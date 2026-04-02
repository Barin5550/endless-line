/* map-page.js — D3.js + TopoJSON accurate world map */

/* ============================================================
   Mapping: our countryId → ISO numeric codes (Natural Earth)
   ============================================================ */
const COUNTRY_ISO = {
  turkey:      792,
  uae:         784,
  egypt:        818,
  greece:       300,
  italy:        380,
  france:       250,
  germany:      276,
  austria:       40,
  spain:        724,
  china:        156,
  japan:        392,
  thailand:     764,
  india:        356,
  maldives:     462,
  brazil:        76,
  portugal:     620,
  montenegro:   499,
  morocco:      504,
  southkorea:   410,
  vietnam:      704,
  indonesia:    360,
  srilanka:     144,
  usa:          840,
  mexico:       484,
  australia:     36,
};

/* Reverse lookup: ISO numeric → countryId */
const ISO_TO_COUNTRY = {};
Object.entries(COUNTRY_ISO).forEach(([id, iso]) => { ISO_TO_COUNTRY[iso] = id; });

let selectedCountry = null;
let d3Projection, d3Path, d3Zoom, svgEl, gMap;

document.addEventListener('DOMContentLoaded', () => {
  initD3Map();
  buildAvailableCountriesList();
  checkURLParam();
});

/* ============================================================
   D3 MAP INIT
   ============================================================ */
