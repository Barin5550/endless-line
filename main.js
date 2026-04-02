/* Endless Line — main.js */
(function () {
    'use strict';

    /* ── 1. SMOOTH SCROLL ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ── 2. HEADER SCROLL SHADOW ── */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* ── 3. SCROLL REVEAL ── */
    const reveals = document.querySelectorAll(
        '.service-card, .dest-card, .testimonial-card, .faq-item, .contact-item, .section-header'
    );
    reveals.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObserver.observe(el));

    /* ── 4. LANGUAGE SWITCHER ── */
    const translations = {
        ru: {
            'nav-services': 'Услуги', 'nav-destinations': 'Направления',
            'nav-booking': 'Бронирование', 'nav-contacts': 'Контакты',
            'btn-book': 'Забронировать',
            'hero-badge': 'Путешествие без границ',
            'hero-title': 'Ваше путешествие<br><span>никогда не кончается</span>',
            'hero-subtitle': 'От железнодорожных вокзалов до океанских портов и аэропортов — мы соединяем каждое направление на Земле в один бесшовный маршрут.',
            'btn-explore': 'Изучить направления', 'btn-learn': 'Узнать больше',
            'stat-countries': 'Стран', 'stat-routes': 'Маршрутов', 'stat-travelers': 'Путешественников',
            'services-tag': 'Наши услуги', 'services-title': 'Любой маршрут — <span>одно место</span>',
            'services-subtitle': 'Мы предлагаем три вида путешествий под любые желания и бюджет',
            'service-train-name': 'Железная дорога', 'service-cruise-name': 'Круизы', 'service-air-name': 'Авиаперелёты',
            'service-train-desc': 'Межгородские и международные маршруты. Комфортные купе, панорамные вагоны, скоростные поезда.',
            'service-cruise-desc': 'Морские путешествия на роскошных лайнерах. Средиземноморье, Карибы, Норвежские фьорды.',
            'service-air-desc': 'Рейсы по всему миру. Бизнес-класс, эконом, стыковочные рейсы с оптимальной ценой.',
            'service-link': 'Выбрать маршрут →', 'badge-popular': 'Популярное',
            'dest-tag': 'Направления', 'dest-title': 'Популярные <span>маршруты</span>',
            'dest-subtitle': 'Самые популярные направления среди наших путешественников',
            'from-text': 'от', 'country-kz': 'Казахстан', 'country-tr': 'Турция',
            'country-ae': 'ОАЭ', 'country-at': 'Австрия', 'country-de': 'Германия', 'country-cn': 'Китай',
            'booking-tag': 'Бронирование', 'booking-title': 'Найдите <span>свой маршрут</span>',
            'booking-subtitle': 'Поиск по лучшим ценам среди 3200+ маршрутов',
            'tab-train': 'Поезд', 'tab-cruise': 'Круиз', 'tab-air': 'Авиа',
            'field-from': 'Откуда', 'field-to': 'Куда', 'field-depart': 'Отправление',
            'field-return': 'Возврат', 'field-passengers': 'Пассажиры',
            'btn-search': '🔍 Найти маршруты',
            'reviews-tag': 'Отзывы', 'reviews-title': 'Что говорят <span>наши клиенты</span>',
            'faq-tag': 'Вопросы и ответы', 'faq-title': 'Часто задаваемые <span>вопросы</span>',
            'faq1-q': 'Как выбрать подходящий маршрут?',
            'faq1-a': 'Используйте форму поиска: выберите тип транспорта, укажите откуда и куда, дату и количество пассажиров. Мы покажем лучшие варианты по цене и удобству.',
            'faq2-q': 'Какие документы нужны для поездки?',
            'faq2-a': 'Для международных маршрутов нужны действующий загранпаспорт и виза (при необходимости). Для внутренних — удостоверение личности или паспорт.',
            'faq3-q': 'Можно ли вернуть или обменять билет?',
            'faq3-a': 'Да. Большинство билетов можно вернуть за 24 часа до отправления с удержанием сервисного сбора. Условия зависят от конкретного перевозчика.',
            'faq4-q': 'Работаете ли вы с корпоративными клиентами?',
            'faq4-a': 'Да, у нас есть специальные корпоративные тарифы для групп от 10 человек. Свяжитесь с нами для получения индивидуального предложения.',
            'faq5-q': 'Как оплатить бронирование?',
            'faq5-a': 'Принимаем карты Visa/Mastercard, Kaspi Pay, Apple Pay и Google Pay. Оплата проходит через защищённый шлюз с шифрованием SSL.',
            'contacts-tag': 'Контакты', 'contacts-title': 'Свяжитесь <span>с нами</span>',
            'contacts-subtitle': 'Мы ответим в течение 2 часов в рабочее время',
            'contact-address-label': 'Адрес', 'contact-phone-label': 'Телефон',
            'c-name': 'Ваше имя', 'c-message': 'Сообщение', 'btn-send': 'Отправить сообщение',
            'form-success': '✅ Сообщение отправлено! Мы ответим в течение 2 часов.',
            'footer-tagline': 'Путешествие без границ', 'footer-rights': 'Все права защищены.'
        },
        en: {
            'nav-services': 'Services', 'nav-destinations': 'Destinations',
            'nav-booking': 'Booking', 'nav-contacts': 'Contacts',
            'btn-book': 'Book Now',
            'hero-badge': 'Travel Without Limits',
            'hero-title': 'Your Journey<br><span>Never Ends</span>',
            'hero-subtitle': 'From railway stations to ocean ports to airports — we connect every destination on Earth into one seamless experience.',
            'btn-explore': 'Explore Destinations', 'btn-learn': 'Learn More',
            'stat-countries': 'Countries', 'stat-routes': 'Routes', 'stat-travelers': 'Travelers',
            'services-tag': 'Our Services', 'services-title': 'Any Route — <span>One Place</span>',
            'services-subtitle': 'We offer three types of travel for any taste and budget',
            'service-train-name': 'Railways', 'service-cruise-name': 'Cruises', 'service-air-name': 'Flights',
            'service-train-desc': 'Intercity and international routes. Comfortable cabins, panoramic cars, high-speed trains.',
            'service-cruise-desc': 'Sea voyages on luxury liners. Mediterranean, Caribbean, Norwegian Fjords.',
            'service-air-desc': 'Flights worldwide. Business class, economy, connecting flights at the best prices.',
            'service-link': 'Choose Route →', 'badge-popular': 'Popular',
            'dest-tag': 'Destinations', 'dest-title': 'Popular <span>Routes</span>',
            'dest-subtitle': 'The most popular destinations among our travelers',
            'from-text': 'from', 'country-kz': 'Kazakhstan', 'country-tr': 'Turkey',
            'country-ae': 'UAE', 'country-at': 'Austria', 'country-de': 'Germany', 'country-cn': 'China',
            'booking-tag': 'Booking', 'booking-title': 'Find <span>Your Route</span>',
            'booking-subtitle': 'Search at the best prices across 3200+ routes',
            'tab-train': 'Train', 'tab-cruise': 'Cruise', 'tab-air': 'Flight',
            'field-from': 'From', 'field-to': 'To', 'field-depart': 'Departure',
            'field-return': 'Return', 'field-passengers': 'Passengers',
            'btn-search': '🔍 Search Routes',
            'reviews-tag': 'Reviews', 'reviews-title': 'What Our <span>Clients Say</span>',
            'faq-tag': 'FAQ', 'faq-title': 'Frequently Asked <span>Questions</span>',
            'faq1-q': 'How do I find the right route?',
            'faq1-a': 'Use the search form: choose transport type, enter origin and destination, date and passengers. We will show the best options by price and comfort.',
            'faq2-q': 'What documents do I need?',
            'faq2-a': 'For international routes you need a valid passport and visa (if required). For domestic — a national ID or passport.',
            'faq3-q': 'Can I refund or exchange a ticket?',
            'faq3-a': 'Yes. Most tickets can be refunded up to 24 hours before departure with a service fee. Conditions depend on the carrier.',
            'faq4-q': 'Do you work with corporate clients?',
            'faq4-a': 'Yes, we have special corporate rates for groups of 10+. Contact us for a custom quote.',
            'faq5-q': 'How do I pay for my booking?',
            'faq5-a': 'We accept Visa/Mastercard, Apple Pay and Google Pay. Payment is processed through a secure SSL-encrypted gateway.',
            'contacts-tag': 'Contact', 'contacts-title': 'Get In <span>Touch</span>',
            'contacts-subtitle': 'We respond within 2 hours during business hours',
            'contact-address-label': 'Address', 'contact-phone-label': 'Phone',
            'c-name': 'Your Name', 'c-message': 'Message', 'btn-send': 'Send Message',
            'form-success': '✅ Message sent! We will reply within 2 hours.',
            'footer-tagline': 'Travel Without Limits', 'footer-rights': 'All rights reserved.'
        },
        de: {
            'nav-services': 'Leistungen', 'nav-destinations': 'Reiseziele',
            'nav-booking': 'Buchung', 'nav-contacts': 'Kontakt',
            'btn-book': 'Jetzt buchen',
            'hero-badge': 'Reisen ohne Grenzen',
            'hero-title': 'Deine Reise<br><span>hört nie auf</span>',
            'hero-subtitle': 'Von Bahnhöfen über Häfen bis zu Flughäfen — wir verbinden jeden Ort der Erde zu einem nahtlosen Erlebnis.',
            'btn-explore': 'Reiseziele entdecken', 'btn-learn': 'Mehr erfahren',
            'stat-countries': 'Länder', 'stat-routes': 'Routen', 'stat-travelers': 'Reisende',
            'services-tag': 'Unsere Leistungen', 'services-title': 'Jede Route — <span>ein Ort</span>',
            'services-subtitle': 'Wir bieten drei Reisearten für jeden Geschmack und jedes Budget',
            'service-train-name': 'Zugfahrten', 'service-cruise-name': 'Kreuzfahrten', 'service-air-name': 'Flüge',
            'service-train-desc': 'Interregionale und internationale Strecken. Komfortkabinen, Panoramawagen, Hochgeschwindigkeitszüge.',
            'service-cruise-desc': 'Seereisen auf Luxusliner. Mittelmeer, Karibik, Norwegische Fjorde.',
            'service-air-desc': 'Flüge weltweit. Business Class, Economy, Anschlussflüge zum Bestpreis.',
            'service-link': 'Route wählen →', 'badge-popular': 'Beliebt',
            'dest-tag': 'Reiseziele', 'dest-title': 'Beliebte <span>Routen</span>',
            'dest-subtitle': 'Die beliebtesten Reiseziele unserer Kunden',
            'from-text': 'ab', 'country-kz': 'Kasachstan', 'country-tr': 'Türkei',
            'country-ae': 'VAE', 'country-at': 'Österreich', 'country-de': 'Deutschland', 'country-cn': 'China',
            'booking-tag': 'Buchung', 'booking-title': 'Finde <span>deine Route</span>',
            'booking-subtitle': 'Suche zum besten Preis unter 3200+ Routen',
            'tab-train': 'Zug', 'tab-cruise': 'Kreuzfahrt', 'tab-air': 'Flug',
            'field-from': 'Von', 'field-to': 'Nach', 'field-depart': 'Abfahrt',
            'field-return': 'Rückreise', 'field-passengers': 'Passagiere',
            'btn-search': '🔍 Routen suchen',
            'reviews-tag': 'Bewertungen', 'reviews-title': 'Was unsere <span>Kunden sagen</span>',
            'faq-tag': 'FAQ', 'faq-title': 'Häufig gestellte <span>Fragen</span>',
            'faq1-q': 'Wie finde ich die richtige Route?',
            'faq1-a': 'Nutze das Suchformular: Wähle Transportart, gib Start und Ziel ein, Datum und Passagiere. Wir zeigen die besten Optionen nach Preis und Komfort.',
            'faq2-q': 'Welche Dokumente benötige ich?',
            'faq2-a': 'Für internationale Routen benötigst du einen gültigen Reisepass und ggf. ein Visum. Für inländische Reisen genügt ein Personalausweis.',
            'faq3-q': 'Kann ich ein Ticket zurückgeben oder umtauschen?',
            'faq3-a': 'Ja. Die meisten Tickets können bis 24 Stunden vor Abfahrt gegen Servicegebühr storniert werden.',
            'faq4-q': 'Arbeiten Sie mit Firmenkunden?',
            'faq4-a': 'Ja, wir haben Sondertarife für Gruppen ab 10 Personen. Kontaktiere uns für ein individuelles Angebot.',
            'faq5-q': 'Wie bezahle ich meine Buchung?',
            'faq5-a': 'Wir akzeptieren Visa/Mastercard, Apple Pay und Google Pay über einen gesicherten SSL-Gateway.',
            'contacts-tag': 'Kontakt', 'contacts-title': 'Kontaktiere <span>uns</span>',
            'contacts-subtitle': 'Wir antworten innerhalb von 2 Stunden während der Geschäftszeiten',
            'contact-address-label': 'Adresse', 'contact-phone-label': 'Telefon',
            'c-name': 'Dein Name', 'c-message': 'Nachricht', 'btn-send': 'Nachricht senden',
            'form-success': '✅ Nachricht gesendet! Wir melden uns innerhalb von 2 Stunden.',
            'footer-tagline': 'Reisen ohne Grenzen', 'footer-rights': 'Alle Rechte vorbehalten.'
        }
    };

    let currentLang = 'ru';

    function applyLang(lang) {
        const t = translations[lang];
        if (!t) return;
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });

    /* ── 5. CURRENCY SWITCHER ── */
    const currencySymbols = { kzt: '₸', usd: '$', eur: '€' };
    let currentCurrency = 'kzt';

    function applyCurrency(currency) {
        currentCurrency = currency;
        const sym = currencySymbols[currency];
        document.querySelectorAll('.price-value').forEach(el => {
            const val = parseInt(el.dataset[currency]);
            if (!isNaN(val)) {
                el.textContent = currency === 'kzt'
                    ? val.toLocaleString('ru-KZ') + ' ' + sym
                    : sym + ' ' + val.toLocaleString('en');
            }
        });
        document.querySelectorAll('.currency-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.currency === currency);
        });
    }

    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', () => applyCurrency(btn.dataset.currency));
    });

    /* ── 6. BOOKING TABS ── */
    const placeholders = {
        train: { from: 'Алматы', to: 'Берлин' },
        cruise: { from: 'Стамбул', to: 'Барселона' },
        air: { from: 'Алматы', to: 'Дубай' }
    };

    document.querySelectorAll('.booking-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.dataset.tab;
            const p = placeholders[type];
            if (p) {
                document.getElementById('field-from').placeholder = p.from;
                document.getElementById('field-to').placeholder = p.to;
            }
        });
    });

    /* ── 7. PASSENGER COUNTER ── */
    let passengers = 1;
    const passCount = document.getElementById('pass-count');
    document.getElementById('pass-minus').addEventListener('click', () => {
        if (passengers > 1) { passengers--; passCount.textContent = passengers; }
    });
    document.getElementById('pass-plus').addEventListener('click', () => {
        if (passengers < 9) { passengers++; passCount.textContent = passengers; }
    });

    /* ── 8. SWAP FROM/TO ── */
    document.getElementById('btn-swap').addEventListener('click', () => {
        const from = document.getElementById('field-from');
        const to = document.getElementById('field-to');
        [from.value, to.value] = [to.value, from.value];
        [from.placeholder, to.placeholder] = [to.placeholder, from.placeholder];
    });

    /* ── 9. BOOKING FORM SUBMIT ── */
    document.getElementById('booking-form').addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('btn-search');
        btn.textContent = '⏳ Поиск...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = translations[currentLang]['btn-search'] || '🔍 Найти маршруты';
            btn.disabled = false;
        }, 1800);
    });

    /* ── 10. TESTIMONIALS SLIDER ── */
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = 5;

    function goToSlide(idx) {
        currentSlide = idx;
        const cardW = track.querySelector('.testimonial-card').offsetWidth + 24;
        track.style.transform = `translateX(-${idx * cardW}px)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.idx)));
    });

    // Auto-advance
    setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 4000);

    /* ── 11. FAQ ACCORDION ── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            // Close all
            document.querySelectorAll('.faq-q').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.classList.remove('open');
            });
            // Open clicked if it was closed
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                btn.nextElementSibling.classList.add('open');
            }
        });
    });

    /* ── 12. CONTACT FORM ── */
    document.getElementById('contact-form').addEventListener('submit', e => {
        e.preventDefault();
        const success = document.getElementById('form-success');
        const btn = document.getElementById('btn-send');
        btn.textContent = '⏳ Отправка...';
        btn.disabled = true;
        setTimeout(() => {
            success.classList.add('visible');
            btn.textContent = translations[currentLang]['btn-send'] || 'Отправить сообщение';
            btn.disabled = false;
            e.target.reset();
            setTimeout(() => success.classList.remove('visible'), 5000);
        }, 1200);
    });

    /* ── 13. HERO BUTTONS ── */
    document.getElementById('btn-explore').addEventListener('click', () => {
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('btn-learn').addEventListener('click', () => {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('btn-book').addEventListener('click', () => {
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });

    /* ── 14. SET DEFAULT DATE ── */
    const today = new Date();
    const fmt = d => d.toISOString().split('T')[0];
    const dep = new Date(today); dep.setDate(dep.getDate() + 7);
    const ret = new Date(today); ret.setDate(ret.getDate() + 14);
    document.getElementById('field-depart').value = fmt(dep);
    document.getElementById('field-return').value = fmt(ret);
    document.getElementById('field-depart').min = fmt(today);
    document.getElementById('field-return').min = fmt(dep);

})();