function initD3Map() {
  const wrap = document.getElementById('map-svg-wrap');
  const svg  = d3.select('#world-map');

  const W = wrap.clientWidth  || 900;
  const H = wrap.clientHeight || 520;

  svg.attr('viewBox', `0 0 ${W} ${H}`)
     .attr('width',  '100%')
     .attr('height', '100%');

  /* Ocean background */
  svg.append('rect')
     .attr('width', W).attr('height', H)
     .attr('fill', 'url(#ocean-grad)');

  /* Gradient defs */
  const defs = svg.append('defs');

  /* Ocean gradient — smooth deep navy, no harsh bands */
  const rg = defs.append('radialGradient')
    .attr('id','ocean-glow').attr('cx','50%').attr('cy','40%').attr('r','60%');
  rg.append('stop').attr('offset','0%').attr('stop-color','#0d2240').attr('stop-opacity','1');
  rg.append('stop').attr('offset','60%').attr('stop-color','#091a30').attr('stop-opacity','1');
  rg.append('stop').attr('offset','100%').attr('stop-color','#050d1a').attr('stop-opacity','1');

  const og = defs.append('linearGradient')
    .attr('id','ocean-grad').attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
  og.append('stop').attr('offset','0%').attr('stop-color','#0d2240');
  og.append('stop').attr('offset','35%').attr('stop-color','#0a1c36');
  og.append('stop').attr('offset','70%').attr('stop-color','#081528');
  og.append('stop').attr('offset','100%').attr('stop-color','#050d1a');

  /* Graticule (lat/lon grid) */
  d3Projection = d3.geoNaturalEarth1()
    .scale(W / 6.28)
    .translate([W / 2, H / 2]);

  d3Path = d3.geoPath().projection(d3Projection);

  const graticule = d3.geoGraticule()();
  const sphere    = { type: 'Sphere' };

  /* Ocean fill with gradient */
  svg.append('path')
     .datum(sphere)
     .attr('d', d3Path)
     .attr('fill', 'url(#ocean-grad)');

  /* Sphere border glow */
  svg.append('path')
     .datum(sphere)
     .attr('d', d3Path)
     .attr('fill', 'none')
     .attr('stroke', 'rgba(100,180,255,0.12)')
     .attr('stroke-width', 1.5);

  /* Graticule grid */
  svg.append('path')
     .datum(graticule)
     .attr('d', d3Path)
     .attr('fill', 'none')
     .attr('stroke', 'rgba(100,180,255,0.06)')
     .attr('stroke-width', 0.35)
     .attr('stroke-dasharray', '2,5');

  /* Map group (zoom/pan target) */
  gMap = svg.append('g').attr('id','g-map');
  svgEl = svg;

  /* Load world topojson */
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      /* Draw all country fills */
      gMap.selectAll('path.country')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', d => {
          const iso = +d.id;
          const cId = ISO_TO_COUNTRY[iso];
          return cId ? `country country-active` : `country country-base`;
        })
        .attr('id', d => {
          const iso = +d.id;
          const cId = ISO_TO_COUNTRY[iso];
          return cId ? `country-${cId}` : null;
        })
        .attr('data-country', d => ISO_TO_COUNTRY[+d.id] || null)
        .attr('d', d3Path)
        .on('mouseenter', function(event, d) {
          const cId = ISO_TO_COUNTRY[+d.id];
          if (!cId) return;
          d3.select(this).classed('hovered', true);
          showTooltip(event, COUNTRY_DATA[cId]?.name || cId);
        })
        .on('mouseleave', function(event, d) {
          const cId = ISO_TO_COUNTRY[+d.id];
          if (!cId) return;
          d3.select(this).classed('hovered', false);
          hideTooltip();
        })
        .on('click', function(event, d) {
          const cId = ISO_TO_COUNTRY[+d.id];
          if (!cId || !COUNTRY_DATA[cId]) return;
          event.stopPropagation();
          selectCountry(cId);
        });

      /* Country borders */
      gMap.append('path')
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr('class', 'country-borders')
        .attr('d', d3Path)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,0,0,0.35)')
        .attr('stroke-width', 0.4);

      /* Country name labels — hidden by default, appear on zoom */
      const labelGroup = gMap.append('g').attr('id','labels').style('pointer-events','none');

      /* Short names for labels */
      const SHORT_NAME = {
        turkey:'Турция', uae:'ОАЭ', egypt:'Египет', greece:'Греция', italy:'Италия',
        france:'Франция', germany:'Германия', austria:'Австрия', spain:'Испания',
        china:'Китай', japan:'Япония', thailand:'Таиланд', india:'Индия',
        maldives:'Мальдивы', brazil:'Бразилия', portugal:'Португалия',
        montenegro:'Черногория', morocco:'Марокко', southkorea:'Ю. Корея',
        vietnam:'Вьетнам', indonesia:'Индонезия', srilanka:'Шри-Ланка',
        usa:'США', mexico:'Мексика', australia:'Австралия',
      };

      Object.entries(COUNTRY_DATA).forEach(([cId, data]) => {
        const feature = countries.features.find(f => +f.id === COUNTRY_ISO[cId]);
        if (!feature) return;
        let centroid;
        try { centroid = d3Path.centroid(feature); } catch(e) { return; }
        if (!centroid || isNaN(centroid[0])) return;

        const offsets = { maldives:[0,6], srilanka:[4,4], montenegro:[0,-4], portugal:[-5,0] };
        const off = offsets[cId] || [0, 0];

        /* Background pill for readability */
        const g = labelGroup.append('g')
          .attr('class', 'country-name-label')
          .attr('data-country', cId)
          .attr('transform', `translate(${centroid[0] + off[0]}, ${centroid[1] + off[1]})`)
          .style('opacity', 0)
          .style('pointer-events','none');

        /* Text shadow pill */
        g.append('text')
          .attr('class','lbl-shadow')
          .attr('text-anchor','middle')
          .attr('dy','0.35em')
          .text(SHORT_NAME[cId] || data.name);

        /* Main text */
        g.append('text')
          .attr('class','lbl-text')
          .attr('text-anchor','middle')
          .attr('dy','0.35em')
          .text(SHORT_NAME[cId] || data.name);
      });

    })
    .catch(err => {
      console.error('Failed to load world map:', err);
      /* Fallback message */
      document.getElementById('map-svg-wrap').insertAdjacentHTML('afterbegin',
        '<div style="color:rgba(255,255,255,0.5);padding:40px;text-align:center">Карта загружается... Проверьте подключение к интернету.</div>'
      );
    });

  /* Zoom & Pan with D3 zoom */
  const LABEL_SHOW_SCALE = 2.5; /* zoom threshold to show labels */

  d3Zoom = d3.zoom()
    .scaleExtent([0.8, 12])
    .on('zoom', (event) => {
      const { transform } = event;
      gMap.attr('transform', transform);

      /* Show/hide labels based on zoom scale */
      const k = transform.k;
      const labelOpacity = k >= LABEL_SHOW_SCALE
        ? Math.min(1, (k - LABEL_SHOW_SCALE) / 0.8)
        : 0;

      /* Scale labels inversely so text stays readable size */
      gMap.selectAll('.country-name-label').each(function() {
        const g = d3.select(this);
        /* Inverse scale to keep text size constant */
        const s = 1 / k;
        const x = +g.attr('data-cx') || 0;
        const y = +g.attr('data-cy') || 0;
        g.style('opacity', labelOpacity)
         .attr('transform', function() {
            /* Preserve translated position, apply inverse scale */
            const m = this.getAttribute('transform') || '';
            const t = m.match(/translate\(([^,]+),([^)]+)\)/);
            if (t) {
              return `translate(${t[1]},${t[2]}) scale(${s})`;
            }
            return m;
          });
      });
    });

  svg.call(d3Zoom);

  /* Zoom buttons */
  document.getElementById('zoom-in')?.addEventListener('click', () => {
    svg.transition().duration(300).call(d3Zoom.scaleBy, 1.4);
  });
  document.getElementById('zoom-out')?.addEventListener('click', () => {
    svg.transition().duration(300).call(d3Zoom.scaleBy, 0.7);
  });
  document.getElementById('zoom-reset')?.addEventListener('click', () => {
    svg.transition().duration(400).call(d3Zoom.transform, d3.zoomIdentity);
  });

  /* Click on ocean → deselect */
  svg.on('click', () => {
    /* intentionally empty — keep sidebar open */
  });

  /* Resize observer */
  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      const nW = wrap.clientWidth;
      const nH = wrap.clientHeight;
      if (nW < 100 || nH < 100) return;
      svg.attr('viewBox', `0 0 ${nW} ${nH}`);
      d3Projection.scale(nW / 6.28).translate([nW/2, nH/2]);
      d3Path = d3.geoPath().projection(d3Projection);
      gMap.selectAll('path').attr('d', d3Path);
    }).observe(wrap);
  }
}

/* ============================================================
   TOOLTIP (HTML-based, more reliable than SVG text)
   ============================================================ */
function showTooltip(event, name) {
  const tt = document.getElementById('map-tooltip-html');
  if (!tt) return;
  tt.textContent = name;
  tt.style.display = 'block';
  const wrap = document.getElementById('map-svg-wrap');
  const rect = wrap.getBoundingClientRect();
  let x = event.clientX - rect.left + 12;
  let y = event.clientY - rect.top - 36;
  /* Keep inside bounds */
  if (x + 140 > rect.width) x = event.clientX - rect.left - 152;
  if (y < 0) y = event.clientY - rect.top + 12;
  tt.style.left = x + 'px';
  tt.style.top  = y + 'px';
}

function hideTooltip() {
  const tt = document.getElementById('map-tooltip-html');
  if (tt) tt.style.display = 'none';
}

/* ============================================================
   COUNTRY SELECTION
   ============================================================ */
function selectCountry(countryId) {
  if (!COUNTRY_DATA[countryId]) return;

  /* Deselect previous */
  if (selectedCountry) {
    d3.select(`#country-${selectedCountry}`).classed('selected', false);
  }
  selectedCountry = countryId;
  d3.select(`#country-${countryId}`).classed('selected', true);

  /* Show sidebar */
  renderSidebar(countryId);

  /* On mobile scroll to sidebar */
  if (window.innerWidth <= 900) {
    const sidebar = document.getElementById('country-sidebar');
    if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderSidebar(countryId) {
  const data = COUNTRY_DATA[countryId];
  if (!data) return;

  const placeholder = document.getElementById('sidebar-placeholder');
  const content     = document.getElementById('sidebar-content');

  if (placeholder) placeholder.style.display = 'none';
  if (content) {
    content.style.display = 'block';
    content.innerHTML = buildSidebarHTML(data, countryId);
  }
}

function buildSidebarHTML(data, countryId) {
  const visaClass = data.visa === 'required' ? 'visa-required' : '';
  const visaIcon  = data.visa === 'free' ? '✅' : data.visa === 'on-arrival' ? '🛂' : '❌';
  const heroImg   = COUNTRY_IMAGES[countryId] || '';

  const attractionsHTML = data.attractions.map(a => `
    <div class="attraction-chip">
      <span class="ac-emoji">${a.emoji}</span>
      <span>${a.name}</span>
    </div>
  `).join('');

  const toursHTML = data.tours.map((t) => `
    <a href="#" class="sb-tour-card" onclick="event.preventDefault();openBookingModal('${t.name.replace(/'/g, "\\'")}', ${t.price}, ${t.nights}, '${data.name}', '${(t.meta || '').replace(/'/g, "\\'")}')">
      <div class="sb-tour-left">
        <div class="sb-tour-name">${t.name}</div>
        <div class="sb-tour-meta">${t.meta}</div>
      </div>
      <div class="sb-tour-price">
        <span class="sb-tour-price-val">${t.price.toLocaleString('ru-RU')} ₸</span>
        <span class="sb-tour-nights">${t.nights} ночей</span>
      </div>
    </a>
  `).join('');

  const photosHTML = data.photos.map((p, i) => {
    if (heroImg && i === 0) {
      return `
        <div class="sb-photo">
          <img src="${heroImg}" alt="${p.label}" style="width:100%;height:100%;object-fit:cover">
          <div class="sb-photo-label">${p.label}</div>
        </div>
      `;
    }
    return `
      <div class="sb-photo" style="background:${p.color}">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2rem">${p.icon}</div>
        <div class="sb-photo-label">${p.label}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="sb-hero">
      ${heroImg
        ? `<img src="${heroImg}" alt="${data.name}" class="sb-hero-img">`
        : `<div style="height:100%;background:${data.heroGradient};display:flex;align-items:center;justify-content:center;font-size:5rem">${data.flag}</div>`
      }
      <div class="sb-hero-gradient"></div>
      <button class="sb-hero-close" onclick="closeSidebar()">×</button>
    </div>

    <div class="sb-body">
      <div class="sb-country-header">
        <span class="sb-flag">${data.flag}</span>
        <div>
          <div class="sb-country-name">${data.name}</div>
          <div class="sb-country-sub">${data.capital}</div>
        </div>
      </div>

      <div class="sb-visa-badge ${visaClass}">
        ${visaIcon} ${data.visaText}
      </div>

      <p style="font-size:0.875rem;color:var(--c-text-2);line-height:1.7;margin-bottom:16px">${data.description}</p>

      <div class="sb-info-grid">
        <div class="sb-info-item">
          <div class="sb-info-label">Столица</div>
          <div class="sb-info-value">📍 ${data.capital}</div>
        </div>
        <div class="sb-info-item">
          <div class="sb-info-label">Валюта</div>
          <div class="sb-info-value">💰 ${data.currency}</div>
        </div>
        <div class="sb-info-item">
          <div class="sb-info-label">Климат</div>
          <div class="sb-info-value">🌡 ${data.climate}</div>
        </div>
        <div class="sb-info-item">
          <div class="sb-info-label">Лучшее время</div>
          <div class="sb-info-value">📅 ${data.bestTime}</div>
        </div>
        <div class="sb-info-item">
          <div class="sb-info-label">Язык</div>
          <div class="sb-info-value">🗣 ${data.language}</div>
        </div>
        <div class="sb-info-item">
          <div class="sb-info-label">Часовой пояс</div>
          <div class="sb-info-value">⏰ ${data.timezone}</div>
        </div>
      </div>

      <div class="sb-section-title">🏛 Достопримечательности</div>
      <div class="sb-attractions">${attractionsHTML}</div>

      <div class="sb-section-title">📸 Фотогалерея</div>
      <div class="sb-photos">${photosHTML}</div>

      <div class="sb-section-title">✈️ Туры в ${data.name}</div>
      <div class="sb-tours">${toursHTML}</div>

      <a href="tours.html?dest=${countryId}" class="sb-book-btn">
        🎒 Все туры в ${data.name}
      </a>
    </div>
  `;
}

function closeSidebar() {
  const placeholder = document.getElementById('sidebar-placeholder');
  const content     = document.getElementById('sidebar-content');
  if (placeholder) placeholder.style.display = '';
  if (content) content.style.display = 'none';

  if (selectedCountry) {
    d3.select(`#country-${selectedCountry}`).classed('selected', false);
    selectedCountry = null;
  }
}

/* ============================================================
   AVAILABLE COUNTRIES LIST
   ============================================================ */
function buildAvailableCountriesList() {
  const grid = document.getElementById('ac-grid');
  if (!grid) return;
  const sorted = Object.entries(COUNTRY_DATA).sort((a, b) => a[1].name.localeCompare(b[1].name, 'ru'));
  grid.innerHTML = sorted.map(([id, data]) => `
    <button class="ac-btn" onclick="selectCountry('${id}')">
      <span>${data.flag}</span>
      <span>${data.name}</span>
    </button>
  `).join('');
}

function checkURLParam() {
  const params  = new URLSearchParams(window.location.search);
  const country = params.get('country');
  if (country && COUNTRY_DATA[country]) {
    setTimeout(() => selectCountry(country), 800);
  }
}
