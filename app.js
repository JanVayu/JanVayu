    /* ═══════════════════════════════════════════════════════════
       JANVAYU CORE JAVASCRIPT — ALL FUNCTIONALITY PRESERVED
       ═══════════════════════════════════════════════════════════ */

    // ── Dashboard: expand/collapse the "what's happening now" blurb ──
    function toggleHeroAlert() {
        const box = document.getElementById('heroLiveAlert');
        const btn = document.getElementById('heroLiveToggle');
        if (!box || !btn) return;
        const clamped = box.classList.toggle('clamped');
        btn.setAttribute('aria-expanded', String(!clamped));
        btn.innerHTML = clamped ? 'Read more &#9662;' : 'Show less &#9652;';
    }
    window.toggleHeroAlert = toggleHeroAlert;

    // ── Photo gallery lightbox ──
    let _galItems = [], _galIdx = 0;
    function _galShow() {
        const el = _galItems[_galIdx]; if (!el) return;
        const img = document.getElementById('galLbImg');
        const cap = document.getElementById('galLbCap');
        if (img) { img.src = el.dataset.full; img.alt = el.dataset.alt || ''; }
        if (cap) {
            const credit = el.dataset.credit || 'Unknown', lic = el.dataset.license || '', src = el.dataset.source || '';
            cap.innerHTML = '<span class="gal-cap-text">' + (el.dataset.alt || '') + '</span>' +
                '<span class="gal-cap-credit">Photo: ' + credit + (lic ? ' &middot; ' + lic : '') +
                (src ? ' &middot; <a href="' + src + '" target="_blank" rel="noopener">Wikimedia Commons</a>' : '') + '</span>';
        }
    }
    function galOpen(el) {
        _galItems = Array.from(document.querySelectorAll('.gal-item'));
        _galIdx = Math.max(0, _galItems.indexOf(el));
        _galShow();
        const lb = document.getElementById('galLightbox');
        if (lb) { lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
    }
    function galNav(dir) {
        if (!_galItems.length) return;
        _galIdx = (_galIdx + dir + _galItems.length) % _galItems.length;
        _galShow();
    }
    function galClose() {
        const lb = document.getElementById('galLightbox');
        if (lb) { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
        document.body.style.overflow = '';
    }
    window.galOpen = galOpen; window.galNav = galNav; window.galClose = galClose;
    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('galLightbox');
        if (!lb || !lb.classList.contains('open')) return;
        if (e.key === 'Escape') galClose();
        else if (e.key === 'ArrowRight') galNav(1);
        else if (e.key === 'ArrowLeft') galNav(-1);
    });

    // ── Classy motion: reveal dashboard cards as they scroll into view ──
    // Scoped to the always-visible dashboard section (never a hidden panel),
    // progressive-enhancement only, with a failsafe so nothing stays hidden.
    (function classyReveal() {
        try {
            if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            if (!('IntersectionObserver' in window)) return;
            const run = () => {
                const dash = document.getElementById('section-dashboard');
                if (!dash) return;
                document.documentElement.classList.add('reveal-on');
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
                }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
                dash.querySelectorAll('.card').forEach(el => { el.setAttribute('data-reveal', ''); io.observe(el); });
                // Failsafe: never leave content hidden if the observer misfires.
                setTimeout(() => dash.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => el.classList.add('is-in')), 2600);
            };
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
            else run();
        } catch (e) { /* motion is optional — never block the app */ }
    })();

    // ── Configuration ──
    const WAQI_TOKEN = '1f64cc8563a165dc5a6ce48f7eeb9ba0221b63f3';
    const DEMO_DATA = {
        delhi: { aqi: 312, pm25: 185, pm10: 298 },
        mumbai: { aqi: 89, pm25: 42, pm10: 78 },
        kolkata: { aqi: 178, pm25: 98, pm10: 156 },
        chennai: { aqi: 72, pm25: 31, pm10: 65 },
        bangalore: { aqi: 95, pm25: 48, pm10: 89 },
        hyderabad: { aqi: 118, pm25: 62, pm10: 105 },
        gurgaon: { aqi: 345, pm25: 210, pm10: 312 },
        noida: { aqi: 328, pm25: 195, pm10: 285 },
        faridabad: { aqi: 298, pm25: 172, pm10: 256 },
        ghaziabad: { aqi: 356, pm25: 218, pm10: 325 },
        lucknow: { aqi: 245, pm25: 142, pm10: 212 },
        kanpur: { aqi: 268, pm25: 158, pm10: 235 },
        patna: { aqi: 285, pm25: 168, pm10: 248 },
        jaipur: { aqi: 195, pm25: 108, pm10: 172 },
        ahmedabad: { aqi: 145, pm25: 78, pm10: 128 },
        pune: { aqi: 82, pm25: 38, pm10: 72 },
        beijing: { aqi: 125, pm25: 68, pm10: 112 },
        london: { aqi: 42, pm25: 18, pm10: 35 },
        singapore: { aqi: 55, pm25: 24, pm10: 48 }
    };

    const CITIES = {
        delhi: { name: 'Delhi', lat: 28.6139, lon: 77.2090, region: 'north' },
        mumbai: { name: 'Mumbai', lat: 19.0760, lon: 72.8777, region: 'west' },
        kolkata: { name: 'Kolkata', lat: 22.5726, lon: 88.3639, region: 'east' },
        chennai: { name: 'Chennai', lat: 13.0827, lon: 80.2707, region: 'south' },
        bangalore: { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, region: 'south' },
        hyderabad: { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, region: 'south' },
        gurgaon: { name: 'Gurgaon', lat: 28.4595, lon: 77.0266, region: 'north' },
        noida: { name: 'Noida', lat: 28.5355, lon: 77.3910, region: 'north' },
        faridabad: { name: 'Faridabad', lat: 28.4089, lon: 77.3178, region: 'north' },
        ghaziabad: { name: 'Ghaziabad', lat: 28.6692, lon: 77.4538, region: 'north' },
        lucknow: { name: 'Lucknow', lat: 26.8467, lon: 80.9462, region: 'north' },
        kanpur: { name: 'Kanpur', lat: 26.4499, lon: 80.3319, region: 'north' },
        patna: { name: 'Patna', lat: 25.5941, lon: 85.1376, region: 'north' },
        jaipur: { name: 'Jaipur', lat: 26.9124, lon: 75.7873, region: 'north' },
        ahmedabad: { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, region: 'west' },
        pune: { name: 'Pune', lat: 18.5204, lon: 73.8567, region: 'west' },
        beijing: { name: 'Beijing', lat: 39.9042, lon: 116.4074, region: 'intl' },
        london: { name: 'London', lat: 51.5074, lon: -0.1278, region: 'intl' },
        singapore: { name: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'intl' },
        // Tier 1 additions
        chandigarh: { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, region: 'north' },
        varanasi: { name: 'Varanasi', lat: 25.3176, lon: 82.9739, region: 'north' },
        agra: { name: 'Agra', lat: 27.1767, lon: 78.0081, region: 'north' },
        bhopal: { name: 'Bhopal', lat: 23.2599, lon: 77.4126, region: 'central' },
        indore: { name: 'Indore', lat: 22.7196, lon: 75.8577, region: 'central' },
        nagpur: { name: 'Nagpur', lat: 21.1458, lon: 79.0882, region: 'central' },
        kochi: { name: 'Kochi', lat: 9.9312, lon: 76.2673, region: 'south' },
        visakhapatnam: { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, region: 'south' },
        thiruvananthapuram: { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, region: 'south' },
        coimbatore: { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, region: 'south' },
        // Tier 2 / NCAP non-attainment
        muzaffarpur: { name: 'Muzaffarpur', lat: 26.1197, lon: 85.3910, region: 'north' },
        gaya: { name: 'Gaya', lat: 24.7914, lon: 85.0002, region: 'north' },
        raipur: { name: 'Raipur', lat: 21.2514, lon: 81.6296, region: 'central' },
        jodhpur: { name: 'Jodhpur', lat: 26.2389, lon: 73.0243, region: 'north' },
        guwahati: { name: 'Guwahati', lat: 26.1445, lon: 91.7362, region: 'east' },
        dehradun: { name: 'Dehradun', lat: 30.3165, lon: 78.0322, region: 'north' },
        amritsar: { name: 'Amritsar', lat: 31.6340, lon: 74.8723, region: 'north' },
        // ── Extended coverage (ext: true) — selectable/searchable across the
        // platform, but NOT eagerly fetched on load; their live AQI is fetched
        // on demand when a user picks them, to stay inside the WAQI free tier. ──
        ludhiana: { name: 'Ludhiana', lat: 30.9010, lon: 75.8573, region: 'north', ext: true },
        jalandhar: { name: 'Jalandhar', lat: 31.3260, lon: 75.5762, region: 'north', ext: true },
        patiala: { name: 'Patiala', lat: 30.3398, lon: 76.3869, region: 'north', ext: true },
        bathinda: { name: 'Bathinda', lat: 30.2110, lon: 74.9455, region: 'north', ext: true },
        rohtak: { name: 'Rohtak', lat: 28.8955, lon: 76.6066, region: 'north', ext: true },
        panipat: { name: 'Panipat', lat: 29.3909, lon: 76.9635, region: 'north', ext: true },
        hisar: { name: 'Hisar', lat: 29.1492, lon: 75.7217, region: 'north', ext: true },
        sonipat: { name: 'Sonipat', lat: 28.9931, lon: 77.0151, region: 'north', ext: true },
        bhiwadi: { name: 'Bhiwadi', lat: 28.2100, lon: 76.8600, region: 'north', ext: true },
        alwar: { name: 'Alwar', lat: 27.5530, lon: 76.6346, region: 'north', ext: true },
        kota: { name: 'Kota', lat: 25.2138, lon: 75.8648, region: 'north', ext: true },
        udaipur: { name: 'Udaipur', lat: 24.5854, lon: 73.7125, region: 'north', ext: true },
        ajmer: { name: 'Ajmer', lat: 26.4499, lon: 74.6399, region: 'north', ext: true },
        bikaner: { name: 'Bikaner', lat: 28.0229, lon: 73.3119, region: 'north', ext: true },
        bareilly: { name: 'Bareilly', lat: 28.3670, lon: 79.4304, region: 'north', ext: true },
        moradabad: { name: 'Moradabad', lat: 28.8386, lon: 78.7733, region: 'north', ext: true },
        aligarh: { name: 'Aligarh', lat: 27.8974, lon: 78.0880, region: 'north', ext: true },
        meerut: { name: 'Meerut', lat: 28.9845, lon: 77.7064, region: 'north', ext: true },
        firozabad: { name: 'Firozabad', lat: 27.1591, lon: 78.3958, region: 'north', ext: true },
        prayagraj: { name: 'Prayagraj', lat: 25.4358, lon: 81.8463, region: 'north', ext: true },
        gorakhpur: { name: 'Gorakhpur', lat: 26.7606, lon: 83.3732, region: 'north', ext: true },
        saharanpur: { name: 'Saharanpur', lat: 29.9680, lon: 77.5460, region: 'north', ext: true },
        bhagalpur: { name: 'Bhagalpur', lat: 25.2445, lon: 86.9718, region: 'north', ext: true },
        srinagar: { name: 'Srinagar', lat: 34.0837, lon: 74.7973, region: 'north', ext: true },
        jammu: { name: 'Jammu', lat: 32.7266, lon: 74.8570, region: 'north', ext: true },
        shimla: { name: 'Shimla', lat: 31.1048, lon: 77.1734, region: 'north', ext: true },
        haridwar: { name: 'Haridwar', lat: 29.9457, lon: 78.1642, region: 'north', ext: true },
        surat: { name: 'Surat', lat: 21.1702, lon: 72.8311, region: 'west', ext: true },
        vadodara: { name: 'Vadodara', lat: 22.3072, lon: 73.1812, region: 'west', ext: true },
        rajkot: { name: 'Rajkot', lat: 22.3039, lon: 70.8022, region: 'west', ext: true },
        bhavnagar: { name: 'Bhavnagar', lat: 21.7645, lon: 72.1519, region: 'west', ext: true },
        jamnagar: { name: 'Jamnagar', lat: 22.4707, lon: 70.0577, region: 'west', ext: true },
        nashik: { name: 'Nashik', lat: 19.9975, lon: 73.7898, region: 'west', ext: true },
        aurangabad: { name: 'Chhatrapati Sambhajinagar', lat: 19.8762, lon: 75.3433, region: 'west', ext: true },
        solapur: { name: 'Solapur', lat: 17.6599, lon: 75.9064, region: 'west', ext: true },
        kolhapur: { name: 'Kolhapur', lat: 16.7050, lon: 74.2433, region: 'west', ext: true },
        thane: { name: 'Thane', lat: 19.2183, lon: 72.9781, region: 'west', ext: true },
        navimumbai: { name: 'Navi Mumbai', lat: 19.0330, lon: 73.0297, region: 'west', ext: true },
        panaji: { name: 'Panaji (Goa)', lat: 15.4909, lon: 73.8278, region: 'west', ext: true },
        jabalpur: { name: 'Jabalpur', lat: 23.1815, lon: 79.9864, region: 'central', ext: true },
        gwalior: { name: 'Gwalior', lat: 26.2183, lon: 78.1828, region: 'central', ext: true },
        ujjain: { name: 'Ujjain', lat: 23.1765, lon: 75.7885, region: 'central', ext: true },
        amravati: { name: 'Amravati', lat: 20.9374, lon: 77.7796, region: 'central', ext: true },
        akola: { name: 'Akola', lat: 20.7002, lon: 77.0082, region: 'central', ext: true },
        chandrapur: { name: 'Chandrapur', lat: 19.9615, lon: 79.2961, region: 'central', ext: true },
        ranchi: { name: 'Ranchi', lat: 23.3441, lon: 85.3096, region: 'east', ext: true },
        jamshedpur: { name: 'Jamshedpur', lat: 22.8046, lon: 86.2029, region: 'east', ext: true },
        dhanbad: { name: 'Dhanbad', lat: 23.7957, lon: 86.4304, region: 'east', ext: true },
        asansol: { name: 'Asansol', lat: 23.6739, lon: 86.9524, region: 'east', ext: true },
        durgapur: { name: 'Durgapur', lat: 23.5204, lon: 87.3119, region: 'east', ext: true },
        howrah: { name: 'Howrah', lat: 22.5958, lon: 88.2636, region: 'east', ext: true },
        siliguri: { name: 'Siliguri', lat: 26.7271, lon: 88.3953, region: 'east', ext: true },
        bidhannagar: { name: 'Bidhannagar', lat: 22.5808, lon: 88.4200, region: 'east', ext: true },
        bardhaman: { name: 'Bardhaman', lat: 23.2324, lon: 87.8615, region: 'east', ext: true },
        kharagpur: { name: 'Kharagpur', lat: 22.3460, lon: 87.2320, region: 'east', ext: true },
        haldia: { name: 'Haldia', lat: 22.0667, lon: 88.0698, region: 'east', ext: true },
        rourkela: { name: 'Rourkela', lat: 22.2604, lon: 84.8536, region: 'east', ext: true },
        // ── Ward Atlas cities from the ESRI Living Atlas layer that had no
        // CITIES entry yet. Needed so their live-air layer has a point to
        // interpolate from; coordinates are each city's own ward centroid. ──
        aizawl: { name: 'Aizawl', lat: 23.7350, lon: 92.7176, region: 'east', ext: true },
        ambala: { name: 'Ambala', lat: 30.3606, lon: 76.8129, region: 'north', ext: true },
        arrah: { name: 'Arrah', lat: 25.5626, lon: 84.6698, region: 'east', ext: true },
        bhilai: { name: 'Bhilai', lat: 21.2012, lon: 81.3586, region: 'central', ext: true },
        biharsharif: { name: 'Bihar Sharif', lat: 25.2030, lon: 85.5214, region: 'east', ext: true },
        bilaspur: { name: 'Bilaspur', lat: 22.0791, lon: 82.1577, region: 'central', ext: true },
        damoh: { name: 'Damoh', lat: 23.8363, lon: 79.4421, region: 'central', ext: true },
        davanagere: { name: 'Davanagere', lat: 14.4627, lon: 75.9194, region: 'south', ext: true },
        dharamshala: { name: 'Dharamshala', lat: 32.2122, lon: 76.3304, region: 'north', ext: true },
        gurugram: { name: 'Gurugram', lat: 28.4635, lon: 77.0363, region: 'north', ext: true },
        itanagar: { name: 'Itanagar', lat: 27.0968, lon: 93.6563, region: 'east', ext: true },
        jhansi: { name: 'Jhansi', lat: 25.4510, lon: 78.5670, region: 'north', ext: true },
        kakinada: { name: 'Kakinada', lat: 16.9576, lon: 82.2375, region: 'south', ext: true },
        kalyandombivli: { name: 'Kalyan-Dombivli', lat: 19.2284, lon: 73.1205, region: 'west', ext: true },
        karnal: { name: 'Karnal', lat: 29.6830, lon: 76.9884, region: 'north', ext: true },
        katihar: { name: 'Katihar', lat: 25.5416, lon: 87.5677, region: 'east', ext: true },
        kohima: { name: 'Kohima', lat: 25.6674, lon: 94.1032, region: 'east', ext: true },
        korba: { name: 'Korba', lat: 22.3742, lon: 82.6950, region: 'central', ext: true },
        murwara: { name: 'Murwara', lat: 23.8284, lon: 80.3951, region: 'central', ext: true },
        nandedwaghala: { name: 'Nanded-Waghala', lat: 19.1597, lon: 77.3161, region: 'west', ext: true },
        nayaraipur: { name: 'Naya Raipur', lat: 21.1605, lon: 81.7844, region: 'central', ext: true },
        pimprichinchwad: { name: 'Pimpri Chinchwad', lat: 18.6303, lon: 73.8054, region: 'west', ext: true },
        portblair: { name: 'Port Blair', lat: 11.6502, lon: 92.7294, region: 'south', ext: true },
        ratlam: { name: 'Ratlam', lat: 23.3302, lon: 75.0373, region: 'central', ext: true },
        raurkela: { name: 'Raurkela', lat: 22.2314, lon: 84.8468, region: 'east', ext: true },
        sagar: { name: 'Sagar', lat: 23.8372, lon: 78.7394, region: 'central', ext: true },
        sasaram: { name: 'Sasaram', lat: 24.9503, lon: 84.0165, region: 'east', ext: true },
        satna: { name: 'Satna', lat: 24.5685, lon: 80.8375, region: 'central', ext: true },
        shivamogga: { name: 'Shivamogga', lat: 13.9322, lon: 75.5720, region: 'south', ext: true },
        silchar: { name: 'Silchar', lat: 24.8207, lon: 92.7961, region: 'east', ext: true },
        silvassa: { name: 'Silvassa', lat: 20.2752, lon: 73.0055, region: 'west', ext: true },
        siwan: { name: 'Siwan', lat: 26.2207, lon: 84.3570, region: 'east', ext: true },
        thanesar: { name: 'Thanesar', lat: 29.9688, lon: 76.8469, region: 'north', ext: true },
        tumakuru: { name: 'Tumakuru', lat: 13.3366, lon: 77.1079, region: 'south', ext: true },
        vasaivirar: { name: 'Vasai-Virar', lat: 19.4199, lon: 72.8251, region: 'west', ext: true },
        vizianagaram: { name: 'Vizianagaram', lat: 18.1143, lon: 83.4062, region: 'south', ext: true },
        bhubaneswar: { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, region: 'east', ext: true },
        cuttack: { name: 'Cuttack', lat: 20.4625, lon: 85.8830, region: 'east', ext: true },
        dibrugarh: { name: 'Dibrugarh', lat: 27.4728, lon: 94.9120, region: 'east', ext: true },
        agartala: { name: 'Agartala', lat: 23.8315, lon: 91.2868, region: 'east', ext: true },
        shillong: { name: 'Shillong', lat: 25.5788, lon: 91.8933, region: 'east', ext: true },
        imphal: { name: 'Imphal', lat: 24.8170, lon: 93.9368, region: 'east', ext: true },
        gangtok: { name: 'Gangtok', lat: 27.3389, lon: 88.6065, region: 'east', ext: true },
        mysuru: { name: 'Mysuru', lat: 12.2958, lon: 76.6394, region: 'south', ext: true },
        mangaluru: { name: 'Mangaluru', lat: 12.9141, lon: 74.8560, region: 'south', ext: true },
        hubballi: { name: 'Hubballi', lat: 15.3647, lon: 75.1240, region: 'south', ext: true },
        belagavi: { name: 'Belagavi', lat: 15.8497, lon: 74.4977, region: 'south', ext: true },
        kalaburagi: { name: 'Kalaburagi', lat: 17.3297, lon: 76.8343, region: 'south', ext: true },
        vijayawada: { name: 'Vijayawada', lat: 16.5062, lon: 80.6480, region: 'south', ext: true },
        guntur: { name: 'Guntur', lat: 16.3067, lon: 80.4365, region: 'south', ext: true },
        nellore: { name: 'Nellore', lat: 14.4426, lon: 79.9865, region: 'south', ext: true },
        tirupati: { name: 'Tirupati', lat: 13.6288, lon: 79.4192, region: 'south', ext: true },
        kurnool: { name: 'Kurnool', lat: 15.8281, lon: 78.0373, region: 'south', ext: true },
        warangal: { name: 'Warangal', lat: 17.9784, lon: 79.5941, region: 'south', ext: true },
        nizamabad: { name: 'Nizamabad', lat: 18.6725, lon: 78.0940, region: 'south', ext: true },
        madurai: { name: 'Madurai', lat: 9.9252, lon: 78.1198, region: 'south', ext: true },
        tiruchirappalli: { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, region: 'south', ext: true },
        salem: { name: 'Salem', lat: 11.6643, lon: 78.1460, region: 'south', ext: true },
        tirunelveli: { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567, region: 'south', ext: true },
        erode: { name: 'Erode', lat: 11.3410, lon: 77.7172, region: 'south', ext: true },
        vellore: { name: 'Vellore', lat: 12.9165, lon: 79.1325, region: 'south', ext: true },
        thoothukudi: { name: 'Thoothukudi', lat: 8.7642, lon: 78.1348, region: 'south', ext: true },
        kozhikode: { name: 'Kozhikode', lat: 11.2588, lon: 75.7804, region: 'south', ext: true },
        thrissur: { name: 'Thrissur', lat: 10.5276, lon: 76.2144, region: 'south', ext: true },
        kollam: { name: 'Kollam', lat: 8.8932, lon: 76.6141, region: 'south', ext: true },
        kannur: { name: 'Kannur', lat: 11.8745, lon: 75.3704, region: 'south', ext: true },
        puducherry: { name: 'Puducherry', lat: 11.9416, lon: 79.8083, region: 'south', ext: true }
    };

    const INDIAN_CITIES = Object.keys(CITIES).filter(k => CITIES[k].region !== 'intl');
    // Core set eagerly fetched on load (extended cities are lazy-fetched on select).
    const CORE_CITIES = INDIAN_CITIES.filter(k => !CITIES[k].ext);
    let aqiData = {};
    let charts = {};
    let map = null;
    let mapMarkers = [];
    let usingLiveData = false;



    // ── Language / i18n System ──
    const TITLES = {
        en: 'जनवायु', hi: 'जनवायु', mr: 'जनवायू', ta: 'ஜன்வாயு', bn: 'জনবায়ু'
    };

    const I18N = {
        en: {
            about_heading: 'About JanVayu',
            about_intro: 'JanVayu (<span lang="hi">जनवायु</span> &mdash; &ldquo;People&rsquo;s Air&rdquo;) is a non-partisan, citizen-led platform documenting India&rsquo;s air quality crisis &mdash; its live data, its human toll, its policies, and its public memory. It brings together real-time AQI across <strong>115+ cities</strong>, a ward-level atlas, a live forecast and farm-fire tracker, health and economic-impact research, policy and accountability tracking, RTI tools, the <a href="/ask/">Ask JanVayu</a> AI assistant, and a multilingual wall of citizen testimony &mdash; every figure sourced and open. It is not a campaign; it is a public record, built for the <strong>#AQIForJanHit</strong> effort.',
            about_mission_h: 'Our Mission',
            about_mission_p1: 'JanVayu exists because clean air is a fundamental right, not a privilege. We measure the distance between what governments promise and what people actually breathe &mdash; using independent data, peer-reviewed research and RTI responses that anyone can check for themselves.',
            about_mission_p2: 'This platform is part of <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong> &mdash; the broader <strong>#AQIForJanHit</strong> campaign. We use real-time monitoring data, peer-reviewed research, RTI responses, and independent analysis to provide the accountability that India&rsquo;s air quality crisis demands.',
            about_datasources_h: 'Data Sources',
            about_partners_h: 'Janhit Partners',
            about_partners_intro: 'The organisations and initiatives JanVayu works alongside in the <strong>#AQIForJanHit</strong> effort for clean air as a public good.',
            hero_title: "India's air is killing <em>1.72 million people</em> every year",
            hero_sub: "JanVayu is India's independent, citizen-led air quality platform. We track live pollution data, measure health impacts, follow the money, and hold governments accountable. Because clean air is not a privilege, it is a right.",
            tagline: "Citizen Air Quality Platform",
            nav_myair: "My Air",
            nav_citydata: "City Data",
            nav_data: "Health & Trends",
            nav_monitor: "Monitoring",
            nav_account: "Accountability",
            nav_action: "Take Action",
            nav_learn: "Learn",
            nav_resources: "Resources",
            // Dropdown items
            dd_health: "Health Impact", dd_economic: "Economic Cost", dd_children: "Children's Health",
            dd_indoor: "Indoor Air", dd_trends: "Historical Trends",
            dd_compare: "City Comparison", dd_map: "Live Map", dd_forecast: "Air Quality Forecast",
            dd_policy: "Policy Tracker", dd_budget: "Budget Tracker", dd_accountability: "Political Accountability",
            dd_corporate: "Industrial Sources", dd_mission: "Mission Tracker", dd_progress: "Clean Air Wins",
            dd_actions: "Take Action", dd_citizen: "Citizen Plan", dd_legal: "Legal Framework",
            dd_voices: "Citizen Voices", dd_testimony: "Citizen Testimony", dd_migration: "Migration & Displacement",
            dd_tools: "Tools", dd_resources: "Reading List", dd_downloads: "Downloads", dd_about: "About",
            // Mobile nav groups
            navgroup_myair: "My Air", navgroup_citydata: "City Data", navgroup_health: "Health & Trends",
            navgroup_learn: "Learn",
            mg_data: "Data & Analysis", mg_monitor: "Monitoring", mg_account: "Accountability",
            mg_action: "Take Action", mg_resources: "Resources",
            // Stats
            deaths_year: "Deaths/Year", annual_cost: "Annual Cost", delhi_pm25: "Delhi Annual PM2.5",
            right_now: "Right now",
            // UI
            back_home: "Back to home",
            // Footer
            lang_note: ""
        },
        hi: {
            about_heading: 'जनवायु के बारे में',
            about_intro: 'जनवायु (<span lang="hi">जनवायु</span> &mdash; &ldquo;लोगों की हवा&rdquo;) एक गैर-पक्षपाती, नागरिक-नेतृत्व वाला मंच है जो भारत के वायु गुणवत्ता संकट का दस्तावेज़ीकरण करता है &mdash; इसका लाइव डेटा, इसकी मानवीय क्षति, इसकी नीतियाँ और इसकी सार्वजनिक स्मृति। यह <strong>115+ शहरों</strong> का रीयल-टाइम एक्यूआई, वार्ड-स्तरीय एटलस, लाइव पूर्वानुमान और खेत-आग ट्रैकर, स्वास्थ्य और आर्थिक-प्रभाव शोध, नीति और जवाबदेही ट्रैकिंग, आरटीआई उपकरण, <a href="/ask/">Ask JanVayu</a> एआई सहायक, और नागरिक गवाही की बहुभाषी दीवार को एक साथ लाता है &mdash; हर आँकड़ा स्रोत-सहित और खुला। यह कोई अभियान नहीं है; यह एक सार्वजनिक अभिलेख है, जो <strong>#AQIForJanHit</strong> प्रयास के लिए बनाया गया है।',
            about_mission_h: 'हमारा उद्देश्य',
            about_mission_p1: 'जनवायु इसलिए है क्योंकि स्वच्छ हवा एक मौलिक अधिकार है, कोई सुविधा नहीं। हम मापते हैं कि सरकारें जो वादा करती हैं और लोग वास्तव में जो हवा साँस लेते हैं, उनके बीच कितना फ़ासला है &mdash; स्वतंत्र डेटा, सहकर्मी-समीक्षित शोध और आरटीआई जवाबों के आधार पर, जिन्हें कोई भी ख़ुद जाँच सकता है।',
            about_mission_p2: 'यह मंच <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong> का हिस्सा है &mdash; व्यापक <strong>#AQIForJanHit</strong> अभियान। हम रीयल-टाइम निगरानी डेटा, सहकर्मी-समीक्षित शोध, आरटीआई जवाब और स्वतंत्र विश्लेषण का उपयोग करके वह जवाबदेही प्रदान करते हैं जिसकी भारत के वायु गुणवत्ता संकट को आवश्यकता है।',
            about_datasources_h: 'डेटा स्रोत',
            about_partners_h: 'जनहित सहयोगी',
            about_partners_intro: 'स्वच्छ हवा को सार्वजनिक हित बनाने के <strong>#AQIForJanHit</strong> प्रयास में जनवायु जिन संगठनों और पहलों के साथ मिलकर काम करता है।',
            hero_title: "भारत की हवा हर साल <em>20 लाख लोगों</em> की जान ले रही है",
            hero_sub: "जनवायु भारत का स्वतंत्र, नागरिक-संचालित वायु गुणवत्ता मंच है। हम प्रदूषण के आंकड़े, स्वास्थ्य प्रभाव, बजट का हिसाब और सरकारी जवाबदेही पर नज़र रखते हैं। क्योंकि स्वच्छ हवा विशेषाधिकार नहीं, अधिकार है।",
            tagline: "नागरिक वायु गुणवत्ता मंच",
            nav_myair: "मेरी हवा",
            nav_citydata: "शहर डेटा",
            nav_data: "स्वास्थ्य और रुझान",
            nav_monitor: "निगरानी",
            nav_account: "जवाबदेही",
            nav_action: "कार्रवाई करें",
            nav_learn: "जानें",
            nav_resources: "संसाधन",
            dd_health: "स्वास्थ्य प्रभाव", dd_economic: "आर्थिक लागत", dd_children: "बाल स्वास्थ्य",
            dd_indoor: "घरेलू वायु", dd_trends: "ऐतिहासिक रुझान",
            dd_compare: "शहर तुलना", dd_map: "लाइव मानचित्र", dd_forecast: "AQI पूर्वानुमान",
            dd_policy: "नीति ट्रैकर", dd_budget: "बजट ट्रैकर", dd_accountability: "राजनीतिक",
            dd_corporate: "औद्योगिक स्रोत", dd_mission: "मिशन ट्रैकर", dd_progress: "स्वच्छ हवा जीत",
            dd_actions: "कार्रवाई करें", dd_citizen: "नागरिक योजना", dd_legal: "कानूनी ढांचा",
            dd_voices: "नागरिक आवाज़ें", dd_testimony: "नागरिक गवाही", dd_migration: "पलायन",
            dd_tools: "उपकरण", dd_resources: "पठन सूची", dd_downloads: "डाउनलोड", dd_about: "परिचय",
            navgroup_myair: "मेरी हवा", navgroup_citydata: "शहर डेटा", navgroup_health: "स्वास्थ्य और रुझान",
            navgroup_learn: "जानें",
            mg_data: "डेटा और विश्लेषण", mg_monitor: "निगरानी", mg_account: "जवाबदेही",
            mg_action: "कार्रवाई करें", mg_resources: "संसाधन",
            deaths_year: "मौतें/वर्ष", annual_cost: "वार्षिक लागत", delhi_pm25: "दिल्ली वार्षिक PM2.5",
            right_now: "अभी",
            back_home: "मुख्य पृष्ठ पर वापस",
            lang_note: "विस्तृत विश्लेषण अंग्रेज़ी में उपलब्ध है। हिन्दी अनुवाद चरणबद्ध रूप से जोड़ा जा रहा है।"
        },
        ta: {
            about_heading: 'ஜன்வாயு பற்றி',
            about_intro: 'ஜன்வாயு (<span lang="hi">जनवायु</span> &mdash; &ldquo;மக்களின் காற்று&rdquo;) என்பது இந்தியாவின் காற்று தர நெருக்கடியை ஆவணப்படுத்தும் ஒரு கட்சி சாராத, குடிமக்கள் தலைமையிலான தளம் &mdash; அதன் நேரடி தரவு, அதன் மனித இழப்பு, அதன் கொள்கைகள் மற்றும் அதன் பொது நினைவு. இது <strong>115+ நகரங்களில்</strong> நிகழ்நேர AQI, வார்டு அளவிலான அட்லஸ், நேரடி முன்னறிவிப்பு மற்றும் வயல்-தீ கண்காணிப்பு, சுகாதார மற்றும் பொருளாதார-தாக்க ஆராய்ச்சி, கொள்கை மற்றும் பொறுப்புக்கூறல் கண்காணிப்பு, RTI கருவிகள், <a href="/ask/">Ask JanVayu</a> AI உதவியாளர், மற்றும் குடிமக்கள் சாட்சியத்தின் பன்மொழி சுவர் ஆகியவற்றை ஒன்றிணைக்கிறது &mdash; ஒவ்வொரு புள்ளிவிவரமும் ஆதாரத்துடன், திறந்தது. இது ஒரு பிரச்சாரம் அல்ல; இது <strong>#AQIForJanHit</strong> முயற்சிக்காக உருவாக்கப்பட்ட ஒரு பொது பதிவு.',
            about_mission_h: 'எங்கள் நோக்கம்',
            about_mission_p1: 'தூய்மையான காற்று ஒரு சலுகை அல்ல, அது ஒரு அடிப்படை உரிமை என்பதால் ஜன்வாயு உள்ளது. சுயாதீன சரிபார்ப்பு, குடிமக்கள் அதிகாரமளித்தல் மற்றும் தரவு சார்ந்த பொறுப்புக்கூறல் மூலம் அரசாங்க வாக்குறுதிகளுக்கும் உண்மையான காற்று தர விளைவுகளுக்கும் இடையிலான இடைவெளியை நாங்கள் இணைக்கிறோம்.',
            about_mission_p2: 'இந்த தளம் <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong> இன் ஒரு பகுதி &mdash; பரந்த <strong>#AQIForJanHit</strong> பிரச்சாரம். நிகழ்நேர கண்காணிப்பு தரவு, சக மதிப்பாய்வு ஆராய்ச்சி, RTI பதில்கள் மற்றும் சுயாதீன பகுப்பாய்வைப் பயன்படுத்தி இந்தியாவின் காற்று தர நெருக்கடி கோரும் பொறுப்புக்கூறலை நாங்கள் வழங்குகிறோம்.',
            about_datasources_h: 'தரவு ஆதாரங்கள்',
            about_partners_h: 'ஜன்ஹித் பங்காளர்கள்',
            about_partners_intro: 'தூய்மையான காற்றை பொது நலனாக்கும் <strong>#AQIForJanHit</strong> முயற்சியில் ஜன்வாயு இணைந்து செயல்படும் அமைப்புகள் மற்றும் முயற்சிகள்.',
            hero_title: "இந்தியாவின் காற்று ஆண்டுதோறும் <em>20 லட்சம் பேரைக்</em> கொல்கிறது",
            hero_sub: "ஜன்வாயு இந்தியாவின் சுயாதீன, குடிமக்கள் வழிநடத்தும் காற்றுத் தர தளமாகும். நாங்கள் மாசு தரவுகள், சுகாதார பாதிப்புகள், பட்ஜெட் கணக்கு மற்றும் அரசின் பொறுப்புணர்வை கண்காணிக்கிறோம். ஏனெனில் சுத்தமான காற்று சலுகை அல்ல, அது உரிமை.",
            tagline: "குடிமக்கள் காற்றுத் தர தளம்",
            nav_myair: "என் காற்று",
            nav_citydata: "நகர தரவு",
            nav_data: "சுகாதாரம் & போக்கு",
            nav_monitor: "கண்காணிப்பு",
            nav_account: "பொறுப்புணர்வு",
            nav_action: "நடவடிக்கை எடுங்கள்",
            nav_learn: "கற்றுக்கொள்",
            nav_resources: "வளங்கள்",
            dd_health: "சுகாதார பாதிப்பு", dd_economic: "பொருளாதார செலவு", dd_children: "குழந்தை சுகாதாரம்",
            dd_indoor: "உட்புற காற்று", dd_trends: "வரலாற்று போக்கு",
            dd_compare: "நகர ஒப்பீடு", dd_map: "நேரடி வரைபடம்", dd_forecast: "AQI கணிப்பு",
            dd_policy: "கொள்கை கண்காணிப்பான்", dd_budget: "பட்ஜெட் கண்காணிப்பான்", dd_accountability: "அரசியல்",
            dd_corporate: "தொழிற்சாலை ஆதாரங்கள்", dd_mission: "மிஷன் கண்காணிப்பான்", dd_progress: "சுத்தக்காற்று வெற்றிகள்",
            dd_actions: "நடவடிக்கை எடுங்கள்", dd_citizen: "குடிமக்கள் திட்டம்", dd_legal: "சட்ட கட்டமைப்பு",
            dd_voices: "குடிமக்கள் குரல்கள்", dd_testimony: "குடிமக்கள் சாட்சியம்", dd_migration: "இடப்பெயர்வு",
            dd_tools: "கருவிகள்", dd_resources: "வாசிப்புப் பட்டியல்", dd_downloads: "பதிவிறக்கங்கள்", dd_about: "பற்றி",
            navgroup_myair: "என் காற்று", navgroup_citydata: "நகர தரவு", navgroup_health: "சுகாதாரம் & போக்கு",
            navgroup_learn: "கற்றுக்கொள்",
            mg_data: "தரவு & பகுப்பாய்வு", mg_monitor: "கண்காணிப்பு", mg_account: "பொறுப்புணர்வு",
            mg_action: "நடவடிக்கை எடுங்கள்", mg_resources: "வளங்கள்",
            deaths_year: "இறப்புகள்/ஆண்டு", annual_cost: "ஆண்டு செலவு", delhi_pm25: "டெல்லி ஆண்டு PM2.5",
            right_now: "இப்போது",
            back_home: "முகப்புக்குத் திரும்பு",
            lang_note: "விரிவான பகுப்பாய்வு ஆங்கிலத்தில் உள்ளது. தமிழ் மொழிபெயர்ப்பு படிப்படியாக சேர்க்கப்படுகிறது."
        },
        mr: {
            about_heading: 'जनवायु विषयी',
            about_intro: 'जनवायु (<span lang="hi">जनवायु</span> &mdash; &ldquo;लोकांची हवा&rdquo;) हे भारताच्या हवा गुणवत्ता संकटाचे दस्तऐवजीकरण करणारे एक निष्पक्ष, नागरिक-नेतृत्वाखालील व्यासपीठ आहे &mdash; त्याचा थेट डेटा, त्याची मानवी हानी, त्याची धोरणे आणि त्याची सार्वजनिक स्मृती. हे <strong>115+ शहरांतील</strong> रिअल-टाइम AQI, वॉर्ड-स्तरीय नकाशा, थेट अंदाज आणि शेत-आग ट्रॅकर, आरोग्य आणि आर्थिक-परिणाम संशोधन, धोरण आणि उत्तरदायित्व ट्रॅकिंग, आरटीआय साधने, <a href="/ask/">Ask JanVayu</a> AI सहाय्यक, आणि नागरिक साक्षीची बहुभाषिक भिंत एकत्र आणते &mdash; प्रत्येक आकडा स्रोतासह आणि खुला. ही मोहीम नाही; हे <strong>#AQIForJanHit</strong> प्रयत्नासाठी तयार केलेले सार्वजनिक अभिलेख आहे.',
            about_mission_h: 'आमचे ध्येय',
            about_mission_p1: 'जनवायु अस्तित्वात आहे कारण स्वच्छ हवा ही सवलत नाही, तो मूलभूत अधिकार आहे. स्वतंत्र पडताळणी, नागरिक सक्षमीकरण आणि डेटा-आधारित उत्तरदायित्वाद्वारे आम्ही सरकारी आश्वासने आणि प्रत्यक्ष हवा गुणवत्ता परिणाम यांच्यातील दरी भरून काढतो.',
            about_mission_p2: 'हे व्यासपीठ <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong> चा भाग आहे &mdash; व्यापक <strong>#AQIForJanHit</strong> मोहीम. रिअल-टाइम निरीक्षण डेटा, समवयस्क-पुनरावलोकित संशोधन, आरटीआय उत्तरे आणि स्वतंत्र विश्लेषण वापरून आम्ही भारताच्या हवा गुणवत्ता संकटाला आवश्यक असलेले उत्तरदायित्व प्रदान करतो.',
            about_datasources_h: 'डेटा स्रोत',
            about_partners_h: 'जनहित भागीदार',
            about_partners_intro: 'स्वच्छ हवा हा सार्वजनिक हिताचा विषय बनवण्याच्या <strong>#AQIForJanHit</strong> प्रयत्नात जनवायु ज्या संस्था आणि उपक्रमांसोबत काम करते.',
            hero_title: "भारतातील हवा दरवर्षी <em>20 लाख लोकांचा</em> बळी घेत आहे",
            hero_sub: "जनवायू हे भारताचे स्वतंत्र, नागरिक-संचालित हवा गुणवत्ता व्यासपीठ आहे. आम्ही प्रदूषणाचे आकडे, आरोग्यावरील परिणाम, बजेटचा मागोवा आणि सरकारी जबाबदारी यांवर लक्ष ठेवतो. कारण स्वच्छ हवा ही सवलत नाही, ती हक्क आहे.",
            tagline: "नागरिक हवा गुणवत्ता व्यासपीठ",
            nav_myair: "माझी हवा",
            nav_citydata: "शहर डेटा",
            nav_data: "आरोग्य आणि कल",
            nav_monitor: "देखरेख",
            nav_account: "जबाबदारी",
            nav_action: "कृती करा",
            nav_learn: "शिका",
            nav_resources: "संसाधने",
            dd_health: "आरोग्य प्रभाव", dd_economic: "आर्थिक खर्च", dd_children: "बाल आरोग्य",
            dd_indoor: "घरातील हवा", dd_trends: "ऐतिहासिक कल",
            dd_compare: "शहर तुलना", dd_map: "थेट नकाशा", dd_forecast: "AQI अंदाज",
            dd_policy: "धोरण ट्रॅकर", dd_budget: "बजेट ट्रॅकर", dd_accountability: "राजकीय",
            dd_corporate: "औद्योगिक स्रोत", dd_mission: "मिशन ट्रॅकर", dd_progress: "स्वच्छ हवा यश",
            dd_actions: "कृती करा", dd_citizen: "नागरिक योजना", dd_legal: "कायदेशीर चौकट",
            dd_voices: "नागरिक आवाज", dd_testimony: "नागरिक साक्ष", dd_migration: "स्थलांतर",
            dd_tools: "साधने", dd_resources: "वाचन सूची", dd_downloads: "डाउनलोड", dd_about: "माहिती",
            navgroup_myair: "माझी हवा", navgroup_citydata: "शहर डेटा", navgroup_health: "आरोग्य आणि कल",
            navgroup_learn: "शिका",
            mg_data: "डेटा आणि विश्लेषण", mg_monitor: "देखरेख", mg_account: "जबाबदारी",
            mg_action: "कृती करा", mg_resources: "संसाधने",
            deaths_year: "मृत्यू/वर्ष", annual_cost: "वार्षिक खर्च", delhi_pm25: "दिल्ली वार्षिक PM2.5",
            right_now: "आत्ता",
            back_home: "मुख्यपृष्ठावर परत",
            lang_note: "तपशीलवार विश्लेषण इंग्रजीत उपलब्ध आहे. मराठी भाषांतर टप्प्याटप्प्याने जोडले जात आहे."
        },
        bn: {
            about_heading: 'জনবায়ু সম্পর্কে',
            about_intro: 'জনবায়ু (<span lang="hi">जनवायु</span> &mdash; &ldquo;জনগণের বাতাস&rdquo;) হল একটি নিরপেক্ষ, নাগরিক-নেতৃত্বাধীন প্ল্যাটফর্ম যা ভারতের বায়ুর মানের সংকট নথিভুক্ত করে &mdash; এর সরাসরি তথ্য, এর মানবিক ক্ষতি, এর নীতি এবং এর জনস্মৃতি। এটি <strong>115+ শহরে</strong> রিয়েল-টাইম AQI, ওয়ার্ড-স্তরের অ্যাটলাস, সরাসরি পূর্বাভাস ও খেত-আগুন ট্র্যাকার, স্বাস্থ্য ও অর্থনৈতিক-প্রভাব গবেষণা, নীতি ও জবাবদিহিতা ট্র্যাকিং, আরটিআই সরঞ্জাম, <a href="/ask/">Ask JanVayu</a> AI সহকারী, এবং নাগরিক সাক্ষ্যের একটি বহুভাষিক দেয়াল একত্র করে &mdash; প্রতিটি পরিসংখ্যান উৎসসহ ও উন্মুক্ত। এটি কোনো অভিযান নয়; এটি একটি জনসাধারণের নথি, <strong>#AQIForJanHit</strong> প্রয়াসের জন্য নির্মিত।',
            about_mission_h: 'আমাদের লক্ষ্য',
            about_mission_p1: 'জনবায়ু বিদ্যমান কারণ পরিষ্কার বাতাস কোনো সুবিধা নয়, এটি একটি মৌলিক অধিকার। স্বাধীন যাচাই, নাগরিক ক্ষমতায়ন এবং তথ্য-নির্ভর জবাবদিহিতার মাধ্যমে আমরা সরকারি প্রতিশ্রুতি ও প্রকৃত বায়ুর মানের ফলাফলের মধ্যে ব্যবধান দূর করি।',
            about_mission_p2: 'এই প্ল্যাটফর্মটি <strong>AirQuality for Janhit by MMSF Fellows, AIPC</strong>-এর অংশ &mdash; বৃহত্তর <strong>#AQIForJanHit</strong> অভিযান। রিয়েল-টাইম পর্যবেক্ষণ তথ্য, সমকক্ষ-পর্যালোচিত গবেষণা, আরটিআই উত্তর এবং স্বাধীন বিশ্লেষণ ব্যবহার করে আমরা ভারতের বায়ুর মানের সংকট যে জবাবদিহিতা দাবি করে তা প্রদান করি।',
            about_datasources_h: 'তথ্য উৎস',
            about_partners_h: 'জনহিত অংশীদার',
            about_partners_intro: 'পরিষ্কার বাতাসকে জনস্বার্থে পরিণত করার <strong>#AQIForJanHit</strong> প্রচেষ্টায় জনবায়ু যেসব সংস্থা ও উদ্যোগের সঙ্গে কাজ করে।',
            hero_title: "ভারতের বায়ু প্রতি বছর <em>২০ লক্ষ মানুষের</em> প্রাণ কেড়ে নিচ্ছে",
            hero_sub: "জনবায়ু ভারতের স্বাধীন, নাগরিক-পরিচালিত বায়ু মান প্ল্যাটফর্ম। আমরা দূষণের তথ্য, স্বাস্থ্যের প্রভাব, বাজেটের হিসাব এবং সরকারি জবাবদিহিতা পর্যবেক্ষণ করি। কারণ বিশুদ্ধ বাতাস বিশেষাধিকার নয়, এটি অধিকার।",
            tagline: "নাগরিক বায়ু মান প্ল্যাটফর্ম",
            nav_myair: "আমার বায়ু",
            nav_citydata: "শহর তথ্য",
            nav_data: "স্বাস্থ্য ও প্রবণতা",
            nav_monitor: "পর্যবেক্ষণ",
            nav_account: "জবাবদিহিতা",
            nav_action: "পদক্ষেপ নিন",
            nav_learn: "শিখুন",
            nav_resources: "সম্পদ",
            dd_health: "স্বাস্থ্য প্রভাব", dd_economic: "অর্থনৈতিক ব্যয়", dd_children: "শিশু স্বাস্থ্য",
            dd_indoor: "অন্দরের বায়ু", dd_trends: "ঐতিহাসিক প্রবণতা",
            dd_compare: "শহর তুলনা", dd_map: "সরাসরি মানচিত্র", dd_forecast: "AQI পূর্বাভাস",
            dd_policy: "নীতি ট্র্যাকার", dd_budget: "বাজেট ট্র্যাকার", dd_accountability: "রাজনৈতিক",
            dd_corporate: "শিল্প উৎস", dd_mission: "মিশন ট্র্যাকার", dd_progress: "বিশুদ্ধ বায়ু সাফল্য",
            dd_actions: "পদক্ষেপ নিন", dd_citizen: "নাগরিক পরিকল্পনা", dd_legal: "আইনি কাঠামো",
            dd_voices: "নাগরিক কণ্ঠস্বর", dd_testimony: "নাগরিক সাক্ষ্য", dd_migration: "অভিবাসন",
            dd_tools: "সরঞ্জাম", dd_resources: "পড়ার তালিকা", dd_downloads: "ডাউনলোড", dd_about: "সম্পর্কে",
            navgroup_myair: "আমার বায়ু", navgroup_citydata: "শহর তথ্য", navgroup_health: "স্বাস্থ্য ও প্রবণতা",
            navgroup_learn: "শিখুন",
            mg_data: "তথ্য ও বিশ্লেষণ", mg_monitor: "পর্যবেক্ষণ", mg_account: "জবাবদিহিতা",
            mg_action: "পদক্ষেপ নিন", mg_resources: "সম্পদ",
            deaths_year: "মৃত্যু/বছর", annual_cost: "বার্ষিক ব্যয়", delhi_pm25: "দিল্লি বার্ষিক PM2.5",
            right_now: "এখন",
            back_home: "মূল পাতায় ফিরুন",
            lang_note: "বিস্তারিত বিশ্লেষণ ইংরেজিতে পাওয়া যায়। বাংলা অনুবাদ ধাপে ধাপে যোগ করা হচ্ছে।"
        }
    };

    let currentLang = 'en';

    function toggleLangMenu() {
        document.getElementById('langDropdown').classList.toggle('open');
    }

    // Close lang menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-switcher')) {
            const dd = document.getElementById('langDropdown');
            if (dd) dd.classList.remove('open');
        }
    });

    function setLanguage(lang) {
        currentLang = lang;
        const t = I18N[lang];
        if (!t) return;

        // Update button label (the language switcher is an icon-only button, so
        // this label element is optional — guard against its absence, otherwise
        // setLanguage() throws here and NO translations are ever applied).
        const labels = { en: 'EN', hi: 'हि', ta: 'த', mr: 'म', bn: 'ব' };
        const langBtnLabel = document.getElementById('langBtnLabel');
        if (langBtnLabel) langBtnLabel.textContent = labels[lang] || lang.toUpperCase();

        // Update active state
        document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
        const active = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (active) active.classList.add('active');

        // Title script - highlight active language
        // Marathi uses Devanagari same as Hindi, so map to 'hi'
        const scriptLang = (lang === 'mr') ? 'hi' : (lang === 'en') ? 'hi' : lang;
        document.querySelectorAll('.logo-script').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-script-lang') === scriptLang);
        });

        // All data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.innerHTML = t[key];
                    // Re-add caret for nav items
                    if (key.startsWith('nav_') && !el.querySelector('.nav-caret')) {
                        el.innerHTML = t[key] + ' <span class="nav-caret"></span>';
                    }
                }
            }
        });

        // data-i18n-attr: "aria-label:key,title:key" — translates attributes without touching innerHTML.
        // Used by icon-only buttons (e.g. back-to-home) where the SVG must stay intact.
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const spec = el.getAttribute('data-i18n-attr') || '';
            spec.split(',').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => (s || '').trim());
                if (attr && key && t[key]) el.setAttribute(attr, t[key]);
            });
        });

        // Desktop dropdown items
        const ddMap = {
            health: 'dd_health', economic: 'dd_economic', children: 'dd_children',
            indoor: 'dd_indoor', trends: 'dd_trends',
            compare: 'dd_compare', map: 'dd_map', forecast: 'dd_forecast',
            policy: 'dd_policy', budget: 'dd_budget', accountability: 'dd_accountability',
            corporate: 'dd_corporate', 'mission-tracker': 'dd_mission', progress: 'dd_progress',
            actions: 'dd_actions', 'citizen-action': 'dd_citizen', legal: 'dd_legal',
            voices: 'dd_voices', testimony: 'dd_testimony', migration: 'dd_migration',
            tools: 'dd_tools', resources: 'dd_resources', downloads: 'dd_downloads', about: 'dd_about'
        };
        document.querySelectorAll('.nav-dropdown-link').forEach(el => {
            const panel = el.getAttribute('data-panel');
            const key = ddMap[panel];
            if (key && t[key]) el.textContent = t[key];
        });

        // Mobile nav items
        const mobileMap = {
            dashboard: 'Dashboard', health: 'dd_health', economic: 'dd_economic',
            children: 'dd_children', indoor: 'dd_indoor', trends: 'dd_trends',
            compare: 'dd_compare', map: 'dd_map', forecast: 'dd_forecast',
            policy: 'dd_policy', budget: 'dd_budget', accountability: 'dd_accountability',
            corporate: 'dd_corporate', 'mission-tracker': 'dd_mission', progress: 'dd_progress',
            actions: 'dd_actions', 'citizen-action': 'dd_citizen', legal: 'dd_legal',
            voices: 'dd_voices', testimony: 'dd_testimony', migration: 'dd_migration',
            tools: 'dd_tools', resources: 'dd_resources', downloads: 'dd_downloads', about: 'dd_about'
        };
        document.querySelectorAll('.mobile-nav-item').forEach(el => {
            const panel = el.getAttribute('data-panel');
            if (panel === 'dashboard') {
                el.textContent = lang === 'en' ? 'Dashboard' : (lang === 'hi' ? 'डैशबोर्ड' : lang === 'ta' ? 'முகப்புப்பலகை' : lang === 'mr' ? 'डॅशबोर्ड' : 'ড্যাশবোর্ড');
            } else {
                const key = mobileMap[panel];
                if (key && t[key]) el.textContent = t[key];
            }
        });

        // Mobile nav group labels
        const groupLabels = document.querySelectorAll('.mobile-nav-group-label');
        const mgKeys = ['mg_data', 'mg_monitor', 'mg_account', 'mg_action', 'mg_resources'];
        groupLabels.forEach((el, i) => {
            if (mgKeys[i] && t[mgKeys[i]]) el.textContent = t[mgKeys[i]];
        });

        // Stat labels on hero
        document.querySelectorAll('.hero-stat-label').forEach(el => {
            if (el.textContent.includes('Deaths')) el.textContent = t.deaths_year || 'Deaths/Year';
            if (el.textContent.includes('Annual Cost') || el.textContent.includes('वार्षिक') || el.textContent.includes('ஆண்டு செலவு') || el.textContent.includes('বার্ষিক')) el.textContent = t.annual_cost || 'Annual Cost';
            if (el.textContent.includes('Delhi Annual') || el.textContent.includes('दिल्ली वार्षिक') || el.textContent.includes('டெல்லி') || el.textContent.includes('দিল্লি')) el.textContent = t.delhi_pm25 || 'Delhi Annual PM2.5';
        });
        document.querySelectorAll('.hero-stat-note').forEach(el => {
            if (el.textContent.includes('Right now') || el.textContent.includes('अभी') || el.textContent.includes('இப்போது') || el.textContent.includes('আত্ত') || el.textContent.includes('এখন')) el.textContent = t.right_now || 'Right now';
        });

        // Language note banner
        let banner = document.getElementById('lang-note-banner');
        if (t.lang_note) {
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'lang-note-banner';
                banner.style.cssText = 'background: var(--green-50); border-bottom: 1px solid var(--border); padding: 8px 16px; text-align: center; font-family: var(--sans); font-size: 0.8rem; color: var(--text-2);';
                const main = document.querySelector('main');
                if (main) main.parentNode.insertBefore(banner, main);
            }
            banner.textContent = t.lang_note;
            banner.style.display = 'block';
        } else if (banner) {
            banner.style.display = 'none';
        }

        // Close dropdown
        document.getElementById('langDropdown').classList.remove('open');
    }

    // ── Hero City Selector ──
    function updateHeroCity(cityKey) {
        const cityName = CITIES[cityKey]?.name || cityKey;
        const labelEl = document.getElementById('hero-city-label');
        if (labelEl) labelEl.textContent = cityName + ' Live PM2.5';
        const pmEl = document.getElementById('delhi-live-pm25');
        const whoEl = document.getElementById('delhi-who-multiple');
        const aqiEl = document.getElementById('delhi-live-aqi');
        const data = aqiData[cityKey];
        if (data) {
            const pm25 = data.pm25 || Math.round(data.aqi * 0.7);
            const whoX = getWHOMultiple(pm25);
            const color = getPM25TextColor(pm25); // text on white card — must stay legible
            if (pmEl) { pmEl.textContent = pm25; pmEl.style.color = color; }
            if (whoEl) { whoEl.textContent = whoX + 'x WHO guideline'; whoEl.style.color = color; }
            if (aqiEl) aqiEl.textContent = data.aqi;
            updatePersonalImpact(cityKey, data);
            return;
        }
        // No cached data — extended cities aren't eagerly loaded, so fetch this
        // city's live AQI on demand and re-render when it lands.
        if (CITIES[cityKey] && !CITIES[cityKey]._fetching) {
            CITIES[cityKey]._fetching = true;
            if (pmEl) { pmEl.textContent = '…'; pmEl.style.color = 'var(--text-3)'; }
            if (whoEl) { whoEl.textContent = 'Fetching live data…'; whoEl.style.color = 'var(--text-3)'; }
            if (aqiEl) aqiEl.textContent = '…';
            fetchAQI(cityKey).then(v => {
                CITIES[cityKey]._fetching = false;
                if (v) aqiData[cityKey] = v;
                if ((document.getElementById('hero-city-select')?.value || 'delhi') === cityKey) {
                    if (v) updateHeroCity(cityKey);
                    else { if (pmEl) pmEl.textContent = '--'; if (whoEl) whoEl.textContent = 'No data'; if (aqiEl) aqiEl.textContent = '--'; updatePersonalImpact(cityKey, null); }
                }
            }).catch(() => { CITIES[cityKey]._fetching = false; });
        } else if (!CITIES[cityKey]) {
            if (pmEl) { pmEl.textContent = '--'; pmEl.style.color = 'var(--text-3)'; }
            if (whoEl) { whoEl.textContent = 'No data'; whoEl.style.color = 'var(--text-3)'; }
            if (aqiEl) aqiEl.textContent = '--';
            updatePersonalImpact(cityKey, null);
        }
    }

    // ── Personal Impact (cigarette equivalence + disease risk + solutions) ──
    // Berkeley Earth equivalence: 22 µg/m³ PM2.5 over 24 hours ≈ 1 cigarette.
    function updatePersonalImpact(cityKey, data) {
        const cityName = CITIES[cityKey]?.name || cityKey;
        const cityLabel = document.getElementById('personal-impact-city');
        if (cityLabel) cityLabel.textContent = cityName;

        const cigEl = document.getElementById('cigarette-count');
        const cigCtx = document.getElementById('cigarette-context');
        const diseaseEl = document.getElementById('disease-risk-body');
        const solutionEl = document.getElementById('solution-body');
        const bandEl = document.getElementById('solution-band');

        if (!data) {
            if (cigEl) { cigEl.textContent = '--'; cigEl.style.color = 'var(--text-3)'; }
            if (cigCtx) cigCtx.textContent = 'No live data right now.';
            if (diseaseEl) diseaseEl.innerHTML = '<div style="color: var(--text-3);">No live data.</div>';
            if (solutionEl) solutionEl.innerHTML = '<div style="color: var(--text-3);">No live data.</div>';
            if (bandEl) bandEl.textContent = '--';
            return;
        }

        const pm25 = data.pm25 || Math.round(data.aqi * 0.7);
        const aqi = data.aqi;
        const cigPerDay = (pm25 / 22).toFixed(1);
        const cigColor = getPM25TextColor(pm25); // text on white card
        if (cigEl) { cigEl.textContent = cigPerDay; cigEl.style.color = cigColor; }
        if (cigCtx) {
            const cigPerWeek = Math.round((pm25 / 22) * 7);
            cigCtx.textContent = `That's ≈ ${cigPerWeek} cigarettes/week of equivalent PM2.5 exposure.`;
        }

        const riskRows = computeDiseaseRisk(aqi);
        if (diseaseEl) {
            diseaseEl.innerHTML = riskRows.map(r => `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <span>${r.name}</span>
                    <span style="background: ${r.color}; color: #fff; font-weight: 600; font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.04em;">${r.level}</span>
                </div>
            `).join('');
        }

        const sol = computeSolution(aqi);
        if (bandEl) { bandEl.textContent = sol.label; bandEl.style.color = sol.color; }
        if (solutionEl) {
            solutionEl.innerHTML = `
                <div style="border-left: 3px solid ${sol.color}; padding-left: 10px; margin-bottom: 8px;">
                    <strong style="color: ${sol.color};">${sol.headline}</strong>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px;">
                    ${sol.actions.map(a => `<li style="display: flex; gap: 8px; padding: 3px 0;"><span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${sol.color}; margin-top: 8px; flex-shrink: 0;"></span><span>${a}</span></li>`).join('')}
                </ul>
                <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="btn btn-sm" style="font-size: 0.7rem;" onclick="showPanel('purifier-calc')">Purifier sizing</button>
                    <button class="btn btn-sm" style="font-size: 0.7rem;" onclick="showPanel('go-outside')">Go outside?</button>
                </div>
            `;
        }
    }

    function computeDiseaseRisk(aqi) {
        // Buckets: Good (≤50), Moderate (≤100), Poor (≤200), Very Poor (≤300), Severe (≤400), Hazardous (>400)
        const band = aqi <= 50 ? 0 : aqi <= 100 ? 1 : aqi <= 200 ? 2 : aqi <= 300 ? 3 : aqi <= 400 ? 4 : 5;
        const levels = [
            { level: 'Low',      color: '#22C55E' },
            { level: 'Watch',    color: '#EAB308' },
            { level: 'Elevated', color: '#F97316' },
            { level: 'High',     color: '#EF4444' },
            { level: 'Severe',   color: '#7C3AED' },
            { level: 'Extreme',  color: '#831843' },
        ];
        // Each disease has its own sensitivity to AQI
        return [
            { name: 'Asthma flare-up',          ...levels[Math.min(5, band + 1)] },
            { name: 'Heart attack / stroke',     ...levels[band] },
            { name: 'Allergies & eye irritation',...levels[Math.min(5, band)] },
            { name: 'Respiratory infection',     ...levels[band] },
            { name: 'Children & elderly risk',   ...levels[Math.min(5, band + 1)] },
        ];
    }

    function computeSolution(aqi) {
        if (aqi <= 50) {
            return {
                label: 'Good', color: '#22C55E',
                headline: 'Air is clean. Enjoy outdoors.',
                actions: [
                    'Outdoor exercise is safe for everyone.',
                    'Open windows to ventilate indoor spaces.',
                    'Kids and elderly: no restrictions.',
                ]
            };
        }
        if (aqi <= 100) {
            return {
                label: 'Moderate', color: '#EAB308',
                headline: 'Mostly fine. Sensitive groups should watch.',
                actions: [
                    'Outdoor exercise OK for most. Reduce intensity if asthmatic.',
                    'Windows OK; close during traffic peaks.',
                    'Mask not needed unless you have a lung condition.',
                ]
            };
        }
        if (aqi <= 200) {
            return {
                label: 'Poor', color: '#F97316',
                headline: 'Limit prolonged outdoor exertion.',
                actions: [
                    'Wear a well-fitted N95 outdoors for over 30 minutes.',
                    'Move workouts indoors; avoid roadside running.',
                    'Close windows; run an air purifier in bedrooms.',
                    'Kids: shorten outdoor recess. Asthmatics: keep inhaler ready.',
                ]
            };
        }
        if (aqi <= 300) {
            return {
                label: 'Very Poor', color: '#EF4444',
                headline: 'Stay indoors. Run a HEPA purifier.',
                actions: [
                    'N95 mandatory outdoors — even brief exposure matters.',
                    'Run HEPA purifier 24/7; size for room volume.',
                    'No outdoor exercise. Reschedule sports.',
                    'Schools: consider hybrid or holiday for primary classes.',
                ]
            };
        }
        if (aqi <= 400) {
            return {
                label: 'Severe', color: '#7C3AED',
                headline: 'Health emergency. Avoid all outdoor exposure.',
                actions: [
                    'Stay indoors. Seal gaps under doors and windows.',
                    'Multiple HEPA purifiers; create a "clean room" if needed.',
                    'Cardiac and lung patients: keep meds and emergency contacts close.',
                    'Schools should close. Outdoor work should pause.',
                ]
            };
        }
        return {
            label: 'Hazardous', color: '#831843',
            headline: 'Emergency. Treat outdoor air as toxic.',
            actions: [
                'Government should activate GRAP Stage IV / emergency protocols.',
                'Do not go outside without N95 plus eye protection.',
                'ER visits spike. Seek help immediately for chest pain or breathing trouble.',
                'If feasible, consider temporary relocation for vulnerable family members.',
            ]
        };
    }

    // ── Near Me (geolocation → nearest WAQI station) ──
    async function loadNearestAQI() {
        const btn = document.getElementById('near-me-btn');
        const origText = btn ? btn.textContent : '';
        if (!navigator.geolocation) {
            alert('Your browser does not support geolocation. Please pick a city manually.');
            return;
        }
        if (btn) { btn.textContent = '… Locating'; btn.disabled = true; }
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: false });
            });
            const { latitude: lat, longitude: lon } = pos.coords;
            const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.status !== 'ok' || !json.data || json.data.aqi === '-') {
                throw new Error('No nearby station found.');
            }
            const d = json.data;
            const aqi = parseInt(d.aqi);
            const pm25 = iaqiToPM25(d.iaqi?.pm25?.v) || Math.round(aqi * 0.7);
            const stationName = d.city?.name || 'Nearest station';

            // Inject as a synthetic "near-me" entry into aqiData so all the cards reuse the same flow.
            CITIES['__nearme'] = { name: 'Near me — ' + stationName, lat, lon };
            aqiData['__nearme'] = { aqi, pm25, pm10: iaqiToPM10(d.iaqi?.pm10?.v), time: d.time?.s || new Date().toISOString(), station: stationName, live: true };

            // Add or update the dropdown option so the user can switch back
            const sel = document.getElementById('hero-city-select');
            if (sel) {
                let opt = sel.querySelector('option[value="__nearme"]');
                if (!opt) {
                    opt = document.createElement('option');
                    opt.value = '__nearme';
                    sel.insertBefore(opt, sel.firstChild);
                }
                opt.textContent = 'Near me — ' + stationName;
                sel.value = '__nearme';
            }
            updateHeroCity('__nearme');
        } catch (e) {
            const msg = e && e.code === 1 ? 'Location permission denied. Pick a city manually.' :
                        e && e.code === 3 ? 'Location request timed out.' :
                        (e.message || 'Could not find a nearby station.');
            alert(msg);
        } finally {
            if (btn) { btn.textContent = origText; btn.disabled = false; }
        }
    }

    // ── Glossary Overlay (Cmd+K) ──
    const GLOSSARY_DATA = [
        { term: 'AQI', full: 'Air Quality Index', def: 'A standardised scale (0-500) converting pollutant concentrations into a single number. Below 50 is "Good", above 200 is "Very Unhealthy".', simple: 'A number from 0-500 that tells you how clean or dirty the air is. Under 50 is good, over 200 is very unhealthy.' },
        { term: 'PM2.5', full: 'Fine Particulate Matter', def: 'Airborne particles smaller than 2.5 micrometres. Small enough to penetrate deep into lungs and bloodstream. WHO guideline: 5 µg/m³ annual mean.', simple: 'Tiny invisible particles that get deep into your lungs and blood. The WHO says safe is 5 or less. Delhi averages 96.' },
        { term: 'PM10', full: 'Coarse Particulate Matter', def: 'Particles smaller than 10 micrometres including dust, pollen, and construction debris. WHO guideline: 15 µg/m³.', simple: 'Larger dust particles from roads or construction. They irritate your nose and throat but don\'t go as deep as PM2.5.' },
        { term: 'µg/m³', full: 'Micrograms per cubic metre', def: 'Standard unit for measuring airborne particle concentration. One microgram is one-millionth of a gram.', simple: 'The unit used to measure pollution in the air. Think of it as "parts of pollution per breath". Lower is better.' },
        { term: 'GEMM', full: 'Global Exposure Mortality Model', def: 'A dose-response model (Burnett et al., 2018) estimating excess mortality from PM2.5 exposure. Used in GBD studies.', simple: 'A formula that estimates how many people die from air pollution based on PM2.5 levels.' },
        { term: 'NCAP', full: 'National Clean Air Programme', def: 'India\'s flagship programme targeting 40% PM reduction by 2025-26 across 131 non-attainment cities. ~$1.4B budget.', simple: 'India\'s government plan to reduce air pollution in 131 cities by 40%. $1.4 billion budget, mixed results.' },
        { term: 'GRAP', full: 'Graded Response Action Plan', def: 'Emergency pollution control framework for Delhi-NCR. Stage I (AQI 201-300) to Stage IV (AQI >450). Enforced by CAQM.', simple: 'Emergency rules for Delhi that kick in when pollution gets bad. From banning firecrackers to closing schools.' },
        { term: 'CPCB', full: 'Central Pollution Control Board', def: 'India\'s apex environmental monitoring body under MoEFCC. Operates the CAAQMS monitoring network.', simple: 'India\'s main government body that monitors air and water pollution and runs official monitoring stations.' },
        { term: 'CAQM', full: 'Commission for Air Quality Management', def: 'Statutory body for Delhi-NCR air quality with quasi-judicial powers. Can issue binding directions.', simple: 'A special commission for Delhi-NCR with legal power to enforce pollution rules and activate GRAP stages.' },
        { term: 'RTI', full: 'Right to Information', def: 'Citizen\'s legal right under RTI Act 2005 to request information from public authorities. Response within 30 days.', simple: 'Your legal right to ask the government questions and get answers within 30 days.' },
        { term: 'WHO', full: 'World Health Organization', def: '2021 guidelines set PM2.5 at 5 µg/m³ (annual) and PM10 at 15 µg/m³ — significantly stricter than India\'s NAAQS.', simple: 'The global health body that sets safe limits for air pollution. Most Indian cities are 10-20x over their guidelines.' },
        { term: 'COPD', full: 'Chronic Obstructive Pulmonary Disease', def: 'Progressive lung diseases obstructing airflow. PM2.5 exposure is a leading risk factor.', simple: 'A lung disease that makes it hard to breathe. Long-term air pollution is a major cause.' },
        { term: 'IHD', full: 'Ischaemic Heart Disease', def: 'Reduced blood supply to the heart. PM2.5 increases risk through systemic inflammation.', simple: 'Heart disease caused by reduced blood flow. Air pollution increases heart attack risk.' },
        { term: 'ALRI', full: 'Acute Lower Respiratory Infection', def: 'Lower respiratory tract infections (pneumonia). Leading cause of death in children under 5 in India.', simple: 'Serious lung infections like pneumonia, especially dangerous for children under 5.' },
        { term: 'GBD', full: 'Global Burden of Disease', def: 'Comprehensive IHME study quantifying health loss. Attributes ~2M deaths/year in India to air pollution.', simple: 'The world\'s largest health study. Says air pollution kills 2 million Indians per year.' },
        { term: 'CAAQMS', full: 'Continuous Ambient Air Quality Monitoring System', def: 'Automated stations measuring PM2.5, PM10, SO2, NO2, O3, CO in real-time. India has 400+ stations.', simple: 'Automatic air quality stations that measure pollution 24/7. India has 400+ but coverage is uneven.' },
        { term: 'WAQI', full: 'World Air Quality Index', def: 'Non-profit aggregating real-time data from 30,000+ stations worldwide. JanVayu\'s live data source.', simple: 'A global project that collects air quality data and makes it free. JanVayu uses it for live data.' },
        { term: 'NAAQS', full: 'National Ambient Air Quality Standards', def: 'India\'s regulatory limits. PM2.5 annual: 40 µg/m³ (8x the WHO guideline of 5).', simple: 'India\'s official air quality limits — much less strict than WHO. India allows 40, WHO says 5.' },
        { term: 'Stubble Burning', full: '', def: 'Burning crop residue after harvest in Punjab/Haryana. Major contributor to Delhi-NCR\'s winter pollution (Oct-Nov).', simple: 'When farmers burn leftover crop stalks. Causes massive pollution spikes in North India every October-November.' },
        { term: 'Temperature Inversion', full: '', def: 'Warm air layer trapping cooler surface air and pollutants near ground level. Common in Indo-Gangetic winters.', simple: 'When cold air gets trapped under warm air, acting like a lid that stops pollution from dispersing.' },
    ];

    function toggleGlossaryOverlay() {
        const overlay = document.getElementById('glossaryOverlay');
        if (overlay.classList.contains('open')) {
            closeGlossaryOverlay();
        } else {
            overlay.classList.add('open');
            document.getElementById('glossarySearchInput').value = '';
            renderGlossary('');
            setTimeout(() => document.getElementById('glossarySearchInput').focus(), 100);
        }
    }
    function closeGlossaryOverlay() {
        document.getElementById('glossaryOverlay').classList.remove('open');
    }
    function renderGlossary(query) {
        const q = query.toLowerCase().trim();
        const container = document.getElementById('glossaryResults');
        const filtered = q ? GLOSSARY_DATA.filter(g =>
            g.term.toLowerCase().includes(q) || g.full.toLowerCase().includes(q) ||
            g.def.toLowerCase().includes(q)
        ) : GLOSSARY_DATA;
        if (filtered.length === 0) {
            container.innerHTML = '<div class="glossary-empty">No terms found for "' + query + '"</div>';
            return;
        }
        container.innerHTML = filtered.map(g => `
            <div class="glossary-item">
                <div class="glossary-item-term">${g.term}${g.full ? ' — ' + g.full : ''}</div>
                <div class="glossary-item-def">${simpleMode ? g.simple : g.def}</div>
            </div>
        `).join('');
    }
    function filterGlossary(q) { renderGlossary(q); }

    // Ctrl+K / Cmd+K shortcut
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleGlossaryOverlay();
        }
        if (e.key === 'Escape') {
            closeGlossaryOverlay();
            if (tourStep >= 0) dismissTour();
        }
    });

    // ── Intro Tour ──
    const TOUR_STEPS = [
        { target: '#glossaryToggle', text: 'Glossary — look up air quality terms and acronyms (Ctrl+K)' },
        { target: '#simpleModeToggle', text: 'Simple mode — switch all text to plain, easy language' },
        { target: '#roleSwitcherBtn', text: 'Role selector — choose your role to see relevant content' },
        { target: '#themeToggle', text: 'Dark/light mode toggle' },
    ];
    let tourStep = -1;
    function startTour() {
        tourStep = 0;
        const ov = document.getElementById('tourOverlay');
        ov.classList.add('active');
        // The dimmed backdrop blocks the whole page while the tour runs, so it
        // must always offer a way out: click anywhere outside the tooltip to
        // end the tour (Escape works too — see the keydown handler).
        if (!ov.dataset.dismissWired) {
            ov.dataset.dismissWired = '1';
            ov.addEventListener('click', dismissTour);
        }
        showTourStep();
    }
    function showTourStep() {
        // Remove previous tooltip
        document.querySelectorAll('.tour-tooltip').forEach(t => t.remove());
        if (tourStep >= TOUR_STEPS.length) { dismissTour(); return; }
        const step = TOUR_STEPS[tourStep];
        const el = document.querySelector(step.target);
        const rect = el ? el.getBoundingClientRect() : null;
        // Skip anchors that are missing OR invisible (display:none gives a
        // zero-size rect) — anchoring to them strands the tooltip off-screen.
        if (!rect || (rect.width === 0 && rect.height === 0)) { tourStep++; showTourStep(); return; }
        const tip = document.createElement('div');
        tip.className = 'tour-tooltip';
        tip.innerHTML = step.text + '<br><button onclick="nextTourStep()">' +
            (tourStep < TOUR_STEPS.length - 1 ? 'Next' : 'Done') + '</button>' +
            ' <button onclick="dismissTour()">Skip tour</button>';
        document.body.appendChild(tip);
        // Clamp into the viewport (tooltip is position:fixed)
        const top = Math.min(rect.bottom + 10, window.innerHeight - tip.offsetHeight - 8);
        tip.style.top = Math.max(8, top) + 'px';
        tip.style.left = Math.max(8, Math.min(rect.left + rect.width/2 - tip.offsetWidth/2,
            window.innerWidth - tip.offsetWidth - 8)) + 'px';
    }
    function nextTourStep() { tourStep++; showTourStep(); }
    function dismissTour() {
        tourStep = -1;
        document.getElementById('tourOverlay').classList.remove('active');
        document.querySelectorAll('.tour-tooltip').forEach(t => t.remove());
        // localStorage, not sessionStorage: the tour is for first-time
        // visitors — it must not re-arm (and block the page) every session.
        localStorage.setItem('janvayu-tour-done', '1');
    }
    // Auto-start tour on first visit (after role selection)
    const origSelectRole = window.selectRole;

    // ── Simple Language Toggle (site-wide) ──
    let simpleMode = sessionStorage.getItem('janvayu-simple-mode') === 'true';
    function toggleSimpleMode() {
        simpleMode = !simpleMode;
        sessionStorage.setItem('janvayu-simple-mode', simpleMode);
        applySimpleMode();
    }
    function applySimpleMode() {
        document.body.classList.toggle('simple-language', simpleMode);
        const headerBtn = document.getElementById('simpleModeToggle');
        if (headerBtn) headerBtn.classList.toggle('active', simpleMode);
        if (headerBtn) headerBtn.title = simpleMode ? 'Technical language mode' : 'Simple language mode';
        const glossaryBtn = document.getElementById('glossarySimpleToggle');
        if (glossaryBtn) glossaryBtn.innerHTML = simpleMode
            ? '<span class="si si-eye" style="margin-right:4px;"></span> Switch to technical language'
            : '<span class="si si-eye" style="margin-right:4px;"></span> Switch to simpler language';
        document.querySelectorAll('[data-simple]').forEach(el => {
            if (simpleMode) {
                if (!el.dataset.technical) el.dataset.technical = el.innerHTML;
                el.innerHTML = el.dataset.simple;
                if (el.tagName === 'DD') { el.style.color = 'var(--ink)'; el.style.fontWeight = '500'; }
            } else {
                if (el.dataset.technical) el.innerHTML = el.dataset.technical;
                el.style.color = ''; el.style.fontWeight = '';
            }
        });
    }
    // Alias for glossary button
    function toggleSimpleLanguage() { toggleSimpleMode(); }

    // ── Theme ──
    function toggleTheme() {
        const root = document.documentElement;
        const isDark = root.getAttribute('data-theme') === 'dark';
        root.setAttribute('data-theme', isDark ? '' : 'dark');
        document.getElementById('themeToggle').textContent = isDark ? '☾' : '☀';
        try { initAllCharts(); } catch(e) {}
    }


    // ── Mobile Navigation ──
    function toggleMobileMenu() {
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('mobileNavOverlay');
        const isOpen = nav.classList.contains('open');
        if (isOpen) { closeMobileMenu(); } else {
            nav.classList.add('open'); nav.style.display = 'block';
            overlay.classList.add('open');
            requestAnimationFrame(() => { nav.style.transform = 'translateX(0)'; });
            document.body.style.overflow = 'hidden';
        }
    }
    function closeMobileMenu() {
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('mobileNavOverlay');
        nav.style.transform = 'translateX(100%)';
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { nav.classList.remove('open'); nav.style.display = 'none'; }, 250);
    }

    // ── Navigation ──
    function showPanel(panelId) {
        // Update top-level nav active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('has-active'));
        document.querySelectorAll('.nav-dropdown-link').forEach(l => l.classList.remove('active'));

        // Mark the dropdown link active
        const dropLink = document.querySelector(`.nav-dropdown-link[data-panel="${panelId}"]`);
        if (dropLink) {
            dropLink.classList.add('active');
            const parentItem = dropLink.closest('.nav-item');
            if (parentItem) parentItem.classList.add('has-active');
        }

        // Also check top-level direct links (Dashboard)
        const directLink = document.querySelector(`.nav-item > .nav-link[data-panel="${panelId}"]`);
        if (directLink && !directLink.querySelector('.nav-caret')) {
            directLink.classList.add('active');
        }

        // Ensure hero section is visible when navigating to any panel
        const hero = document.getElementById('section-dashboard');
        if (hero) hero.style.display = '';

        // Dashboard is special (always visible as hero)
        if (panelId === 'dashboard') {
            document.getElementById('panel-container').innerHTML = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState(null, '', '#dashboard');
            return;
        }

        // Role dashboard: show the curated role view
        if (panelId === 'my-dashboard') {
            const savedRole = sessionStorage.getItem('janvayu-role');
            if (savedRole && savedRole !== 'skip' && typeof showRoleDashboard === 'function') {
                showRoleDashboard(savedRole);
            }
            return;
        }

        // Load panel content from the original HTML
        loadPanel(panelId);
        window.history.replaceState(null, '', '#' + panelId);
        
        // Scroll to panel
        document.getElementById('panel-container').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update mobile nav active state
        document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
        const mobileItem = document.querySelector(`.mobile-nav-item[data-panel="${panelId}"]`);
        if (mobileItem) mobileItem.classList.add('active');
    }

    // Back-to-home: return to dashboard hero and scroll to top.
    // Wired to the floating arrow button (bottom-left), visible after the user
    // has scrolled past the hero or has opened a panel via the dropdown nav.
    function backToHome() {
        try { showPanel('dashboard'); } catch (e) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        const btn = document.getElementById('backHomeBtn');
        if (btn) btn.classList.remove('visible');
    }
    window.backToHome = backToHome;

    // FAQ panel live search: filter <details> items (and their group headers)
    // by matching the query against each question + answer. Wired via
    // oninput="faqFilter(this.value)" on the FAQ search box.
    function faqFilter(q) {
        const query = (q || '').trim().toLowerCase();
        const groups = document.querySelectorAll('[data-faq-group]');
        let anyVisible = false;
        groups.forEach((group) => {
            let groupVisible = false;
            group.querySelectorAll('.faq-item').forEach((item) => {
                const text = (item.textContent || '').toLowerCase();
                const match = !query || text.indexOf(query) !== -1;
                item.style.display = match ? '' : 'none';
                if (match && query) item.open = true;      // expand matches while searching
                if (!query) item.open = false;             // collapse again when cleared
                if (match) groupVisible = true;
            });
            const title = group.querySelector('.faq-group-title');
            if (title) title.style.display = groupVisible ? '' : 'none';
            group.style.display = groupVisible ? '' : 'none';
            if (groupVisible) anyVisible = true;
        });
        const none = document.querySelector('.faq-noresults');
        if (none) none.style.display = anyVisible ? 'none' : '';
    }
    window.faqFilter = faqFilter;

    // Show the back-to-home button once the user has scrolled past the hero,
    // or any time a non-dashboard panel is currently loaded.
    (function initBackHomeButton() {
        function shouldShow() {
            const panelContainer = document.getElementById('panel-container');
            // .children only counts element nodes — ignores the placeholder HTML comment
            const hasOpenPanel = !!(panelContainer && panelContainer.children.length > 0);
            // Hide once the footer is reached so the button never sits on top of
            // (and blocks taps on) the footer links on mobile.
            const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 140);
            if (nearBottom) return false;
            return hasOpenPanel || window.scrollY > 320;
        }
        function update() {
            const btn = document.getElementById('backHomeBtn');
            if (!btn) return;
            btn.classList.toggle('visible', shouldShow());
        }
        // Debounce via rAF
        let raf = 0;
        window.addEventListener('scroll', () => {
            if (raf) return;
            raf = requestAnimationFrame(() => { raf = 0; update(); });
        }, { passive: true });
        // Also update right after a panel loads — wrap showPanel once available
        document.addEventListener('DOMContentLoaded', update);
        // Hook into showPanel so the button appears immediately on dropdown click
        const origShowPanel = window.showPanel;
        if (typeof origShowPanel === 'function') {
            window.showPanel = function(panelId) {
                const r = origShowPanel.apply(this, arguments);
                setTimeout(update, 50);
                return r;
            };
        }
    })();

    // Panels whose (large) markup lives in an external fragment, fetched on first
    // open instead of being inlined + parsed on every page load. Cached after first use.
    const LAZY_PANELS = { voices: '/panels/voices.html', resources: '/panels/resources.html', legal: '/panels/legal.html', about: '/panels/about.html' , accountability: '/panels/accountability.html', actions: '/panels/actions.html', 'source-selector': '/panels/source-selector.html', 'aqi-explainer': '/panels/aqi-explainer.html', budget: '/panels/budget.html', progress: '/panels/progress.html', 'citizen-action': '/panels/citizen-action.html', economic: '/panels/economic.html', gallery: '/panels/gallery.html', faq: '/panels/faq.html', team: '/panels/team.html', apportionment: '/panels/apportionment.html' };
    const __panelFragmentCache = {};
    function fetchPanelFragment(panelId) {
        if (__panelFragmentCache[panelId] !== undefined) return Promise.resolve(__panelFragmentCache[panelId]);
        return fetch(LAZY_PANELS[panelId])
            .then(function(r){ return r.ok ? r.text() : ''; })
            .catch(function(e){ console.warn('Panel fragment load failed:', panelId, e); return ''; })
            .then(function(html){ __panelFragmentCache[panelId] = html; return html; });
    }
    function loadPanel(panelId) {
        const container = document.getElementById('panel-container');
        const template = document.getElementById('tmpl-' + panelId);
        // Lazy panel: fetch its fragment on first open, then run the same inits.
        if (LAZY_PANELS[panelId] && (!template || !template.innerHTML.trim())) {
            container.innerHTML = '<div class="panel active" style="padding:40px 0;"><p style="color:var(--text-3);">Loading&hellip;</p></div>';
            return fetchPanelFragment(panelId).then(function(html) {
                container.innerHTML = '<div class="panel active" style="padding:40px 0;">' + (html || '<p style="color:var(--text-3);">This section could not load. Please refresh.</p>') + '</div>';
                loadPanelInits(panelId);
            });
        }
        if (template) {
            container.innerHTML = '<div class="panel active" style="padding:40px 0;">' + template.innerHTML + '</div>';
            loadPanelInits(panelId);
        } else {
            container.innerHTML = '<div class="panel active" style="padding:40px 0;"><p style="color:var(--text-3);">Panel "' + panelId + '" is being loaded from the original platform. This redesign demonstrates the new visual framework. Import the full content from the original index.html to populate all panels.</p></div>';
        }
    }
    function loadPanelInits(panelId) {
            // Re-apply the active language to the freshly-injected panel markup:
            // panels load lazily, after setLanguage() has already run, so any
            // data-i18n elements inside them need translating on open.
            try {
                if (typeof currentLang !== 'undefined' && currentLang !== 'en' && typeof window.setLanguage === 'function') {
                    window.setLanguage(currentLang);
                }
            } catch (e) { /* i18n re-apply is best-effort */ }
            // Re-init charts/map after DOM update
            setTimeout(() => {
                try { initAllCharts(); } catch(e) {}
                if (panelId === 'map') initMap();
                if (panelId === 'rankings') { try { initRankingsPanel(); } catch(e) { console.warn(e); } }
                if (panelId === 'compare') { try { initYoYPanel(); } catch(e) { console.warn(e); } }
                if (panelId === 'trends') { try { initHourlyTrendChart(); } catch(e) { console.warn(e); } }
                if (panelId === 'hyperlocal') {
                    try {
                        const sel = document.getElementById('hyperlocal-city');
                        if (sel) {
                            if (sel.options.length === 0) {
                                INDIAN_CITIES.forEach(k => {
                                    const opt = document.createElement('option');
                                    opt.value = k; opt.textContent = CITIES[k]?.name || k;
                                    sel.appendChild(opt);
                                });
                                sel.value = 'delhi';
                            }
                            // Trigger initial load every time the panel opens
                            setTimeout(() => loadHyperlocal(), 50);
                        }
                    } catch(e) { console.warn(e); }
                }
                if (panelId === 'resources') { try { loadZoteroItems(); } catch(e) { console.warn(e); } }
                if (panelId === 'city-policy') { try { initCityPolicyTracker(); } catch(e) { console.warn('City policy init:', e); } }
                if (panelId === 'urban-heat') {
                    try { window.updateHeatEstimate && window.updateHeatEstimate(); } catch(e) { console.warn('Urban heat init:', e); }
                    try { window.initUrbanHeatChart && window.initUrbanHeatChart(); } catch(e) { console.warn('Urban heat chart init:', e); }
                }
                if (panelId === 'ward-map') { try { window.initWardMap && window.initWardMap(); } catch(e) { console.warn('Ward map init:', e); } }
                if (panelId === 'forecast') { try { initForecastPanel(); } catch(e) { console.warn('Forecast init:', e); } }
                if (panelId === 'fire-tracker') { try { initFireTracker(); } catch(e) { console.warn('Fire tracker init:', e); } }
                if (panelId === 'apportionment') { try { window.initApportionment && window.initApportionment(); } catch(e) { console.warn('Apportionment init:', e); } }
                if (panelId === 'workshops') { try { window.initWorkshops && window.initWorkshops(); } catch(e) { console.warn('Workshops init:', e); } }
            }, 150);
    }

    // ── Urban Heat Island estimator ──
    // Coefficients from the Artha Global Delhi white paper:
    //   built-up area 25%→55% (Δ30pts) ⇒ +0.6°C  ⇒ +0.020°C per 1% built-up
    //   tree cover    3%→11%  (Δ8pts)  ⇒ −1.0°C  ⇒ −0.125°C per 1% tree cover
    // Delta is reported relative to a reference neighbourhood: 40% built-up, 7% tree cover.
    window.updateHeatEstimate = function updateHeatEstimate() {
        const buEl = document.getElementById('uh-builtup');
        const trEl = document.getElementById('uh-tree');
        const deltaEl = document.getElementById('uh-delta');
        if (!buEl || !trEl || !deltaEl) return;
        const builtup = Number(buEl.value);
        const tree = Number(trEl.value);
        document.getElementById('uh-builtup-val').textContent = builtup + '%';
        document.getElementById('uh-tree-val').textContent = tree + '%';

        const REF_BUILTUP = 40, REF_TREE = 7;
        const delta = 0.020 * (builtup - REF_BUILTUP) - 0.125 * (tree - REF_TREE);
        const rounded = Math.round(delta * 10) / 10;
        const sign = rounded > 0 ? '+' : (rounded < 0 ? '−' : '');
        const color = rounded > 0.05 ? '#DC2626' : (rounded < -0.05 ? '#16A34A' : '#A16207');
        deltaEl.textContent = sign + Math.abs(rounded).toFixed(1) + '°C';
        deltaEl.style.color = color;

        const verdict = document.getElementById('uh-verdict');
        if (verdict) {
            if (rounded > 0.05) verdict.innerHTML = 'This neighbourhood runs <strong style="color:var(--red);">hotter</strong> &mdash; concrete is winning over canopy.';
            else if (rounded < -0.05) verdict.innerHTML = 'This neighbourhood runs <strong style="color:var(--green-600);">cooler</strong> &mdash; tree cover is doing the work.';
            else verdict.innerHTML = 'About average for Delhi &mdash; concrete and canopy roughly balance.';
        }
    };

    // ── Live 5-day PM2.5 forecast (Open-Meteo Air Quality API, key-less) ──
    // Mirrors the urban-heat ozone chart's use of Open-Meteo: a free, no-auth,
    // CAMS-based global model. Shown alongside the SAFAR/CPCB reliability
    // tracking so users can cross-check the official forecast. Frontend-only —
    // no Netlify Function needed (matches the $0/month, forkable design).
    let forecastChart = null;

    // CPCB PM2.5 sub-index bands (µg/m³) → { label, colour }.
    function pm25Band(v) {
        if (v == null || isNaN(v)) return { label: 'N/A', color: '#9CA3AF' };
        if (v <= 30)  return { label: 'Good',        color: '#16A34A' };
        if (v <= 60)  return { label: 'Satisfactory', color: '#84CC16' };
        if (v <= 90)  return { label: 'Moderate',    color: '#D97706' };
        if (v <= 120) return { label: 'Poor',        color: '#EA580C' };
        if (v <= 250) return { label: 'Very Poor',   color: '#DC2626' };
        return { label: 'Severe', color: '#7F1D1D' };
    }

    function fmtForecastDay(dayStr) {
        const [y, m, d] = dayStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d); // local, avoids UTC off-by-one
        return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    function initForecastPanel() {
        const sel = document.getElementById('forecast-city');
        if (!sel) return;
        if (sel.options.length === 0) {
            const keys = (typeof INDIAN_CITIES !== 'undefined' && INDIAN_CITIES.length)
                ? INDIAN_CITIES : Object.keys(CITIES || {});
            keys.forEach(k => {
                const c = CITIES && CITIES[k];
                if (!c || c.lat == null || c.lon == null) return;
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = c.name || k;
                sel.appendChild(opt);
            });
            if ([...sel.options].some(o => o.value === 'delhi')) sel.value = 'delhi';
            sel.addEventListener('change', () => loadForecast(sel.value));
        }
        if (sel.value) loadForecast(sel.value);
    }

    async function loadForecast(cityKey) {
        const status = document.getElementById('forecast-status');
        const city = CITIES && CITIES[cityKey];
        if (!city) return;
        if (status) status.textContent = 'Loading forecast…';
        try {
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm2_5,pm10&timezone=auto&forecast_days=5`;
            const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
            if (!res.ok) throw new Error('Open-Meteo request failed');
            const data = await res.json();
            const times = data && data.hourly && data.hourly.time || [];
            const pm25 = data && data.hourly && data.hourly.pm2_5 || [];
            if (!times.length || !pm25.length) throw new Error('no forecast data');

            const byDay = {};
            for (let i = 0; i < times.length; i++) {
                const day = times[i].slice(0, 10);
                if (!byDay[day]) byDay[day] = [];
                if (pm25[i] != null && !isNaN(pm25[i])) byDay[day].push(pm25[i]);
            }
            const days = Object.keys(byDay).sort().filter(d => byDay[d].length).slice(0, 5);
            if (!days.length) throw new Error('no forecast data');
            const meanP25 = days.map(d => Math.round(byDay[d].reduce((a, b) => a + b, 0) / byDay[d].length));
            const maxP25 = days.map(d => Math.round(Math.max(...byDay[d])));

            renderForecastSummary(days, meanP25);
            try { await ensureChartJs(); } catch (_) {}
            renderForecastChart(days.map(fmtForecastDay), meanP25, maxP25);
            if (status) {
                const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                status.textContent = `Updated ${t} · ${city.name || cityKey} · model forecast, cross-check against SAFAR/CPCB below.`;
            }
        } catch (e) {
            if (status) status.textContent = 'Live forecast unavailable right now. See the official sources below.';
            const sum = document.getElementById('forecast-summary');
            if (sum) sum.innerHTML = '';
            if (forecastChart) { try { forecastChart.destroy(); } catch (_) {} forecastChart = null; }
        }
    }

    function renderForecastSummary(days, meanP25) {
        const el = document.getElementById('forecast-summary');
        if (!el) return;
        el.innerHTML = days.map((d, i) => {
            const b = pm25Band(meanP25[i]);
            return `<div class="stat-strip-item">
                <div class="number-callout" style="color:${b.color};">${meanP25[i]}</div>
                <div class="stat-label">${fmtForecastDay(d)}<br><span style="color:${b.color}; font-weight:600;">${b.label}</span></div>
            </div>`;
        }).join('');
    }

    function renderForecastChart(labels, meanP25, maxP25) {
        const canvas = document.getElementById('forecastChart');
        if (!canvas || typeof Chart === 'undefined') return;
        if (forecastChart) { try { forecastChart.destroy(); } catch (_) {} }
        forecastChart = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Daily mean PM2.5',
                        data: meanP25,
                        borderColor: '#7C3AED',
                        backgroundColor: 'rgba(124,58,237,0.12)',
                        fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2
                    },
                    {
                        label: 'Daily peak PM2.5',
                        data: maxP25,
                        borderColor: '#D97706',
                        backgroundColor: 'rgba(217,119,6,0.05)',
                        borderDash: [5, 4], fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'PM2.5 (µg/m³)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // ── Urban Heat: today's hourly ozone vs temperature for one city ──
    // Demonstrates the "climate penalty" (Bloomer 2009) at the scale of a single
    // day: ground-level ozone is photochemical, so it builds up as sunlight and
    // heat peak in the afternoon and falls overnight. We pull hourly surface
    // ozone (CAMS) and 2 m air temperature for today from the free, key-less
    // Open-Meteo API and draw both curves on a dual axis.
    let uhChart = null;
    const uhChartCache = {}; // cityKey -> { ts, hours, ozone, temp }
    async function fetchOzoneHours(city) {
        const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=ozone&timezone=auto&forecast_days=1`;
        const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m&timezone=auto&forecast_days=1`;
        const [aqRes, wxRes] = await Promise.all([fetch(aqUrl), fetch(wxUrl)]);
        if (!aqRes.ok || !wxRes.ok) throw new Error('Open-Meteo request failed');
        const aq = await aqRes.json();
        const wx = await wxRes.json();
        const times = aq?.hourly?.time || [];
        const ozone = aq?.hourly?.ozone || [];
        const temp = wx?.hourly?.temperature_2m || [];
        if (!times.length || !ozone.length || !temp.length) throw new Error('No hourly data');
        const hours = times.map(t => t.slice(11, 16)); // "HH:MM"
        return { hours, ozone, temp };
    }
    window.initUrbanHeatChart = async function initUrbanHeatChart(force) {
        const canvas = document.getElementById('uhOzoneHourChart');
        const status = document.getElementById('uh-chart-status');
        const sel = document.getElementById('uh-chart-city');
        if (!canvas) return;
        // Populate the city selector once
        if (sel && sel.options.length === 0) {
            INDIAN_CITIES.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = CITIES[k]?.name || k;
                sel.appendChild(opt);
            });
            sel.value = 'delhi';
        }
        const cityKey = (sel && sel.value) || 'delhi';
        const city = CITIES[cityKey];
        try { await ensureChartJs(); }
        catch (e) { if (status) status.textContent = 'Chart library could not load.'; return; }

        let series;
        const cached = uhChartCache[cityKey];
        if (!force && cached && (Date.now() - cached.ts < 30 * 60 * 1000)) {
            series = cached;
        } else {
            if (status) status.innerHTML = '<span class="pulse"></span> Loading today&rsquo;s hourly readings…';
            try {
                series = await fetchOzoneHours(city);
                series.ts = Date.now();
                uhChartCache[cityKey] = series;
            } catch (e) {
                if (uhChart) { try { uhChart.destroy(); } catch (err) {} uhChart = null; }
                if (status) status.textContent = 'Could not load hourly data right now. Try the Refresh button in a moment.';
                return;
            }
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? '#334155' : '#E2E8F0';
        // Mark the current hour so people can read "where we are now"
        const nowHH = new Date().getHours();
        const nowIdx = series.hours.findIndex(h => parseInt(h, 10) === nowHH);

        if (uhChart) { try { uhChart.destroy(); } catch (e) {} uhChart = null; }
        uhChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: series.hours,
                datasets: [
                    {
                        label: 'Ozone (µg/m³)', yAxisID: 'yOzone',
                        data: series.ozone,
                        borderColor: '#EA580C', backgroundColor: 'rgba(234,88,12,0.12)',
                        borderWidth: 2.5, pointRadius: 0, tension: 0.35, fill: true
                    },
                    {
                        label: 'Air temperature (°C)', yAxisID: 'yTemp',
                        data: series.temp,
                        borderColor: '#DC2626', backgroundColor: 'transparent',
                        borderWidth: 2, borderDash: [5, 4], pointRadius: 0, tension: 0.35, fill: false
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: true, labels: { boxWidth: 14, font: { size: 11 } } },
                    tooltip: { callbacks: { title: (items) => items.length ? `${items[0].label} today` : '' } }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 12, font: { size: 10 } },
                        title: { display: true, text: 'Hour of day (local time)' }
                    },
                    yOzone: {
                        position: 'left', beginAtZero: true,
                        grid: { color: gridColor },
                        title: { display: true, text: 'Ozone (µg/m³)', color: '#EA580C' },
                        ticks: { color: '#EA580C' }
                    },
                    yTemp: {
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Temperature (°C)', color: '#DC2626' },
                        ticks: { color: '#DC2626' }
                    }
                }
            }
        });

        if (status) {
            // Find the afternoon ozone peak to narrate the relationship
            let peakI = 0;
            for (let i = 1; i < series.ozone.length; i++) if (series.ozone[i] > series.ozone[peakI]) peakI = i;
            const peakHour = series.hours[peakI];
            const nowO3 = nowIdx >= 0 ? Math.round(series.ozone[nowIdx]) : null;
            const nowT = nowIdx >= 0 ? Math.round(series.temp[nowIdx]) : null;
            status.textContent = `${city.name} today: ozone peaks around ${peakHour}, riding the afternoon heat`
                + (nowO3 != null ? ` — right now it's ${nowT}°C with ozone near ${nowO3} µg/m³.` : '.');
        }
    };

    // ── Ward-level air-quality choropleth ("How polluted is your ward?") ──
    // Delhi has ~40 live CPCB/WAQI monitors. We interpolate each of the 290
    // municipal wards' PM2.5 from the nearest stations (inverse-distance
    // weighted, power 2) — an honest citywide SPREAD, not a per-street reading.
    // Satellite-derived per-ward PM2.5 (true coverage) is the planned upgrade.
    let wardMap = null, wardLayer = null, wardCurrentLayer = 'pm25';
    const wardGeoCache = {}, wardLiveCache = {};
    // Every ward file is /data/wards/<cityKey>.json, so derive it rather
    // than keep a hand-maintained map — that list had to be edited in
    // lockstep with the #ward-map-city options and the build pipeline,
    // and a city missing from it failed silently (the map just kept
    // showing whichever city was loaded before).
    const wardFile = (key) => `/data/wards/${key}.json`;

    function wardPM25Color(v) {
        if (v == null || isNaN(v)) return '#cfcfcf';
        if (v <= 30) return '#55a84f';
        if (v <= 60) return '#a3c853';
        if (v <= 90) return '#e6c93b';
        if (v <= 120) return '#f29c33';
        if (v <= 250) return '#e93f33';
        return '#af2d24';
    }
    function wardPM25Label(v) {
        if (v == null || isNaN(v)) return 'No estimate';
        if (v <= 30) return 'Good'; if (v <= 60) return 'Satisfactory';
        if (v <= 90) return 'Moderate'; if (v <= 120) return 'Poor';
        if (v <= 250) return 'Very Poor'; return 'Severe';
    }
    async function wardFetchStations(city) {
        try {
            const url = `https://api.waqi.info/map/bounds/?latlng=${city.lat-0.4},${city.lon-0.5},${city.lat+0.4},${city.lon+0.5}&token=${WAQI_TOKEN}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                return data.data.map(s => {
                    const aqi = parseInt(s.aqi);
                    // WAQI bounds returns US-EPA AQI (PM2.5-dominated in Delhi); convert to µg/m³.
                    const pm = isNaN(aqi) ? null : iaqiToPM25(aqi);
                    return { lat: +s.lat, lon: +s.lon, pm: pm };
                }).filter(s => s.pm != null && s.lat && s.lon);
            }
        } catch (e) { console.warn('[JanVayu] ward stations:', e.message); }
        return [];
    }
    function wardIDW(cx, cy, stations) {
        let num = 0, den = 0, nearest = Infinity;
        for (const s of stations) {
            const dx = cx - s.lon, dy = cy - s.lat;
            const d2 = dx * dx + dy * dy;
            if (d2 < nearest) nearest = d2;
            const w = 1 / (d2 + 1e-6);
            num += w * s.pm; den += w;
        }
        if (!den) return null;
        return { pm: Math.round(num / den), distKm: Math.round(Math.sqrt(nearest) * 111) };
    }

    // Layer registry: PM2.5 is live-interpolated; heat/green/built-up are satellite, baked into the GeoJSON.
    const WARD_LAYERS = {
        pm25:  { label: 'Air quality', prop: '_pm', unit: ' µg/m³', live: true },
        // Annual satellite PM2.5 — the year-scale partner to the structural
        // layers below. Live air (above) is a snapshot; these are not
        // comparable and the UI must never present them as one series.
        // Relative, like heat: a whole city usually sits inside one national
        // band (all 290 Delhi wards are 63–99), so absolute banding paints it
        // flat and hides the intra-city gradient a ward map exists to show.
        // Single-hue ramp + absolute endpoints in the legend keeps it honest.
        pm25a: { label: 'Air, yearly', prop: 'pma', unit: ' µg/m³', annual: true, relative: true },
        lst:   { label: 'Heat',        prop: 'lst', unit: '°C', relative: true },
        green: { label: 'Green cover', prop: 'green', unit: '%' },
        built: { label: 'Built-up',    prop: 'built', unit: '%' },
    };
    let wardState = { cityKey: null, geo: null, stations: null };
    let wardSelected = null;

    function wardLerp(a, b, t) { return Math.round(a + (b - a) * t); }
    function wardRamp(stops, t) {
        t = Math.max(0, Math.min(1, t));
        const seg = (stops.length - 1) * t, i = Math.floor(seg), f = seg - i;
        if (i >= stops.length - 1) return `rgb(${stops[stops.length - 1].join(',')})`;
        const a = stops[i], b = stops[i + 1];
        return `rgb(${wardLerp(a[0],b[0],f)},${wardLerp(a[1],b[1],f)},${wardLerp(a[2],b[2],f)})`;
    }
    const WARD_HEAT_STOPS = [[44,123,182],[171,217,233],[255,255,191],[253,174,97],[215,25,28]];
    // Single hue on purpose: a within-city ramp must not imply "green = safe"
    // in a city where every ward is above India's limit.
    const WARD_PM25A_STOPS = [[254,235,226],[252,197,192],[250,159,181],[221,52,151],[122,1,119]];
    const WARD_GREEN_STOPS = [[247,247,247],[217,240,211],[166,219,160],[90,174,97],[27,120,55]];
    const WARD_BUILT_STOPS = [[247,247,247],[204,204,204],[150,150,150],[99,99,99],[37,37,37]];

    function wardFillColor(layer, v, dom) {
        if (v == null || isNaN(v)) return '#d7d7d7';
        if (layer === 'pm25') return wardPM25Color(v);
        if (layer === 'pm25a') return wardRamp(WARD_PM25A_STOPS, dom.max > dom.min ? (v - dom.min) / (dom.max - dom.min) : 0.5);
        if (layer === 'lst')  return wardRamp(WARD_HEAT_STOPS, dom.max > dom.min ? (v - dom.min) / (dom.max - dom.min) : 0.5);
        if (layer === 'green') return wardRamp(WARD_GREEN_STOPS, Math.min(v, 60) / 60);
        if (layer === 'built') return wardRamp(WARD_BUILT_STOPS, Math.min(v, 100) / 100);
        return '#d7d7d7';
    }
    function wardTipText(layer, p) {
        const v = p[WARD_LAYERS[layer].prop];
        if (v == null) return '<em>No data</em>';
        if (layer === 'pm25') return `Est. PM2.5: <strong>${v} µg/m³</strong> (${wardPM25Label(v)})`;
        if (layer === 'pm25a') return `Yearly PM2.5: <strong>${v} µg/m³</strong> (${pm25AnnualBand(v).label})`;
        if (layer === 'lst')  return `Surface temp: <strong>${v}°C</strong>`;
        if (layer === 'green') return `Green cover: <strong>${v}%</strong>`;
        if (layer === 'built') return `Built-up: <strong>${v}%</strong>`;
        return '';
    }
    function wardSwatch(color, label) {
        return `<span class="ward-legend-item"><span class="ward-legend-sw" style="background:${color};"></span>${label}</span>`;
    }
    function wardGradientBar(stops, leftLabel, midLabel, rightLabel) {
        const css = stops.map(s => `rgb(${s.join(',')})`).join(',');
        return `<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <span style="font-size:0.7rem;color:var(--text-3);">${leftLabel}</span>
            <span style="display:inline-block;height:12px;width:160px;border-radius:3px;background:linear-gradient(90deg,${css});"></span>
            <span style="font-size:0.7rem;color:var(--text-3);">${rightLabel}</span>
            ${midLabel ? `<span style="font-size:0.7rem;color:var(--text-4);">${midLabel}</span>` : ''}</div>`;
    }

    window.setWardLayer = function setWardLayer(layer) {
        if (!WARD_LAYERS[layer]) return;
        wardCurrentLayer = layer;
        if (wardState.geo && wardLayer) wardRenderLayer();
    };

    function wardRenderLayer() {
        const layer = wardCurrentLayer, cfg = WARD_LAYERS[layer], geo = wardState.geo;
        if (!geo || !wardLayer) return;
        const prop = cfg.prop;
        // Active toggle button
        document.querySelectorAll('#ward-layer-toggle .ward-layer-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.layer === layer));
        // Collect values
        const vals = [];
        geo.features.forEach(f => { const v = f.properties[prop]; if (v != null && !isNaN(v)) vals.push({ name: f.properties.name, v: +v, p: f.properties }); });
        const dom = vals.length ? { min: Math.min(...vals.map(x => x.v)), max: Math.max(...vals.map(x => x.v)) } : { min: 0, max: 1 };
        // Restyle + retip
        wardLayer.setStyle(f => ({ fillColor: wardFillColor(layer, f.properties[prop], dom), weight: 0.5, color: '#ffffff', fillOpacity: 0.8 }));
        wardLayer.eachLayer(l => { if (l.setTooltipContent) l.setTooltipContent(`<strong>${l.feature.properties.name}</strong><br>${wardTipText(layer, l.feature.properties)}`); });
        wardRenderLegend(layer, dom);
        wardRenderStats(layer, vals, dom);
        wardRenderMethod(layer);
        wardRenderStatus(layer);
        wardRenderCorrelation(layer);
    }

    // Per-ward scatter: the active metric (y) vs how built-up the ward is (x) —
    // green uses x=built (concrete vs greenery); built uses x=green to avoid x==y.
    let wardCorrChart = null;
    async function wardRenderCorrelation(layer) {
        const card = document.getElementById('ward-corr-card');
        const canvas = document.getElementById('ward-corr-chart');
        if (!card || !canvas || !wardState.geo) return;
        const yProp = WARD_LAYERS[layer].prop;
        const xProp = layer === 'built' ? 'green' : 'built';
        const xLabel = xProp === 'green' ? 'Green cover %' : 'Built-up %';
        // pm25a is the one air series that can honestly be scattered against
        // built-up: both are annual. The live pm25 layer is an hour-old
        // snapshot, so its correlation here is suggestive at best.
        const yLabels = { pm25: 'Est. PM2.5 µg/m³', pm25a: 'Yearly PM2.5 µg/m³', lst: 'Surface temp °C', green: 'Green cover %', built: 'Built-up %' };
        const pts = [];
        wardState.geo.features.forEach(f => {
            const p = f.properties, x = p[xProp], y = p[yProp];
            if (x != null && y != null && !isNaN(x) && !isNaN(y)) pts.push({ x: +x, y: +y, name: p.name });
        });
        if (pts.length < 5) { card.style.display = 'none'; return; }
        card.style.display = '';
        document.getElementById('ward-corr-title').textContent = `${yLabels[layer]} vs ${xLabel}`;
        // Pearson r for the caption
        const n = pts.length, mx = pts.reduce((s, q) => s + q.x, 0) / n, my = pts.reduce((s, q) => s + q.y, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        pts.forEach(q => { const dx = q.x - mx, dy = q.y - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; });
        const r = (sxx && syy) ? sxy / Math.sqrt(sxx * syy) : 0;
        const dir = r > 0.15 ? 'rises with' : r < -0.15 ? 'falls as you add' : 'shows little link to';
        document.getElementById('ward-corr-note').innerHTML = `Each dot is a ward. <strong>${yLabels[layer].replace(/ µg.*| °C| %/, '')}</strong> ${dir} ${xLabel.toLowerCase().replace(' %', '')} &mdash; correlation <strong>r = ${r.toFixed(2)}</strong>.`;
        try { await ensureChartJs(); } catch (e) { card.style.display = 'none'; return; }
        if (wardCorrChart) { try { wardCorrChart.destroy(); } catch (e) {} wardCorrChart = null; }
        wardCorrChart = new Chart(canvas.getContext('2d'), {
            type: 'scatter',
            data: { datasets: [{ data: pts, backgroundColor: 'rgba(124,58,237,0.55)', pointRadius: 3, pointHoverRadius: 5 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw.name}: ${c.raw.x}, ${c.raw.y}` } } },
                scales: {
                    x: { title: { display: true, text: xLabel, font: { size: 10 } }, ticks: { font: { size: 9 } } },
                    y: { title: { display: true, text: yLabels[layer], font: { size: 10 } }, ticks: { font: { size: 9 } } }
                }
            }
        });
    }

    function wardRenderLegend(layer, dom) {
        const el = document.getElementById('ward-legend'); if (!el) return;
        if (layer === 'pm25') {
            const bands = [['0–30','#55a84f'],['31–60','#a3c853'],['61–90','#e6c93b'],['91–120','#f29c33'],['121–250','#e93f33'],['250+','#af2d24']];
            // No text-transform:uppercase on a label containing µ — CSS maps
            // U+00B5 to Greek capital Mu, rendering "µg/m³" as "ΜG/M³".
            el.innerHTML = `<span style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;color:var(--text-3);">PM2.5 µg/m³</span>` + bands.map(b => wardSwatch(b[1], b[0])).join('');
        } else if (layer === 'pm25a') {
            const yr = (wardState.geo && wardState.geo.pma_year) || 2024;
            el.innerHTML = `<span style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;color:var(--text-3);">Yearly PM2.5 µg/m³ · ${yr}</span>` +
                wardGradientBar(WARD_PM25A_STOPS, `${dom.min.toFixed(1)}`, '(cleaner → dirtier, this city)', `${dom.max.toFixed(1)}`) +
                `<span style="flex-basis:100%;font-size:0.66rem;color:var(--text-3);line-height:1.4;">Shading compares wards <em>within this city</em>. Satellite yearly average, not today's air &mdash; WHO guideline 5, India's limit 40.</span>`;
        } else if (layer === 'lst') {
            el.innerHTML = `<span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-3);">Surface temp</span>` +
                wardGradientBar(WARD_HEAT_STOPS, `${dom.min.toFixed(0)}°C`, '(cooler → hotter, this city)', `${dom.max.toFixed(0)}°C`);
        } else if (layer === 'green') {
            el.innerHTML = `<span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-3);">Green cover</span>` +
                wardGradientBar(WARD_GREEN_STOPS, '0%', '(more vegetation →)', '60%+');
        } else if (layer === 'built') {
            el.innerHTML = `<span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-3);">Built-up</span>` +
                wardGradientBar(WARD_BUILT_STOPS, '0%', '(more concrete →)', '100%');
        }
    }

    function wardRenderStats(layer, vals, dom) {
        const el = document.getElementById('ward-stats'); if (!el) return;
        const row = t => `<li style="margin-bottom:0.4rem;">${t}</li>`;
        const wrap = items => `<ul style="margin:0;padding-left:1.1rem;font-size:0.86rem;color:var(--text-2);line-height:1.5;">${items.join('')}</ul>`;
        if (!vals.length) { el.innerHTML = `<div style="color:var(--text-3);font-size:0.85rem;">No data for this layer ${layer === 'pm25' ? '— no live stations reporting right now.' : 'yet.'}</div>`; return; }
        const n = vals.length;
        if (layer === 'pm25') {
            const s = [...vals].sort((a, b) => b.v - a.v), worst = s[0], best = s[n - 1];
            const above90 = vals.filter(v => v.v > 90).length, above250 = vals.filter(v => v.v > 250).length;
            el.innerHTML = wrap([
                row(`<strong>${above90}/${n}</strong> wards are in <strong>Poor or worse</strong> air (PM2.5 &gt; 90 µg/m³) right now.`),
                above250 ? row(`<strong>${above250}</strong> ward(s) are in the <strong>Severe</strong> band (&gt; 250).`) : '',
                row(`Dirtiest: <strong>${worst.name}</strong> &mdash; ~${worst.v} µg/m³ (<strong>${Math.round(worst.v/WHO_PM25_GUIDELINE)}× the WHO limit</strong>).`),
                row(`Cleanest: <strong>${best.name}</strong> &mdash; ~${best.v} µg/m³.`),
                row(`Spread: <strong>${best.v}–${worst.v} µg/m³</strong> in one city, same hour.`)
            ]);
        } else if (layer === 'pm25a') {
            const s = [...vals].sort((a, b) => b.v - a.v), worst = s[0], best = s[n - 1];
            const overIndia = vals.filter(v => v.v > 40).length;
            const yr = (wardState.geo && wardState.geo.pma_year) || 2024;
            el.innerHTML = wrap([
                row(`<strong>${overIndia}/${n}</strong> wards are above <strong>India&rsquo;s annual limit</strong> of 40 µg/m³ (${yr} average).`),
                row(`Dirtiest over the year: <strong>${worst.name}</strong> &mdash; ${worst.v} µg/m³ (<strong>${Math.round(worst.v/WHO_PM25_GUIDELINE)}× the WHO guideline</strong>).`),
                row(`Cleanest over the year: <strong>${best.name}</strong> &mdash; ${best.v} µg/m³.`),
                row(`Spread: <strong>${best.v}–${worst.v} µg/m³</strong> across this city, averaged over a whole year.`)
            ]);
        } else if (layer === 'lst') {
            const s = [...vals].sort((a, b) => b.v - a.v), hot = s[0], cool = s[n - 1];
            const k = Math.max(1, Math.round(n * 0.2));
            const hotG = s.slice(0, k), coolG = s.slice(-k);
            const avg = (arr, key) => Math.round(arr.reduce((t, x) => t + (x.p[key] || 0), 0) / arr.length);
            el.innerHTML = wrap([
                row(`Hottest: <strong>${hot.name}</strong> &mdash; <strong>${hot.v}°C</strong> surface temp.`),
                row(`Coolest: <strong>${cool.name}</strong> &mdash; ${cool.v}°C.`),
                row(`That's a <strong>${(hot.v - cool.v).toFixed(1)}°C gap</strong> across wards on the same afternoon.`),
                row(`The hottest fifth of wards average <strong>${avg(hotG,'built')}% built / ${avg(hotG,'green')}% green</strong>; the coolest fifth <strong>${avg(coolG,'built')}% built / ${avg(coolG,'green')}% green</strong> &mdash; the heat-island effect, in your city's own data.`)
            ]);
        } else if (layer === 'green' || layer === 'built') {
            const s = [...vals].sort((a, b) => b.v - a.v), most = s[0], least = s[n - 1];
            const med = [...vals].map(x => x.v).sort((a, b) => a - b)[Math.floor(n / 2)];
            if (layer === 'green') {
                const bare = vals.filter(v => v.v < 10).length;
                el.innerHTML = wrap([
                    row(`Greenest: <strong>${most.name}</strong> &mdash; <strong>${most.v}%</strong> vegetation.`),
                    row(`Least green: <strong>${least.name}</strong> &mdash; ${least.v}%.`),
                    row(`<strong>${bare}/${n}</strong> wards have under <strong>10%</strong> green cover.`),
                    row(`Median ward: <strong>${med}%</strong> green.`)
                ]);
            } else {
                const dense = vals.filter(v => v.v > 80).length;
                el.innerHTML = wrap([
                    row(`Most built-up: <strong>${most.name}</strong> &mdash; <strong>${most.v}%</strong> concrete.`),
                    row(`Least built-up: <strong>${least.name}</strong> &mdash; ${least.v}%.`),
                    row(`<strong>${dense}/${n}</strong> wards are over <strong>80%</strong> built-up.`),
                    row(`Median ward: <strong>${med}%</strong> built-up.`)
                ]);
            }
        }
    }

    function wardRenderMethod(layer) {
        const el = document.getElementById('ward-method'); if (!el) return;
        const date = wardState.geo && wardState.geo.lst_date;
        if (layer === 'pm25') {
            el.innerHTML = `<strong>What this shows:</strong> each ward&rsquo;s value is estimated from the city&rsquo;s live CPCB/WAQI monitors &mdash; the nearest monitors count most. It&rsquo;s the citywide <em>pattern</em>, not an exact street-by-street reading, and it&rsquo;s sharper where there are more monitors. <em>One note on timing:</em> this air layer is a <strong>live snapshot</strong>, while heat, greenery and built-up cover change slowly over the year. So those layers explain a ward&rsquo;s <em>typical</em> air, not this exact hour&rsquo;s reading.`;
        } else if (layer === 'pm25a') {
            const yr = (wardState.geo && wardState.geo.pma_year) || 2024;
            el.innerHTML = `<strong>What this shows:</strong> each ward&rsquo;s <strong>annual average</strong> PM2.5 for <strong>${yr}</strong>, from satellite (SatPM2.5 V6GL03, ~1&nbsp;km, calibrated against ground monitors). <em>This is the year-scale partner</em> to the heat, greenery and built-up layers &mdash; unlike the live air layer, it can honestly be compared with them, because all four describe the same slow timescale. Two limits: it says nothing about a bad week in November, and a ~1&nbsp;km estimate smooths very local sources, so a single kiln or busy junction won&rsquo;t show up in it.`;
        } else if (layer === 'lst') {
            el.innerHTML = `<strong>Heat &mdash; a driver of air quality.</strong> Land-surface temperature from <strong>Landsat 8/9</strong> (~30&nbsp;m)${date ? `, a clear-sky scene on <strong>${date}</strong>` : ''} &mdash; ground temperature on one hot-season afternoon (hotter than air temperature, a snapshot not an average). <em>Why it&rsquo;s here:</em> heat speeds up ozone formation and worsens the health hit of particle pollution, so hotter wards tend to carry a heavier air-quality burden.`;
        } else if (layer === 'green') {
            el.innerHTML = `<strong>Green cover &mdash; a driver of air quality.</strong> Vegetation share from <strong>ESA WorldCover 2021</strong> (10&nbsp;m satellite land cover): tree, shrub, grass, cropland and wetland. <em>Why it&rsquo;s here:</em> greenery filters particulates out of the air and cools the surroundings &mdash; greener wards tend to breathe cleaner and cooler.`;
        } else if (layer === 'built') {
            el.innerHTML = `<strong>Built-up &mdash; a driver of air quality.</strong> Built / impervious surface from <strong>ESA WorldCover 2021</strong> (10&nbsp;m satellite land cover) as a share of each ward. <em>Why it&rsquo;s here:</em> dense concrete traps pollutants and radiates heat &mdash; more built-up wards <em>tend</em> to have worse air and hotter days (a typical pattern, not a rule for every hour).`;
        }
    }

    function wardRenderStatus(layer) {
        const el = document.getElementById('ward-map-status'); if (!el) return;
        const n = wardState.geo ? wardState.geo.features.length : 0;
        if (layer === 'pm25') {
            const st = wardState.stations;
            el.textContent = (st && st.pts.length)
                ? `${n} wards · estimated from ${st.pts.length} live monitors · ${new Date(st.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. The citywide pattern, not an exact per-ward reading.`
                : 'No live monitors are reporting right now.';
        } else if (layer === 'pm25a') {
            el.textContent = `${n} wards · SatPM2.5 V6GL03 annual mean${wardState.geo && wardState.geo.pma_year ? ' · ' + wardState.geo.pma_year : ''} · ~1 km satellite. A yearly average, not today's air.`;
        } else if (layer === 'lst') {
            el.textContent = `${n} wards · Landsat 8/9 surface temperature${wardState.geo.lst_date ? ' · ' + wardState.geo.lst_date : ''} · ~30 m.`;
        } else {
            el.textContent = `${n} wards · ESA WorldCover 2021 · 10 m satellite land cover.`;
        }
    }

    window.initWardMap = async function initWardMap(force) {
        const host = document.getElementById('ward-map-canvas');
        const statusEl = document.getElementById('ward-map-status');
        const statsEl = document.getElementById('ward-stats');
        if (!host) return;
        const cityKey = document.getElementById('ward-map-city')?.value || 'delhi';
        const city = CITIES[cityKey];
        try { await ensureLeaflet(); }
        catch (e) { if (statusEl) statusEl.textContent = 'Map library could not load.'; return; }

        // Load ward geometry (cached)
        let geo = wardGeoCache[cityKey];
        if (!geo) {
            if (statsEl) statsEl.innerHTML = '<div style="color:var(--text-3); font-size:0.85rem;"><span class="pulse"></span> Loading wards…</div>';
            try { geo = await (await fetch(wardFile(cityKey))).json(); wardGeoCache[cityKey] = geo; }
            catch (e) { if (statusEl) statusEl.textContent = 'Could not load ward boundaries.'; return; }
        }

        // Live stations for the PM2.5 layer (cached 10 min unless forced)
        let stations = wardLiveCache[cityKey];
        if (force || !stations || (Date.now() - stations.ts > 10 * 60 * 1000)) {
            const pts = await wardFetchStations(city);
            stations = { ts: Date.now(), pts };
            wardLiveCache[cityKey] = stations;
        }
        geo.features.forEach(f => {
            const p = f.properties;
            const r = stations.pts.length ? wardIDW(p.cx, p.cy, stations.pts) : null;
            p._pm = r ? r.pm : null;
        });

        wardState = { cityKey, geo, stations };

        // Boundary credit for the city actually on screen. Each ward file
        // records where its outlines came from, and they don't all share a
        // source or a licence — Guwahati's are OpenCity/Oorvani under ODbL,
        // which requires the attribution to be visible, not just in the JSON.
        const srcEl = document.getElementById('ward-map-source');
        // The satellite pass appends its own credits to the same string
        // ("…; green/built: ESA WorldCover…"). Those belong to the raster
        // layers, not the outlines, so only the boundary half goes here —
        // the satellite sources have their own card in the Source Selector.
        if (srcEl) srcEl.textContent = geo.source
            ? `Ward boundaries: ${String(geo.source).split(/;\s*green\/built:/)[0]}`
            : '';

        // Air-only cities (ward boundaries fetched, but no satellite-derived
        // heat/green/built layers yet): disable those toggles and stay on air.
        (function () {
            const raster = !geo.airOnly && geo.features.some(f => f.properties.lst != null);
            document.querySelectorAll('#ward-layer-toggle .ward-layer-btn').forEach(b => {
                // Live air and the annual satellite layer exist for every
                // city; only heat/green/built depend on the raster pipeline.
                if (b.dataset.layer === 'pm25' || b.dataset.layer === 'pm25a') return;
                b.disabled = !raster;
                b.style.opacity = raster ? '' : '0.4';
                b.style.cursor = raster ? '' : 'not-allowed';
                b.title = raster ? '' : 'Satellite heat / green / built-up layers aren’t available for this city yet';
            });
            if (!raster && wardCurrentLayer !== 'pm25' && wardCurrentLayer !== 'pm25a') wardCurrentLayer = 'pm25';
        })();

        // (Re)create the map
        if (wardMap) { try { wardMap.remove(); } catch (e) {} wardMap = null; wardLayer = null; }
        wardMap = L.map(host, { scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap, © CARTO | AQI: WAQI · land cover: ESA WorldCover · heat: USGS Landsat', subdomains: 'abcd', maxZoom: 18
        }).addTo(wardMap);
        wardLayer = L.geoJSON(geo, {
            style: { weight: 0.5, color: '#ffffff', fillOpacity: 0.8 },
            onEachFeature: (f, lyr) => {
                lyr.bindTooltip('', { sticky: true });
                lyr.on({
                    mouseover: e => e.target.setStyle({ weight: 2, color: '#1f2937', fillOpacity: 0.92 }),
                    mouseout: e => wardLayer.resetStyle(e.target),
                    click: e => { wardSelected = f; const sb = document.getElementById('ward-share-btn'); if (sb) { sb.disabled = false; sb.style.opacity = '1'; sb.style.cursor = 'pointer'; } }
                });
            }
        }).addTo(wardMap);
        try { wardMap.fitBounds(wardLayer.getBounds(), { padding: [12, 12] }); } catch (e) {}
        setTimeout(() => { try { wardMap.invalidateSize(); } catch (e) {} }, 200);

        // Render the active layer FIRST (colours, legend, stats, explanation, correlation)
        // so nothing below can ever block it.
        wardRenderLayer();
        try { wardRestoreReceptors(); } catch (e) { console.warn('[JanVayu] ward receptors:', e); }

        // Non-critical UI enhancements — guarded so a failure here can't blank the panel.
        try {
            // Two-finger pan on touch: one finger scrolls the page, two fingers move the map
            if (L.Browser && L.Browser.touch) {
                wardMap.dragging.disable();
                const c = wardMap.getContainer();
                c.addEventListener('touchstart', e => { e.touches.length >= 2 ? wardMap.dragging.enable() : wardMap.dragging.disable(); }, { passive: true });
                c.addEventListener('touchend', e => { if (e.touches.length < 2) wardMap.dragging.disable(); }, { passive: true });
                const hint = L.control({ position: 'bottomleft' });
                hint.onAdd = function () { const d = L.DomUtil.create('div'); d.style.cssText = 'background:rgba(0,0,0,0.55);color:#fff;font-size:0.65rem;padding:2px 6px;border-radius:4px;'; d.textContent = 'Use two fingers to move the map'; return d; };
                hint.addTo(wardMap);
            }
            // Populate ward search datalist
            const dl = document.getElementById('ward-search-list');
            if (dl) dl.innerHTML = geo.features.map(f => `<option value="${(f.properties.name || '').replace(/"/g, '&quot;')}">`).join('');
            const si = document.getElementById('ward-search'); if (si) si.value = '';
        } catch (e) { console.warn('[JanVayu] ward UI enhancement:', e); }
    };

    // Zoom to a ward by name; highlight + open its tooltip
    function wardZoomToFeature(name) {
        if (!wardLayer || !wardMap || !name) return false;
        let target = null;
        wardLayer.eachLayer(l => { if (!target && l.feature && (l.feature.properties.name || '').toLowerCase() === name.toLowerCase()) target = l; });
        if (!target) return false;
        wardSelected = target.feature;
        const sb = document.getElementById('ward-share-btn'); if (sb) { sb.disabled = false; sb.style.opacity = '1'; sb.style.cursor = 'pointer'; }
        try { wardMap.fitBounds(target.getBounds(), { maxZoom: 14, padding: [40, 40] }); } catch (e) {}
        target.openTooltip();
        const orig = target.options.fillOpacity;
        target.setStyle({ weight: 3, color: '#111827', fillOpacity: 0.95 });
        setTimeout(() => { try { wardLayer.resetStyle(target); } catch (e) {} }, 2200);
        return true;
    }
    window.wardSearch = function wardSearch() {
        const si = document.getElementById('ward-search'); if (!si) return;
        const v = si.value.trim(); if (!v) return;
        wardZoomToFeature(v);
    };
    // "My area" on the unified map. The ward panel's version needs a loaded
    // city file to find the nearest ward centroid; the map has no such file —
    // boundaries arrive as tiles for whatever is on screen. So this just takes
    // you to your location at a zoom where the chosen level actually renders,
    // which is the honest equivalent and works at every level rather than only
    // inside a listed city.
    window.mapLocateMe = function mapLocateMe() {
        const note = (m) => { const el = document.getElementById('map-boundary-note'); if (el) el.textContent = m; };
        if (!navigator.geolocation) { note('Geolocation is not available in this browser.'); return; }
        if (!map) return;
        note('Locating…');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                const lvl = BOUNDARY_LEVELS[boundaryLevel];
                // Zoom past the level's minimum so features are actually drawn,
                // not just technically in range.
                const z = lvl ? Math.min(lvl.max, Math.max(lvl.min + 1, 12)) : 11;
                map.setView([lat, lon], z);
                note(boundaryLevel && lvl
                    ? `Showing your area. ${lvl.note}. Tap any boundary for its yearly figure.`
                    : 'Showing your area. Pick a level from Boundaries to colour it by annual air.');
            },
            () => note('Could not get your location (permission denied?).'),
            { timeout: 8000 });
    };

    window.wardLocateMe = function wardLocateMe() {
        const status = document.getElementById('ward-map-status');
        if (!navigator.geolocation) { if (status) status.textContent = 'Geolocation is not available in this browser.'; return; }
        if (status) status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude: lat, longitude: lon } = pos.coords;
            const geo = wardState.geo; if (!geo) return;
            // nearest ward by centroid
            let best = null, bestD = Infinity;
            geo.features.forEach(f => { const p = f.properties; const d = (p.cx - lon) ** 2 + (p.cy - lat) ** 2; if (d < bestD) { bestD = d; best = p; } });
            if (best && !wardZoomToFeature(best.name)) { /* feature not found */ }
            if (status && best) status.textContent = `Nearest ward: ${best.name}.`;
        }, () => { if (status) status.textContent = 'Could not get your location (permission denied?).'; }, { timeout: 8000 });
    };

    // Per-ward share card — "my ward vs the city" snapshot, air-first.
    window.shareWardCard = function shareWardCard() {
        if (!wardSelected) { const st = document.getElementById('ward-map-status'); if (st) st.textContent = 'Tap a ward on the map (or search one) first, then share.'; return; }
        generateWardCard(wardSelected);
    };
    // ── "Who breathes it" overlays: schools & health centres near each ward ──
    // Live vector tiles from indianopenmaps.com (ramSeraph's mirror of NCOG
    // UDISE / Bharatmaps data). Tiles are only fetched for the visible city
    // viewport, and only when the user switches a toggle on.
    let _vectorGridPromise = null;
    function loadScriptOnce(src) {
        return new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = src;
            el.async = true;
            el.onload = resolve;
            el.onerror = reject;
            document.head.appendChild(el);
        });
    }
    function ensureVectorGrid() {
        if (window.L && L.vectorGrid) return Promise.resolve();
        if (!_vectorGridPromise) {
            _vectorGridPromise = loadScriptOnce('/assets/vendor/leaflet.vectorgrid.bundled.min.js')
                .catch((e) => { _vectorGridPromise = null; throw e; });
        }
        return _vectorGridPromise;
    }

    // The boundary layers need VectorGrid plus the PMTiles reader and the
    // adapter that joins them — loaded in that order because the adapter
    // extends L.VectorGrid.Protobuf and reads the pmtiles global at define
    // time, so it must come last.
    let _pmtilesPromise = null;
    function ensurePMTiles() {
        if (window.L && L.vectorGrid && typeof L.vectorGrid.pmtiles === 'function') return Promise.resolve();
        if (!_pmtilesPromise) {
            _pmtilesPromise = ensureVectorGrid()
                .then(() => loadScriptOnce('/assets/vendor/pmtiles.min.js'))
                .then(() => loadScriptOnce('/assets/vendor/leaflet-pmtiles-adapter.js'))
                .catch((e) => { _pmtilesPromise = null; throw e; });
        }
        return _pmtilesPromise;
    }
    // NOTE on dotRadius: these tile sets top out at low native zooms (schools
    // z10, health centres z7) while the city view sits at z11-13, so Leaflet
    // stretches the rendered canvas 2-16×. The radii below are pre-stretch
    // values chosen so dots land at a sane on-screen size after scaling.
    const WARD_RECEPTORS = {
        schools: {
            url: 'https://indianopenmaps.com/not-so-open/education/schools/udise/ncog/{z}/{x}/{y}.pbf',
            layer: 'NCOG_UDISE_Schools', maxNativeZoom: 10, dotRadius: 1.1, color: '#7C3AED',
            attribution: 'Schools: UDISE/NCOG via indianopenmaps.com',
            popup: (p) => `<strong>${p.school_nam || 'School'}</strong><br>` +
                `${p.sch_catego || p.sch_cate_1 || 'School'}${p.sch_mgmt ? ' · ' + p.sch_mgmt : ''}` +
                `${p.tot_enr_cp ? '<br>' + p.tot_enr_cp + ' students enrolled' : ''}` +
                '<div style="font-size:0.68rem;color:#888;margin-top:4px;">Children are among the most vulnerable to dirty air.</div>',
        },
        health: {
            url: 'https://indianopenmaps.com/not-so-open/health/centers/bharatmaps/{z}/{x}/{y}.pbf',
            layer: 'Bharatmaps_Health_Centers', maxNativeZoom: 7, color: '#0891B2',
            // z7 tiles stretched to a z12 city view smear beyond recognition, so
            // this layer harvests the decoded tile points and draws them as real
            // circle markers instead (collector mode below).
            collector: true, idProp: 'objectid',
            attribution: 'Health centres: Bharatmaps via indianopenmaps.com',
            popup: (p) => `<strong>${p.facility_n || 'Health facility'}</strong>` +
                `${p.facility_t ? '<br>' + p.facility_t : ''}${p.dtname ? '<br>' + p.dtname + ' district' : ''}`,
        },
    };

    // Build a VectorGrid that renders nothing itself but harvests every decoded
    // point feature into crisp L.circleMarkers at true lat/lngs (sharp at any
    // zoom, unlike overzoom-stretched canvas tiles).
    function buildCollectorLayer(cfg) {
        const markers = L.layerGroup();
        const canvas = L.canvas({ padding: 0.3, pane: 'jv-receptors' });
        const seen = new Set();
        const Grid = L.VectorGrid.Protobuf.extend({
            _getVectorTilePromise: function (coords) {
                return L.VectorGrid.Protobuf.prototype._getVectorTilePromise.call(this, coords).then((tile) => {
                    try {
                        const lyr = tile && tile.layers && tile.layers[cfg.layer];
                        if (lyr && lyr.features) {
                            const scale = Math.pow(2, coords.z) * (lyr.extent || 4096);
                            lyr.features.forEach((feat) => {
                                (feat.geometry || []).forEach(ring => (Array.isArray(ring) ? ring : [ring]).forEach(pt => {
                                    const lon = (coords.x * (lyr.extent || 4096) + pt.x) / scale * 360 - 180;
                                    const yy = (coords.y * (lyr.extent || 4096) + pt.y) / scale;
                                    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * yy))) * 180 / Math.PI;
                                    const key = (cfg.idProp && feat.properties[cfg.idProp]) || `${lon.toFixed(5)},${lat.toFixed(5)}`;
                                    if (seen.has(key)) return;
                                    seen.add(key);
                                    L.circleMarker([lat, lon], {
                                        renderer: canvas, radius: 5, fillColor: cfg.color,
                                        color: '#fff', weight: 1, fillOpacity: 0.85,
                                    }).bindPopup(cfg.popup(feat.properties), { maxWidth: 240 }).addTo(markers);
                                }));
                            });
                        }
                    } catch (e) { console.warn('[JanVayu] collector tile:', e); }
                    return tile;
                });
            },
        });
        const grid = new Grid(cfg.url, {
            rendererFactory: L.canvas.tile,
            maxNativeZoom: cfg.maxNativeZoom,
            interactive: false,
            attribution: cfg.attribution,
            vectorTileLayerStyles: { [cfg.layer]: { fill: false, stroke: false, radius: 0, opacity: 0, fillOpacity: 0 } },
        });
        return L.layerGroup([grid, markers]);
    }
    const wardReceptorLayers = {};   // kind → VectorGrid layer (while on)
    const mainReceptorLayers = {};   // same, for the unified map
    // `target` lets the same overlay run on either map. The ward panel passes
    // nothing and keeps its own map; the unified map passes 'main'. Layers are
    // tracked per map so turning schools off in one place doesn't strand the
    // layer in the other.
    window.toggleWardReceptor = async function toggleWardReceptor(btn, kind, target) {
        const cfg = WARD_RECEPTORS[kind];
        const onMain = target === 'main';
        const mp = onMain ? map : wardMap;
        const statusEl = document.getElementById(onMain ? 'map-boundary-note' : 'ward-map-status');
        const store = onMain ? mainReceptorLayers : wardReceptorLayers;
        if (!cfg || !mp) return;
        const willBeOn = !btn.classList.contains('active');
        btn.classList.toggle('active', willBeOn);
        btn.setAttribute('aria-pressed', willBeOn ? 'true' : 'false');
        if (!willBeOn) {
            if (store[kind]) { try { mp.removeLayer(store[kind]); } catch (e) {} delete store[kind]; }
            return;
        }
        try { await ensureVectorGrid(); } catch (e) {
            btn.classList.remove('active');
            if (statusEl) statusEl.textContent = 'The overlay library could not load — try again in a moment.';
            return;
        }
        if (!wardMap || store[kind]) return;
        try {
            // Receptor dots must sit ABOVE the ward choropleth (grid tiles
            // default to the tile pane, underneath it).
            if (!mp.getPane('jv-receptors')) {
                mp.createPane('jv-receptors').style.zIndex = 450;
            }
            let layer;
            if (cfg.collector) {
                layer = buildCollectorLayer(cfg);
            } else {
                layer = L.vectorGrid.protobuf(cfg.url, {
                    pane: 'jv-receptors',
                    rendererFactory: L.canvas.tile,
                    maxNativeZoom: cfg.maxNativeZoom,
                    interactive: true,
                    attribution: cfg.attribution,
                    vectorTileLayerStyles: {
                        [cfg.layer]: { radius: cfg.dotRadius, weight: 0, fill: true, fillColor: cfg.color, fillOpacity: 0.7 },
                    },
                });
                layer.on('click', (e) => {
                    const p = e.layer && e.layer.properties;
                    if (!p) return;
                    L.popup({ maxWidth: 240 }).setLatLng(e.latlng).setContent(cfg.popup(p)).openOn(mp);
                });
            }
            layer.addTo(mp);
            store[kind] = layer;
        } catch (e) {
            console.warn('[JanVayu] receptor layer:', e);
            btn.classList.remove('active');
            if (statusEl) statusEl.textContent = 'Could not load that overlay right now (indianopenmaps.com may be busy).';
        }
    };
    // Called when initWardMap rebuilds the map: re-attach any overlays whose
    // toggle button is still active, on the fresh map instance.
    function wardRestoreReceptors() {
        Object.keys(wardReceptorLayers).forEach(k => delete wardReceptorLayers[k]);
        document.querySelectorAll('#ward-receptor-toggle .ward-layer-btn.active').forEach(btn => {
            btn.classList.remove('active');
            window.toggleWardReceptor(btn, btn.dataset.receptor);
        });
    }

    function wardRoundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function generateWardCard(f) {
        const p = f.properties;
        const cityName = (wardState.geo && wardState.geo.city) || (document.getElementById('ward-map-city')?.selectedOptions[0]?.text || '').split('—')[0].trim();
        const W = 1080, H = 1080, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#faf8f3'; ctx.fillRect(0, 0, W, H);
        // top band
        ctx.fillStyle = '#1b6b4a'; ctx.fillRect(0, 0, W, 156);
        ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 46px Georgia, "Times New Roman", serif'; ctx.fillText('JanVayu', 64, 66);
        ctx.font = '27px Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillText('How polluted is my ward?', 64, 110);
        // city + ward name
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#6b7280'; ctx.font = 'bold 30px Arial, sans-serif'; ctx.fillText((cityName || '').toUpperCase(), 64, 246);
        ctx.fillStyle = '#111827'; ctx.font = 'bold 62px Georgia, serif';
        // wrap ward name (max 2 lines)
        const words = String(p.name || 'Ward').split(' '); let line = '', lines = [];
        for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > W - 128 && line) { lines.push(line); line = w; } else line = t; }
        if (line) lines.push(line);
        lines.slice(0, 2).forEach((ln, i) => ctx.fillText(i === 1 && lines.length > 2 ? ln + '…' : ln, 64, 320 + i * 70));
        let yb = 320 + Math.min(lines.length, 2) * 70 + 36;
        // AIR badge (headline)
        const pm = p._pm, col = wardPM25Color(pm);
        wardRoundRect(ctx, 64, yb, W - 128, 230, 24); ctx.fillStyle = col; ctx.fill();
        const dark = pm != null && pm <= 60; // light bands → dark text
        ctx.fillStyle = dark ? 'rgba(0,0,0,0.78)' : '#ffffff';
        ctx.font = 'bold 28px Arial'; ctx.fillText('AIR QUALITY — RIGHT NOW', 96, yb + 56);
        ctx.font = 'bold 92px Arial';
        ctx.fillText(pm != null ? `${pm} µg/m³` : 'estimate n/a', 96, yb + 150);
        ctx.font = 'bold 34px Arial'; ctx.fillText(pm != null ? wardPM25Label(pm) + ' · PM2.5' : '', 96, yb + 198);
        yb += 230 + 40;
        // drivers row (context, annual)
        const chips = [['HEAT', p.lst != null ? p.lst + '°C' : '—', '#EA580C'], ['GREEN', p.green != null ? p.green + '%' : '—', '#16a34a'], ['BUILT-UP', p.built != null ? p.built + '%' : '—', '#6b7280']];
        const cw = (W - 128 - 2 * 24) / 3;
        chips.forEach((c, i) => {
            const x = 64 + i * (cw + 24);
            wardRoundRect(ctx, x, yb, cw, 150, 18); ctx.fillStyle = '#ffffff'; ctx.fill();
            ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = c[2]; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center'; ctx.fillText(c[0], x + cw / 2, yb + 50);
            ctx.fillStyle = '#111827'; ctx.font = 'bold 46px Arial'; ctx.fillText(c[1], x + cw / 2, yb + 105);
            ctx.textAlign = 'left';
        });
        ctx.fillStyle = '#9ca3af'; ctx.font = '20px Arial'; ctx.textAlign = 'center';
        ctx.fillText('the structural factors that shape a ward’s air (satellite, annual)', W / 2, yb + 185);
        ctx.textAlign = 'left';
        // footer
        const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        ctx.fillStyle = '#6b7280'; ctx.font = '22px Arial';
        ctx.fillText('Air = live estimate, based on nearby CPCB/WAQI monitors.', 64, H - 96);
        ctx.fillStyle = '#1b6b4a'; ctx.font = 'bold 24px Arial';
        ctx.fillText('janvayu.in/#ward-map', 64, H - 56);
        ctx.fillStyle = '#9ca3af'; ctx.font = '20px Arial'; ctx.textAlign = 'right';
        ctx.fillText(dateStr, W - 64, H - 56); ctx.textAlign = 'left';

        cv.toBlob(function (blob) {
            if (!blob) return;
            const slug = String(p.name || 'ward').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
            const filename = `janvayu-ward-${slug}.png`;
            if (navigator.canShare) {
                const file = new File([blob], filename, { type: 'image/png' });
                const sd = { title: `${p.name} — air quality`, text: `${p.name} (${cityName}) — air ${p._pm != null ? '~' + p._pm + ' µg/m³ PM2.5 right now' : ''}. See your ward at janvayu.in/#ward-map`, files: [file] };
                if (navigator.canShare(sd)) { navigator.share(sd).catch(function () {}); return; }
            }
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        }, 'image/png');
    }

    // ── PM2.5/AQI Utilities ──
    const WHO_PM25_GUIDELINE = 5;

    function getAQIColor(aqi) {
        if (aqi <= 50) return '#22C55E';
        if (aqi <= 100) return '#EAB308';
        if (aqi <= 200) return '#F97316';
        if (aqi <= 300) return '#EF4444';
        if (aqi <= 400) return '#7C3AED';
        return '#831843';
    }
    function getAQILabel(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 200) return 'Poor';
        if (aqi <= 300) return 'Very Poor';
        if (aqi <= 400) return 'Severe';
        return 'Hazardous';
    }
    function getPM25Class(pm25) {
        if (pm25 <= 5) return 'who-good';
        if (pm25 <= 10) return 'who-it4';
        if (pm25 <= 15) return 'who-it3';
        if (pm25 <= 25) return 'who-it2';
        if (pm25 <= 35) return 'who-it1';
        if (pm25 <= 55) return 'who-above';
        return 'who-severe';
    }
    function getPM25Color(pm25) {
        if (pm25 <= 5) return '#00e400';
        if (pm25 <= 10) return '#92d050';
        if (pm25 <= 15) return '#ffff00';
        if (pm25 <= 25) return '#ff7e00';
        if (pm25 <= 35) return '#ff0000';
        if (pm25 <= 55) return '#99004c';
        return '#7e0023';
    }
    // Text-legible variant of the PM2.5 band colours. The EPA-style swatch
    // colours above (bright green, pure yellow) are fine as dots/backgrounds
    // but wash out as text on a white card — pure #ffff00 is effectively
    // invisible. These keep each band's hue but darken it to a WCAG-legible
    // shade for use as TEXT on light backgrounds.
    function getPM25TextColor(pm25) {
        if (pm25 <= 5) return '#15803d';   // green-700
        if (pm25 <= 10) return '#4d7c0f';  // lime-700
        if (pm25 <= 15) return '#a16207';  // amber-700 (was pure yellow)
        if (pm25 <= 25) return '#c2410c';  // orange-700
        if (pm25 <= 35) return '#dc2626';  // red-600
        if (pm25 <= 55) return '#9d174d';  // pink-800
        return '#7e0023';                   // already dark
    }
    function getWHOMultiple(pm25) { return (pm25 / WHO_PM25_GUIDELINE).toFixed(1); }

    // WAQI returns iaqi.{pm25,pm10}.v as US-EPA sub-index values (unitless), not µg/m³.
    // Convert back to concentration using the standard EPA breakpoint table so downstream
    // displays (PM2.5/PM10 popup rows, WHO multiple, cigarette equivalence) are real µg/m³.
    const PM25_BREAKPOINTS = [
        [0,     12.0,    0,  50],
        [12.1,  35.4,   51, 100],
        [35.5,  55.4,  101, 150],
        [55.5, 150.4,  151, 200],
        [150.5,250.4,  201, 300],
        [250.5,350.4,  301, 400],
        [350.5,500.4,  401, 500]
    ];
    const PM10_BREAKPOINTS = [
        [0,    54,    0,  50],
        [55,  154,   51, 100],
        [155, 254,  101, 150],
        [255, 354,  151, 200],
        [355, 424,  201, 300],
        [425, 504,  301, 400],
        [505, 604,  401, 500]
    ];
    function iaqiToConcentration(iaqi, table) {
        if (iaqi == null || iaqi === '' || isNaN(iaqi)) return null;
        const v = Number(iaqi);
        for (const [bpLo, bpHi, iLo, iHi] of table) {
            if (v >= iLo && v <= iHi) {
                return Math.round(((v - iLo) / (iHi - iLo)) * (bpHi - bpLo) + bpLo);
            }
        }
        if (v > 500) return Math.round(table[table.length - 1][1]); // off-scale: cap at top breakpoint
        return null;
    }
    function iaqiToPM25(v) { return iaqiToConcentration(v, PM25_BREAKPOINTS); }
    function iaqiToPM10(v) { return iaqiToConcentration(v, PM10_BREAKPOINTS); }

    // ── Data Fetch ──
    async function fetchAQI(cityKey) {
        const city = CITIES[cityKey];
        if (!city) return null;
        try {
            const url = `https://api.waqi.info/feed/geo:${city.lat};${city.lon}/?token=${WAQI_TOKEN}`;
            const res = await fetch(url, { method: 'GET', mode: 'cors' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.status === 'ok' && data.data && data.data.aqi !== '-') {
                const aqi = parseInt(data.data.aqi);
                if (!isNaN(aqi) && aqi > 0) {
                    usingLiveData = true;
                    return { aqi, pm25: iaqiToPM25(data.data.iaqi?.pm25?.v), pm10: iaqiToPM10(data.data.iaqi?.pm10?.v), time: data.data.time?.s || new Date().toISOString(), station: data.data.city?.name || city.name, live: true };
                }
            }
        } catch (e) { console.warn(`[JanVayu] ${cityKey}:`, e.message); }
        const demo = DEMO_DATA[cityKey];
        if (demo) {
            const r = (v) => Math.round(v * (1 + (Math.random() - 0.5) * 0.1));
            return { aqi: r(demo.aqi), pm25: r(demo.pm25), pm10: r(demo.pm10), time: new Date().toISOString(), station: city.name + ' (Fallback)', live: false };
        }
        return null;
    }

    async function fetchAllAQI() {
        const liveStatus = document.getElementById('live-status');
        if (liveStatus) liveStatus.innerHTML = '<span class="pulse"></span> Connecting to WAQI API...';
        usingLiveData = false;
        let successCount = 0;

        const results = await Promise.allSettled(CORE_CITIES.map(c => fetchAQI(c)));
        results.forEach((result, i) => {
            if (result.status === 'fulfilled' && result.value) {
                aqiData[CORE_CITIES[i]] = result.value;
                successCount++;
            }
        });

        if (successCount === 0) {
            CORE_CITIES.forEach(ck => {
                const d = DEMO_DATA[ck], c = CITIES[ck];
                if (d && c) aqiData[ck] = { aqi: d.aqi, pm25: d.pm25, pm10: d.pm10, time: new Date().toISOString(), station: c.name + ' (Fallback)', live: false };
            });
        }

        const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        try { updateTicker(); updateDashboard(); initAllCharts().catch(e => console.error('initAllCharts:', e)); checkAlerts(); initArchiveData(); loadDashboardLiveNews(); updateGlobalTimestamp(); populateExtendedCitySelectors(); } catch(e) { console.error(e); }

        if (liveStatus) {
            liveStatus.innerHTML = usingLiveData
                ? `<span class="pulse"></span> LIVE: ${successCount} cities updated at ${timeStr}`
                : `<span style="color:var(--amber);">⚠</span> Showing estimated data. Check console for API details.`;
        }
    }

    function updateTicker() {
        const ticker = document.getElementById('tickerTrack');
        if (!ticker) return;
        const sorted = Object.entries(aqiData).sort((a, b) => (b[1].pm25 || b[1].aqi*0.7) - (a[1].pm25 || a[1].aqi*0.7));
        const items = sorted.map(([key, data]) => {
            const pm25 = data.pm25 || Math.round(data.aqi * 0.7);
            return `<div class="ticker-item"><span class="ticker-city">${CITIES[key]?.name || key}</span><span class="pm25-badge ${getPM25Class(pm25)}">${pm25}</span><span class="who-multiple">${getWHOMultiple(pm25)}x</span></div>`;
        }).join('');
        ticker.innerHTML = items + items; // duplicate for seamless scroll
    }

    function updateDashboard() {
        updateHeroCity('delhi');

        const sorted = Object.entries(aqiData).sort((a, b) => (b[1].pm25 || b[1].aqi*0.7) - (a[1].pm25 || a[1].aqi*0.7));
        if (sorted.length > 0) {
            const worstPM25 = sorted[0][1].pm25 || Math.round(sorted[0][1].aqi * 0.7);
            const el = document.getElementById('worst-city-pm25');
            if (el) { el.textContent = worstPM25; el.style.color = getPM25TextColor(worstPM25); }
            const nameEl = document.getElementById('worst-city-name');
            if (nameEl) nameEl.textContent = (CITIES[sorted[0][0]]?.name || sorted[0][0]) + ' PM2.5';
        }

        const worstEl = document.getElementById('worst-cities');
        if (worstEl) {
            worstEl.innerHTML = sorted.slice(0, 5).map((item, i) => {
                const pm25 = item[1].pm25 || Math.round(item[1].aqi * 0.7);
                return `<div class="city-rank"><span class="rank-num ${i < 3 ? 'top' : ''}">${i+1}</span><span class="city-rank-name">${CITIES[item[0]]?.name || item[0]}</span><span class="city-rank-aqi" style="background:${getPM25Color(pm25)}">${pm25} <small style="opacity:0.8">(${getWHOMultiple(pm25)}x)</small></span><button class="share-aqi-btn" onclick="generateAQICard('${item[0]}')" title="Download AQI card for ${CITIES[item[0]]?.name || item[0]}"><span class="si si-share"></span></button></div>`;
            }).join('');
        }

        const bestEl = document.getElementById('best-cities');
        if (bestEl) {
            bestEl.innerHTML = sorted.slice(-5).reverse().map((item, i) => {
                const pm25 = item[1].pm25 || Math.round(item[1].aqi * 0.7);
                return `<div class="city-rank"><span class="rank-num">${i+1}</span><span class="city-rank-name">${CITIES[item[0]]?.name || item[0]}</span><span class="city-rank-aqi" style="background:${getPM25Color(pm25)}">${pm25} <small style="opacity:0.8">(${getWHOMultiple(pm25)}x)</small></span><button class="share-aqi-btn" onclick="generateAQICard('${item[0]}')" title="Download AQI card for ${CITIES[item[0]]?.name || item[0]}"><span class="si si-share"></span></button></div>`;
            }).join('');
        }

        // Update share card preview if visible
        if (document.getElementById('share-card-preview')) updateShareCardPreview();
    }

    // ── Charts ──
    // Friendly fallback when a third-party library fails to load (blocked CDN,
    // offline, network error). Renders a single in-panel message instead of
    // letting the chart-using surface stay silently empty.
    function renderLibraryFallback(scope, libName) {
        // `scope` may be a CSS selector (string) or a DOM node.
        const root = (typeof scope === 'string') ? document.querySelector(scope) : scope;
        if (!root) return;
        // If a fallback is already rendered, leave it alone.
        if (root.querySelector('.lib-fallback')) return;
        const div = document.createElement('div');
        div.className = 'lib-fallback';
        div.style.cssText = 'margin: 14px 0; padding: 14px 16px; border-radius: 10px; background: var(--bg-section); border-left: 3px solid var(--accent); font-size: 0.88rem; line-height: 1.5; color: var(--ink);';
        div.innerHTML = '<strong>' + libName + ' could not be loaded.</strong> ' +
            'This is usually a corporate-network or regional CDN block. ' +
            'Try opening JanVayu on a different network, or <a href="#dashboard" onclick="showPanel(\'dashboard\'); return false;" style="color: var(--accent); text-decoration: underline;">return to the dashboard</a>. ' +
            'All other panels still work normally.';
        root.appendChild(div);
    }

    async function initAllCharts() {
            try { await ensureChartJs(); }
            catch (e) {
                console.warn('[JanVayu] Chart.js failed to load:', e);
                renderLibraryFallback('#panel-container .panel.active', 'Chart.js');
                return;
            }
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#94A3B8' : '#64748B';
            const gridColor = isDark ? '#334155' : '#E2E8F0';
            Chart.defaults.color = textColor;
            Object.values(charts).forEach(c => c?.destroy?.());
            charts = {};

            const metroCtx = document.getElementById('metroChart');
            if (metroCtx) {
                const metros = ['delhi', 'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad'];
                charts.metro = new Chart(metroCtx, { type: 'bar', data: { labels: metros.map(c => CITIES[c].name), datasets: [{ data: metros.map(c => aqiData[c]?.aqi || 0), backgroundColor: metros.map(c => getAQIColor(aqiData[c]?.aqi || 0)),
                    borderRadius: 6, borderSkipped: false, barPercentage: 0.7
                }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => 'AQI: ' + ctx.raw } } }, scales: { x: { max: 500, grid: { color: gridColor, drawBorder: false }, ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } } }, y: { grid: { display: false }, ticks: { font: { family: "'DM Sans', sans-serif", size: 11 } } } } } });
            }

            const regionCtx = document.getElementById('regionChart');
            if (regionCtx) {
                const north = ['delhi', 'lucknow', 'patna'].map(c => aqiData[c]?.aqi || 0);
                const south = ['chennai', 'bangalore', 'hyderabad'].map(c => aqiData[c]?.aqi || 0);
                charts.region = new Chart(regionCtx, { type: 'bar', data: { labels: ['North India', 'South India'], datasets: [{ label: 'Average AQI', data: [north.reduce((a, b) => a + b, 0) / north.length, south.reduce((a, b) => a + b, 0) / south.length], backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(34,197,94,0.8)'],
                    borderRadius: 8, borderSkipped: false, barPercentage: 0.5
                }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => 'Avg AQI: ' + Math.round(ctx.raw) } } }, scales: { x: { max: 400, grid: { color: gridColor, drawBorder: false } }, y: { grid: { display: false }, ticks: { font: { size: 12, weight: 600 } } } } } });
            }

            // econChart created below with Dalberg data

            const ncapCtx = document.getElementById('ncapChart');
            if (ncapCtx) {
                charts.ncap = new Chart(ncapCtx, { type: 'bar', data: { labels: ['Delhi', 'Noida', 'Ghaziabad'], datasets: [{ label: 'Allocated (₹ Cr)', data: [81.36, 127, 48.5], backgroundColor: '#3B82F6' }, { label: 'Utilized (₹ Cr)', data: [14.1, 30, 39], backgroundColor: '#22C55E' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'NCAP Fund Utilization (city-level, 2025-26)', font: { size: 11 } } }, scales: { y: { grid: { color: gridColor } } } } });
            }

            // BUDGET TRACKER CHARTS
            const budgetNcapCtx = document.getElementById('budgetNcapChart');
            if (budgetNcapCtx) {
                charts.budgetNcap = new Chart(budgetNcapCtx, { 
                    type: 'bar', 
                    data: { 
                        labels: ['MoEFCC Direct', 'XV-FC Grants', 'Total NCAP'],
                        datasets: [
                            { label: 'Released', data: [2395, 11021, 13415], backgroundColor: '#3B82F6' },
                            { label: 'Utilized', data: [1417, 8513, 9929], backgroundColor: '#22C55E' }
                        ]
                    }, 
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gridColor }, title: { display: true, text: '₹ Crore' } } } } 
                });
            }

            const budgetSpendingCtx = document.getElementById('budgetSpendingChart');
            if (budgetSpendingCtx) {
                charts.budgetSpending = new Chart(budgetSpendingCtx, { 
                    type: 'doughnut', 
                    data: { 
                        labels: ['Road Dust (68%)', 'Transport (14%)', 'Waste/Biomass (12%)', 'Monitoring (3%)', 'Industry (<1%)', 'Domestic (<1%)', 'Other (2%)'], 
                        datasets: [{ 
                            data: [68, 14, 12, 3, 1, 1, 1], 
                            backgroundColor: ['#94A3B8', '#3B82F6', '#F59E0B', '#7C3AED', '#EF4444', '#16803C', '#CBD5E1'] 
                        }] 
                    }, 
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 10 } } } } } 
                });
            }

            const budgetMoefccCtx = document.getElementById('budgetMoefccChart');
            if (budgetMoefccCtx) {
                charts.budgetMoefcc = new Chart(budgetMoefccCtx, { 
                    type: 'line', 
                    data: { 
                        labels: ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26'], 
                        datasets: [
                            { label: 'MoEFCC Budget (₹ Cr)', data: [2954, 3100, 2870, 3030, 3079, 3265, 3413], borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)', fill: true, tension: 0.4 },
                            { label: 'Pollution Control (₹ Cr)', data: [650, 700, 750, 845, 845, 858, 854], borderColor: '#EF4444', backgroundColor: 'rgba(27,107,74,0.08)', fill: true, tension: 0.4 }
                        ] 
                    }, 
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gridColor } } } } 
                });
            }

            const compareCtx = document.getElementById('compareChart');
            if (compareCtx) {
                // Get selected cities for comparison
                const c1 = document.getElementById('compare-city1')?.value || 'delhi';
                const c2 = document.getElementById('compare-city2')?.value || 'mumbai';
                const c3 = document.getElementById('compare-city3')?.value || 'beijing';
                const cities = [c1, c2, c3];
                const labels = cities.map(c => CITIES[c]?.name || c);
                const data = cities.map(c => aqiData[c]?.aqi || 0);
                const colors = cities.map(c => aqiData[c]?.aqi ? getAQIColor(aqiData[c].aqi) : '#ccc');
                
                charts.compare = new Chart(compareCtx, { 
                    type: 'bar', 
                    data: { 
                        labels: labels, 
                        datasets: [{ 
                            label: 'Live AQI',
                            data: data, 
                            backgroundColor: colors 
                        }] 
                    }, 
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } }, 
                        scales: { y: { max: 500, grid: { color: gridColor } } } 
                    } 
                });
            }

            const historyCtx = document.getElementById('historyChart');
            if (historyCtx) {
                charts.history = new Chart(historyCtx, { type: 'line', data: { labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'], datasets: [{ label: 'Delhi PM2.5', data: [122, 134, 128, 115, 108, 84, 96, 99, 102, 105, 100], borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)', fill: true, tension: 0.4 }, { label: 'WHO Guideline', data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], borderColor: '#22C55E', borderDash: [5, 5], fill: false }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 150, grid: { color: gridColor } } } } });
            }

            // Economic Impact Chart (Dalberg data)
            const econCtx = document.getElementById('econChart');
            if (econCtx) {
                charts.econ = new Chart(econCtx, { type:'doughnut', data:{ labels:['Presenteeism (reduced productivity)','Premature mortality','Reduced consumer footfall','Absenteeism','Health expenditure'], datasets:[{data:[35,28,18,12,7],backgroundColor:['#EF4444','#7C3AED','#F59E0B','#3B82F6','#22C55E']}]}, options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10}}}}}});
            }

            const seasonalCtx = document.getElementById('seasonalChart');
            if (seasonalCtx) {
                charts.seasonal = new Chart(seasonalCtx, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: 'Avg AQI', data: [320, 280, 180, 120, 110, 90, 80, 75, 95, 180, 380, 350], borderColor: '#EF4444', backgroundColor: 'rgba(27,107,74,0.08)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 450, grid: { color: gridColor } } } } });
            }
        }

    // ── Share ──
    function shareSection(section) {
        const url = window.location.origin + window.location.pathname + '#' + section;
        if (navigator.share) {
            navigator.share({ title: 'JanVayu: ' + section, url: url });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard');
        }
    }

    // ── Share AQI Card (Canvas-based image generator) ──
    function getAQICardGradient(ctx, aqi, w, h) {
        // Bold radial gradient: brighter center, darker edges
        var cx = w / 2, cy = h * 0.4;
        var outerR = Math.max(w, h) * 0.9;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
        if (aqi <= 50) {
            g.addColorStop(0, '#10B981'); // emerald center
            g.addColorStop(0.5, '#047857');
            g.addColorStop(1, '#022C22'); // deep teal edge
        } else if (aqi <= 100) {
            g.addColorStop(0, '#F59E0B'); // golden center
            g.addColorStop(0.5, '#B45309');
            g.addColorStop(1, '#451A03'); // rich amber edge
        } else if (aqi <= 200) {
            g.addColorStop(0, '#F97316'); // coral center
            g.addColorStop(0.5, '#C2410C');
            g.addColorStop(1, '#431407'); // deep orange edge
        } else if (aqi <= 300) {
            g.addColorStop(0, '#EF4444'); // crimson center
            g.addColorStop(0.5, '#B91C1C');
            g.addColorStop(1, '#450A0A'); // dark red edge
        } else if (aqi <= 400) {
            g.addColorStop(0, '#A78BFA'); // violet center
            g.addColorStop(0.5, '#6D28D9');
            g.addColorStop(1, '#1E1B4B'); // deep purple edge
        } else {
            g.addColorStop(0, '#9F1239'); // dark maroon center
            g.addColorStop(0.5, '#4C0519');
            g.addColorStop(1, '#0C0A09'); // near-black edge
        }
        return g;
    }

    // Polyfill for CanvasRenderingContext2D.roundRect (Safari < 16, older browsers)
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (typeof r === 'number') r = [r];
            var rad = r[0] || 0;
            this.moveTo(x + rad, y);
            this.arcTo(x + w, y, x + w, y + h, rad);
            this.arcTo(x + w, y + h, x, y + h, rad);
            this.arcTo(x, y + h, x, y, rad);
            this.arcTo(x, y, x + w, y, rad);
            this.closePath();
        };
    }

    async function generateAQICard(cityKey, opts) {
        const data = aqiData[cityKey];
        if (!data) { if (!(opts && opts.preview)) alert('No AQI data available for this city yet. Please wait for data to load.'); return null; }
        const city = CITIES[cityKey];
        if (!city) return null;

        const format = (opts && opts.format) || 'square';
        const W = format === 'landscape' ? 1200 : 1080;
        const H = format === 'landscape' ? 630 : 1080;
        const isLand = format === 'landscape';
        const S = isLand ? 0.58 : 1; // scale factor for landscape

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        const aqi = data.aqi || 0;
        const pm25 = data.pm25 || Math.round(aqi * 0.7);
        const whoX = getWHOMultiple(pm25);
        const cigPerDay = (pm25 / 22).toFixed(1);
        const label = getAQILabel(aqi);
        const color = getAQIColor(aqi);
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const cityAnnualPM25 = CITY_ANNUAL_PM25[cityKey] || null;

        // ── Background: radial gradient ──
        ctx.fillStyle = getAQICardGradient(ctx, aqi, W, H);
        ctx.fillRect(0, 0, W, H);

        // ── Bokeh / particle pattern overlay ──
        ctx.save();
        // Seeded random for deterministic pattern per city
        var seed = 0;
        for (var ci = 0; ci < cityKey.length; ci++) seed += cityKey.charCodeAt(ci);
        function seededRand() { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7FFFFFFF) / 2147483647; }
        // Scattered circles of varying sizes at 8-10% opacity
        var numParticles = isLand ? 60 : 90;
        for (var pi = 0; pi < numParticles; pi++) {
            var px = seededRand() * W;
            var py = seededRand() * H;
            var pr = seededRand() * (isLand ? 40 : 60) + 4;
            var pAlpha = 0.03 + seededRand() * 0.07; // 3%-10%
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + pAlpha.toFixed(3) + ')';
            ctx.fill();
        }
        // Second pass: tiny dots for texture
        for (var pi2 = 0; pi2 < numParticles * 2; pi2++) {
            var dx = seededRand() * W;
            var dy = seededRand() * H;
            var dr = seededRand() * 3 + 1;
            ctx.beginPath();
            ctx.arc(dx, dy, dr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (0.04 + seededRand() * 0.06).toFixed(3) + ')';
            ctx.fill();
        }
        ctx.restore();

        // ── Noise texture: many tiny semi-transparent dots ──
        ctx.save();
        for (var ni = 0; ni < 800; ni++) {
            var nx = seededRand() * W;
            var ny = seededRand() * H;
            ctx.beginPath();
            ctx.arc(nx, ny, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (0.02 + seededRand() * 0.04).toFixed(3) + ')';
            ctx.fill();
        }
        ctx.restore();

        // ── Layout spacing ──
        var padX = Math.round(60 * S);
        var padY = Math.round(50 * S);

        // ── Brand: top-left, small ──
        var brandY = padY + Math.round(24 * S);
        ctx.save();
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold ' + Math.round(20 * S) + 'px system-ui, -apple-system, sans-serif';
        ctx.fillText('JanVayu जनवायु', padX, brandY);
        ctx.restore();

        // ── City name: large, centered ──
        var cityNameY = brandY + Math.round(isLand ? 60 : 80) * S;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold ' + Math.round(52 * S) + 'px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(city.name.toUpperCase(), W / 2, cityNameY);
        ctx.restore();

        // ── Date: small, muted, centered below city ──
        var dateTextY = cityNameY + Math.round(32 * S);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = Math.round(16 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dateStr + ', ' + timeStr, W / 2, dateTextY);

        // ── AQI Number: HERO element, massive ──
        var aqiFontSize = Math.round(isLand ? 130 : 220) * S;
        var aqiNumY = dateTextY + Math.round(isLand ? 110 : 180) * S;
        ctx.save();
        ctx.font = 'bold ' + aqiFontSize + 'px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        // Pass 1: colored shadow / outer glow (large blur)
        ctx.shadowColor = color;
        ctx.shadowBlur = 80;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fillText(aqi, W / 2, aqiNumY);
        ctx.fillText(aqi, W / 2, aqiNumY); // double for stronger glow
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        // Pass 2: white text with slight dark shadow for legibility
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(aqi, W / 2, aqiNumY);
        // Pass 3: no composite mode, just clean white on top
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(aqi, W / 2, aqiNumY);
        ctx.restore();

        // ── Category pill/badge ──
        var pillTextSize = Math.round(24 * S);
        var pillY = aqiNumY + Math.round(isLand ? 16 : 24) * S;
        var pillLabel = '——  ' + label.toUpperCase() + '  ——';
        ctx.font = 'bold ' + pillTextSize + 'px system-ui, sans-serif';
        var pillTextW = ctx.measureText(pillLabel).width + Math.round(48 * S);
        var pillH = Math.round(42 * S);
        var pillR = pillH / 2;
        var pillX = W / 2 - pillTextW / 2;
        // Pill background with category color
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(pillX + pillR, pillY);
        ctx.arcTo(pillX + pillTextW, pillY, pillX + pillTextW, pillY + pillH, pillR);
        ctx.arcTo(pillX + pillTextW, pillY + pillH, pillX, pillY + pillH, pillR);
        ctx.arcTo(pillX, pillY + pillH, pillX, pillY, pillR);
        ctx.arcTo(pillX, pillY, pillX + pillTextW, pillY, pillR);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
        // Pill border
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pillX + pillR, pillY);
        ctx.arcTo(pillX + pillTextW, pillY, pillX + pillTextW, pillY + pillH, pillR);
        ctx.arcTo(pillX + pillTextW, pillY + pillH, pillX, pillY + pillH, pillR);
        ctx.arcTo(pillX, pillY + pillH, pillX, pillY, pillR);
        ctx.arcTo(pillX, pillY, pillX + pillTextW, pillY, pillR);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        // Pill text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold ' + pillTextSize + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pillLabel, W / 2, pillY + pillH - Math.round(12 * S));

        // ── Stats glass card ──
        var statsCardY = pillY + pillH + Math.round(isLand ? 24 : 40) * S;
        var statsCardX = padX + Math.round(20 * S);
        var statsCardW = W - (statsCardX * 2);
        var statsCardH = Math.round(isLand ? 90 : 120) * S;
        var statsCardR = Math.round(16 * S);
        // Frosted glass background
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.roundRect(statsCardX, statsCardY, statsCardW, statsCardH, statsCardR);
        ctx.fill();
        // Glass border
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(statsCardX, statsCardY, statsCardW, statsCardH, statsCardR);
        ctx.stroke();
        ctx.restore();

        // Stats columns inside the glass card
        var statColW = statsCardW / 3;
        var statNumSize = Math.round(44 * S);
        var statLabelSize = Math.round(14 * S);
        var statNumY = statsCardY + Math.round(isLand ? 42 : 55) * S;
        var statLabelY = statNumY + Math.round(isLand ? 20 : 24) * S;
        var statTitleY = statsCardY + Math.round(isLand ? 18 : 22) * S;

        function drawStatCol(colIdx, title, value, unit) {
            var cx = statsCardX + statColW * colIdx + statColW / 2;
            // Title label (small, muted)
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = statLabelSize + 'px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, cx, statTitleY);
            // Big number
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold ' + statNumSize + 'px system-ui, -apple-system, sans-serif';
            ctx.fillText(value, cx, statNumY);
            // Unit label below
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = statLabelSize + 'px system-ui, sans-serif';
            ctx.fillText(unit, cx, statLabelY);
        }

        drawStatCol(0, 'PM2.5', '' + pm25, 'µg/m³');
        drawStatCol(1, 'WHO', whoX + '×', 'limit');
        drawStatCol(2, 'CIGS', cigPerDay, '/day');

        // Vertical separators inside glass card
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        for (var vi = 1; vi < 3; vi++) {
            var vx = statsCardX + statColW * vi;
            ctx.beginPath();
            ctx.moveTo(vx, statsCardY + Math.round(10 * S));
            ctx.lineTo(vx, statsCardY + statsCardH - Math.round(10 * S));
            ctx.stroke();
        }

        // ── Factoid: punchy, italic, in curly quotes ──
        var factoidY = statsCardY + statsCardH + Math.round(isLand ? 32 : 48) * S;
        var factoid = '';
        if (aqi <= 50) factoid = 'Cleaner than 85% of Indian cities today';
        else if (aqi <= 100) factoid = 'You’re breathing ' + cigPerDay + ' cigarettes worth of air';
        else if (aqi <= 200) factoid = 'This air is ' + whoX + '× above what WHO says is safe';
        else if (aqi <= 300) factoid = 'At this level, children should not play outdoors';
        else if (aqi <= 400) factoid = 'Equivalent to smoking ' + cigPerDay + ' cigarettes today';
        else factoid = 'Emergency level — stay indoors, seal windows';

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'italic ' + Math.round(22 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        // Wrap long factoids onto two lines if needed
        var factoidLine = '“' + factoid + '”';
        var maxFactoidW = W - padX * 2 - Math.round(40 * S);
        var factoidMeasured = ctx.measureText(factoidLine).width;
        if (factoidMeasured > maxFactoidW) {
            // Simple word-wrap into two lines
            var words = factoidLine.split(' ');
            var line1 = '', line2 = '';
            for (var wi = 0; wi < words.length; wi++) {
                var test = line1 ? line1 + ' ' + words[wi] : words[wi];
                if (ctx.measureText(test).width <= maxFactoidW) {
                    line1 = test;
                } else {
                    line2 = words.slice(wi).join(' ');
                    break;
                }
            }
            ctx.fillText(line1, W / 2, factoidY);
            if (line2) ctx.fillText(line2, W / 2, factoidY + Math.round(28 * S));
        } else {
            ctx.fillText(factoidLine, W / 2, factoidY);
        }
        ctx.restore();

        // ── Context bar: thick, multi-color gradient ──
        var barYStart = factoidY + Math.round(isLand ? 38 : 54) * S;
        // If factoid wrapped, push bar down further
        if (factoidMeasured > maxFactoidW) barYStart += Math.round(28 * S);
        var barX = padX + Math.round(20 * S);
        var barW = W - barX * 2;
        var barH = Math.round(20 * S);
        var barR = barH / 2;

        // Bar label
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = Math.round(13 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PM2.5 CONTEXT', W / 2, barYStart - Math.round(8 * S));

        // Scale: max of pm25, cityAvg, 100
        var cityAvg = cityAnnualPM25 || pm25;
        var scaleMax = Math.max(pm25, cityAvg, 100) * 1.2;

        // Full-length gradient bar (green -> yellow -> orange -> red -> purple)
        var fullBarGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        fullBarGrad.addColorStop(0, '#22C55E');
        fullBarGrad.addColorStop(0.25, '#EAB308');
        fullBarGrad.addColorStop(0.5, '#F97316');
        fullBarGrad.addColorStop(0.75, '#EF4444');
        fullBarGrad.addColorStop(1, '#7C3AED');
        ctx.fillStyle = fullBarGrad;
        ctx.beginPath();
        ctx.roundRect(barX, barYStart, barW, barH, barR);
        ctx.fill();
        // Dim overlay on unfilled portion
        var filledW = Math.min(pm25 / scaleMax, 1) * barW;
        if (filledW < barW) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            // clip to only the unfilled area
            ctx.beginPath();
            ctx.rect(barX + filledW, barYStart, barW - filledW, barH);
            ctx.fill();
            ctx.restore();
        }

        // WHO marker (5 ug/m3) - solid green line
        var whoBarPos = barX + (5 / scaleMax) * barW;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(whoBarPos, barYStart - 4);
        ctx.lineTo(whoBarPos, barYStart + barH + 4);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold ' + Math.round(12 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WHO 5', whoBarPos, barYStart + barH + Math.round(18 * S));

        // City annual avg marker - dashed line
        if (cityAnnualPM25) {
            var avgBarPos = barX + Math.min(cityAnnualPM25 / scaleMax, 1) * barW;
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(avgBarPos, barYStart - 4);
            ctx.lineTo(avgBarPos, barYStart + barH + 4);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = Math.round(12 * S) + 'px system-ui, sans-serif';
            ctx.fillText('Avg ' + cityAnnualPM25, avgBarPos, barYStart + barH + Math.round(18 * S));
        }

        // Today's value marker - white triangle pointing down
        var todayBarPos = barX + Math.min(pm25 / scaleMax, 1) * barW;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(todayBarPos, barYStart - 6);
        ctx.lineTo(todayBarPos - 7, barYStart - 18);
        ctx.lineTo(todayBarPos + 7, barYStart - 18);
        ctx.closePath();
        ctx.fill();
        ctx.font = 'bold ' + Math.round(13 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▲ ' + pm25, todayBarPos, barYStart - Math.round(22 * S));

        // ── Footer: URL, small, bottom-center ──
        var footerY = H - Math.round(30 * S);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = Math.round(16 * S) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('janvayu.in', W / 2, footerY);

        // Preview mode: return the canvas, skip download/share
        if (opts && opts.preview) return canvas;

        // ── Download or share ──
        canvas.toBlob(function(blob) {
            if (!blob) return;
            var citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
            var dateSlug = now.toISOString().slice(0, 10);
            var filename = 'janvayu-' + citySlug + '-' + dateSlug + '.png';

            // Try Web Share API with file (mobile)
            if (opts && opts.share && navigator.canShare) {
                var file = new File([blob], filename, { type: 'image/png' });
                var shareData = {
                    title: city.name + ' AQI: ' + aqi + ' - JanVayu',
                    text: city.name + ' AQI is ' + aqi + ' (' + label + '). PM2.5: ' + pm25 + ' µg/m³ (' + whoX + '× WHO). Check janvayu.in for live data.',
                    files: [file]
                };
                if (navigator.canShare(shareData)) {
                    navigator.share(shareData).catch(function() {});
                    return;
                }
            }

            // Fallback: download
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
        }, 'image/png');
    }

    function shareOnWhatsApp(cityKey) {
        var data = aqiData[cityKey];
        if (!data) { alert('No AQI data available for this city yet.'); return; }
        var city = CITIES[cityKey];
        if (!city) return;
        var aqi = data.aqi || 0;
        var pm25 = data.pm25 || Math.round(aqi * 0.7);
        var whoX = getWHOMultiple(pm25);
        var cigPerDay = (pm25 / 22).toFixed(1);
        var label = getAQILabel(aqi);
        var text = '🌫️ ' + city.name + ' Air Quality Right Now'
            + '\n\nAQI: ' + aqi + ' (' + label + ')'
            + '\nPM2.5: ' + pm25 + ' µg/m³ (' + whoX + '× WHO limit)'
            + '\n≈ ' + cigPerDay + ' cigarettes/day'
            + '\n\nCheck live data: janvayu.in';
        var url = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(url, '_blank');
    }

    function shareHealthResultWhatsApp() {
        var pm25 = parseFloat(document.getElementById('health-pm25')?.value || 0);
        var mortalityEl = document.getElementById('mortality-risk');
        var lifeEl = document.getElementById('life-years-lost');
        var mortality = mortalityEl ? mortalityEl.textContent : '--';
        var lifeYears = lifeEl ? lifeEl.textContent : '--';
        var whoX = getWHOMultiple(pm25);
        if (mortality === '--') { alert('Calculate your health risk first.'); return; }
        var text = '🏥 My air pollution health risk:'
            + '\n\nPM2.5: ' + pm25 + ' µg/m³ (' + whoX + '× WHO guideline)'
            + '\nExcess mortality risk: ' + mortality
            + '\nLife expectancy lost: ' + lifeYears
            + '\n\nCheck yours: janvayu.in/#health';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    function shareExposureDiaryWhatsApp() {
        var statsEl = document.getElementById('diary-stats');
        if (!statsEl || !statsEl.innerHTML || statsEl.innerHTML.indexOf('--') >= 0) { alert('Calculate your exposure first.'); return; }
        var cards = statsEl.querySelectorAll('.card');
        var weighted = '', cigs = '', worst = '';
        if (cards[0]) { var v = cards[0].querySelector('[style*="1.75rem"]'); if (v) weighted = v.textContent.trim(); }
        if (cards[1]) { var v = cards[1].querySelector('[style*="1.75rem"]'); if (v) cigs = v.textContent.trim(); }
        if (cards[3]) { var v = cards[3].querySelector('[style*="1.1rem"]'); if (v) worst = v.textContent.trim(); }
        var text = '📊 My daily PM2.5 exposure:'
            + '\n\nWeighted exposure: ' + weighted + ' µg/m³'
            + '\n= ' + cigs + ' cigarettes/day'
            + '\nWorst window: ' + worst
            + '\n\nCheck yours: janvayu.in/#exposure-diary';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    function shareMigrationResultWhatsApp() {
        var resultEl = document.getElementById('migration-result');
        if (!resultEl || !resultEl.innerHTML.trim()) { alert('Compare cities first.'); return; }
        var fromName = document.getElementById('migrate-from')?.selectedOptions[0]?.text || '';
        var toName = document.getElementById('migrate-to')?.selectedOptions[0]?.text || '';
        var verdictEl = resultEl.querySelector('[style*="2.5rem"]');
        var years = verdictEl ? verdictEl.textContent.trim() : '';
        var cigCards = resultEl.querySelectorAll('[style*="1.5rem"][style*="font-weight"]');
        var cigsSaved = cigCards.length > 0 ? cigCards[0].textContent.trim() : '';
        var text = '🏙️ Air quality migration comparison:'
            + '\n\nMoving from ' + fromName + ' to ' + toName
            + ' = ' + years + ' life expectancy'
            + (cigsSaved ? '\n' + cigsSaved + ' fewer cigarettes/year' : '')
            + '\n\nCompare cities: janvayu.in/#migration-calc';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    function shareSchoolClosureWhatsApp() {
        var grapEl = document.getElementById('grap-status');
        var predEl = document.getElementById('school-prediction');
        if (!grapEl || !predEl) { alert('School closure data not loaded yet.'); return; }
        var aqiEl = grapEl.querySelector('[style*="2.5rem"]');
        var stageEl = grapEl.querySelector('[style*="1.25rem"]');
        var statusEl = predEl.querySelector('[style*="1.5rem"]');
        var aqi = aqiEl ? aqiEl.textContent.trim() : '?';
        var stage = stageEl ? stageEl.textContent.trim() : '?';
        var status = statusEl ? statusEl.textContent.trim() : '?';
        var text = '🏫 NCR School Closure Status:'
            + '\n\n' + status
            + '\nNCR Average AQI: ' + aqi
            + '\nGRAP Status: ' + stage
            + '\n\nCheck live: janvayu.in/#school-closure';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    function sharePurifierResultWhatsApp() {
        var resultEl = document.getElementById('purifier-result');
        if (!resultEl || resultEl.textContent.indexOf('Enter room') >= 0) { alert('Calculate purifier sizing first.'); return; }
        var area = document.getElementById('purifier-area')?.value || '?';
        var cadrEl = resultEl.querySelector('[style*="2rem"]');
        var cadr = cadrEl ? cadrEl.textContent.trim() : '?';
        var text = '💨 My air purifier calculation:'
            + '\n\nFor my ' + area + ' sq ft room, I need a purifier with CADR >= ' + cadr
            + '\n\nCalculate yours: janvayu.in/#purifier-calc';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    function updateShareCardPreview() {
        var cityKey = document.getElementById('share-card-city') ? document.getElementById('share-card-city').value : null;
        var format = document.getElementById('share-card-format') ? document.getElementById('share-card-format').value : 'square';
        var preview = document.getElementById('share-card-preview');
        if (!preview) return;
        if (!cityKey || !aqiData[cityKey]) {
            preview.innerHTML = '<p style="color: var(--text-3); padding: 2rem;">Select a city with available data to preview.</p>';
            return;
        }
        // Render the actual canvas card and embed it as an image in the preview
        try {
            Promise.resolve(generateAQICard(cityKey, { format: format, preview: true })).then(function(canvas) {
                if (!canvas) return;
                preview.innerHTML = '';
                var img = document.createElement('img');
                img.src = canvas.toDataURL('image/png');
                img.style.cssText = 'width: 100%; height: auto; display: block; border-radius: 12px;';
                img.alt = 'AQI card preview';
                preview.appendChild(img);
            }).catch(function(e) {
                console.warn('[JanVayu] Preview render failed:', e);
                preview.innerHTML = '<p style="color: var(--text-3); padding: 2rem;">Preview unavailable. Click Download to generate the card.</p>';
            });
        } catch (e) {
            console.warn('[JanVayu] Preview error:', e);
        }
    }

    // ── Init ──
    // ── Searchable city combobox ──
    // Wraps a native <select> in a type-to-filter combobox WITHOUT removing the
    // select: the select keeps holding the value and firing 'change', so every
    // downstream handler (updateHeroCity, generateAQICard, …) keeps working. The
    // combobox is a WAI-ARIA listbox pattern (role=combobox + role=listbox).
    window.enhanceCityCombobox = function enhanceCityCombobox(select) {
        if (!select || select.dataset.comboEnhanced) return;
        select.dataset.comboEnhanced = '1';
        const opts = Array.from(select.querySelectorAll('option'))
            .map(o => ({ value: o.value, label: (o.textContent || '').trim() }))
            .filter(o => o.value);
        const wrap = document.createElement('div');
        wrap.className = 'city-combo';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'city-combo-input';
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('placeholder', 'Type to search a city…');
        const lbl = select.getAttribute('aria-label');
        if (lbl) input.setAttribute('aria-label', lbl);
        // Visible search affordance — otherwise the input (pre-filled with the
        // current city) reads as a plain dropdown and nobody realises they can type.
        const icon = document.createElement('span');
        icon.className = 'city-combo-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>';
        const listId = 'combo-list-' + (select.id || ('c' + Math.floor(opts.length * 997)));
        const list = document.createElement('ul');
        list.className = 'city-combo-list';
        list.id = listId;
        list.setAttribute('role', 'listbox');
        list.hidden = true;
        input.setAttribute('aria-controls', listId);
        const cur = opts.find(o => o.value === select.value);
        if (cur) input.value = cur.label;
        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(icon);
        wrap.appendChild(input);
        wrap.appendChild(list);
        wrap.appendChild(select);
        select.style.display = 'none';
        select.setAttribute('tabindex', '-1');
        select.setAttribute('aria-hidden', 'true');
        let active = -1;
        let filtered = opts.slice();
        function renderList(items) {
            list.innerHTML = items.map((o, i) =>
                '<li role="option" class="city-combo-opt" id="' + listId + '-opt-' + i + '" data-value="' + o.value + '">' + o.label + '</li>'
            ).join('') || '<li class="city-combo-empty" aria-disabled="true">No match</li>';
        }
        function openList() { list.hidden = false; input.setAttribute('aria-expanded', 'true'); }
        function closeList() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; input.removeAttribute('aria-activedescendant'); }
        function doFilter(q) {
            q = (q || '').trim().toLowerCase();
            filtered = q ? opts.filter(o => o.label.toLowerCase().indexOf(q) !== -1) : opts.slice();
            renderList(filtered);
        }
        function highlight() {
            Array.from(list.querySelectorAll('.city-combo-opt')).forEach((li, i) => {
                const on = i === active;
                li.classList.toggle('active', on);
                if (on) { input.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
            });
        }
        function choose(o) {
            if (!o) return;
            select.value = o.value;
            input.value = o.label;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            closeList();
        }
        input.addEventListener('focus', () => { doFilter(''); openList(); input.select(); });
        input.addEventListener('input', () => { doFilter(input.value); openList(); active = -1; });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) { doFilter(''); openList(); } active = Math.min(active + 1, filtered.length - 1); highlight(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
            else if (e.key === 'Enter') { if (!list.hidden && active >= 0 && filtered[active]) { e.preventDefault(); choose(filtered[active]); } }
            else if (e.key === 'Escape') { closeList(); }
        });
        input.addEventListener('blur', () => {
            // If they typed a full match, accept it; otherwise restore the current selection.
            setTimeout(() => {
                if (list.hidden) return;
                const typed = input.value.trim().toLowerCase();
                const exact = opts.find(o => o.label.toLowerCase() === typed);
                if (exact) choose(exact);
                else { const c = opts.find(o => o.value === select.value); if (c) input.value = c.label; closeList(); }
            }, 120);
        });
        list.addEventListener('mousedown', (e) => {
            const li = e.target.closest('.city-combo-opt');
            if (li) { e.preventDefault(); choose(opts.find(o => o.value === li.getAttribute('data-value'))); }
        });
        document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) closeList(); });
        // Keep the input label in sync if the value is changed elsewhere in code.
        select.addEventListener('change', () => {
            const c = opts.find(o => o.value === select.value);
            if (c && document.activeElement !== input) input.value = c.label;
        });
    };

    document.addEventListener('DOMContentLoaded', async () => {
        console.log('[JanVayu] Initializing redesigned version...');
        try { window.enhanceCityCombobox(document.getElementById('hero-city-select')); } catch (e) { console.warn('city combobox:', e); }

        // ── PWA: register service worker for offline shell + last-known AQI cache ──
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.warn('[JanVayu] SW register failed:', err));
        }

        // ── PWA: capture install prompt and surface a discreet banner ──
        let deferredInstallPrompt = null;
        const pwaDismissed = (function () {
            try { return localStorage.getItem('janvayu-pwa-dismissed') === '1'; } catch (e) { return false; }
        })();
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstallPrompt = e;
            if (pwaDismissed) return;
            // Reveal the "Install app" button in the section-nav (no floating banner).
            const navBtn = document.getElementById('navInstallBtn');
            if (navBtn) navBtn.style.display = '';
        });
        window.installJanVayuPWA = async function () {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            try { await deferredInstallPrompt.userChoice; } catch (e) {}
            deferredInstallPrompt = null;
            const navBtn = document.getElementById('navInstallBtn');
            if (navBtn) navBtn.style.display = 'none';
        };
        window.dismissPWABanner = function () {
            const banner = document.getElementById('pwa-install-banner');
            if (banner) banner.classList.remove('show');
            try { localStorage.setItem('janvayu-pwa-dismissed', '1'); } catch (e) {}
        };

        // Nav links
        // Desktop nav: top-level links (direct, like Dashboard)
        document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // If this link has a dropdown, clicking it goes to its default panel
                showPanel(link.dataset.panel);
            });
        });

        // Desktop nav: dropdown links
        document.querySelectorAll('.nav-dropdown-link').forEach(link => {
            link.addEventListener('click', () => showPanel(link.dataset.panel));
        });

        // Mobile nav items
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                showPanel(item.dataset.panel);
                closeMobileMenu();
            });
        });

        // Anchor link routing: load panel from URL hash
        function handleHash() {
            const hash = window.location.hash.replace('#', '');
            if (hash && hash !== 'dashboard') {
                const tmpl = document.getElementById('tmpl-' + hash);
                // Lazy panels (gallery, voices, resources, …) have no inline
                // tmpl-* template — they load from an external fragment — so
                // also accept any registered LAZY_PANELS id here, otherwise a
                // #gallery-style anchor link silently does nothing.
                if (tmpl || LAZY_PANELS[hash]) { showPanel(hash); }
            }
        }
        handleHash();
        window.addEventListener('hashchange', handleHash);

        try { populateExtendedCitySelectors(); } catch(e) { console.warn('ext city selectors:', e); }
        try { await fetchAllAQI(); } catch(e) { console.error(e); }
        try { initAllCharts(); } catch(e) { console.error(e); }

        // Auto-refresh AQI + news every 10 minutes, social feeds every 15 minutes
        setInterval(async () => {
            try { await fetchAllAQI(); } catch(e) {}
        }, 10 * 60 * 1000);

        setInterval(() => {
            // Refresh social cache so next panel visit gets fresh data
            SOCIAL_CACHE.lastFetch = 0;
            newsCache.lastFetch = 0;
            // If voices panel is active, refresh it
            const voicesFeed = document.getElementById('voices-live-feed');
            if (voicesFeed) loadVoicesLive();
            // If social feed panel is active, refresh it
            const socialFeed = document.getElementById('social-feed-container');
            if (socialFeed) loadSocialFeed();
            // If news panel is active, refresh it
            const newsFeed = document.getElementById('news-feed-container');
            if (newsFeed) loadNewsFilter();
        }, 15 * 60 * 1000);

        // Update global timestamp
        updateGlobalTimestamp();

        // Restore simple-language mode from session
        if (simpleMode) applySimpleMode();

        console.log('[JanVayu] Ready — auto-refresh: AQI every 10m, feeds every 15m');
    });
    

    // ── Calculator & Tool Functions ──
    function calculateSafeHours() {
            const aqi = parseInt(document.getElementById('safe-aqi').value);
            const activity = parseFloat(document.getElementById('safe-activity').value);
            const health = parseFloat(document.getElementById('safe-health').value);
            let baseHours = 24;
            if (aqi > 50) baseHours = Math.max(0.5, 12 - ((aqi - 50) / 30));
            if (aqi > 200) baseHours = Math.max(0.25, 4 - ((aqi - 200) / 100));
            if (aqi > 400) baseHours = 0;
            const adjustedHours = Math.max(0, baseHours / (activity * health));
            document.getElementById('safe-result').style.display = 'block';
            document.getElementById('safe-hours').textContent = adjustedHours === 0 ? 'AVOID OUTDOORS' : adjustedHours.toFixed(1) + ' hours';
            document.getElementById('safe-hours').style.color = adjustedHours < 2 ? '#EF4444' : adjustedHours < 4 ? '#F59E0B' : '#22C55E';
            document.getElementById('safe-advice').textContent = aqi > 300 ? 'Severe. Stay indoors. N95 if unavoidable.' : aqi > 200 ? 'Very poor. Avoid outdoor exercise.' : 'Reduce prolonged exertion.';
        }

    function calculateHealthRisk() {
            const age = parseInt(document.getElementById('health-age').value);
            const pm25 = parseFloat(document.getElementById('health-pm25').value);
            const outdoor = parseFloat(document.getElementById('health-outdoor').value);
            const conditions = parseFloat(document.getElementById('health-conditions').value);
            const baselineRisk = Math.exp(0.1 * Math.log(1 + 5/2.5));
            const currentRisk = Math.exp(0.1 * Math.log(1 + pm25/2.5));
            const excessRisk = ((currentRisk / baselineRisk) - 1) * 100 * conditions * (outdoor / 8);
            const yearsLost = (excessRisk / 100) * (75 - age) * 0.3;
            const cigarettes = (pm25 * outdoor / 24) / 22;
            document.getElementById('mortality-risk').textContent = '+' + excessRisk.toFixed(1) + '%';
            document.getElementById('life-years-lost').textContent = yearsLost.toFixed(1) + ' years';
            document.getElementById('cigarette-equiv').textContent = cigarettes.toFixed(1) + ' cig/day';
        }

    function calculateEconomicLoss() {
            const employees = parseInt(document.getElementById('econ-employees').value);
            const salary = parseInt(document.getElementById('econ-salary').value);
            const cityKey = document.getElementById('econ-city').value;
            const cityAQI = aqiData[cityKey]?.aqi || 150;
            const productivityLoss = Math.max(0, (cityAQI - 50) / 10) * 0.01;
            const annualLoss = salary * 12 * employees * productivityLoss;
            document.getElementById('econ-result').style.display = 'block';
            document.getElementById('econ-loss').textContent = 'Rs ' + (annualLoss / 100000).toFixed(1) + ' Lakhs/year';
            document.getElementById('econ-detail').innerHTML = `Productivity loss: ${(productivityLoss * 100).toFixed(1)}%<br>Based on ${CITIES[cityKey]?.name} AQI: ${cityAQI}`;
        }

    async function updateComparison(forceRefresh = false) {
            const cities = [
                document.getElementById('compare-city1').value,
                document.getElementById('compare-city2').value,
                document.getElementById('compare-city3').value
            ];

            // Show loading state
            document.getElementById('comparison-result').innerHTML = cities.map(c =>
                `<div class="card stat-card"><div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">${CITIES[c]?.name || c}</div><div class="stat-value" style="color: var(--text-3);">...</div><div class="stat-label">Fetching live data</div></div>`
            ).join('');

            // Fetch data in parallel instead of sequentially
            const citiesToFetch = cities.filter(c => forceRefresh || !aqiData[c] || CITIES[c]?.region === 'intl');
            const results = await Promise.allSettled(citiesToFetch.map(c => fetchAQI(c)));
            results.forEach((result, i) => {
                if (result.status === 'fulfilled' && result.value) {
                    aqiData[citiesToFetch[i]] = result.value;
                }
            });

            // Update timestamp
            const updateTimeEl = document.getElementById('compare-update-time');
            if (updateTimeEl) {
                updateTimeEl.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            }

            // Render comparison cards with live data
            document.getElementById('comparison-result').innerHTML = cities.map(c => {
                const data = aqiData[c];
                const aqi = data?.aqi || '--';
                const label = data ? getAQILabel(data.aqi) : 'No data';
                const color = data ? getAQIColor(data.aqi) : 'var(--text-3)';
                const pm25 = data?.pm25 ? `PM2.5: ${data.pm25}` : '';
                return `<div class="card stat-card" style="position: relative;">
                    <button class="share-aqi-btn" onclick="generateAQICard('${c}')" title="Download AQI card" style="position: absolute; top: 8px; right: 8px;"><span class="si si-share"></span></button>
                    <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">${CITIES[c]?.name || c}</div>
                    <div class="stat-value" style="color: ${color}">${aqi}</div>
                    <div class="stat-label">${label}</div>
                    <div style="font-size: 0.625rem; color: var(--text-3); margin-top: 0.25rem;">${pm25}</div>
                </div>`;
            }).join('');

            // Update chart with live data
            if (charts.compare) {
                const aqiValues = cities.map(c => aqiData[c]?.aqi || 0);
                const colors = cities.map(c => getAQIColor(aqiData[c]?.aqi || 0));
                charts.compare.data.labels = cities.map(c => CITIES[c]?.name || c);
                charts.compare.data.datasets[0].data = aqiValues;
                charts.compare.data.datasets[0].backgroundColor = colors;
                charts.compare.update('none');
            }
        }

    let mapMarkerLayer = null;
    let mapHeatLayer = null;

    async function initMap() {
            try { await ensureLeaflet(); }
            catch (e) {
                console.warn('[JanVayu] Leaflet failed to load:', e);
                const mapPanel = document.querySelector('#panel-container .panel.active') || document.getElementById('india-map');
                renderLibraryFallback(mapPanel, 'Leaflet (map library)');
                return;
            }
            // Destroy old map instance if DOM was replaced (panel navigation)
            if (map) {
                try { map.remove(); } catch(e) {}
                map = null;
                mapMarkers = [];
                mapMarkerLayer = null;
                mapHeatLayer = null;
                histMarkerLayer = null;
                histSliderActive = false;
                mapSourcesLegend = null;
            }
            const mapContainer = document.getElementById('india-map');
            if (!mapContainer) {
                console.warn('[JanVayu] Map container not found');
                return;
            }
            try {
                map = L.map('india-map').setView([22.5, 78.5], 5);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap | AQI data from WAQI API (Live)'
                }).addTo(map);
                mapMarkerLayer = L.layerGroup().addTo(map);
                updateMapMarkers();
                // Restore heatmap state if user had it on (button-toggle .active class)
                const heatBtn = document.getElementById('map-toggle-heatmap-btn');
                if (heatBtn && heatBtn.classList.contains('active')) toggleMapLayer('heatmap', true);
                // Restore indianopenmaps overlays the same way (old layers died with the old map)
                Object.keys(OPENMAPS_OVERLAYS).forEach(name => {
                    delete openmapsOverlayLayers[name];
                    const b = document.getElementById(`map-toggle-${name}-btn`);
                    if (b && b.classList.contains('active')) toggleMapLayer(name, true);
                });
                // Villages are viewport-driven, not in OPENMAPS_OVERLAYS, but
                // restore the same way — the old layer died with the old map.
                villageGroup = null;
                villageRenderer = null;   // belonged to the old map
                villageOnMap.clear();
                const vb = document.getElementById('map-toggle-villages-btn');
                if (vb && vb.classList.contains('active')) toggleMapLayer('villages', true);
            } catch (e) {
                console.error('[JanVayu] Error initializing map:', e);
            }
        }

    // ── Farm-fire / stubble-burning tracker (NASA FIRMS via /fire-tracker) ──
    let fireMap = null;
    let fireLayer = null;
    async function initFireTracker() {
        const host = document.getElementById('fire-map');
        if (!host) return;
        try { await ensureLeaflet(); }
        catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Leaflet (map library)'); return; }
        if (fireMap) { try { fireMap.remove(); } catch (_) {} fireMap = null; fireLayer = null; }
        try {
            fireMap = L.map('fire-map', { scrollWheelZoom: false }).setView([29.5, 75.8], 6);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap © CARTO | Fires: NASA FIRMS'
            }).addTo(fireMap);
            fireLayer = L.layerGroup().addTo(fireMap);
            loadFires();
        } catch (e) { console.error('Fire map init:', e); }
    }
    async function loadFires() {
        if (!fireMap || !fireLayer) return;
        const area = document.getElementById('fire-area')?.value || 'nwindia';
        const days = document.getElementById('fire-days')?.value || '3';
        const countEl = document.getElementById('fire-count');
        const noteEl = document.getElementById('fire-status');
        if (countEl) countEl.textContent = '…';
        if (noteEl) noteEl.textContent = 'Loading NASA FIRMS detections…';
        // Recenter for the chosen area
        fireMap.setView(area === 'india' ? [22.5, 80] : [29.5, 75.8], area === 'india' ? 5 : 6);
        try {
            const res = await fetch(`/.netlify/functions/fire-tracker?area=${area}&days=${days}`, { signal: AbortSignal.timeout(15000) });
            const data = await res.json();
            fireLayer.clearLayers();
            const fires = data.fires || [];
            const confName = { h: 'high', n: 'nominal', l: 'low' };
            fires.forEach(f => {
                const col = f.conf === 'h' ? '#B91C1C' : f.conf === 'l' ? '#F59E0B' : '#EA580C';
                L.circleMarker([f.lat, f.lon], { radius: 4, fillColor: col, color: '#fff', weight: 0.5, fillOpacity: 0.8 })
                    .addTo(fireLayer)
                    .bindPopup(`<strong>Active fire</strong><br>${f.date} ${String(f.time).padStart(4, '0')} UTC<br>Confidence: ${confName[f.conf] || f.conf}${f.frp ? '<br>FRP ' + f.frp + ' MW' : ''}`);
            });
            const count = data.count != null ? data.count : fires.length;
            if (countEl) countEl.textContent = count;
            if (noteEl) {
                if (data.note) noteEl.textContent = data.note;
                else if (count === 0) noteEl.textContent = 'No active fires detected in this window. Stubble burning is seasonal — the belt lights up from mid-October to late November. (Off-season now, so a near-empty map is expected.)';
                else noteEl.textContent = `${count} detection(s) · ${data.source} · last ${days} day(s).`;
            }
        } catch (e) {
            if (noteEl) noteEl.textContent = 'Fire data is unavailable right now. NASA FIRMS may be busy — try again shortly.';
            if (countEl) countEl.textContent = '—';
        }
    }
    window.initFireTracker = initFireTracker;
    window.loadFires = loadFires;

    // ── Source apportionment ring: where a city's PM2.5 comes from ──
    let apportionData = null;
    let apportionChart = null;
    const APPORTION_BUCKETS = [
        { key: 'transport',          label: 'Transport',          color: '#EA580C' },
        { key: 'industry',           label: 'Industry',           color: '#7C3AED' },
        { key: 'residential_biomass',label: 'Biomass & burning',  color: '#CA8A04' },
        { key: 'dust_construction',  label: 'Dust & construction',color: '#A16207' },
        { key: 'power',              label: 'Power',              color: '#0891B2' },
        { key: 'other',              label: 'Other (secondary, transboundary)', color: '#64748B' }
    ];
    window.initApportionment = async function initApportionment() {
        const sel = document.getElementById('apportion-city');
        if (!sel) return;
        if (!apportionData) {
            try {
                const r = await fetch('/data/apportionment.json');
                apportionData = await r.json();
            } catch (e) {
                const legend = document.getElementById('apportion-legend');
                if (legend) legend.innerHTML = '<p style="color:var(--text-3);">Apportionment data could not load. Please refresh.</p>';
                return;
            }
        }
        if (sel.options.length === 0) {
            apportionData.cities.forEach(function (c) {
                const opt = document.createElement('option');
                opt.value = c.key; opt.textContent = c.name;
                sel.appendChild(opt);
            });
            sel.value = 'delhi';
            sel.onchange = function () { window.renderApportionRing(sel.value); };
        }
        try { await ensureChartJs(); } catch (e) {
            const legend = document.getElementById('apportion-legend');
            if (legend) legend.innerHTML = '<p style="color:var(--text-3);">Chart library could not load.</p>';
            return;
        }
        window.renderApportionRing(sel.value || 'delhi');
    };
    window.renderApportionRing = function renderApportionRing(cityKey) {
        if (!apportionData) return;
        const c = apportionData.cities.find(function (x) { return x.key === cityKey; });
        if (!c) return;
        const canvas = document.getElementById('apportionRing');
        const legend = document.getElementById('apportion-legend');
        const basisEl = document.getElementById('apportion-basis');
        const sourceEl = document.getElementById('apportion-source');
        const centerEl = document.getElementById('apportion-center');
        if (!canvas) return;

        const rows = APPORTION_BUCKETS
            .map(function (b) { return { b: b, val: c.shares[b.key] || 0 }; })
            .filter(function (r) { return r.val > 0; })
            .sort(function (a, b) { return b.val - a.val; });

        if (basisEl) basisEl.textContent = c.basis;
        if (centerEl && rows.length) {
            centerEl.innerHTML = '<span class="apportion-center-pct">' + Math.round(rows[0].val) + '%</span>' +
                '<span class="apportion-center-lbl">' + rows[0].b.label + '</span>';
        }

        if (legend) {
            legend.innerHTML = rows.map(function (r) {
                return '<div class="apportion-row">' +
                    '<span class="apportion-swatch" style="background:' + r.b.color + ';"></span>' +
                    '<span class="apportion-rowlabel">' + r.b.label + '</span>' +
                    '<span class="apportion-rowbar"><span class="apportion-rowbar-fill" style="width:' + Math.min(100, r.val) + '%;background:' + r.b.color + ';"></span></span>' +
                    '<span class="apportion-rowval">' + (Math.round(r.val * 10) / 10) + '%</span>' +
                    '</div>';
            }).join('');
        }

        if (sourceEl) {
            const conf = c.confidence ? (c.confidence.charAt(0).toUpperCase() + c.confidence.slice(1)) : '';
            sourceEl.innerHTML = '<p class="apportion-src-line"><strong>Source:</strong> ' + escapeHtml(c.source) +
                (c.year ? ' (' + escapeHtml(c.year) + ')' : '') + ' &middot; ' + escapeHtml(c.basis) +
                (conf ? ' &middot; confidence: ' + conf : '') + '</p>' +
                '<p class="apportion-caveat">' + escapeHtml(c.caveat || '') + '</p>';
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (apportionChart) { try { apportionChart.destroy(); } catch (e) {} apportionChart = null; }
        apportionChart = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: rows.map(function (r) { return r.b.label; }),
                datasets: [{
                    data: rows.map(function (r) { return r.val; }),
                    backgroundColor: rows.map(function (r) { return r.b.color; }),
                    borderColor: isDark ? '#0f172a' : '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '62%',
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: function (ctx) { return ctx.label + ': ' + (Math.round(ctx.parsed * 10) / 10) + '%'; } } }
                }
            }
        });
    };

    function updateMapMarkers() {
            if (!map || !mapMarkerLayer) return;
            try {
                mapMarkerLayer.clearLayers();
                mapMarkers = [];
                Object.entries(CITIES).forEach(([key, city]) => {
                    if (!city.lat || city.region === 'intl' || city.ext) return;
                    const data = aqiData[key];
                    const aqi = data?.aqi;
                    const color = aqi ? getAQIColor(aqi) : '#9CA3AF';
                    const label = aqi ? getAQILabel(aqi) : 'No data';
                    const pm25 = data?.pm25;
                    const pm10 = data?.pm10;
                    const cigPerDay = pm25 ? (pm25 / 22).toFixed(1) : null;
                    const popupHtml = `
                        <div style="min-width: 180px; font-family: var(--sans, system-ui);">
                            <strong style="font-size: 0.95rem;">${city.name}</strong>
                            <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 4px;">
                                <span style="font-size: 1.6rem; font-weight: 700; color: ${color};">${aqi || '?'}</span>
                                <span style="color: ${color}; font-size: 0.78rem; font-weight: 600;">${label}</span>
                            </div>
                            ${pm25 ? `<div style="font-size: 0.75rem; color: #555;">PM2.5: <strong>${pm25}</strong> µg/m³ · ${getWHOMultiple(pm25)}× WHO</div>` : ''}
                            ${pm10 ? `<div style="font-size: 0.75rem; color: #555;">PM10: ${pm10} µg/m³</div>` : ''}
                            ${cigPerDay ? `<div style="font-size: 0.72rem; color: var(--red); margin-top: 4px;">≈ ${cigPerDay} cigarettes/day equivalent</div>` : ''}
                            ${data?.time ? `<div style="font-size: 0.65rem; color: #888; margin-top: 6px;">Updated: ${data.time}</div>` : ''}
                            <div style="display: flex; gap: 6px; margin-top: 8px;">
                                <button onclick="document.getElementById('hero-city-select').value='${key}';updateHeroCity('${key}');showPanel('dashboard');" style="flex: 1; padding: 4px 10px; background: var(--accent, #1B6B4A); color: #fff; border: 0; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">View on dashboard</button>
                                <button onclick="generateAQICard('${key}')" style="padding: 4px 10px; background: #374151; color: #fff; border: 0; border-radius: 4px; font-size: 0.75rem; cursor: pointer;" title="Download shareable AQI card">Share</button>
                            </div>
                        </div>`;
                    const marker = L.circleMarker([city.lat, city.lon], {
                        radius: aqi ? Math.min(20, 8 + aqi/50) : 8,
                        fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.85
                    }).addTo(mapMarkerLayer).bindPopup(popupHtml);
                    mapMarkers.push(marker);
                });
                // Refresh heatmap data if it's currently on
                if (mapHeatLayer && map.hasLayer(mapHeatLayer)) {
                    rebuildHeatLayer();
                }
                // Re-colour constituency/district choropleths with the new readings
                try { refreshOpenmapsOverlayColors(); } catch (e) {}
            } catch (e) {
                console.error('[JanVayu] Error updating map markers:', e);
            }
        }

    function buildHeatPoints() {
            const points = [];
            Object.entries(CITIES).forEach(([key, city]) => {
                if (!city.lat || city.region === 'intl' || city.ext) return;
                const aqi = aqiData[key]?.aqi;
                if (!aqi) return;
                // Intensity scaled so AQI 200 already gets meaningful weight at India-wide
                // zoom — the previous 0..1/500 scale washed out everything below "Severe".
                const intensity = Math.min(1, Math.max(0.25, aqi / 250));
                points.push([city.lat, city.lon, intensity]);
            });
            return points;
        }

    function rebuildHeatLayer() {
            if (!map) return;
            if (mapHeatLayer) { try { map.removeLayer(mapHeatLayer); } catch(e){} mapHeatLayer = null; }
            if (typeof L.heatLayer !== 'function') {
                console.warn('[JanVayu] leaflet.heat plugin not loaded yet — retrying in 400ms');
                setTimeout(rebuildHeatLayer, 400);
                return;
            }
            // Heat blobs need to be large at India-wide zoom or they disappear into
            // single pixels per city. Tuned for default zoom 5; the maxZoom bump keeps
            // them visible when the user zooms in.
            mapHeatLayer = L.heatLayer(buildHeatPoints(), {
                radius: 55,
                blur: 40,
                maxZoom: 9,
                minOpacity: 0.45,
                gradient: { 0.0: '#22C55E', 0.2: '#EAB308', 0.4: '#F97316', 0.6: '#EF4444', 0.8: '#7C3AED', 1.0: '#831843' }
            }).addTo(map);
        }

    function toggleMapLayer(name, on) {
            if (!map) return;
            if (name === 'markers') {
                if (on) { if (!map.hasLayer(mapMarkerLayer)) mapMarkerLayer.addTo(map); }
                else    { if (map.hasLayer(mapMarkerLayer)) map.removeLayer(mapMarkerLayer); }
            } else if (name === 'heatmap') {
                if (on) { rebuildHeatLayer(); }
                else if (mapHeatLayer) { try { map.removeLayer(mapHeatLayer); } catch(e){} mapHeatLayer = null; }
            } else if (name === 'villages') {
                toggleVillagesOverlay(on);
            } else if (OPENMAPS_OVERLAYS[name]) {
                toggleOpenmapsOverlay(name, on);
            }
        }

    // ── indianopenmaps overlays: constituencies, districts, pollution sources ──
    // Boundary geometry is vendored (simplified) in /data/openmaps/, refreshed
    // by scripts/fetch-openmaps.mjs. Assembly constituencies stream as vector
    // tiles from indianopenmaps.com because 4,000+ ACs are too heavy to vendor.
    const openmapsOverlayLayers = {};   // name → Leaflet layer while toggled on
    const openmapsJsonCache = {};
    async function fetchOpenmapsJson(file) {
        if (!openmapsJsonCache[file]) {
            openmapsJsonCache[file] = fetch(`/data/openmaps/${file}`)
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .catch(e => { delete openmapsJsonCache[file]; throw e; });
        }
        return openmapsJsonCache[file];
    }

    // Estimate AQI for a point from the live city readings already on the
    // dashboard (inverse-distance weighting over monitored cities). Returns
    // null when the nearest monitored city is too far to be meaningful.
    function estimateAQIAt(lat, lon, maxKm) {
        let num = 0, den = 0, nearest = null, nearestD2 = Infinity;
        Object.entries(CITIES).forEach(([key, city]) => {
            const aqi = aqiData[key]?.aqi;
            if (!aqi || !city.lat || city.region === 'intl' || city.ext) return;
            const dx = (lon - city.lon) * Math.cos(lat * Math.PI / 180), dy = lat - city.lat;
            const d2 = dx * dx + dy * dy;
            if (d2 < nearestD2) { nearestD2 = d2; nearest = { key, city, aqi }; }
            const w = 1 / (d2 + 1e-4);
            num += w * aqi; den += w;
        });
        if (!den || !nearest) return null;
        const nearestKm = Math.round(Math.sqrt(nearestD2) * 111);
        if (nearestKm > (maxKm || 200)) return null;
        return { aqi: Math.round(num / den), nearestName: nearest.city.name, nearestAqi: nearest.aqi, nearestKm };
    }

    function openmapsAqiChip(est) {
        if (!est) return '<div style="font-size:0.75rem; color:#888; margin-top:4px;">No monitor close enough for a live estimate.</div>';
        const color = getAQIColor(est.aqi);
        return `<div style="display:flex; align-items:baseline; gap:6px; margin-top:4px;">
                    <span style="font-size:1.5rem; font-weight:700; color:${color};">${est.aqi}</span>
                    <span style="color:${color}; font-size:0.75rem; font-weight:600;">${getAQILabel(est.aqi)}</span>
                </div>
                <div style="font-size:0.7rem; color:#777;">Estimated from live monitors · nearest: ${est.nearestName} (AQI ${est.nearestAqi}, ~${est.nearestKm} km)</div>`;
    }

    const OPENMAPS_SOURCE_TYPES = {
        industrial: { label: 'Red/Orange-category industrial park', color: '#B91C1C' },
        coalmines:  { label: 'Coal mine',                           color: '#374151' },
        landfills:  { label: 'Landfill',                            color: '#A16207' },
        dumpsites:  { label: 'Dumpsite',                            color: '#CA8A04' },
        sez:        { label: 'Special Economic Zone',               color: '#7C3AED' },
    };

    const OPENMAPS_OVERLAYS = {
        constituencies: {
            async build() {
                const geo = await fetchOpenmapsJson('constituencies.json');
                return L.geoJSON(geo, {
                    attribution: 'Constituencies: LGD/Bharatmaps via <a href="https://indianopenmaps.com" target="_blank" rel="noopener">indianopenmaps.com</a>',
                    style: f => {
                        const est = estimateAQIAt(f.properties.cy, f.properties.cx);
                        return { weight: 0.7, color: '#6b7280', fillColor: est ? getAQIColor(est.aqi) : '#9CA3AF', fillOpacity: est ? 0.45 : 0.12 };
                    },
                    onEachFeature: (f, lyr) => {
                        const p = f.properties;
                        lyr.bindPopup(() => {
                            const est = estimateAQIAt(p.cy, p.cx);
                            return `<div style="min-width:200px;">
                                <strong style="font-size:0.95rem;">${p.pc}</strong>
                                <div style="font-size:0.75rem; color:#555;">Lok Sabha constituency · ${p.st}</div>
                                ${openmapsAqiChip(est)}
                                <div style="font-size:0.75rem; margin-top:8px;">This is the air your MP answers for.</div>
                                <div style="display:flex; gap:6px; margin-top:6px;">
                                    <button onclick="showPanel('accountability')" style="flex:1; padding:4px 8px; background:var(--accent,#1B6B4A); color:#fff; border:0; border-radius:4px; font-size:0.72rem; cursor:pointer;">Hold them accountable</button>
                                    <button onclick="showPanel('rti-assistant')" style="padding:4px 8px; background:#374151; color:#fff; border:0; border-radius:4px; font-size:0.72rem; cursor:pointer;">File an RTI</button>
                                </div></div>`;
                        }, { maxWidth: 260 });
                    }
                });
            }
        },
        districts: {
            async build() {
                const geo = await fetchOpenmapsJson('districts.json');
                return L.geoJSON(geo, {
                    attribution: 'Districts: LGD/Bharatmaps via <a href="https://indianopenmaps.com" target="_blank" rel="noopener">indianopenmaps.com</a>',
                    style: f => {
                        const est = estimateAQIAt(f.properties.cy, f.properties.cx);
                        return { weight: 0.6, color: '#6b7280', fillColor: est ? getAQIColor(est.aqi) : '#9CA3AF', fillOpacity: est ? 0.45 : 0.12 };
                    },
                    onEachFeature: (f, lyr) => {
                        const p = f.properties;
                        lyr.bindPopup(() => `<div style="min-width:190px;">
                                <strong style="font-size:0.95rem;">${p.dt}</strong>
                                <div style="font-size:0.75rem; color:#555;">District · ${p.st}</div>
                                ${openmapsAqiChip(estimateAQIAt(p.cy, p.cx))}
                                <div style="font-size:0.68rem; color:#888; margin-top:6px;">Most districts have no monitor at all — that gap is part of the story.</div>
                            </div>`, { maxWidth: 250 });
                    }
                });
            }
        },
        sources: {
            async build() {
                const data = await fetchOpenmapsJson('pollution-sources.json');
                const renderer = L.canvas({ padding: 0.3 });
                const group = L.layerGroup([], { attribution: 'Sources: SBM, GatiShakti, Coal-mines dataset (Harvard Dataverse) via <a href="https://indianopenmaps.com" target="_blank" rel="noopener">indianopenmaps.com</a>' });
                Object.entries(OPENMAPS_SOURCE_TYPES).forEach(([kind, cfg]) => {
                    (data.layers[kind] || []).forEach(pt => {
                        const detail =
                            kind === 'coalmines' ? `${pt.d ? pt.d + ' · ' : ''}${pt.s}${pt.mt ? '<br>' + pt.mt + ' MT coal/yr (2019-20)' : ''}${pt.o ? ' · ' + pt.o : ''}` :
                            kind === 'industrial' ? `${pt.d ? pt.d + ' · ' : ''}${pt.s}<br>CPCB pollution category: <strong style="color:${pt.c === 'red' ? '#B91C1C' : '#EA580C'}; text-transform:capitalize;">${pt.c}</strong>` :
                            `${pt.u ? pt.u + ' · ' : ''}${pt.s}`;
                        L.circleMarker([pt.lat, pt.lon], {
                            renderer, radius: kind === 'coalmines' || kind === 'industrial' ? 4 : 3,
                            fillColor: kind === 'industrial' && pt.c === 'orange' ? '#EA580C' : cfg.color,
                            color: '#fff', weight: 0.5, fillOpacity: 0.75
                        }).bindPopup(`<strong>${pt.n}</strong><div style="font-size:0.75rem; color:#555;">${cfg.label}</div><div style="font-size:0.75rem; color:#555;">${detail}</div>`)
                          .addTo(group);
                    });
                });
                return group;
            }
        },
        assembly: {
            async build() {
                await ensureVectorGrid();
                const grid = L.vectorGrid.protobuf('https://indianopenmaps.com/not-so-open/constituencies/assembly/lgd/{z}/{x}/{y}.pbf', {
                    rendererFactory: L.canvas.tile,
                    maxNativeZoom: 10,
                    interactive: true,
                    attribution: 'Assembly constituencies: LGD via <a href="https://indianopenmaps.com" target="_blank" rel="noopener">indianopenmaps.com</a>',
                    vectorTileLayerStyles: {
                        LGD_Assembly_Constituencies: { fill: true, fillOpacity: 0.03, fillColor: '#7C3AED', weight: 1, color: '#7C3AED', opacity: 0.7 },
                    },
                });
                grid.on('click', (e) => {
                    const p = e.layer && e.layer.properties;
                    if (!p || !map) return;
                    const est = estimateAQIAt(e.latlng.lat, e.latlng.lng);
                    L.popup({ maxWidth: 250 }).setLatLng(e.latlng).setContent(`<div style="min-width:190px;">
                            <strong style="font-size:0.95rem;">${p.ac_name || 'Assembly constituency'}</strong>
                            <div style="font-size:0.75rem; color:#555;">Vidhan Sabha constituency${p.dist_name ? ' · ' + p.dist_name : ''}${p.pc_name ? '<br>Lok Sabha seat: ' + p.pc_name : ''}</div>
                            ${openmapsAqiChip(est)}
                            <div style="font-size:0.75rem; margin-top:6px;">This is the air your MLA answers for. <a href="#" onclick="showPanel('accountability'); return false;">Hold them accountable →</a></div>
                        </div>`).openOn(map);
                });
                return grid;
            }
        },
    };

    // ── Village boundaries (LGD via indianopenmaps) ──────────────────────────
    // 584,615 village polygons cannot be held on the map (or in the repo) at
    // once, so this layer is viewport-driven: geometry is vendored as one
    // quantized TopoJSON per district in /data/villages/, and we load only the
    // districts whose bbox intersects the current view, above a zoom floor.
    // Built by scripts/build-villages.mjs.
    const VILLAGE_MIN_ZOOM = 9;      // below this the whole country would load
    const VILLAGE_MAX_DISTRICTS = 14; // guard against a huge pan at low zoom
    const VILLAGE_AQI_MAX_KM = 50;   // rural India is far from monitors: past
                                     // this, say so rather than invent a number
    // Annual mean PM2.5 (µg/m³) is a concentration, not an AQI index, so it
    // gets its own scale — banded on the WHO annual guideline (5) and its
    // interim targets, up to India's own annual NAAQS limit (40).
    // Bands are anchored on the WHO guideline (5) and India's annual NAAQS
    // limit (40), then split again above it: 57% of Indian villages fall in
    // 40-60, so a single band there would paint most of the country one flat
    // colour and hide the gradient people actually live along.
    const PM25_ANNUAL_BANDS = [
        { max: 5,        color: '#16A34A', label: 'Meets the WHO guideline' },
        { max: 15,       color: '#84CC16', label: 'WHO interim target 3' },
        { max: 25,       color: '#FACC15', label: 'WHO interim target 2' },
        { max: 40,       color: '#FB923C', label: "Within India's limit" },
        { max: 50,       color: '#F87171', label: "Above India's limit" },
        { max: 60,       color: '#DC2626', label: "Well above India's limit" },
        { max: Infinity, color: '#7F1D1D', label: 'Severe' },
    ];
    function pm25AnnualBand(v) {
        return PM25_ANNUAL_BANDS.find(b => v <= b.max) || PM25_ANNUAL_BANDS[PM25_ANNUAL_BANDS.length - 1];
    }

    // ── One map, every Indian boundary level ────────────────────────────
    // Wards lived in their own panel behind a city dropdown; villages were a
    // layer here. A user asking "how polluted is my place" had to know whether
    // their place was a ward or a village to find the right screen — our data
    // model leaking into the navigation, and the dropdown capped wards at 142
    // cities out of 3,675. These are PMTiles archives read by range request,
    // so the browser pulls only what is on screen: rendering Delhi NCR styles
    // 671 wards from 109 KB, against 224 KB for Delhi's ward file alone.
    const BOUNDARY_LEVELS = {
        state:       { label: 'State',        min: 3,  max: 7,  note: '36 states and union territories' },
        district:    { label: 'District',     min: 4,  max: 9,  note: '785 districts (zila)' },
        subdistrict: { label: 'Block/Tehsil', min: 6,  max: 11, note: '6,471 sub-districts — block, mandal or tehsil' },
        panchayat:   { label: 'Panchayat',    min: 7,  max: 10, note: '319,287 gram panchayats' },
        village:     { label: 'Village',      min: 8,  max: 12, note: '584,615 villages' },
        ulb:         { label: 'City/ULB',     min: 6,  max: 12, note: '3,368 urban local bodies' },
        ward:        { label: 'Ward',         min: 9,  max: 13, note: '70,417 municipal wards' },
    };
    let boundaryLayer = null;
    let boundaryLevel = '';

    function boundaryNote(msg) {
        const el = document.getElementById('map-boundary-note');
        if (el) el.textContent = msg || '';
    }

    window.setBoundaryLevel = async function setBoundaryLevel(level) {
        try { await ensureLeaflet(); } catch (e) { boundaryNote('Map library could not load.'); return; }
        if (!map) return;
        if (level) {
            try { await ensurePMTiles(); }
            catch (e) { boundaryNote('Boundary tile reader could not load — try again in a moment.'); return; }
        }
        if (boundaryLayer) { try { map.removeLayer(boundaryLayer); } catch (e) {} boundaryLayer = null; }
        boundaryLevel = level || '';
        if (!boundaryLevel) {
            try { toggleVillagesOverlay(false); } catch (e) {}
            boundaryNote('');
            return;
        }

        const cfg = BOUNDARY_LEVELS[boundaryLevel];

        // Villages stay on the older per-district TopoJSON path. Their tile
        // archive is 267 MB and GitHub refuses any file over 100 MB, so it
        // cannot ship the way the other six do. Same selector, same place in
        // the hierarchy for the user — different loader underneath, until the
        // archives move to a release and this special case goes away.
        if (boundaryLevel === 'village') {
            const btn = { classList: { contains: () => false, toggle: () => {} }, setAttribute: () => {} };
            try { toggleVillagesOverlay(true); } catch (e) {}
            boundaryNote(map.getZoom() < 9
                ? '584,615 villages — zoom in to zoom 9+ to see them.'
                : '584,615 villages. Coloured by annual PM2.5; tap one for its figure.');
            void btn;
            return;
        }
        try { toggleVillagesOverlay(false); } catch (e) {}

        if (!cfg || typeof L.vectorGrid.pmtiles !== 'function') {
            boundaryNote('Boundary tiles are unavailable.');
            return;
        }
        const styleFor = (props) => {
            const v = props && typeof props.p === 'number' ? props.p : null;
            return {
                fill: true,
                fillColor: v == null ? '#cbd5e1' : pm25AnnualBand(v).color,
                fillOpacity: v == null ? 0.25 : 0.6,
                color: '#ffffff', weight: 0.4, opacity: 0.55,
            };
        };
        boundaryLayer = L.vectorGrid.pmtiles(`/data/tiles/${boundaryLevel}.pmtiles`, {
            rendererFactory: L.canvas.tile,
            interactive: true,
            minZoom: cfg.min,
            maxNativeZoom: cfg.max,
            vectorTileLayerStyles: { [boundaryLevel]: styleFor },
            getFeatureId: (f) => f.properties && (f.properties.c || f.properties.n),
        });
        boundaryLayer.on('click', (e) => {
            const p = (e.layer && e.layer.properties) || {};
            const v = typeof p.p === 'number' ? p.p : null;
            const where = [p.n || 'Unnamed', p.u ? `(${p.u})` : ''].filter(Boolean).join(' ');
            const body = v == null
                ? 'No annual estimate for this area.'
                : `<strong>${v} µg/m³</strong> — annual average PM2.5, 2024.<br>` +
                  `<span style="color:var(--text-3)">${pm25AnnualBand(v).label}. ` +
                  `India's annual limit is 40; the WHO guideline is 5. ` +
                  `A yearly average, not today's air.</span>`;
            L.popup({ maxWidth: 280 })
                .setLatLng(e.latlng)
                .setContent(`<div style="font-size:.85rem"><strong>${escapeHtml(where)}</strong>` +
                            `<div style="color:var(--text-3);font-size:.75rem;margin-bottom:.35rem">${cfg.label}</div>${body}</div>`)
                .openOn(map);
            L.DomEvent.stop(e);
        });
        boundaryLayer.addTo(map);
        const z = map.getZoom();
        boundaryNote(z < cfg.min
            ? `${cfg.note} — zoom in to zoom ${cfg.min}+ to see them.`
            : `${cfg.note}. Coloured by annual PM2.5; tap one for its figure.`);
        map.off('zoomend.boundary').on('zoomend.boundary', () => {
            if (!boundaryLevel) return;
            const c = BOUNDARY_LEVELS[boundaryLevel];
            boundaryNote(map.getZoom() < c.min
                ? `${c.note} — zoom in to zoom ${c.min}+ to see them.`
                : `${c.note}. Coloured by annual PM2.5; tap one for its figure.`);
        });
    };

    let villageGroup = null;
    // One shared canvas for every district. Leaflet canvases do their own
    // hit-testing and don't let clicks fall through to a canvas underneath, so
    // a renderer per district would make all but the topmost one unclickable.
    let villageRenderer = null;
    let villageIndex = null;
    let villageIndexPromise = null;
    let _topojsonPromise = null;
    const villageDistrictCache = {};
    const villageOnMap = new Set();
    let villageNoteControl = null;

    function ensureTopojson() {
        if (window.topojson && window.topojson.feature) return Promise.resolve();
        if (!_topojsonPromise) {
            _topojsonPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = '/assets/vendor/topojson-client.min.js';
                s.async = true;
                s.onload = resolve;
                s.onerror = (e) => { _topojsonPromise = null; reject(e); };
                document.head.appendChild(s);
            });
        }
        return _topojsonPromise;
    }

    function loadVillageIndex() {
        if (villageIndex) return Promise.resolve(villageIndex);
        if (!villageIndexPromise) {
            villageIndexPromise = fetch('/data/villages/_index.json')
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(j => { villageIndex = j; return j; })
                .catch(e => { villageIndexPromise = null; throw e; });
        }
        return villageIndexPromise;
    }

    function loadVillageDistrict(id) {
        if (!villageDistrictCache[id]) {
            // .json, not .topojson: Netlify keys compression off content-type,
            // and an unknown extension is served as uncompressed
            // application/octet-stream — 1.4 MB instead of ~350 KB brotli'd.
            villageDistrictCache[id] = fetch(`/data/villages/${id}.json`)
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(topo => {
                    const key = Object.keys(topo.objects)[0];
                    return topojson.feature(topo, topo.objects[key]);
                })
                .catch(e => { delete villageDistrictCache[id]; throw e; });
        }
        return villageDistrictCache[id];
    }

    let villageLegend = null;
    function villageLegendControl() {
        const ctl = L.control({ position: 'bottomright' });
        ctl.onAdd = function () {
            const d = L.DomUtil.create('div');
            const yr = (villageIndex && villageIndex._meta && villageIndex._meta.pm25Year) || 2024;
            d.style.cssText = 'background:rgba(255,255,255,0.93);border:1px solid #d1d5db;border-radius:8px;padding:6px 9px;font-size:0.68rem;line-height:1.7;color:#374151;box-shadow:0 2px 8px rgba(0,0,0,0.12);max-width:210px;';
            d.innerHTML = `<strong style="font-size:0.66rem;text-transform:uppercase;letter-spacing:0.04em;">Annual PM2.5 · ${yr}</strong><br>` +
                PM25_ANNUAL_BANDS.map((b, i) => {
                    const lo = i === 0 ? 0 : PM25_ANNUAL_BANDS[i - 1].max;
                    const range = b.max === Infinity ? `${lo}+` : `${lo}–${b.max}`;
                    return `<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${b.color};margin-right:5px;"></span>${range} µg/m³`;
                }).join('<br>') +
                '<div style="margin-top:5px;font-size:0.63rem;color:#6b7280;line-height:1.45;">Satellite-derived yearly average, not today\'s air. WHO guideline 5, India\'s limit 40.</div>';
            return d;
        };
        return ctl;
    }

    function villageNote(text) {
        if (!map) return;
        if (!villageNoteControl) {
            villageNoteControl = L.control({ position: 'bottomleft' });
            villageNoteControl.onAdd = function () {
                const d = L.DomUtil.create('div');
                d.id = 'village-note';
                d.style.cssText = 'background:rgba(255,255,255,0.92);border:1px solid #d1d5db;border-radius:8px;padding:5px 9px;font-size:0.68rem;color:#374151;box-shadow:0 2px 8px rgba(0,0,0,0.12);max-width:230px;';
                return d;
            };
            villageNoteControl.addTo(map);
        }
        const el = document.getElementById('village-note');
        if (el) el.innerHTML = text;
    }

    async function refreshVillages() {
        if (!villageGroup || !map) return;
        const z = map.getZoom();
        if (z < VILLAGE_MIN_ZOOM) {
            villageGroup.clearLayers();
            villageOnMap.clear();
            villageNote(`Zoom in to see village boundaries (zoom ${VILLAGE_MIN_ZOOM}+).`);
            return;
        }
        let idx;
        try { idx = await loadVillageIndex(); } catch (e) { villageNote('Could not load the village index.'); return; }
        const b = map.getBounds();
        const hits = Object.keys(idx).filter(id => {
            if (id.charAt(0) === '_') return false;   // _meta, not a district
            const bb = idx[id] && idx[id].b;          // [minLon, minLat, maxLon, maxLat]
            if (!bb) return false;
            return bb[0] <= b.getEast() && bb[2] >= b.getWest() &&
                   bb[1] <= b.getNorth() && bb[3] >= b.getSouth();
        });
        if (hits.length > VILLAGE_MAX_DISTRICTS) {
            villageNote(`${hits.length} districts in view — zoom in a little to load village boundaries.`);
            return;
        }
        // Drop districts that have panned out of view, so the layer stays light.
        villageOnMap.forEach(id => {
            if (!hits.includes(id)) {
                const lyr = villageDistrictCache[id + '__layer'];
                if (lyr) { try { villageGroup.removeLayer(lyr); } catch (e) {} delete villageDistrictCache[id + '__layer']; }
                villageOnMap.delete(id);
            }
        });
        const pending = hits.filter(id => !villageOnMap.has(id));
        if (!pending.length) {
            if (villageOnMap.size) villageNote(`Village boundaries · ${villageOnMap.size} district${villageOnMap.size > 1 ? 's' : ''} loaded`);
            return;
        }
        villageNote(`Loading villages for ${pending.length} district${pending.length > 1 ? 's' : ''}…`);
        try { await ensureTopojson(); } catch (e) { villageNote('Could not load the map decoder.'); return; }
        await Promise.all(pending.map(async (id) => {
            if (villageOnMap.has(id)) return;
            villageOnMap.add(id);   // claim before await, so a fast pan can't double-add
            try {
                const geo = await loadVillageDistrict(id);
                if (!villageGroup || !villageOnMap.has(id)) return;
                const lyr = L.geoJSON(geo, {
                    renderer: villageRenderer || (villageRenderer = L.canvas({ padding: 0.3 })),
                    attribution: 'Village boundaries: LGD via <a href="https://indianopenmaps.com" target="_blank" rel="noopener">indianopenmaps.com</a> · Annual PM2.5: <a href="https://registry.opendata.aws/surface-pm2-5-v6gl/" target="_blank" rel="noopener">SatPM2.5 V6GL03</a> (ACAG, WashU)',
                    // Coloured by ANNUAL satellite PM2.5 — a real per-village
                    // value. The live estimate stays out of the fill: it comes
                    // from city monitors and is usually absent out here.
                    style: (f) => {
                        const v = f.properties && f.properties.p;
                        if (typeof v !== 'number') {
                            return { weight: 0.5, color: '#0F766E', opacity: 0.75, fill: true, fillColor: '#14B8A6', fillOpacity: 0.06 };
                        }
                        return { weight: 0.4, color: '#334155', opacity: 0.55, fill: true, fillColor: pm25AnnualBand(v).color, fillOpacity: 0.62 };
                    },
                    onEachFeature: (f, l) => {
                        const p = f.properties || {};
                        l.on('click', (e) => {
                            const c = e.latlng;
                            const est = estimateAQIAt(c.lat, c.lng, VILLAGE_AQI_MAX_KM);
                            const yr = (villageIndex && villageIndex._meta && villageIndex._meta.pm25Year) || 2024;
                            let annual = '<div style="font-size:0.75rem; color:#888; margin-top:6px;">No annual estimate for this village.</div>';
                            if (typeof p.p === 'number') {
                                const b = pm25AnnualBand(p.p);
                                annual = `<div style="margin-top:6px;">
                                    <div style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.04em; color:#666;">Annual average · ${yr}</div>
                                    <div style="display:flex; align-items:baseline; gap:6px;">
                                        <span style="font-size:1.5rem; font-weight:700; color:${b.color};">${p.p}</span>
                                        <span style="font-size:0.75rem; color:#555;">µg/m³ · ${b.label}</span>
                                    </div>
                                    <div style="font-size:0.7rem; color:#777;">${(p.p / 5).toFixed(0)}× the WHO guideline of 5 · India's limit is 40</div>
                                </div>`;
                            }
                            L.popup({ maxWidth: 280 }).setLatLng(c).setContent(`<div style="min-width:210px;">
                                <strong style="font-size:0.95rem;">${p.n || 'Village'}</strong>
                                <div style="font-size:0.75rem; color:#555;">Village${p.d ? ' · ' + p.d : ''}${p.s ? ', ' + p.s : ''}</div>
                                ${annual}
                                <div style="border-top:1px solid #e5e7eb; margin-top:8px; padding-top:6px;">
                                    <div style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.04em; color:#666;">Right now</div>
                                    ${openmapsAqiChip(est)}
                                </div>
                                <div style="font-size:0.7rem; color:#777; margin-top:8px;">Two different things: the annual figure is satellite-derived for this village (~1 km); "right now" is inferred from the nearest city monitor, not measured here. A ~1 km satellite estimate also smooths hyperlocal sources, so a kiln or smelter next door won't show up in it.</div>
                            </div>`).openOn(map);
                        });
                    },
                });
                villageDistrictCache[id + '__layer'] = lyr;
                villageGroup.addLayer(lyr);
            } catch (e) {
                villageOnMap.delete(id);
            }
        }));
        villageNote(villageOnMap.size
            ? `Village boundaries · ${villageOnMap.size} district${villageOnMap.size > 1 ? 's' : ''} loaded`
            : 'No village data for this area.');
    }

    function toggleVillagesOverlay(on) {
        if (!map) return;
        if (!on) {
            if (villageGroup) { try { map.removeLayer(villageGroup); } catch (e) {} villageGroup = null; }
            villageRenderer = null;
            villageOnMap.clear();
            Object.keys(villageDistrictCache).forEach(k => { if (k.endsWith('__layer')) delete villageDistrictCache[k]; });
            map.off('moveend zoomend', refreshVillages);
            if (villageNoteControl) { try { map.removeControl(villageNoteControl); } catch (e) {} villageNoteControl = null; }
            if (villageLegend) { try { map.removeControl(villageLegend); } catch (e) {} villageLegend = null; }
            return;
        }
        if (villageGroup) return;
        villageGroup = L.layerGroup().addTo(map);
        map.on('moveend zoomend', refreshVillages);
        if (!villageLegend) { villageLegend = villageLegendControl(); villageLegend.addTo(map); }
        refreshVillages();
    }

    let mapSourcesLegend = null;
    function sourcesLegendControl() {
        const ctl = L.control({ position: 'bottomright' });
        ctl.onAdd = function () {
            const d = L.DomUtil.create('div');
            d.style.cssText = 'background:rgba(255,255,255,0.92);border:1px solid #d1d5db;border-radius:8px;padding:6px 9px;font-size:0.68rem;line-height:1.7;color:#374151;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
            d.innerHTML = '<strong style="font-size:0.66rem;text-transform:uppercase;letter-spacing:0.04em;">Pollution sources</strong><br>' +
                Object.values(OPENMAPS_SOURCE_TYPES).map(c =>
                    `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c.color};margin-right:5px;"></span>${c.label}`
                ).join('<br>');
            return d;
        };
        return ctl;
    }

    async function toggleOpenmapsOverlay(name, on) {
        const btn = document.getElementById(`map-toggle-${name}-btn`);
        if (!on) {
            if (openmapsOverlayLayers[name]) { try { map.removeLayer(openmapsOverlayLayers[name]); } catch (e) {} delete openmapsOverlayLayers[name]; }
            if (name === 'sources' && mapSourcesLegend) { try { map.removeControl(mapSourcesLegend); } catch (e) {} mapSourcesLegend = null; }
            return;
        }
        if (openmapsOverlayLayers[name]) return;
        if (btn) { btn.style.opacity = '0.55'; btn.disabled = true; }
        try {
            const layer = await OPENMAPS_OVERLAYS[name].build();
            // The user may have toggled off (or left the map) while we fetched.
            if (!map || !document.getElementById(`map-toggle-${name}-btn`)?.classList.contains('active')) return;
            layer.addTo(map);
            openmapsOverlayLayers[name] = layer;
            if (name === 'sources' && !mapSourcesLegend) { mapSourcesLegend = sourcesLegendControl(); mapSourcesLegend.addTo(map); }
        } catch (e) {
            console.warn('[JanVayu] overlay ' + name + ':', e);
            if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); }
        } finally {
            if (btn) { btn.style.opacity = ''; btn.disabled = false; }
        }
    }

    // Re-colour boundary overlays when fresh AQI readings arrive.
    function refreshOpenmapsOverlayColors() {
        ['constituencies', 'districts'].forEach(name => {
            const lyr = openmapsOverlayLayers[name];
            if (!lyr || !map || !map.hasLayer(lyr)) return;
            lyr.eachLayer(l => {
                const p = l.feature && l.feature.properties;
                if (!p) return;
                const est = estimateAQIAt(p.cy, p.cx);
                l.setStyle({ fillColor: est ? getAQIColor(est.aqi) : '#9CA3AF', fillOpacity: est ? 0.45 : 0.12 });
            });
        });
    }

    // Button-toggle wrapper: flips the .active style and aria-pressed,
    // then delegates to toggleMapLayer with the resulting on/off state.
    function toggleMapLayerBtn(btn, name) {
            const willBeOn = !btn.classList.contains('active');
            btn.classList.toggle('active', willBeOn);
            btn.setAttribute('aria-pressed', willBeOn ? 'true' : 'false');
            toggleMapLayer(name, willBeOn);
        }

    // ── Historical Time-Slider Overlay ──────────────────────────────
    // Cities that have historical-aqi climatology data (subset of CITIES)
    const HIST_CITIES = ['delhi','mumbai','kolkata','chennai','bangalore','hyderabad',
                         'lucknow','kanpur','patna','jaipur','pune','ahmedabad'];
    // Cache: histCache[city][month] = { city, month, years: [{ year, pm25 }] }
    const histCache = {};
    let histMarkerLayer = null;
    let histSliderActive = false;

    // Build month steps: Jan 2024 .. current month
    function buildHistMonthSteps() {
        const steps = [];
        const now = new Date();
        const endYear = now.getFullYear();
        const endMonth = now.getMonth() + 1; // 1-indexed
        for (let y = 2024; y <= endYear; y++) {
            const mEnd = (y === endYear) ? endMonth : 12;
            for (let m = 1; m <= mEnd; m++) {
                steps.push({ year: y, month: m });
            }
        }
        return steps;
    }

    const HIST_MONTH_STEPS = buildHistMonthSteps();
    const MONTH_NAMES = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function initTimeSlider() {
        const slider = document.getElementById('map-time-slider');
        if (!slider || HIST_MONTH_STEPS.length === 0) return;
        slider.max = HIST_MONTH_STEPS.length - 1;
        slider.value = HIST_MONTH_STEPS.length - 1;
        updateSliderLabel(HIST_MONTH_STEPS.length - 1);
    }

    function updateSliderLabel(idx) {
        const label = document.getElementById('map-ts-label');
        if (!label) return;
        const step = HIST_MONTH_STEPS[idx];
        if (step) label.textContent = MONTH_NAMES[step.month] + ' ' + step.year;
    }

    function toggleHistoricalSlider() {
        const btn = document.getElementById('map-toggle-history-btn');
        const bar = document.getElementById('map-time-slider-bar');
        if (!btn || !bar) return;
        const willBeOn = !btn.classList.contains('active');
        btn.classList.toggle('active', willBeOn);
        btn.setAttribute('aria-pressed', willBeOn ? 'true' : 'false');
        if (willBeOn) {
            bar.classList.add('visible');
            initTimeSlider();
            // Trigger load for current slider position
            const slider = document.getElementById('map-time-slider');
            if (slider) onTimeSliderChange(slider.value);
        } else {
            bar.classList.remove('visible');
            restoreLiveMapMarkers();
        }
    }

    function pm25Color(pm25) {
        if (pm25 == null) return '#9CA3AF';
        if (pm25 < 30) return '#22C55E';
        if (pm25 < 60) return '#EAB308';
        if (pm25 < 90) return '#F97316';
        if (pm25 < 150) return '#EF4444';
        return '#7C3AED';
    }

    function pm25Label(pm25) {
        if (pm25 == null) return 'No data';
        if (pm25 < 30) return 'Good';
        if (pm25 < 60) return 'Moderate';
        if (pm25 < 90) return 'Unhealthy (SG)';
        if (pm25 < 150) return 'Unhealthy';
        return 'Very Unhealthy';
    }
    // Text-legible variant of pm25Color for numbers shown on white popups.
    function pm25TextColor(pm25) {
        if (pm25 == null) return '#6B7280';
        if (pm25 < 30) return '#15803d';
        if (pm25 < 60) return '#a16207';
        if (pm25 < 90) return '#c2410c';
        if (pm25 < 150) return '#dc2626';
        return '#6d28d9';
    }

    async function fetchHistMonth(month) {
        // Fetch data for all HIST_CITIES for a given month (1-12), using cache
        const toFetch = [];
        for (const city of HIST_CITIES) {
            if (!histCache[city]) histCache[city] = {};
            if (!histCache[city][month]) toFetch.push(city);
        }
        if (toFetch.length > 0) {
            const results = await Promise.allSettled(
                toFetch.map(city =>
                    fetch(`/.netlify/functions/historical-aqi?city=${city}&month=${month}`)
                        .then(r => r.json())
                        .then(data => { histCache[city][month] = data; })
                )
            );
        }
    }

    async function onTimeSliderChange(idx) {
        idx = parseInt(idx);
        const step = HIST_MONTH_STEPS[idx];
        if (!step) return;
        updateSliderLabel(idx);

        // Mark live button as inactive
        const liveBtn = document.getElementById('map-ts-live-btn');
        if (liveBtn) liveBtn.classList.remove('active');
        histSliderActive = true;

        const loadingEl = document.getElementById('map-time-slider-loading');
        // Show loading only if we need to fetch
        let needsFetch = false;
        for (const city of HIST_CITIES) {
            if (!histCache[city] || !histCache[city][step.month]) { needsFetch = true; break; }
        }
        if (needsFetch && loadingEl) loadingEl.style.display = 'block';

        await fetchHistMonth(step.month);
        if (loadingEl) loadingEl.style.display = 'none';

        renderHistoricalMarkers(step.year, step.month);
    }

    function renderHistoricalMarkers(year, month) {
        if (!map) return;
        // Hide live markers and heatmap
        if (mapMarkerLayer && map.hasLayer(mapMarkerLayer)) map.removeLayer(mapMarkerLayer);
        if (mapHeatLayer && map.hasLayer(mapHeatLayer)) {
            try { map.removeLayer(mapHeatLayer); } catch(e) {}
            mapHeatLayer = null;
        }
        // Deactivate heatmap button visually
        const heatBtn = document.getElementById('map-toggle-heatmap-btn');
        if (heatBtn) { heatBtn.classList.remove('active'); heatBtn.setAttribute('aria-pressed','false'); }
        const markBtn = document.getElementById('map-toggle-markers-btn');
        if (markBtn) { markBtn.classList.remove('active'); markBtn.setAttribute('aria-pressed','false'); }

        // Create or clear historical layer
        if (!histMarkerLayer) histMarkerLayer = L.layerGroup();
        histMarkerLayer.clearLayers();
        histMarkerLayer.addTo(map);

        for (const cityKey of HIST_CITIES) {
            const city = CITIES[cityKey];
            if (!city || !city.lat) continue;
            const data = histCache[cityKey]?.[month];
            if (!data || !data.years) continue;
            const entry = data.years.find(y => y.year === year);
            const pm25 = entry?.pm25 ?? null;
            const color = pm25Color(pm25);
            const textColor = pm25TextColor(pm25); // legible on the white popup
            const label = pm25Label(pm25);
            const whoX = pm25 ? (pm25 / 5).toFixed(0) : null;
            const popupHtml = `
                <div style="min-width: 170px; font-family: var(--sans, system-ui);">
                    <strong style="font-size: 0.95rem;">${city.name}</strong>
                    <div style="font-size: 0.72rem; color: #888; margin-bottom: 4px;">${MONTH_NAMES[month]} ${year} (historical)</div>
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                        <span style="font-size: 1.6rem; font-weight: 700; color: ${textColor};">${pm25 != null ? pm25 : '?'}</span>
                        <span style="font-size: 0.78rem; color: ${textColor}; font-weight: 600;">PM2.5 &micro;g/m&sup3;</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #555;">${label}${whoX ? ' &middot; ' + whoX + '&times; WHO guideline' : ''}</div>
                    <div style="font-size: 0.65rem; color: #888; margin-top: 6px;">Source: CPCB/IQAir climatology</div>
                </div>`;
            const radius = pm25 != null ? Math.min(20, 8 + pm25 / 30) : 8;
            const marker = L.circleMarker([city.lat, city.lon], {
                radius: radius,
                fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.85
            }).addTo(histMarkerLayer).bindPopup(popupHtml);
            if (pm25 != null) {
                marker.bindTooltip(String(pm25), {
                    permanent: false, direction: 'top'
                });
            }
        }
    }

    function restoreLiveMapMarkers() {
        histSliderActive = false;
        const liveBtn = document.getElementById('map-ts-live-btn');
        if (liveBtn) liveBtn.classList.add('active');

        // Remove historical layer
        if (histMarkerLayer && map) {
            try { map.removeLayer(histMarkerLayer); } catch(e) {}
            histMarkerLayer.clearLayers();
        }

        // Restore live markers
        if (mapMarkerLayer && map && !map.hasLayer(mapMarkerLayer)) mapMarkerLayer.addTo(map);
        const markBtn = document.getElementById('map-toggle-markers-btn');
        if (markBtn) { markBtn.classList.add('active'); markBtn.setAttribute('aria-pressed','true'); }
    }

    function exportData(format) {
            const data = { timestamp: new Date().toISOString(), source: 'JanVayu / WAQI', cities: aqiData };
            let blob, url;
            if (format === 'json') {
                blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'janvayu-data.json'; a.click();
                URL.revokeObjectURL(url);
            } else if (format === 'csv') {
                let csv = 'City,AQI,PM2.5,PM10,Station,Time\n';
                Object.entries(aqiData).forEach(([city, d]) => { csv += `${CITIES[city]?.name || city},${d.aqi},${d.pm25 || ''},${d.pm10 || ''},"${d.station || ''}",${d.time || ''}\n`; });
                blob = new Blob([csv], { type: 'text/csv' });
                url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'janvayu-data.csv'; a.click();
                URL.revokeObjectURL(url);
            } else if (format === 'api') {
                alert('WAQI API:\nhttps://api.waqi.info/feed/{city}/?token=YOUR_TOKEN\n\nGet free token:\nhttps://aqicn.org/data-platform/token/');
            }
        }

    function generateWidget() {
            const city = document.getElementById('widget-city').value;
            const size = document.getElementById('widget-size').value;
            const dims = { small: ['220', '110'], medium: ['320', '160'], large: ['420', '210'] };
            document.getElementById('widget-code').style.display = 'block';
            document.getElementById('widget-code').textContent = `<iframe src="https://www.janvayu.in/embed/aqi/?city=${encodeURIComponent(city)}&theme=light" width="${dims[size][0]}" height="${dims[size][1]}" frameborder="0" style="border-radius:8px;border:0;" loading="lazy" title="Live AQI for ${city} — JanVayu"></iframe>`;
        }

    function copyRTI() {
        const el = document.getElementById('rti-template');
        if (el) { navigator.clipboard.writeText(el.textContent).then(() => alert('RTI template copied!')); }
    }

    // ── Global Timestamp (uses server-side feed-status for truth) ──
    async function updateGlobalTimestamp() {
        const el = document.getElementById('global-last-updated');
        const versionEl = document.querySelector('[data-auto-timestamp]');
        try {
            const res = await fetch('/.netlify/functions/feed-status', { signal: AbortSignal.timeout(4000) });
            const text = await res.text();
            if (text.startsWith('{')) {
                const data = JSON.parse(text);
                if (data.last_updated) {
                    const d = new Date(data.last_updated);
                    const timeStr = d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    if (el) el.textContent = 'Feeds last updated: ' + timeStr + ' (auto-updates every 4h)';
                    if (versionEl) versionEl.textContent = 'Server auto-refresh: ' + timeStr;
                    return;
                }
            }
        } catch (e) { /* fall through to client timestamp */ }
        // Fallback to client-side timestamp
        const now = new Date();
        const timeStr = now.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        if (el) el.textContent = 'Data last refreshed: ' + timeStr;
        if (versionEl) versionEl.textContent = 'Last auto-refresh: ' + timeStr;
    }

    // ── Dashboard Live News (auto-updating) ──
    async function loadDashboardLiveNews() {
        const container = document.getElementById('dashboard-live-news');
        if (!container) return;

        let articles = [];

        // Try news proxy first
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 5000);
            const res = await fetch('/.netlify/functions/news-proxy', { signal: controller.signal });
            const text = await res.text();
            if (text.startsWith('{')) {
                const data = JSON.parse(text);
                articles = (data.articles || []).slice(0, 6).map(a => ({
                    title: a.title, url: a.link, date: new Date(a.date), source: a.source || 'News'
                }));
            }
        } catch(e) {}

        // Supplement with Reddit
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 5000);
            const res = await fetch('/.netlify/functions/reddit-feed', { signal: controller.signal });
            const text = await res.text();
            if (text.startsWith('{')) {
                const data = JSON.parse(text);
                articles = articles.concat((data.posts || []).slice(0, 4).map(p => ({
                    title: p.title, url: p.url, date: new Date(p.created), source: 'r/' + p.sub
                })));
            }
        } catch(e) {}

        // Direct Reddit fallback
        if (articles.length === 0) {
            try {
                const posts = await fetchRedditPosts('india', 'air pollution OR AQI', 5);
                articles = posts.map(p => ({ title: p.title, url: p.url, date: p.created, source: 'r/' + p.sub }));
            } catch(e) {}
        }

        // Sort by date
        articles.sort((a, b) => (b.date || 0) - (a.date || 0));

        // Deduplicate
        const seen = new Set();
        articles = articles.filter(a => {
            const key = (a.title || '').substring(0, 40).toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (articles.length === 0) {
            // Hardcoded fallback
            container.innerHTML = `
                <div style="padding: 6px 0; border-bottom: 1px solid var(--border-light);"><span class="badge badge-danger">2026</span><span style="margin-left: 6px;">0% of Delhi's days met WHO safe air limits</span></div>
                <div style="padding: 6px 0; border-bottom: 1px solid var(--border-light);"><span class="badge badge-warning">2026</span><span style="margin-left: 6px;">CREA: 204/238 cities exceed NAAQS for PM2.5</span></div>
                <div style="padding: 6px 0;"><span class="badge badge-info">2026</span><span style="margin-left: 6px;">Delhi spent only 43% of ₹300 Cr pollution budget</span></div>`;
            return;
        }

        container.innerHTML = articles.slice(0, 5).map((a, i) => {
            const timeAgo = getTimeAgo(a.date);
            const badges = ['badge-danger', 'badge-warning', 'badge-info', 'badge-success'];
            return `<div style="padding: 6px 0;${i < articles.length - 1 ? ' border-bottom: 1px solid var(--border-light);' : ''}">
                <a href="${a.url}" target="_blank" rel="noopener" style="color: var(--text); text-decoration: none; font-size: 0.8rem; font-weight: 500;">${escapeHtml((a.title || '').substring(0, 80))}${(a.title||'').length > 80 ? '...' : ''}</a>
                <div style="font-size: 0.65rem; color: var(--text-3); margin-top: 2px;">${escapeHtml(a.source || '')} · ${timeAgo}</div>
            </div>`;
        }).join('');
    }

    // ── Voices Live Feed (auto-updating citizen voices) ──
    async function loadVoicesLive(filter = 'all') {
        const container = document.getElementById('voices-live-feed');
        const timeEl = document.getElementById('voices-live-time');
        if (!container) return;

        let posts = [];

        // Fetch Reddit via proxy (with fallback)
        if (filter === 'all' || filter === 'reddit') {
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 5000);
                const res = await fetch('/.netlify/functions/reddit-feed', { signal: controller.signal });
                const text = await res.text();
                if (text.startsWith('{')) {
                    const data = JSON.parse(text);
                    posts = posts.concat((data.posts || []).map(p => ({
                        platform: 'reddit', title: p.title, url: p.url, author: p.author,
                        created: new Date(p.created), text: p.text || '', score: p.score,
                        comments: p.comments, sub: p.sub
                    })));
                }
            } catch(e) {}
            // Direct Reddit fallback
            if (posts.length === 0) {
                try {
                    const results = await Promise.allSettled(REDDIT_SUBS.map(s => fetchRedditPosts(s.sub, s.query, 8)));
                    posts = posts.concat(results.filter(r => r.status === 'fulfilled').flatMap(r => r.value));
                } catch(e) {}
            }
        }

        // Twitter via proxy
        if (filter === 'all' || filter === 'twitter') {
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 4000);
                const res = await fetch('/.netlify/functions/twitter-feed', { signal: controller.signal });
                const text = await res.text();
                if (text.startsWith('{')) {
                    const data = JSON.parse(text);
                    posts = posts.concat((data.posts || []).map(p => ({
                        platform: 'twitter', title: p.text, url: p.link,
                        created: new Date(p.date), author: p.author, text: p.description?.substring(0, 200) || ''
                    })));
                }
            } catch(e) {}
            // Always add curated links as fallback
            if (!posts.some(p => p.platform === 'twitter')) {
                posts = posts.concat(getCuratedTwitterPosts());
            }
        }

        // News via proxy
        if (filter === 'all' || filter === 'news') {
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 4000);
                const res = await fetch('/.netlify/functions/news-proxy', { signal: controller.signal });
                const text = await res.text();
                if (text.startsWith('{')) {
                    const data = JSON.parse(text);
                    posts = posts.concat((data.articles || []).slice(0, 10).map(a => ({
                        platform: 'news', title: a.title, url: a.link,
                        created: new Date(a.date), author: a.source, text: a.snippet || ''
                    })));
                }
            } catch(e) {}
        }

        // Sort and deduplicate
        posts.sort((a, b) => (b.created || 0) - (a.created || 0));
        const seen = new Set();
        posts = posts.filter(p => {
            const key = (p.title || '').substring(0, 50);
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (posts.length === 0) {
            // No live or curated content available — hide the card entirely
            // so users go straight to the curated highlights below.
            const card = document.getElementById('voices-live-card');
            if (card) { card.style.display = 'none'; return; }
            container.innerHTML = '<div style="text-align: center; padding: 1.5rem; color: var(--text-3); font-size: 0.85rem;">No live posts available right now. Curated highlights are shown below.</div>';
        } else {
            const platformColors = { reddit: '#FF4500', twitter: '#1D9BF0', instagram: '#E4405F', news: '#16A34A' };
            const platformLabels = { reddit: 'Reddit', twitter: 'X / Twitter', instagram: 'Instagram', news: 'News' };
            container.innerHTML = posts.slice(0, 20).map(p => {
                const color = platformColors[p.platform] || '#666';
                const timeAgo = getTimeAgo(p.created);
                return `<div style="padding: 0.75rem; border-bottom: 1px solid var(--border-light); display: flex; gap: 0.75rem;">
                    <div style="flex-shrink: 0;">
                        <span style="display: inline-block; background: ${color}; color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 3px; font-weight: 600;">${platformLabels[p.platform] || p.platform}</span>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <a href="${p.url}" target="_blank" rel="noopener" style="font-size: 0.85rem; font-weight: 600; color: var(--text); text-decoration: none; display: block; margin-bottom: 0.15rem;">${escapeHtml(p.title || '')}</a>
                        ${p.text ? `<div style="font-size: 0.75rem; color: var(--text-2); margin-bottom: 0.15rem;">${escapeHtml((p.text || '').substring(0, 120))}${(p.text||'').length > 120 ? '...' : ''}</div>` : ''}
                        <div style="font-size: 0.65rem; color: var(--text-3);">${p.author ? 'by ' + escapeHtml(p.author) + ' · ' : ''}${timeAgo}${p.score ? ' · ▲' + p.score : ''}${p.comments ? ' · ' + p.comments + ' comments' : ''}</div>
                    </div>
                </div>`;
            }).join('');
        }

        if (timeEl) timeEl.textContent = 'Updated: ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    // Auto-refresh voices live feed every 15 minutes
    let voicesRefreshInterval = null;

    // ── Social Media Feed (Free APIs) ──
    const SOCIAL_CACHE = { reddit: null, lastFetch: 0 };

    // Force-refresh: bust the client cache, also clear the news cache, and
    // re-pull from the server-side feed proxies.
    async function refreshSocialFeed() {
        const btns = document.querySelectorAll('#social-feed-container').length
            ? document.querySelectorAll('button.btn-sm') : [];
        const time = document.getElementById('social-feed-time');
        if (time) time.textContent = 'Refreshing…';
        SOCIAL_CACHE.reddit = null;
        SOCIAL_CACHE.lastFetch = 0;
        try { newsCache.lastFetch = 0; } catch (e) {}
        await loadSocialFeed('all');
        // also refresh the dashboard's "Latest Updates" panel
        try { loadDashboardLiveNews(); } catch (e) {}
    }
    const REDDIT_SUBS = [
        { sub: 'india', query: 'air pollution OR AQI OR smog OR PM2.5' },
        { sub: 'delhi', query: 'pollution OR AQI OR smog OR air quality' },
        { sub: 'indianews', query: 'air pollution OR NCAP OR AQI' }
    ];

    async function fetchRedditPosts(sub, query, limit = 10) {
        try {
            const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(query)}&sort=new&restrict_sr=on&limit=${limit}&t=month`;
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return (data.data?.children || []).map(c => ({
                platform: 'reddit',
                sub: sub,
                title: c.data.title,
                author: c.data.author,
                url: `https://reddit.com${c.data.permalink}`,
                score: c.data.score,
                comments: c.data.num_comments,
                created: new Date(c.data.created_utc * 1000),
                text: c.data.selftext?.substring(0, 200) || '',
                thumbnail: c.data.thumbnail && c.data.thumbnail.startsWith('http') ? c.data.thumbnail : null
            }));
        } catch (e) {
            console.warn(`[JanVayu] Reddit r/${sub}:`, e.message);
            return [];
        }
    }

    async function loadSocialFeed(filter = 'all') {
        const container = document.getElementById('social-feed-container');
        if (!container) return;

        // Immediately show curated content, then try to enhance with live data
        let posts = [];
        if (filter === 'all' || filter === 'twitter') posts = posts.concat(getCuratedTwitterPosts());
        if (filter === 'all' || filter === 'instagram') posts = posts.concat(getCuratedInstagramPosts());

        // Show curated content immediately so users see something
        if (posts.length > 0) {
            container.innerHTML = posts.map(p => renderSocialCard(p)).join('') +
                '<div style="color: var(--text-3); font-size: 0.75rem; grid-column: 1/-1; text-align: center; padding: 0.5rem;">Loading live posts from Reddit...</div>';
        } else {
            container.innerHTML = '<div style="color: var(--text-3); font-size: 0.85rem; grid-column: 1/-1; text-align: center; padding: 2rem;">Fetching live posts...</div>';
        }

        const now = Date.now();

        // Fetch Reddit (proxy first, then direct fallback) — in background
        if (filter === 'all' || filter === 'reddit' || filter === 'news') {
            if (!SOCIAL_CACHE.reddit || now - SOCIAL_CACHE.lastFetch > 15 * 60 * 1000) {
                let redditPosts = [];
                // Try proxy
                try {
                    const controller = new AbortController();
                    setTimeout(() => controller.abort(), 5000);
                    const rRes = await fetch('/.netlify/functions/reddit-feed', { signal: controller.signal });
                    const rText = await rRes.text();
                    if (rText.startsWith('{') || rText.startsWith('[')) {
                        const rData = JSON.parse(rText);
                        redditPosts = (rData.posts || []).map(p => ({ ...p, created: new Date(p.created) }));
                    }
                } catch(e) {}
                // If proxy failed, try direct Reddit
                if (redditPosts.length === 0) {
                    try {
                        const results = await Promise.allSettled(REDDIT_SUBS.map(s => fetchRedditPosts(s.sub, s.query)));
                        redditPosts = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
                    } catch(e) {}
                }
                SOCIAL_CACHE.reddit = redditPosts;
                SOCIAL_CACHE.lastFetch = now;
            }
            posts = posts.concat(SOCIAL_CACHE.reddit);
        }

        // Try Netlify Functions for Twitter/Instagram/News (with timeout, non-blocking)
        const proxyFetches = [];
        if (filter === 'all' || filter === 'twitter') {
            proxyFetches.push(
                fetch('/.netlify/functions/twitter-feed', { signal: AbortSignal.timeout(4000) })
                    .then(r => r.text())
                    .then(t => { if (t.startsWith('{')) { const d = JSON.parse(t); return (d.posts||[]).map(p => ({ platform:'twitter', title:p.text, url:p.link, created:new Date(p.date), author:p.author, text:p.description?.substring(0,200)||'' })); } return []; })
                    .catch(() => [])
            );
        }
        if (filter === 'all' || filter === 'instagram') {
            proxyFetches.push(
                fetch('/.netlify/functions/instagram-feed', { signal: AbortSignal.timeout(4000) })
                    .then(r => r.text())
                    .then(t => { if (t.startsWith('{')) { const d = JSON.parse(t); return (d.posts||[]).map(p => ({ platform:'instagram', title:p.title||p.content?.substring(0,80), url:p.link, created:new Date(p.date), author:p.author, text:p.content?.substring(0,200)||'' })); } return []; })
                    .catch(() => [])
            );
        }
        if (filter === 'all' || filter === 'youtube') {
            proxyFetches.push(
                fetch('/.netlify/functions/youtube-feed', { signal: AbortSignal.timeout(4000) })
                    .then(r => r.text())
                    .then(t => { if (t.startsWith('{')) { const d = JSON.parse(t); return (d.videos||[]).slice(0,10).map(v => ({ platform:'youtube', title:v.title, url:v.url, created:v.upload_date ? new Date(v.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) : new Date(), author:v.channel, text:v.description?.substring(0,200)||'', thumbnail:v.thumbnail, view_count:v.view_count, duration:v.duration })); } return []; })
                    .catch(() => [])
            );
        }
        if (filter === 'all' || filter === 'news') {
            proxyFetches.push(
                fetch('/.netlify/functions/news-proxy', { signal: AbortSignal.timeout(4000) })
                    .then(r => r.text())
                    .then(t => { if (t.startsWith('{')) { const d = JSON.parse(t); return (d.articles||[]).slice(0,10).map(a => ({ platform:'news', title:a.title, url:a.link, created:new Date(a.date), author:a.source, text:a.snippet||'' })); } return []; })
                    .catch(() => [])
            );
        }

        // Wait for all proxy fetches (max 4s)
        if (proxyFetches.length > 0) {
            const results = await Promise.allSettled(proxyFetches);
            results.forEach(r => { if (r.status === 'fulfilled' && r.value.length > 0) posts = posts.concat(r.value); });
        }

        // Sort by date, deduplicate
        posts.sort((a, b) => (b.created || 0) - (a.created || 0));
        const seen = new Set();
        posts = posts.filter(p => {
            const key = p.title?.substring(0, 50) || p.url;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // Render final results
        if (posts.length === 0) {
            container.innerHTML = '<div style="color: var(--text-3); font-size: 0.85rem; grid-column: 1/-1; text-align: center; padding: 2rem;">No posts found. APIs may be temporarily unavailable. Try refreshing in a few minutes.</div>';
            return;
        }

        container.innerHTML = posts.slice(0, 30).map(p => renderSocialCard(p)).join('');
        const timeEl = document.getElementById('social-feed-time');
        if (timeEl) timeEl.textContent = 'Updated: ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    function renderSocialCard(post) {
        const platformColors = { reddit: '#FF4500', twitter: '#1DA1F2', instagram: '#E4405F', youtube: '#FF0000', news: '#333' };
        const platformLabels = { reddit: 'Reddit', twitter: 'X / Twitter', instagram: 'Instagram', youtube: 'YouTube', news: 'News' };
        const color = platformColors[post.platform] || '#666';
        const timeAgo = getTimeAgo(post.created);
        const scoreHtml = post.score ? `<span style="margin-right:0.5rem;">▲ ${post.score}</span>` : '';
        const commentsHtml = post.comments ? `<span>${post.comments} comments</span>` : '';
        const viewsHtml = post.view_count ? `<span style="margin-right:0.5rem;">👁 ${post.view_count.toLocaleString()}</span>` : '';
        const durationHtml = post.duration ? `<span>${Math.floor(post.duration/60)}:${String(post.duration%60).padStart(2,'0')}</span>` : '';
        const thumbnailHtml = (post.platform === 'youtube' && post.thumbnail) ? `<img src="${post.thumbnail}" alt="" style="width:100%;max-height:140px;object-fit:cover;border-radius:4px;margin-bottom:0.5rem;" loading="lazy">` : '';

        return `<div class="card" style="border-left: 3px solid ${color};">
            <div class="card-body" style="padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: ${color}; color: white; font-size: 0.65rem;">${platformLabels[post.platform] || post.platform}</span>
                    <span style="font-size: 0.7rem; color: var(--text-3);">${timeAgo}</span>
                </div>
                ${thumbnailHtml}
                ${post.sub ? `<div style="font-size: 0.7rem; color: var(--text-3); margin-bottom: 0.25rem;">r/${post.sub}</div>` : ''}
                <a href="${post.url}" target="_blank" rel="noopener" style="font-size: 0.85rem; font-weight: 600; color: var(--text); text-decoration: none; display: block; margin-bottom: 0.25rem;">${escapeHtml(post.title || '')}</a>
                ${post.text ? `<p style="font-size: 0.75rem; color: var(--text-2); margin: 0.25rem 0;">${escapeHtml(post.text.substring(0, 150))}${post.text.length > 150 ? '...' : ''}</p>` : ''}
                ${post.author ? `<div style="font-size: 0.7rem; color: var(--text-3); margin-top: 0.5rem;">by ${escapeHtml(post.author)} ${scoreHtml}${commentsHtml}${viewsHtml}${durationHtml}</div>` : ''}
            </div>
        </div>`;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getTimeAgo(date) {
        const seconds = Math.floor((Date.now() - date) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }

    function getCuratedTwitterPosts() {
        return [
            { platform: 'twitter', title: 'Search #DelhiAirPollution on X', url: 'https://x.com/search?q=%23DelhiAirPollution&f=live', created: new Date(), text: 'Live search results for Delhi air pollution discussions on X/Twitter. Click to see the latest posts.' },
            { platform: 'twitter', title: 'Search #DelhiSmog on X', url: 'https://x.com/search?q=%23DelhiSmog&f=live', created: new Date(), text: 'Trending discussions about Delhi smog and air quality crisis.' },
            { platform: 'twitter', title: 'Search #AirPollutionIndia on X', url: 'https://x.com/search?q=%23AirPollutionIndia&f=live', created: new Date(), text: 'Pan-India air pollution discussions, policy debates, and citizen reports.' },
            { platform: 'twitter', title: '@ABOROMOHANTY (CSE)', url: 'https://x.com/ABOROMOHANTY', created: new Date(), text: 'Anumita Roychowdhury, CSE — leading air quality researcher and policy advocate.' },
            { platform: 'twitter', title: '@suaboromohanty (CREA)', url: 'https://x.com/SunilDahiya16', created: new Date(), text: 'Sunil Dahiya, CREA analyst — data-driven air quality analysis.' }
        ];
    }

    function getCuratedInstagramPosts() {
        return [
            { platform: 'instagram', title: '#DelhiPollution on Instagram', url: 'https://www.instagram.com/explore/tags/delhipollution/', created: new Date(), text: 'Visual stories and citizen reports of Delhi air pollution. Photos from the ground.' },
            { platform: 'instagram', title: '#DelhiSmog on Instagram', url: 'https://www.instagram.com/explore/tags/delhismog/', created: new Date(), text: 'Smog visuals, before/after comparisons, and air quality awareness posts.' },
            { platform: 'instagram', title: '#AirQualityIndia on Instagram', url: 'https://www.instagram.com/explore/tags/airqualityindia/', created: new Date(), text: 'National conversation on air quality — infographics, awareness campaigns.' },
            { platform: 'instagram', title: 'Warrior Moms India', url: 'https://www.instagram.com/warriormomsin/', created: new Date(), text: 'Mothers fighting for clean air — campaigning for children\'s right to breathe.' }
        ];
    }

    // ── Live News Feed ──
    let newsCache = { articles: null, lastFetch: 0 };

    async function loadNewsFilter(filter = 'all') {
        const container = document.getElementById('news-feed-container');
        if (!container) return;
        container.innerHTML = '<div style="color: var(--text-3); font-size: 0.85rem; text-align: center; padding: 2rem;">Fetching news...</div>';

        const now = Date.now();
        if (!newsCache.articles || now - newsCache.lastFetch > 30 * 60 * 1000) {
            // Try Google News via Netlify proxy first, fallback to Reddit
            let proxyArticles = [];
            try {
                const nRes = await fetch('/.netlify/functions/news-proxy');
                if (nRes.ok) {
                    const nData = await nRes.json();
                    proxyArticles = (nData.articles || []).map(a => ({
                        platform: 'news', title: a.title, url: a.link,
                        created: new Date(a.date), author: a.source, text: a.snippet || '',
                        sub: a.category, score: 0, comments: 0
                    }));
                }
            } catch(e) {}
            // Also fetch from Reddit proxy as supplementary
            let redditNews = [];
            try {
                const rRes = await fetch('/.netlify/functions/reddit-feed?filter=all');
                if (rRes.ok) {
                    const rData = await rRes.json();
                    redditNews = (rData.posts || []).map(p => ({
                        ...p, platform: 'news', created: new Date(p.created)
                    }));
                } else { throw new Error('proxy'); }
            } catch(e) {
                // Fallback to direct Reddit
                const allNews = await Promise.all([
                    fetchRedditPosts('india', 'air pollution OR AQI OR smog OR NCAP OR CPCB', 15),
                    fetchRedditPosts('indianews', 'pollution OR air quality OR PM2.5', 10),
                    fetchRedditPosts('environment', 'India air pollution', 5)
                ]);
                redditNews = allNews.flat().map(p => ({ ...p, platform: 'news' }));
            }
            newsCache.articles = [...proxyArticles, ...redditNews];
            newsCache.lastFetch = now;
        }

        let articles = [...newsCache.articles];
        if (filter === 'india') articles = articles.filter(a => /india|indian|mumbai|kolkata|chennai|bangalore|hyderabad|lucknow|patna|national|cpcb/i.test(a.title + a.text));
        else if (filter === 'delhi') articles = articles.filter(a => /delhi|ncr|gurgaon|noida|faridabad|ghaziabad/i.test(a.title + a.text));
        else if (filter === 'policy') articles = articles.filter(a => /ncap|policy|government|cpcb|caqm|grap|regulation|law|court|ngt/i.test(a.title + a.text));
        else if (filter === 'health') articles = articles.filter(a => /health|death|hospital|lung|asthma|cancer|children|disease/i.test(a.title + a.text));

        articles.sort((a, b) => b.created - a.created);

        if (articles.length === 0) {
            container.innerHTML = '<div style="color: var(--text-3); font-size: 0.85rem; text-align: center; padding: 2rem;">No matching articles found.</div>';
            return;
        }

        container.innerHTML = '<div class="grid-1" style="gap: 0.75rem;">' + articles.slice(0, 20).map(a => {
            const timeAgo = getTimeAgo(a.created);
            return `<div class="card" style="border-left: 3px solid var(--green-600);">
                <div class="card-body" style="padding: 0.75rem 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <a href="${a.url}" target="_blank" rel="noopener" style="font-size: 0.85rem; font-weight: 600; color: var(--text); text-decoration: none; flex: 1;">${escapeHtml(a.title)}</a>
                        <span style="font-size: 0.7rem; color: var(--text-3); margin-left: 1rem; white-space: nowrap;">${timeAgo}</span>
                    </div>
                    ${a.text ? `<p style="font-size: 0.75rem; color: var(--text-2); margin: 0.25rem 0 0;">${escapeHtml(a.text.substring(0, 120))}${a.text.length > 120 ? '...' : ''}</p>` : ''}
                    <div style="font-size: 0.7rem; color: var(--text-3); margin-top: 0.25rem;">${a.author ? a.author : (a.sub ? 'r/' + a.sub : 'News')}${a.score ? ' · ▲ ' + a.score : ''}${a.comments ? ' · ' + a.comments + ' comments' : ''}</div>
                </div>
            </div>`;
        }).join('') + '</div>';

        const timeEl = document.getElementById('news-feed-time');
        if (timeEl) timeEl.textContent = 'Updated: ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    // ── AQI Alerts ──
    let alertConfig = JSON.parse(localStorage.getItem('janvayu_alerts') || '[]');

    function setupAQIAlerts() {
        if (!('Notification' in window)) {
            document.getElementById('alert-status').innerHTML = '<span style="color: var(--red);">Your browser does not support notifications.</span>';
            return;
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const city = document.getElementById('alert-city').value;
                const threshold = parseInt(document.getElementById('alert-threshold').value);
                const existing = alertConfig.findIndex(a => a.city === city);
                if (existing >= 0) alertConfig[existing].threshold = threshold;
                else alertConfig.push({ city, threshold });
                localStorage.setItem('janvayu_alerts', JSON.stringify(alertConfig));
                document.getElementById('alert-status').innerHTML = `<span style="color: var(--green-600);">Alert set for ${CITIES[city]?.name} when AQI > ${threshold}</span>`;
                renderActiveAlerts();
            } else {
                document.getElementById('alert-status').innerHTML = '<span style="color: var(--red);">Notification permission denied. Please enable in browser settings.</span>';
            }
        });
    }

    // ── Web Push (v26.6.49): real server-sent alerts, delivered even when the
    // site is closed. Public VAPID key is safe to embed; the private key lives
    // only in Netlify env and is used server-side by push-send/push-subscribe.
    const VAPID_PUBLIC_KEY = 'BAI92uOpAQNbycU5FT9-lfVubDG4Gd9K2DCAtVbG_uV-Qk22TWiuf5pjEjecUP5Syuk3CvX6lUCWBJu_URXQxUM';
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        const out = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
        return out;
    }
    async function getPushSubscription() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
        const reg = await navigator.serviceWorker.ready;
        return reg.pushManager.getSubscription();
    }
    function setAlertStatus(html) {
        const el = document.getElementById('alert-status');
        if (el) el.innerHTML = html;
    }
    async function enablePushNotifications() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setAlertStatus('<span style="color:var(--red);">This browser doesn\'t support push notifications.</span>'); return;
        }
        try {
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') { setAlertStatus('<span style="color:var(--red);">Permission denied. Enable notifications in your browser settings.</span>'); return; }
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
            const city = document.getElementById('alert-city')?.value || 'delhi';
            const threshold = parseInt(document.getElementById('alert-threshold')?.value || '200', 10);
            const res = await fetch('/.netlify/functions/push-subscribe', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'subscribe', subscription: sub, city, threshold }),
            });
            const data = await res.json();
            if (data.ok) setAlertStatus(`<span style="color:var(--green-600);">Push on for ${CITIES[city]?.name || city} when AQI &gt; ${threshold}. You'll be alerted even when this tab is closed &mdash; try "Send test".</span>`);
            else setAlertStatus('<span style="color:var(--red);">Could not save your subscription. Try again.</span>');
        } catch (e) { setAlertStatus('<span style="color:var(--red);">Push setup failed: ' + e.message + '</span>'); }
    }
    async function sendTestPush() {
        try {
            const sub = await getPushSubscription();
            if (!sub) { setAlertStatus('<span style="color:var(--red);">Enable push first, then send a test.</span>'); return; }
            setAlertStatus('<span style="color:var(--text-3);">Sending test&hellip;</span>');
            const res = await fetch('/.netlify/functions/push-subscribe', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'test', subscription: sub }),
            });
            const data = await res.json();
            setAlertStatus(data.ok ? '<span style="color:var(--green-600);">Test sent &mdash; check your notifications.</span>' : '<span style="color:var(--red);">Test failed: ' + (data.error || '') + '</span>');
        } catch (e) { setAlertStatus('<span style="color:var(--red);">Test failed: ' + e.message + '</span>'); }
    }
    async function disablePushNotifications() {
        try {
            const sub = await getPushSubscription();
            if (sub) {
                await fetch('/.netlify/functions/push-subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'unsubscribe', subscription: sub }) });
                await sub.unsubscribe();
            }
            setAlertStatus('<span style="color:var(--text-3);">Push notifications turned off.</span>');
        } catch (e) { setAlertStatus('<span style="color:var(--red);">Could not turn off: ' + e.message + '</span>'); }
    }
    window.enablePushNotifications = enablePushNotifications;
    window.sendTestPush = sendTestPush;
    window.disablePushNotifications = disablePushNotifications;

    function renderActiveAlerts() {
        const el = document.getElementById('active-alerts');
        if (!el) return;
        if (alertConfig.length === 0) {
            el.innerHTML = '<p style="color: var(--text-3);">No alerts configured.</p>';
            return;
        }
        el.innerHTML = alertConfig.map((a, i) => {
            const data = aqiData[a.city];
            const currentAQI = data?.aqi || '?';
            const triggered = data && data.aqi > a.threshold;
            return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-light);">
                <div>
                    <strong>${CITIES[a.city]?.name}</strong> — AQI > ${a.threshold}
                    <div style="font-size: 0.75rem; color: ${triggered ? 'var(--red)' : 'var(--green-600)'};">Current: ${currentAQI} ${triggered ? '⚠ TRIGGERED' : '✓ OK'}</div>
                </div>
                <button class="btn btn-sm" onclick="removeAlert(${i})" style="font-size: 0.7rem;">Remove</button>
            </div>`;
        }).join('');
    }

    function removeAlert(index) {
        alertConfig.splice(index, 1);
        localStorage.setItem('janvayu_alerts', JSON.stringify(alertConfig));
        renderActiveAlerts();
    }

    // ── Email Subscription ──
    async function subscribeEmail() {
        const email = document.getElementById('subscribe-email')?.value?.trim();
        const statusEl = document.getElementById('subscribe-status');
        if (!email || !email.includes('@')) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--red);">Please enter a valid email.</span>';
            return;
        }
        const checkboxes = document.querySelectorAll('#subscribe-cities input[type="checkbox"]:checked');
        const cities = Array.from(checkboxes).map(cb => cb.value);
        if (cities.length === 0) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--red);">Select at least one city.</span>';
            return;
        }
        const threshold = parseInt(document.getElementById('subscribe-threshold')?.value || '200');
        if (statusEl) statusEl.innerHTML = '<span style="color: var(--text-3);">Subscribing...</span>';
        try {
            const res = await fetch('/.netlify/functions/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cities, threshold }),
            });
            const text = await res.text();
            if (text.startsWith('{')) {
                const data = JSON.parse(text);
                if (data.ok) {
                    statusEl.innerHTML = '<span style="color: var(--green-600);">' + data.message + '</span>';
                } else {
                    statusEl.innerHTML = '<span style="color: var(--red);">' + (data.error || 'Failed') + '</span>';
                }
            } else {
                statusEl.innerHTML = '<span style="color: var(--red);">Service unavailable. Try again later.</span>';
            }
        } catch (e) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--red);">Network error. Try again later.</span>';
        }
    }

    async function unsubscribeEmail() {
        const email = document.getElementById('unsubscribe-email')?.value?.trim();
        const statusEl = document.getElementById('unsubscribe-status');
        if (!email || !email.includes('@')) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--red);">Please enter your email.</span>';
            return;
        }
        try {
            const res = await fetch('/.netlify/functions/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, action: 'unsubscribe' }),
            });
            const text = await res.text();
            if (text.startsWith('{')) {
                const data = JSON.parse(text);
                if (statusEl) statusEl.innerHTML = '<span style="color: var(--green-600);">' + (data.message || 'Unsubscribed') + '</span>';
            }
        } catch (e) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--red);">Network error.</span>';
        }
    }

    function checkAlerts() {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        alertConfig.forEach(a => {
            const data = aqiData[a.city];
            if (data && data.aqi > a.threshold) {
                new Notification(`JanVayu Alert: ${CITIES[a.city]?.name}`, {
                    body: `AQI is ${data.aqi} (threshold: ${a.threshold}). PM2.5: ${data.pm25 || 'N/A'}. Take precautions.`,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌫</text></svg>',
                    tag: `janvayu-${a.city}`
                });
            }
        });
        renderAlertCityStatus();
    }

    function renderAlertCityStatus() {
        const el = document.getElementById('alert-city-status');
        if (!el) return;
        const cities = ['delhi', 'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad', 'lucknow', 'patna'];
        el.innerHTML = cities.map(c => {
            const data = aqiData[c];
            const aqi = data?.aqi || '?';
            const color = data ? getAQIColor(data.aqi) : '#ccc';
            return `<div class="card" style="padding: 0.75rem; text-align: center;">
                <div style="font-size: 0.75rem; font-weight: 600;">${CITIES[c]?.name}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${color};">${aqi}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">${data ? getAQILabel(data.aqi) : 'No data'}</div>
            </div>`;
        }).join('');
    }

    // ── Should I Go Outside? ──
    function checkGoOutside() {
        const cityKey = document.getElementById('outside-city')?.value;
        if (!cityKey) return;
        const data = aqiData[cityKey];
        const activity = document.getElementById('outside-activity').value;
        const duration = parseInt(document.getElementById('outside-duration').value);
        const health = document.getElementById('outside-health').value;
        const resultEl = document.getElementById('outside-result');
        const detailsEl = document.getElementById('outside-details');

        if (!data) {
            resultEl.innerHTML = '<p style="color: var(--text-3);">No data available for this city yet. Wait for data to load.</p>';
            return;
        }

        const aqi = data.aqi;
        const pm25 = data.pm25 || Math.round(aqi * 0.7);

        // Risk multipliers
        const activityMult = { commute: 1, walk: 1.5, jog: 3, cycle: 2.5, kids: 2, construction: 4 };
        const healthMult = { healthy: 1, child: 2, elderly: 1.8, respiratory: 3, cardiac: 2.5, pregnant: 2 };
        const durationMult = duration / 60;

        const riskScore = (aqi / 50) * (activityMult[activity] || 1) * (healthMult[health] || 1) * durationMult;

        let verdict, color, emoji, advice, maskRec;
        if (riskScore < 2) { verdict = 'YES — Safe to go'; color = '#22C55E'; emoji = '✓'; advice = 'Air quality is acceptable for your activity.'; maskRec = 'No mask needed.'; }
        else if (riskScore < 5) { verdict = 'CAUTION — Limit exposure'; color = '#EAB308'; emoji = '⚠'; advice = 'Consider reducing time outdoors or intensity of activity.'; maskRec = 'N95 mask recommended if sensitive.'; }
        else if (riskScore < 10) { verdict = 'NO — Avoid if possible'; color = '#F97316'; emoji = '✕'; advice = 'Postpone outdoor activities. If unavoidable, wear protection.'; maskRec = 'N95 mask essential.'; }
        else { verdict = 'STAY INDOORS'; color = '#EF4444'; emoji = '✕'; advice = 'Dangerous air quality. Stay indoors with windows closed.'; maskRec = 'N95/N99 mask essential. Consider air purifier.'; }

        resultEl.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: ${color}; margin-bottom: 0.5rem;">${verdict}</div>
            <div style="font-size: 0.9rem; color: var(--text-2); margin-bottom: 1rem;">${advice}</div>
            <div style="font-size: 0.85rem; padding: 0.75rem; background: var(--bg-section); border-radius: var(--radius);">
                <strong>Mask:</strong> ${maskRec}<br>
                <strong>Current AQI:</strong> ${aqi} (${getAQILabel(aqi)})<br>
                <strong>PM2.5:</strong> ${pm25} µg/m³ (${getWHOMultiple(pm25)}x WHO guideline)
            </div>`;

        detailsEl.style.display = 'block';
        document.getElementById('outside-breakdown').innerHTML = `
            <div class="grid-4" style="gap: 0.75rem; text-align: center;">
                <div class="card" style="padding: 0.75rem;"><div style="font-size: 0.7rem; color: var(--text-3);">Risk Score</div><div style="font-size: 1.25rem; font-weight: 700; color: ${color};">${riskScore.toFixed(1)}</div></div>
                <div class="card" style="padding: 0.75rem;"><div style="font-size: 0.7rem; color: var(--text-3);">Cigarette Equiv.</div><div style="font-size: 1.25rem; font-weight: 700;">${((pm25 * duration / 60 / 24) / 22).toFixed(1)}</div></div>
                <div class="card" style="padding: 0.75rem;"><div style="font-size: 0.7rem; color: var(--text-3);">WHO Multiple</div><div style="font-size: 1.25rem; font-weight: 700;">${getWHOMultiple(pm25)}x</div></div>
                <div class="card" style="padding: 0.75rem;"><div style="font-size: 0.7rem; color: var(--text-3);">Best Time</div><div style="font-size: 1.25rem; font-weight: 700;">${aqi > 200 ? 'Avoid' : '2-4 PM'}</div></div>
            </div>`;
    }

    // ── School Closure Predictor ──
    function updateSchoolPrediction() {
        const ncrCities = ['delhi', 'gurgaon', 'noida', 'faridabad', 'ghaziabad'];
        const avgAQI = ncrCities.reduce((sum, c) => sum + (aqiData[c]?.aqi || 0), 0) / ncrCities.length;

        let stage, stageColor, schoolStatus, schoolColor;
        if (avgAQI <= 200) { stage = 'Normal'; stageColor = '#22C55E'; schoolStatus = 'All schools OPEN'; schoolColor = '#22C55E'; }
        else if (avgAQI <= 300) { stage = 'Stage I'; stageColor = '#EAB308'; schoolStatus = 'Schools OPEN — outdoor activities restricted'; schoolColor = '#EAB308'; }
        else if (avgAQI <= 400) { stage = 'Stage II'; stageColor = '#F97316'; schoolStatus = 'Schools OPEN — NO outdoor sports'; schoolColor = '#F97316'; }
        else if (avgAQI <= 450) { stage = 'Stage III'; stageColor = '#EF4444'; schoolStatus = 'Primary schools (up to Class 5) CLOSED'; schoolColor = '#EF4444'; }
        else { stage = 'Stage IV'; stageColor = '#7C3AED'; schoolStatus = 'ALL schools CLOSED — online classes only'; schoolColor = '#7C3AED'; }

        const grapEl = document.getElementById('grap-status');
        if (grapEl) {
            grapEl.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-3);">NCR Average AQI</div>
                    <div style="font-size: 2.5rem; font-weight: 700; color: ${getAQIColor(avgAQI)};">${Math.round(avgAQI)}</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: ${stageColor}; margin-top: 0.5rem;">GRAP ${stage}</div>
                </div>`;
        }
        const predEl = document.getElementById('school-prediction');
        if (predEl) {
            predEl.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${schoolColor}; margin-bottom: 0.5rem;">${schoolStatus}</div>
                    <p style="font-size: 0.85rem; color: var(--text-2);">Based on current NCR average AQI of ${Math.round(avgAQI)}. GRAP stages are determined by CAQM based on 3-day rolling average.</p>
                </div>`;
        }

        const gridEl = document.getElementById('ncr-school-grid');
        if (gridEl) {
            gridEl.innerHTML = ncrCities.map(c => {
                const data = aqiData[c];
                const aqi = data?.aqi || 0;
                return `<div class="card" style="padding: 0.75rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 600;">${CITIES[c]?.name}</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${getAQIColor(aqi)};">${aqi || '?'}</div>
                    <div style="font-size: 0.65rem; color: var(--text-3);">${getAQILabel(aqi)}</div>
                </div>`;
            }).join('');
        }
    }

    // ── Personal Exposure Report ──
    const CITY_ANNUAL_PM25 = {
        delhi: 100, mumbai: 42, kolkata: 84, chennai: 31, bangalore: 48, hyderabad: 55,
        gurgaon: 105, noida: 98, faridabad: 95, ghaziabad: 108, lucknow: 88, kanpur: 95,
        patna: 96, jaipur: 72, ahmedabad: 58, pune: 35, chandigarh: 52, varanasi: 82,
        agra: 78, bhopal: 45, indore: 42, nagpur: 48, kochi: 22, visakhapatnam: 35,
        thiruvananthapuram: 18, coimbatore: 28, muzaffarpur: 90, gaya: 85, raipur: 65,
        jodhpur: 70, guwahati: 55, dehradun: 48, amritsar: 75
    };

    async function generateExposureReport() {
        try { await ensureChartJs(); } catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Chart.js'); return; }
        const cityKey = document.getElementById('exposure-city')?.value;
        if (!cityKey) return;
        const age = parseInt(document.getElementById('exposure-age')?.value || 30);
        const outdoorHours = parseFloat(document.getElementById('exposure-hours')?.value || 4);

        const annualPM25 = CITY_ANNUAL_PM25[cityKey] || 50;
        const cityName = CITIES[cityKey]?.name || cityKey;

        // Monthly PM2.5 estimates (seasonal variation for North India)
        const isNorth = CITIES[cityKey]?.region === 'north';
        const monthlyMultipliers = isNorth
            ? [1.8, 1.5, 1.0, 0.7, 0.6, 0.5, 0.4, 0.4, 0.6, 1.2, 2.2, 2.0]
            : [1.1, 1.0, 0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.8, 1.0, 1.2, 1.2];
        const monthlyPM25 = monthlyMultipliers.map(m => Math.round(annualPM25 * m));

        const daysAboveWHO = 365; // Almost all Indian cities exceed WHO guideline year-round
        const daysAbove100 = monthlyPM25.filter(m => m > 100).length * 30;
        const cigaretteEquiv = ((annualPM25 * outdoorHours / 24) / 22 * 365).toFixed(0);
        const lifeYearsLost = ((annualPM25 - 5) * 0.018 * (outdoorHours / 8)).toFixed(1);

        document.getElementById('exposure-results').style.display = 'block';
        document.getElementById('exposure-stats').innerHTML = `
            <div class="card" style="padding: 1rem; text-align: center; border-left: 3px solid var(--red);">
                <div style="font-size: 0.7rem; color: var(--text-3);">Annual PM2.5</div>
                <div style="font-size: 1.75rem; font-weight: 700; color: ${getPM25TextColor(annualPM25)};">${annualPM25}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">${getWHOMultiple(annualPM25)}x WHO</div>
            </div>
            <div class="card" style="padding: 1rem; text-align: center; border-left: 3px solid var(--amber);">
                <div style="font-size: 0.7rem; color: var(--text-3);">Cigarette Equivalent</div>
                <div style="font-size: 1.75rem; font-weight: 700;">${cigaretteEquiv}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">cigarettes/year</div>
            </div>
            <div class="card" style="padding: 1rem; text-align: center; border-left: 3px solid var(--purple);">
                <div style="font-size: 0.7rem; color: var(--text-3);">Life Years at Risk</div>
                <div style="font-size: 1.75rem; font-weight: 700;">${lifeYearsLost}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">years of life expectancy</div>
            </div>
            <div class="card" style="padding: 1rem; text-align: center; border-left: 3px solid var(--blue);">
                <div style="font-size: 0.7rem; color: var(--text-3);">Days Above WHO</div>
                <div style="font-size: 1.75rem; font-weight: 700;">${daysAboveWHO}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">of 365 days</div>
            </div>`;

        document.getElementById('exposure-interpretation').innerHTML = `
            <p><strong>Living in ${cityName}</strong>, you breathe air with an annual average PM2.5 of <strong>${annualPM25} µg/m³</strong> — that's <strong>${getWHOMultiple(annualPM25)}x the WHO guideline</strong> of 5 µg/m³.</p>
            <p style="margin-top: 0.75rem;">With ${outdoorHours} hours outdoors daily, your annual pollution exposure is equivalent to smoking approximately <strong>${cigaretteEquiv} cigarettes per year</strong> (${(cigaretteEquiv/365).toFixed(1)} per day).</p>
            <p style="margin-top: 0.75rem;">Research suggests this level of exposure reduces life expectancy by approximately <strong>${lifeYearsLost} years</strong> compared to breathing WHO-guideline air.</p>
            <p style="margin-top: 0.75rem; color: var(--text-3); font-size: 0.8rem;"><em>Based on GEMM model estimates and Lancet Countdown 2025 data. Individual risk varies with genetics, pre-existing conditions, and indoor air quality.</em></p>`;

        // Chart
        setTimeout(() => {
            const ctx = document.getElementById('exposureChart');
            if (ctx) {
                if (charts.exposure) charts.exposure.destroy();
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                charts.exposure = new Chart(ctx, {
                    type: 'bar', data: {
                        labels: months,
                        datasets: [{
                            label: 'PM2.5 (µg/m³)', data: monthlyPM25,
                            backgroundColor: monthlyPM25.map(v => getPM25Color(v)),
                            borderRadius: 4
                        }, {
                            label: 'WHO Guideline', data: Array(12).fill(5),
                            type: 'line', borderColor: '#22C55E', borderDash: [5,5], fill: false, pointRadius: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: Math.max(...monthlyPM25) + 20 } }, plugins: { legend: { display: true, labels: { font: { size: 10 } } } } }
                });
            }
        }, 200);
    }


    // ── Exposure Diary ──
    const DIARY_ACTIVITIES = {
        sleeping_indoor:  { label: 'Sleeping (indoors)',            multiplier: 0.3  },
        office_ac:        { label: 'Working (office/AC)',           multiplier: 0.3  },
        office_outdoor:   { label: 'Working (outdoor)',             multiplier: 1.0  },
        cooking_solid:    { label: 'Cooking (solid fuel)',          multiplier: 15.0 },
        cooking_lpg:      { label: 'Cooking (LPG/electric)',       multiplier: 0.5  },
        auto_rickshaw:    { label: 'Commuting (auto-rickshaw)',    multiplier: 1.5  },
        car_ac:           { label: 'Commuting (car AC)',           multiplier: 0.4  },
        bus:              { label: 'Commuting (bus)',               multiplier: 0.9  },
        metro:            { label: 'Commuting (metro)',             multiplier: 0.3  },
        cycling:          { label: 'Commuting (cycling)',           multiplier: 2.5  },
        walking:          { label: 'Commuting (walking)',           multiplier: 1.0  },
        motorcycle:       { label: 'Commuting (motorcycle)',       multiplier: 1.4  },
        exercise_outdoor: { label: 'Exercising (outdoor)',         multiplier: 2.5  },
        school:           { label: 'School/College',               multiplier: 0.5  },
        market:           { label: 'Shopping/Market',              multiplier: 1.2  },
        other_indoor:     { label: 'Other (indoors)',              multiplier: 0.3  }
    };

    const DIARY_DEFAULTS = [
        { activity: 'sleeping_indoor', hours: 8 },
        { activity: 'office_ac', hours: 8 },
        { activity: 'auto_rickshaw', hours: 2 },
        { activity: 'walking', hours: 1 },
        { activity: 'cooking_lpg', hours: 1 },
        { activity: 'other_indoor', hours: 4 }
    ];

    const DIARY_COLORS = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
        '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4', '#E11D48',
        '#A855F7', '#22D3EE', '#FB923C', '#4ADE80'
    ];

    const DIARY_RECOMMENDATIONS_DB = {
        cooking_solid: [
            { text: 'Switch from chulha/biomass to LPG: this single change can reduce your cooking exposure by 97%.', saving: 14.5 },
            { text: 'If LPG is not available, use an improved cookstove with a chimney to cut smoke exposure by 50-60%.', saving: 8.0 },
            { text: 'Cook outdoors or in a well-ventilated separate kitchen to reduce indoor smoke accumulation.', saving: 5.0 }
        ],
        auto_rickshaw: [
            { text: 'Switch from auto-rickshaw to metro: saves significant PM2.5 exposure due to filtered underground air.', saving: 1.2 },
            { text: 'If auto-rickshaw is your only option, use a well-fitting N95 mask during commute.', saving: 0.6 },
            { text: 'Shift commute timing to early morning (before 8 AM) when traffic emissions are lower.', saving: 0.3 }
        ],
        cycling: [
            { text: 'Cycle on less-trafficked routes or greenway paths to reduce direct exhaust exposure.', saving: 0.5 },
            { text: 'Wear a pollution mask (N95/N99) while cycling to filter 90%+ of PM2.5.', saving: 1.5 },
            { text: 'Shift cycling to early morning (5-7 AM) when vehicular emissions are lowest.', saving: 0.5 }
        ],
        exercise_outdoor: [
            { text: 'Check AQI before exercising outdoors. Skip outdoor workouts when AQI exceeds 150.', saving: 0.8 },
            { text: 'Exercise in parks or green spaces away from roads to reduce exposure by 30-50%.', saving: 0.7 },
            { text: 'Shift outdoor exercise to early morning (5-7 AM) for lower pollution levels.', saving: 0.5 }
        ],
        motorcycle: [
            { text: 'Use a full-face helmet with visor closed to reduce particulate inhalation.', saving: 0.3 },
            { text: 'Switch to metro or car AC for heavily polluted routes.', saving: 1.0 },
            { text: 'Wear a pollution mask under your helmet on high-AQI days.', saving: 0.5 }
        ],
        walking: [
            { text: 'Walk on inner lanes or park paths away from main roads to cut exposure by 30%.', saving: 0.3 },
            { text: 'Wear a well-fitting N95 mask while walking in polluted areas.', saving: 0.6 },
            { text: 'Avoid walking during rush hours (8-10 AM, 5-8 PM) when traffic emissions peak.', saving: 0.2 }
        ],
        market: [
            { text: 'Visit markets during off-peak hours to avoid traffic-related pollution spikes.', saving: 0.2 },
            { text: 'Choose indoor malls or shops with AC filtration over open-air markets when AQI is high.', saving: 0.5 },
            { text: 'Wear an N95 mask in crowded outdoor market areas.', saving: 0.4 }
        ],
        bus: [
            { text: 'Choose AC buses over non-AC ones: closed windows with AC filtration reduce exposure.', saving: 0.3 },
            { text: 'Sit away from windows and doors on non-AC buses to reduce direct exhaust intake.', saving: 0.1 },
            { text: 'Switch to metro where available for the lowest commute exposure.', saving: 0.6 }
        ],
        office_outdoor: [
            { text: 'Wear an N95 mask during outdoor work shifts, especially near roads or construction.', saving: 0.6 },
            { text: 'Take indoor breaks every hour to lower cumulative exposure.', saving: 0.2 },
            { text: 'Request employer to provide portable air filtration for outdoor work stations.', saving: 0.3 }
        ]
    };

    function buildDiaryBlockHTML(activity, hours, index) {
        var optionsHTML = Object.entries(DIARY_ACTIVITIES).map(function(pair) {
            return '<option value="' + pair[0] + '"' + (pair[0] === activity ? ' selected' : '') + '>' + pair[1].label + '</option>';
        }).join('');
        return '<div class="diary-block" data-index="' + index + '" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;">' +
            '<select class="form-select" onchange="updateDiaryHours()" style="flex:2;min-width:180px;font-size:0.85rem;">' + optionsHTML + '</select>' +
            '<input type="number" class="form-input" value="' + hours + '" min="0.5" max="12" step="0.5" onchange="updateDiaryHours()" style="width:70px;font-size:0.85rem;text-align:center;">' +
            '<span style="font-size:0.75rem;color:var(--text-3);min-width:24px;">hrs</span>' +
            '<button onclick="removeDiaryBlock(' + index + ')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:1.1rem;padding:2px 6px;" title="Remove">&times;</button>' +
            '</div>';
    }

    function initExposureDiary() {
        var container = document.getElementById('diary-blocks');
        if (!container) return;
        container.innerHTML = '';
        DIARY_DEFAULTS.forEach(function(d, i) {
            container.innerHTML += buildDiaryBlockHTML(d.activity, d.hours, i);
        });
        updateDiaryHours();
        renderDiaryHistory();
    }

    function addDiaryBlock() {
        var container = document.getElementById('diary-blocks');
        if (!container) return;
        var blocks = container.querySelectorAll('.diary-block');
        var nextIndex = blocks.length;
        var div = document.createElement('div');
        div.innerHTML = buildDiaryBlockHTML('other_indoor', 1, nextIndex);
        container.appendChild(div.firstChild);
        updateDiaryHours();
    }

    function removeDiaryBlock(index) {
        var container = document.getElementById('diary-blocks');
        if (!container) return;
        var blocks = container.querySelectorAll('.diary-block');
        if (blocks.length <= 1) return;
        var block = container.querySelector('.diary-block[data-index="' + index + '"]');
        if (block) block.remove();
        container.querySelectorAll('.diary-block').forEach(function(b, i) {
            b.dataset.index = i;
            var btn = b.querySelector('button');
            if (btn) btn.setAttribute('onclick', 'removeDiaryBlock(' + i + ')');
        });
        updateDiaryHours();
    }

    function getDiaryEntries() {
        var container = document.getElementById('diary-blocks');
        if (!container) return [];
        var entries = [];
        container.querySelectorAll('.diary-block').forEach(function(block) {
            var sel = block.querySelector('select');
            var inp = block.querySelector('input');
            if (sel && inp) {
                entries.push({ activity: sel.value, hours: parseFloat(inp.value) || 0 });
            }
        });
        return entries;
    }

    function updateDiaryHours() {
        var entries = getDiaryEntries();
        var total = entries.reduce(function(s, e) { return s + e.hours; }, 0);
        var el = document.getElementById('diary-hours-total');
        if (el) {
            var diff = 24 - total;
            if (Math.abs(diff) < 0.01) {
                el.innerHTML = '<span style="color:var(--green);">Total: 24 hrs (complete day)</span>';
            } else if (diff > 0) {
                el.innerHTML = '<span style="color:var(--amber);">Total: ' + total.toFixed(1) + ' hrs (' + diff.toFixed(1) + ' hrs unaccounted)</span>';
            } else {
                el.innerHTML = '<span style="color:var(--red);">Total: ' + total.toFixed(1) + ' hrs (exceeds 24 hrs by ' + Math.abs(diff).toFixed(1) + ')</span>';
            }
        }
    }

    function calculateExposureDiary() {
        var entries = getDiaryEntries();
        var totalHours = entries.reduce(function(s, e) { return s + e.hours; }, 0);

        if (totalHours < 1) {
            alert('Please add at least one activity to your daily routine.');
            return;
        }

        var cityKey = document.getElementById('diary-city') ? document.getElementById('diary-city').value : '';
        if (!cityKey) return;
        var cityName = (CITIES[cityKey] && CITIES[cityKey].name) || cityKey;

        // Get ambient PM2.5: prefer live data, fall back to annual average
        var livePM25 = aqiData[cityKey] ? aqiData[cityKey].pm25 : null;
        var ambientPM25 = livePM25 || CITY_ANNUAL_PM25[cityKey] || 50;
        var dataSource = livePM25 ? 'live' : 'annual average';

        // Calculate per-activity exposure
        var breakdown = entries.map(function(e, i) {
            var act = DIARY_ACTIVITIES[e.activity];
            var effectivePM25 = ambientPM25 * act.multiplier;
            var exposureContrib = e.hours * effectivePM25;
            return {
                activity: e.activity,
                label: act.label,
                hours: e.hours,
                multiplier: act.multiplier,
                effectivePM25: effectivePM25,
                exposureContrib: exposureContrib,
                color: DIARY_COLORS[i % DIARY_COLORS.length]
            };
        });

        // Weighted daily exposure = sum(hours * multiplier * ambient) / totalHours
        var totalExposureHours = breakdown.reduce(function(s, b) { return s + b.exposureContrib; }, 0);
        var weightedPM25 = totalExposureHours / (totalHours || 24);

        // Cigarette equivalence (Berkeley Earth: 22 ug/m3 per day = 1 cigarette)
        var cigsPerDay = weightedPM25 / 22;
        var cigsPerYear = cigsPerDay * 365;

        // Life-expectancy loss (AQLI formula)
        var lifeYearsLost = Math.max(0, (weightedPM25 - 5) / 10 * 0.98);

        // Worst exposure window
        var worstActivity = breakdown.reduce(function(max, b) {
            return b.effectivePM25 > max.effectivePM25 ? b : max;
        }, breakdown[0]);

        // Show results
        var resultsDiv = document.getElementById('diary-results');
        if (resultsDiv) resultsDiv.style.display = 'block';

        // Stats cards — swatch colour for the accent bar, legible variant for the number text
        var pm25Color = getPM25Color(weightedPM25);
        var pm25Text = getPM25TextColor(weightedPM25);
        document.getElementById('diary-stats').innerHTML =
            '<div class="card" style="padding:1rem;text-align:center;border-left:3px solid ' + pm25Color + ';">' +
                '<div style="font-size:0.7rem;color:var(--text-3);">Daily Weighted PM2.5</div>' +
                '<div style="font-size:1.75rem;font-weight:700;color:' + pm25Text + ';">' + weightedPM25.toFixed(1) + '</div>' +
                '<div style="font-size:0.65rem;color:var(--text-3);">µg/m³ (' + getWHOMultiple(weightedPM25) + 'x WHO)</div>' +
            '</div>' +
            '<div class="card" style="padding:1rem;text-align:center;border-left:3px solid var(--amber);">' +
                '<div style="font-size:0.7rem;color:var(--text-3);">Cigarette Equivalent</div>' +
                '<div style="font-size:1.75rem;font-weight:700;">' + cigsPerDay.toFixed(1) + '</div>' +
                '<div style="font-size:0.65rem;color:var(--text-3);">/day (' + cigsPerYear.toFixed(0) + '/year)</div>' +
            '</div>' +
            '<div class="card" style="padding:1rem;text-align:center;border-left:3px solid var(--purple);">' +
                '<div style="font-size:0.7rem;color:var(--text-3);">Life-Expectancy Loss</div>' +
                '<div style="font-size:1.75rem;font-weight:700;">' + lifeYearsLost.toFixed(1) + '</div>' +
                '<div style="font-size:0.65rem;color:var(--text-3);">years (AQLI estimate)</div>' +
            '</div>' +
            '<div class="card" style="padding:1rem;text-align:center;border-left:3px solid var(--red);">' +
                '<div style="font-size:0.7rem;color:var(--text-3);">Worst Exposure</div>' +
                '<div style="font-size:1.1rem;font-weight:700;color:var(--red);">' + worstActivity.label + '</div>' +
                '<div style="font-size:0.65rem;color:var(--text-3);">' + worstActivity.effectivePM25.toFixed(0) + ' µg/m³ effective</div>' +
            '</div>';

        // Stacked horizontal bar chart
        var totalContrib = breakdown.reduce(function(s, b) { return s + b.exposureContrib; }, 0);
        var barHTML = '<div style="display:flex;height:32px;border-radius:6px;overflow:hidden;border:1px solid var(--border);">';
        var legendHTML = '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;">';

        var sorted = breakdown.slice().sort(function(a, b) { return b.exposureContrib - a.exposureContrib; });
        sorted.forEach(function(b) {
            var pct = totalContrib > 0 ? (b.exposureContrib / totalContrib * 100) : 0;
            if (pct > 0.5) {
                barHTML += '<div style="width:' + pct.toFixed(1) + '%;background:' + b.color + ';display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:#fff;font-weight:600;min-width:2px;" title="' + b.label + ': ' + pct.toFixed(1) + '%">' +
                    (pct > 8 ? pct.toFixed(0) + '%' : '') + '</div>';
            }
            legendHTML += '<span style="display:inline-flex;align-items:center;gap:3px;">' +
                '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + b.color + ';"></span>' +
                b.label + ' (' + pct.toFixed(1) + '%, ' + b.hours + 'h)</span>';
        });
        barHTML += '</div>';
        legendHTML += '</div>';

        // Details table
        barHTML += '<div style="margin-top:1rem;overflow-x:auto;"><table style="width:100%;font-size:0.78rem;border-collapse:collapse;">' +
            '<tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:4px 6px;">Activity</th><th style="text-align:right;padding:4px 6px;">Hours</th><th style="text-align:right;padding:4px 6px;">Multiplier</th><th style="text-align:right;padding:4px 6px;">Effective PM2.5</th><th style="text-align:right;padding:4px 6px;">% of Exposure</th></tr>';
        sorted.forEach(function(b) {
            var pct = totalContrib > 0 ? (b.exposureContrib / totalContrib * 100) : 0;
            barHTML += '<tr style="border-bottom:1px solid var(--border);">' +
                '<td style="padding:4px 6px;"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:' + b.color + ';margin-right:4px;"></span>' + b.label + '</td>' +
                '<td style="text-align:right;padding:4px 6px;">' + b.hours + '</td>' +
                '<td style="text-align:right;padding:4px 6px;">' + b.multiplier + 'x</td>' +
                '<td style="text-align:right;padding:4px 6px;color:' + getPM25TextColor(b.effectivePM25) + ';">' + b.effectivePM25.toFixed(0) + '</td>' +
                '<td style="text-align:right;padding:4px 6px;">' + pct.toFixed(1) + '%</td></tr>';
        });
        barHTML += '</table></div>';

        document.getElementById('diary-bar-chart').innerHTML = barHTML;
        document.getElementById('diary-bar-legend').innerHTML = legendHTML;

        // Recommendations
        var recs = generateDiaryRecommendations(sorted, ambientPM25, weightedPM25);
        document.getElementById('diary-recommendations').innerHTML = recs;

        // Data source note
        document.getElementById('diary-recommendations').innerHTML += '<p style="margin-top:1rem;font-size:0.75rem;color:var(--text-3);border-top:1px solid var(--border);padding-top:0.75rem;">' +
            '<strong>' + cityName + '</strong> ambient PM2.5: <strong>' + ambientPM25.toFixed(0) + ' µg/m³</strong> (' + dataSource + ').<br>' +
            'Cigarette equivalence: Berkeley Earth (22 µg/m³/day). Life-expectancy loss: AQLI methodology.' +
            '</p>';

        // WhatsApp share button
        document.getElementById('diary-recommendations').innerHTML += '<div style="text-align: center; margin-top: 1rem;">' +
            '<button onclick="shareExposureDiaryWhatsApp()" style="background: #0f766e; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.584-1.476A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.818-6.296-2.187l-.44-.362-3.26 1.05 1.07-3.188-.394-.46A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>' +
            'Share on WhatsApp</button></div>';

        // Save to localStorage
        saveDiaryResult(cityKey, weightedPM25, cigsPerDay, lifeYearsLost, worstActivity.label);
        renderDiaryHistory();

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function generateDiaryRecommendations(sortedBreakdown, ambientPM25, weightedPM25) {
        var html = '';
        var recCount = 0;

        for (var idx = 0; idx < sortedBreakdown.length; idx++) {
            if (recCount >= 3) break;
            var item = sortedBreakdown[idx];
            var recs = DIARY_RECOMMENDATIONS_DB[item.activity];
            if (recs && recs.length > 0) {
                var rec = recs[0];
                var savedPM25 = (rec.saving * ambientPM25 * item.hours / 24).toFixed(1);
                html += '<div style="padding:0.75rem;background:var(--bg-2);border-radius:8px;margin-bottom:0.5rem;border-left:3px solid ' + item.color + ';">' +
                    '<div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">' + item.label + '</div>' +
                    '<p style="margin:0;font-size:0.8rem;">' + rec.text + '</p>' +
                    '<p style="margin:4px 0 0;font-size:0.75rem;color:var(--green);">Potential saving: ~' + savedPM25 + ' µg/m³ from daily weighted average</p>' +
                    '</div>';
                recCount++;
            }
        }

        if (recCount === 0) {
            html += '<div style="padding:0.75rem;background:var(--bg-2);border-radius:8px;margin-bottom:0.5rem;">' +
                '<p style="margin:0;font-size:0.85rem;">Your routine is relatively low-exposure. Keep windows closed during high-AQI periods and use an air purifier indoors for additional protection.</p></div>';
            html += '<div style="padding:0.75rem;background:var(--bg-2);border-radius:8px;margin-bottom:0.5rem;">' +
                '<p style="margin:0;font-size:0.85rem;">Check AQI before outdoor activities and consider wearing an N95 mask when PM2.5 exceeds 60 µg/m³.</p></div>';
            html += '<div style="padding:0.75rem;background:var(--bg-2);border-radius:8px;margin-bottom:0.5rem;">' +
                '<p style="margin:0;font-size:0.85rem;">Consider indoor plants and HEPA filtration to further reduce your baseline indoor exposure.</p></div>';
        }

        return html;
    }

    function saveDiaryResult(cityKey, weightedPM25, cigsPerDay, lifeYearsLost, worstActivity) {
        try {
            var key = 'janvayu-diary-history';
            var history = JSON.parse(localStorage.getItem(key) || '[]');
            history.push({
                date: new Date().toISOString().split('T')[0],
                city: (CITIES[cityKey] && CITIES[cityKey].name) || cityKey,
                cityKey: cityKey,
                weightedPM25: Math.round(weightedPM25 * 10) / 10,
                cigsPerDay: Math.round(cigsPerDay * 10) / 10,
                lifeYearsLost: Math.round(lifeYearsLost * 10) / 10,
                worstActivity: worstActivity
            });
            while (history.length > 52) history.shift();
            localStorage.setItem(key, JSON.stringify(history));
        } catch(e) {}
    }

    function renderDiaryHistory() {
        var el = document.getElementById('diary-history');
        if (!el) return;
        try {
            var history = JSON.parse(localStorage.getItem('janvayu-diary-history') || '[]');
            if (history.length === 0) {
                el.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem;">No previous entries. Calculate your exposure to start tracking week-over-week.</p>';
                return;
            }

            var html = '<div style="overflow-x:auto;"><table style="width:100%;font-size:0.8rem;border-collapse:collapse;">' +
                '<tr style="border-bottom:2px solid var(--border);font-weight:600;"><td style="padding:6px;">Date</td><td style="padding:6px;">City</td><td style="padding:6px;text-align:right;">PM2.5</td><td style="padding:6px;text-align:right;">Cigs/Day</td><td style="padding:6px;text-align:right;">Life-Yrs Lost</td><td style="padding:6px;">Worst</td></tr>';

            var reversed = history.slice().reverse();
            reversed.forEach(function(entry, i) {
                var bgColor = i === 0 ? 'var(--bg-2)' : 'transparent';
                html += '<tr style="border-bottom:1px solid var(--border);background:' + bgColor + ';">' +
                    '<td style="padding:6px;">' + entry.date + '</td>' +
                    '<td style="padding:6px;">' + entry.city + '</td>' +
                    '<td style="padding:6px;text-align:right;color:' + getPM25TextColor(entry.weightedPM25) + ';font-weight:600;">' + entry.weightedPM25 + '</td>' +
                    '<td style="padding:6px;text-align:right;">' + entry.cigsPerDay + '</td>' +
                    '<td style="padding:6px;text-align:right;">' + entry.lifeYearsLost + '</td>' +
                    '<td style="padding:6px;font-size:0.75rem;">' + entry.worstActivity + '</td></tr>';
            });
            html += '</table></div>';

            if (history.length >= 2) {
                var latest = history[history.length - 1].weightedPM25;
                var previous = history[history.length - 2].weightedPM25;
                var diff = latest - previous;
                var arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
                var color = diff > 0 ? 'var(--red)' : diff < 0 ? 'var(--green)' : 'var(--text-3)';
                var label = diff > 0 ? 'Exposure increased' : diff < 0 ? 'Exposure decreased' : 'No change';
                html = '<div style="margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:var(--bg-2);border-radius:6px;display:inline-flex;align-items:center;gap:0.5rem;font-size:0.85rem;">' +
                    '<span style="font-size:1.2rem;color:' + color + ';">' + arrow + '</span>' +
                    '<span><strong>' + label + '</strong> since last entry (' + Math.abs(diff).toFixed(1) + ' µg/m³)</span></div>' + html;
            }

            el.innerHTML = html;
        } catch(e) {
            el.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem;">Unable to load history.</p>';
        }
    }

    function clearDiaryHistory() {
        if (!confirm('Clear all saved exposure diary entries?')) return;
        try { localStorage.removeItem('janvayu-diary-history'); } catch(e) {}
        renderDiaryHistory();
    }

    // ── RTI Filing Assistant ──
    const RTI_AUTHORITIES = {
        delhi: { name: 'Delhi Pollution Control Committee', address: '4th Floor, ISBT Building, Kashmere Gate, Delhi-110006', pio: 'Public Information Officer, DPCC' },
        up: { name: 'UP Pollution Control Board', address: 'TC-12V, Vibhuti Khand, Gomti Nagar, Lucknow-226010', pio: 'PIO, UPPCB' },
        haryana: { name: 'Haryana State Pollution Control Board', address: 'C-11, Sector 6, Panchkula-134109', pio: 'PIO, HSPCB' },
        maharashtra: { name: 'Maharashtra Pollution Control Board', address: 'Kalpataru Point, Sion-Trombay Road, Mumbai-400088', pio: 'PIO, MPCB' },
        karnataka: { name: 'Karnataka State Pollution Control Board', address: '49, Parisara Bhavan, Church Street, Bangalore-560001', pio: 'PIO, KSPCB' },
        tamilnadu: { name: 'Tamil Nadu Pollution Control Board', address: '76, Mount Salai, Guindy, Chennai-600032', pio: 'PIO, TNPCB' },
        westbengal: { name: 'West Bengal Pollution Control Board', address: 'Paribesh Bhawan, 10A Block-LA, Sector-III, Salt Lake, Kolkata-700098', pio: 'PIO, WBPCB' },
        rajasthan: { name: 'Rajasthan State Pollution Control Board', address: '4, Institutional Area, Jhalana Dungri, Jaipur-302004', pio: 'PIO, RSPCB' },
        mp: { name: 'MP Pollution Control Board', address: 'Paryavaran Parisar, E-5 Arera Colony, Bhopal-462016', pio: 'PIO, MPPCB' },
        bihar: { name: 'Bihar State Pollution Control Board', address: 'Budh Marg, Patna-800001', pio: 'PIO, BSPCB' },
        punjab: { name: 'Punjab Pollution Control Board', address: 'Vatavaran Bhawan, Nabha Road, Patiala-147001', pio: 'PIO, PPCB' },
        gujarat: { name: 'Gujarat Pollution Control Board', address: 'Paryavaran Bhawan, Sector 10-A, Gandhinagar-382010', pio: 'PIO, GPCB' }
    };

    const RTI_QUESTIONS = {
        'ncap-funds': [
            'Total NCAP funds allocated to this state/city from 2019-20 to 2025-26 (year-wise).',
            'Amount utilized under each head (monitoring, road dust, transport, waste management) with percentage utilization.',
            'List of projects approved, their current status, and completion timeline.',
            'Audit reports or utilization certificates submitted to MoEFCC.'
        ],
        'monitoring': [
            'Total number of CAAQMS (Continuous Ambient Air Quality Monitoring Stations) in the state/city.',
            'Number of stations currently operational vs non-operational, with reasons for downtime.',
            'Data completeness percentage for each station in the last 12 months.',
            'Plans for new monitoring stations and their proposed locations and timelines.'
        ],
        'industrial': [
            'List of industries classified as grossly polluting in the last 3 years.',
            'Number of show-cause notices, closure orders, and penalties issued for air pollution violations.',
            'Compliance status of thermal power plants with emission norms.',
            'Status of brick kilns transitioning to zig-zag technology.'
        ],
        'action-plan': [
            'Copy of the city-specific clean air action plan and its current implementation status.',
            'Progress on each action item with measurable outcomes achieved.',
            'Reasons for any delays or targets missed.',
            'Budget allocated vs spent on each action item.'
        ],
        'health-data': [
            'Number of respiratory disease cases reported in government hospitals in the last 5 years.',
            'Any health impact assessment studies conducted related to air pollution.',
            'Data on school closures due to air quality in the last 3 years.',
            'Any advisories issued to the public regarding air quality emergencies.'
        ]
    };

    function updateRTIAuthority() {
        updateRTIPreview();
    }

    function updateRTIPreview() {
        const topic = document.getElementById('rti-topic').value;
        document.getElementById('rti-custom-q').style.display = topic === 'custom' ? 'block' : 'none';
        generateRTI();
    }

    function generateRTI() {
        const name = document.getElementById('rti-name').value || '[YOUR NAME]';
        const address = document.getElementById('rti-address').value || '[YOUR ADDRESS]';
        const state = document.getElementById('rti-state').value;
        const topic = document.getElementById('rti-topic').value;
        const authority = RTI_AUTHORITIES[state] || { name: '[State Pollution Control Board]', address: '[Address]', pio: 'Public Information Officer' };

        let questions;
        if (topic === 'custom') {
            const customQ = document.getElementById('rti-custom-question')?.value || '[Your question]';
            questions = [customQ];
        } else {
            questions = RTI_QUESTIONS[topic] || ['[Questions will appear here]'];
        }

        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        document.getElementById('rti-preview').textContent = `APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005

To,
The ${authority.pio},
${authority.name},
${authority.address}

Date: ${today}

Subject: Request for Information under RTI Act, 2005

Sir/Madam,

I, ${name}, resident of ${address}, hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

I am willing to pay the prescribed fee as applicable. Kindly provide the information within the stipulated 30-day period as mandated under the RTI Act.

If the information sought is held by another public authority, kindly transfer the application under Section 6(3) of the RTI Act.

Thanking you,
${name}
${address}

Fee: Rs. 10/- (via postal order/DD/court fee stamp)

---
Generated via JanVayu (janvayu.in) — India's citizen air quality platform`;
    }

    function copyRTIGenerated() {
        const text = document.getElementById('rti-preview').textContent;
        navigator.clipboard.writeText(text).then(() => alert('RTI application copied to clipboard!'));
    }

    // ── Air Purifier Calculator ──
    function calcPurifier() {
        const area = parseInt(document.getElementById('purifier-area')?.value || 200);
        const height = parseInt(document.getElementById('purifier-height')?.value || 10);
        const cityKey = document.getElementById('purifier-city')?.value;
        const targetAQI = parseInt(document.getElementById('purifier-target')?.value || 50);
        const resultEl = document.getElementById('purifier-result');
        if (!resultEl) return;

        const currentAQI = aqiData[cityKey]?.aqi || 200;
        const currentPM25 = aqiData[cityKey]?.pm25 || Math.round(currentAQI * 0.7);

        const volumeCuFt = area * height;
        const volumeM3 = volumeCuFt * 0.0283168;
        const airChangesNeeded = currentPM25 > 150 ? 6 : currentPM25 > 100 ? 5 : currentPM25 > 50 ? 4 : 3;
        const requiredCADR = Math.ceil(volumeM3 * airChangesNeeded / 1); // m³/h
        const requiredCADR_cfm = Math.ceil(requiredCADR * 0.5886);

        let priceRange, models;
        if (requiredCADR_cfm < 150) {
            priceRange = '₹5,000 - ₹12,000';
            models = 'MI Air Purifier 3C, Coway Airmega 150, Honeywell Air Touch V3';
        } else if (requiredCADR_cfm < 300) {
            priceRange = '₹10,000 - ₹25,000';
            models = 'MI Air Purifier 4, Coway Airmega 200, Dyson Pure Cool, Blue Star BS-AP450';
        } else {
            priceRange = '₹20,000 - ₹45,000';
            models = 'Dyson Purifier Big Quiet, Coway Airmega 400, IQAir HealthPro, Blueair Classic 605';
        }

        const filterCostYear = requiredCADR_cfm < 150 ? '₹1,500-3,000' : requiredCADR_cfm < 300 ? '₹2,500-5,000' : '₹4,000-8,000';

        resultEl.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 0.85rem; color: var(--text-3);">Required CADR</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--green-700);">${requiredCADR_cfm} CFM</div>
                <div style="font-size: 0.75rem; color: var(--text-3);">(${requiredCADR} m³/h)</div>
            </div>
            <div style="font-size: 0.85rem; padding: 1rem; background: var(--bg-section); border-radius: var(--radius);">
                <div style="margin-bottom: 0.5rem;"><strong>Room:</strong> ${area} sq ft × ${height} ft = ${volumeCuFt.toLocaleString()} cu ft</div>
                <div style="margin-bottom: 0.5rem;"><strong>Current AQI:</strong> ${currentAQI} (PM2.5: ${currentPM25})</div>
                <div style="margin-bottom: 0.5rem;"><strong>Air changes needed:</strong> ${airChangesNeeded}x/hour</div>
                <div style="margin-bottom: 0.5rem;"><strong>Price range:</strong> ${priceRange}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Filter replacement:</strong> ~${filterCostYear}/year</div>
                <div><strong>Suggested models:</strong> ${models}</div>
            </div>
            <div class="alert alert-info mt-2" style="font-size: 0.75rem;">
                Tip: Seal windows and doors for best results. Run purifier 30 minutes before entering room. Replace filters on schedule — a clogged filter is worse than no purifier.
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <button onclick="sharePurifierResultWhatsApp()" style="background: #0f766e; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.584-1.476A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.818-6.296-2.187l-.44-.362-3.26 1.05 1.07-3.188-.394-.46A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                    Share on WhatsApp
                </button>
            </div>`;
    }

    // ── Hyperlocal Comparison ──
    async function loadHyperlocal() {
        const cityKey = document.getElementById('hyperlocal-city')?.value;
        if (!cityKey) return;
        const resultsEl = document.getElementById('hyperlocal-results');
        const city = CITIES[cityKey];
        if (!city) return;

        resultsEl.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-3);">Searching for monitoring stations near ' + city.name + '...</div>';

        // Fetch CPCB/WAQI stations + community sensors (Sensor.Community) in parallel
        const [waqiStations, communityStations] = await Promise.all([
            fetchWAQIStations(city),
            fetchCommunityStations(city)
        ]);

        const totalCount = waqiStations.length + communityStations.length;
        if (totalCount === 0) {
            resultsEl.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-3);">No stations found in this area.</div>';
            return;
        }

        const renderStation = (s, source) => {
            const aqi = parseInt(s.aqi) || 0;
            const sourceLabel = source === 'community'
                ? '<span style="background: #7C3AED; color: #fff; font-size: 0.6rem; padding: 1px 6px; border-radius: 3px; margin-left: 4px;">COMMUNITY</span>'
                : '<span style="background: #3B82F6; color: #fff; font-size: 0.6rem; padding: 1px 6px; border-radius: 3px; margin-left: 4px;">CPCB/WAQI</span>';
            return `<div class="card" style="padding: 1rem; border-left: 3px solid ${getAQIColor(aqi)};">
                <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem;">${s.station?.name || 'Station'} ${sourceLabel}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${getAQIColor(aqi)};">${aqi || '--'}</div>
                <div style="font-size: 0.65rem; color: var(--text-3);">${getAQILabel(aqi)}${s.pm25 ? ' · PM2.5: ' + s.pm25 + ' µg/m³' : ''}</div>
            </div>`;
        };

        resultsEl.innerHTML = `
            <div class="card mb-2"><div class="card-header"><span class="card-title">${city.name} — ${totalCount} stations (${waqiStations.length} CPCB/WAQI + ${communityStations.length} community)</span></div></div>
            ${communityStations.length > 0 ? `<div class="alert alert-info mb-2"><div><strong>Community sensors</strong> are low-cost monitors run by residents (Sensor.Community / OpenAQ network). Treat as indicative; less calibrated than CPCB stations but fill coverage gaps.</div></div>` : ''}
            <div class="grid-3" style="gap: 0.75rem;">
                ${[...waqiStations, ...communityStations]
                    .sort((a, b) => (parseInt(b.aqi)||0) - (parseInt(a.aqi)||0))
                    .map(s => renderStation(s, s._source)).join('')}
            </div>`;
    }

    async function fetchWAQIStations(city) {
        try {
            const url = `https://api.waqi.info/map/bounds/?latlng=${city.lat-0.2},${city.lon-0.2},${city.lat+0.2},${city.lon+0.2}&token=${WAQI_TOKEN}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                return data.data.map(s => ({ ...s, _source: 'waqi' }));
            }
        } catch (e) { console.warn('[JanVayu] WAQI bounds fetch failed:', e.message); }
        return [];
    }

    // Sensor.Community public API — global open community PM2.5/PM10 sensor network.
    // Free, CC0 licensed, no auth required. https://api.sensor.community/static/v2/data.json
    async function fetchCommunityStations(city) {
        try {
            const res = await fetch('/.netlify/functions/community-sensors?lat=' + city.lat + '&lon=' + city.lon + '&radius=25');
            if (!res.ok) return [];
            const data = await res.json();
            if (!Array.isArray(data.stations)) return [];
            return data.stations.map(s => ({
                aqi: s.aqi || pm25ToAQI(s.pm25),
                pm25: s.pm25,
                station: { name: s.name || ('Sensor.Community #' + s.id) },
                lat: s.lat, lon: s.lon,
                _source: 'community'
            }));
        } catch (e) { return []; }
    }

    // EPA breakpoint conversion PM2.5 (µg/m³) → AQI.
    function pm25ToAQI(c) {
        if (c == null || isNaN(c)) return null;
        const bp = [
            [0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
            [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300],
            [250.5, 350.4, 301, 400], [350.5, 500.4, 401, 500]
        ];
        for (const [cl, ch, il, ih] of bp) {
            if (c >= cl && c <= ch) return Math.round(((ih - il) / (ch - cl)) * (c - cl) + il);
        }
        return c > 500 ? 500 : null;
    }

    // ── City Rankings panel ──
    let rankingsState = { tab: 'live', cache: { live: null, week: null, month: null } };

    function switchRankingTab(tab) {
        rankingsState.tab = tab;
        document.querySelectorAll('.rankings-tab').forEach(b => {
            const active = b.dataset.rangetab === tab;
            b.classList.toggle('active', active);
            b.style.background = active ? 'var(--accent, #1B6B4A)' : 'transparent';
            b.style.color = active ? '#fff' : 'var(--text-2)';
        });
        renderRankingsTable();
    }

    async function loadRankingsData(tab) {
        if (rankingsState.cache[tab]) return rankingsState.cache[tab];
        if (tab === 'live') {
            const rows = Object.entries(aqiData).map(([key, d]) => ({
                key, name: CITIES[key]?.name || key,
                pm25: d.pm25 || Math.round(d.aqi * 0.7),
                aqi: d.aqi, delta7: null
            }));
            rankingsState.cache.live = rows;
            return rows;
        }
        try {
            const res = await fetch('/.netlify/functions/rankings?range=' + tab);
            if (res.ok) {
                const json = await res.json();
                if (Array.isArray(json.cities)) {
                    rankingsState.cache[tab] = json.cities;
                    return json.cities;
                }
            }
        } catch (e) { /* fall through */ }
        // Fallback: derive from current live data (no historical signal yet)
        return rankingsState.cache.live || [];
    }

    async function renderRankingsTable() {
        const tbody = document.getElementById('rankings-tbody');
        if (!tbody) return;
        const tab = rankingsState.tab;
        let rows = await loadRankingsData(tab);
        const q = (document.getElementById('rankings-search')?.value || '').toLowerCase().trim();
        const order = document.getElementById('rankings-order')?.value || 'worst';
        if (q) rows = rows.filter(r => (r.name || '').toLowerCase().includes(q));
        rows = [...rows].sort((a, b) => order === 'worst' ? (b.pm25 - a.pm25) : (a.pm25 - b.pm25));
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="color: var(--text-3); padding: 24px; text-align: center;">No cities match.</td></tr>';
            return;
        }
        tbody.innerHTML = rows.map((r, i) => {
            const color = getPM25Color(r.pm25);
            const textColor = getPM25TextColor(r.pm25); // legible on white cells
            const whoX = getWHOMultiple(r.pm25);
            const delta = r.delta7 == null ? '—' : (r.delta7 > 0 ? '<span style="color:var(--red);">+' + r.delta7.toFixed(0) + '%</span>' : '<span style="color:var(--green-600);">' + r.delta7.toFixed(0) + '%</span>');
            return `<tr>
                <td style="text-align: center; font-weight: 600; color: ${i < 3 && order === 'worst' ? '#EF4444' : 'var(--text-2)'}">${i+1}</td>
                <td style="font-weight: 500;">${r.name}</td>
                <td style="text-align: right;"><span style="display: inline-block; min-width: 52px; padding: 3px 10px; background: ${color}; color: #fff; border-radius: 6px; font-weight: 600; font-size: 0.82rem;">${r.pm25}</span></td>
                <td style="text-align: right; color: var(--text-2);">${r.aqi || '--'}</td>
                <td style="text-align: right; font-weight: 600; color: ${textColor};">${whoX}×</td>
                <td style="text-align: right;">${delta}</td>
            </tr>`;
        }).join('');
    }

    async function initRankingsPanel() {
        rankingsState.cache.live = null;
        if (Object.keys(aqiData).length === 0) {
            const tbody = document.getElementById('rankings-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="color: var(--text-3); padding: 24px; text-align: center;">Fetching live data…</td></tr>';
            try { await fetchAllAQI(); } catch(e) {}
        }
        renderRankingsTable();
    }

    // ── Year-over-Year (compare panel) ──
    function initYoYPanel() {
        const citySel = document.getElementById('yoy-city');
        const monthSel = document.getElementById('yoy-month');
        if (!citySel || !monthSel) return;
        if (citySel.options.length === 0) {
            INDIAN_CITIES.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = CITIES[k]?.name || k;
                citySel.appendChild(opt);
            });
            citySel.value = 'delhi';
        }
        const now = new Date();
        monthSel.value = String(now.getMonth() + 1).padStart(2, '0');
        loadYoYData();
    }

    async function loadYoYData() {
        const city = document.getElementById('yoy-city')?.value;
        const month = document.getElementById('yoy-month')?.value;
        const summaryEl = document.getElementById('yoy-summary');
        if (!city || !month) return;
        if (summaryEl) summaryEl.textContent = 'Loading…';
        let years = [];
        try {
            const res = await fetch(`/.netlify/functions/historical-aqi?city=${city}&month=${month}`);
            if (res.ok) {
                const json = await res.json();
                if (Array.isArray(json.years)) years = json.years;
            }
        } catch (e) { /* fall through */ }
        if (years.length === 0) {
            // Fallback: synthesize a comparison from current live PM2.5 only
            const live = aqiData[city]?.pm25 || (aqiData[city]?.aqi ? Math.round(aqiData[city].aqi * 0.7) : null);
            if (live != null) {
                years = [
                    { year: new Date().getFullYear() - 2, pm25: null },
                    { year: new Date().getFullYear() - 1, pm25: null },
                    { year: new Date().getFullYear(),     pm25: live }
                ];
            }
        }
        renderYoYChart(years);
        if (summaryEl) {
            const valid = years.filter(y => y.pm25 != null);
            if (valid.length >= 2) {
                const first = valid[0].pm25, last = valid[valid.length - 1].pm25;
                const pct = ((last - first) / first * 100).toFixed(1);
                const dir = pct > 0 ? 'worse' : 'better';
                const color = pct > 0 ? '#EF4444' : '#22C55E';
                summaryEl.innerHTML = `<strong>${valid[0].year} → ${valid[valid.length-1].year}:</strong> <span style="color: ${color};">${Math.abs(pct)}% ${dir}</span> for ${CITIES[city]?.name || city} in ${monthName(month)}.`;
            } else {
                summaryEl.textContent = 'Historical data is sparse for this city/month combination.';
            }
        }
    }

    function monthName(m) {
        return ['','January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(m)] || '';
    }

    async function renderYoYChart(years) {
        try { await ensureChartJs(); } catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Chart.js'); return; }
        const ctx = document.getElementById('yoyChart');
        if (!ctx) return;
        if (charts.yoy) { try { charts.yoy.destroy(); } catch(e){} }
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const labels = years.map(y => String(y.year));
        const data = years.map(y => y.pm25);
        charts.yoy = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{
                label: 'PM2.5 monthly avg (µg/m³)',
                data,
                backgroundColor: data.map(v => v ? getPM25Color(v) : '#9CA3AF'),
                borderRadius: 4
            }]},
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: isDark ? '#334155' : '#E2E8F0' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // ── Hourly 24-hr scrubbable trend chart ──
    let hourlySeries = [];
    async function initHourlyTrendChart() {
        const sel = document.getElementById('hourly-city');
        if (!sel) return;
        if (sel.options.length === 0) {
            INDIAN_CITIES.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = CITIES[k]?.name || k;
                sel.appendChild(opt);
            });
            sel.value = 'delhi';
        }
        const cityKey = sel.value;
        const city = CITIES[cityKey];
        if (!city) return;

        // Pull WAQI feed; the iaqi.pm25 forecast section + recent readings
        // give us a coarse 24-hr series. Where the API doesn't expose a
        // ready hourly array, synthesize from the daily forecast curve.
        let hourly = [];
        try {
            const url = `https://api.waqi.info/feed/geo:${city.lat};${city.lon}/?token=${WAQI_TOKEN}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.status === 'ok' && json.data) {
                const live = parseInt(json.data.aqi);
                const forecast = json.data.forecast?.daily?.pm25 || [];
                const todayForecast = forecast.find(f => f.day === new Date().toISOString().slice(0,10));
                const avg = todayForecast?.avg || iaqiToPM25(json.data.iaqi?.pm25?.v) || (live * 0.7);
                const min = todayForecast?.min || avg * 0.7;
                const max = todayForecast?.max || avg * 1.3;
                // Build a sinusoidal 24-hr curve anchored at avg, swinging between min and max,
                // with the live reading clamped to position 23 (now).
                const amp = (max - min) / 2;
                for (let h = 0; h < 24; h++) {
                    const phase = ((h - 6) / 24) * 2 * Math.PI; // peak around 6 AM (winter inversion)
                    const v = Math.round(avg + amp * Math.sin(phase));
                    hourly.push({ hour: h, pm25: Math.max(1, v) });
                }
                if (live) {
                    hourly[23].pm25 = iaqiToPM25(json.data.iaqi?.pm25?.v) || Math.round(live * 0.7);
                }
            }
        } catch (e) { console.warn('[JanVayu] hourly fetch failed:', e.message); }

        if (hourly.length === 0) {
            // Fallback to flat-line synthesis from cached aqiData
            const live = aqiData[cityKey]?.pm25 || (aqiData[cityKey]?.aqi ? Math.round(aqiData[cityKey].aqi*0.7) : 50);
            for (let h = 0; h < 24; h++) hourly.push({ hour: h, pm25: live });
        }

        hourlySeries = hourly;
        drawHourlyChart();
        updateHourlyReadout(23);
    }

    async function drawHourlyChart() {
        try { await ensureChartJs(); } catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Chart.js'); return; }
        const ctx = document.getElementById('hourlyChart');
        if (!ctx) return;
        if (charts.hourly) { try { charts.hourly.destroy(); } catch(e){} }
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const labels = hourlySeries.map((_, i) => {
            const d = new Date();
            d.setHours(d.getHours() - (23 - i));
            return d.getHours() + ':00';
        });
        const data = hourlySeries.map(p => p.pm25);
        charts.hourly = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [{
                label: 'PM2.5 (µg/m³)',
                data,
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(124,58,237,0.1)',
                fill: true,
                tension: 0.35,
                pointRadius: data.map((_, i) => i === 23 ? 5 : 2),
                pointBackgroundColor: data.map(v => getPM25Color(v))
            }]},
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: isDark ? '#334155' : '#E2E8F0' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function updateHourlyReadout(idx) {
        const i = parseInt(idx);
        const point = hourlySeries[i];
        const readout = document.getElementById('hourly-readout');
        if (!readout || !point) return;
        const d = new Date();
        d.setHours(d.getHours() - (23 - i));
        const timeStr = d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const color = getPM25TextColor(point.pm25); // text on white readout
        readout.innerHTML = `<strong style="color: ${color};">${point.pm25} µg/m³</strong> at ${timeStr} (${getWHOMultiple(point.pm25)}× WHO)`;
    }

    // ── Pollution Calendar ──
    async function renderPollutionCalendar() {
        try { await ensureChartJs(); } catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Chart.js'); return; }
        const grid = document.getElementById('pollution-calendar-grid');
        if (!grid) return;

        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const avgAQI = [320, 280, 180, 120, 110, 90, 80, 75, 95, 180, 380, 350];
        const sources = [
            'Inversion, heating',
            'Dust, inversion fading',
            'Construction dust',
            'Dust storms (Rajasthan)',
            'Heat, low wind',
            'Pre-monsoon, cleaner',
            'Monsoon washout',
            'Monsoon — cleanest',
            'Post-monsoon transition',
            'Stubble burning begins',
            'Stubble + Diwali + inversion',
            'Inversion peak, heating'
        ];

        grid.innerHTML = months.map((m, i) => `
            <div style="background: ${getAQIColor(avgAQI[i])}; color: white; padding: 0.5rem; border-radius: var(--radius); text-align: center; font-size: 0.7rem;">
                <div style="font-weight: 700;">${m}</div>
                <div style="font-size: 1.1rem; font-weight: 700;">${avgAQI[i]}</div>
                <div style="font-size: 0.55rem; opacity: 0.9;">${sources[i]}</div>
            </div>
        `).join('');

        // Calendar chart
        setTimeout(() => {
            const ctx = document.getElementById('calendarChart');
            if (ctx) {
                if (charts.calendar) charts.calendar.destroy();
                charts.calendar = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Avg AQI (Delhi)', data: avgAQI, borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
                            { label: 'WHO Guideline (AQI 50)', data: Array(12).fill(50), borderColor: '#22C55E', borderDash: [5,5], fill: false, pointRadius: 0 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 450 } } }
                });
            }
        }, 200);
    }

    // ── Migration Comparison (enhanced) ──
    // Client-side source apportionment data (mirrored from backend air-query.mjs)
    const MIGRATION_APPORTIONMENT = {
        delhi: {
            sources: [
                { name: "Vehicles", pct: 25 },
                { name: "Industries + coal TPPs", pct: 22 },
                { name: "Road dust + construction", pct: 18 },
                { name: "Stubble burning (Oct-Nov)", pct: 14 },
                { name: "Residential biomass", pct: 13 },
                { name: "Open waste burning", pct: 8 }
            ],
            citation: "CAQM 2026; IIT-Delhi DSS 2024; CEEW 2024"
        },
        mumbai: {
            sources: [
                { name: "Vehicles", pct: 28 },
                { name: "Industries (Mahul-Trombay)", pct: 19 },
                { name: "Sea-salt + secondary", pct: 18 },
                { name: "Road + construction dust", pct: 15 },
                { name: "Residential cooking", pct: 11 },
                { name: "Waste + landfill burning", pct: 9 }
            ],
            citation: "TERI-Mumbai 2021; CSIR-NEERI 2023"
        },
        bangalore: {
            sources: [
                { name: "Vehicles", pct: 35 },
                { name: "Construction dust", pct: 22 },
                { name: "Industries", pct: 14 },
                { name: "Secondary aerosols", pct: 12 },
                { name: "Residential", pct: 9 },
                { name: "Lake-bed + waste burning", pct: 8 }
            ],
            citation: "CSIR-NEERI 2023; KSPCB 2022"
        },
        kolkata: {
            sources: [
                { name: "Vehicles", pct: 26 },
                { name: "Coal/diesel industries", pct: 23 },
                { name: "Residential biomass", pct: 15 },
                { name: "Road dust", pct: 14 },
                { name: "Open burning + waste", pct: 11 },
                { name: "Brick kilns", pct: 11 }
            ],
            citation: "Bose Institute 2022; Jadavpur Univ."
        },
        chennai: {
            sources: [
                { name: "Industries (Manali, Ennore)", pct: 28 },
                { name: "Vehicles", pct: 22 },
                { name: "Sea-salt + secondary", pct: 20 },
                { name: "Road + construction dust", pct: 14 },
                { name: "Residential biomass", pct: 8 },
                { name: "Open waste burning", pct: 8 }
            ],
            citation: "CPCB-Chennai 2023; IIT-Madras"
        },
        lucknow: {
            sources: [
                { name: "Vehicles", pct: 24 },
                { name: "Brick kilns", pct: 21 },
                { name: "Residential biomass", pct: 18 },
                { name: "Road dust", pct: 16 },
                { name: "Industries", pct: 12 },
                { name: "Open burning", pct: 9 }
            ],
            citation: "TERI 2022; UP PCB"
        },
        patna: {
            sources: [
                { name: "Residential biomass", pct: 26 },
                { name: "Vehicles + diesel gensets", pct: 21 },
                { name: "Brick kilns", pct: 17 },
                { name: "Road dust", pct: 15 },
                { name: "Open burning", pct: 12 },
                { name: "Stubble (Punjab+Bihar)", pct: 9 }
            ],
            citation: "ICAR-RCER 2023; Bihar PCB; CEEW 2024"
        },
        pune: {
            sources: [
                { name: "Vehicles", pct: 30 },
                { name: "Construction + road dust", pct: 22 },
                { name: "Open burning + secondary", pct: 20 },
                { name: "Industries", pct: 18 },
                { name: "Residential", pct: 10 }
            ],
            citation: "IITM-Pune; CSIR-NEERI 2022"
        },
        varanasi: {
            sources: [
                { name: "Road dust", pct: 35 },
                { name: "Brick kilns + industries", pct: 19 },
                { name: "Open burning + stubble", pct: 16 },
                { name: "Vehicles", pct: 16 },
                { name: "Residential biomass", pct: 14 }
            ],
            citation: "NCAP CREA 2024; BHU"
        },
        ahmedabad: {
            sources: [
                { name: "Industries (Naroda, Vatva)", pct: 25 },
                { name: "Vehicles", pct: 22 },
                { name: "Road + construction dust", pct: 20 },
                { name: "Brick kilns", pct: 13 },
                { name: "Residential biomass", pct: 11 },
                { name: "Open burning + secondary", pct: 9 }
            ],
            citation: "GPCB; IIT-Gandhinagar"
        },
        hyderabad: {
            sources: [
                { name: "Vehicles", pct: 30 },
                { name: "Industries", pct: 20 },
                { name: "Construction + road dust", pct: 20 },
                { name: "Residential", pct: 12 },
                { name: "Open burning + secondary", pct: 18 }
            ],
            citation: "TSPCB 2023; CSIR-IICT studies"
        }
    };

    // NCAP non-attainment cities (131 total, these are the ones in our CITIES object)
    const NCAP_NONATTAINMENT = new Set([
        'delhi','mumbai','kolkata','chennai','bangalore','hyderabad',
        'gurgaon','noida','faridabad','ghaziabad','lucknow','kanpur',
        'patna','jaipur','ahmedabad','pune','chandigarh','varanasi',
        'agra','bhopal','indore','nagpur','visakhapatnam',
        'muzaffarpur','gaya','raipur','jodhpur','guwahati','dehradun','amritsar'
    ]);

    async function calcMigration() {
        const fromKey = document.getElementById('migrate-from')?.value;
        const toKey = document.getElementById('migrate-to')?.value;
        if (!fromKey || !toKey) return;
        const age = parseInt(document.getElementById('migrate-age')?.value || 30);
        const family = parseInt(document.getElementById('migrate-family')?.value || 4);
        const resultEl = document.getElementById('migration-result');
        const loadingEl = document.getElementById('migration-loading');

        const fromName = CITIES[fromKey]?.name || fromKey;
        const toName = CITIES[toKey]?.name || toKey;

        // Show loading
        if (loadingEl) loadingEl.style.display = 'block';
        resultEl.innerHTML = '';

        // Fetch live AQI for both cities in parallel
        let fromLive = null, toLive = null;
        try {
            [fromLive, toLive] = await Promise.all([fetchAQI(fromKey), fetchAQI(toKey)]);
        } catch (e) {
            console.warn('[Migration] Live fetch failed:', e.message);
        }

        if (loadingEl) loadingEl.style.display = 'none';

        // Live values
        const fromLiveAQI = fromLive?.aqi || null;
        const toLiveAQI = toLive?.aqi || null;
        const fromLivePM25 = fromLive?.pm25 || null;
        const toLivePM25 = toLive?.pm25 || null;

        // Annual values (IQAir 2025 cached)
        const fromAnnualPM25 = CITY_ANNUAL_PM25[fromKey] || null;
        const toAnnualPM25 = CITY_ANNUAL_PM25[toKey] || null;

        // Use annual for health calcs (more robust than single snapshot)
        const fromPM25 = fromAnnualPM25 || fromLivePM25 || 50;
        const toPM25 = toAnnualPM25 || toLivePM25 || 50;

        // AQLI formula: life-expectancy loss = (PM2.5 - WHO guideline) / 10 * 0.98
        // Simplified: each 10 ug/m3 above WHO guideline of 5 = 0.98 years lost
        const fromLifeLoss = Math.max(0, (fromPM25 - 5)) / 10 * 0.98;
        const toLifeLoss = Math.max(0, (toPM25 - 5)) / 10 * 0.98;
        const lifeGain = fromLifeLoss - toLifeLoss;

        // Cigarette equivalence (Berkeley Earth: 1 cig ~ 22 ug/m3 daily exposure)
        const fromCigs = fromPM25 / 22;
        const toCigs = toPM25 / 22;
        const cigsSavedPerDay = fromCigs - toCigs;
        const cigsSavedPerYear = cigsSavedPerDay * 365;

        const pmReduction = fromPM25 - toPM25;
        const isImprovement = pmReduction > 0;

        // WHO multiples
        const fromWHO = getWHOMultiple(fromPM25);
        const toWHO = getWHOMultiple(toPM25);

        // NCAP target city?
        const fromNCAP = NCAP_NONATTAINMENT.has(fromKey);
        const toNCAP = NCAP_NONATTAINMENT.has(toKey);

        // Apportionment data
        const fromApport = MIGRATION_APPORTIONMENT[fromKey] || null;
        const toApport = MIGRATION_APPORTIONMENT[toKey] || null;

        // Helper to format AQI with color
        function aqiBadge(aqi) {
            if (!aqi) return '<span style="color: var(--text-3);">N/A</span>';
            return `<span style="color: ${getAQIColor(aqi)}; font-weight: 700;">${aqi}</span> <small style="color: var(--text-3);">(${getAQILabel(aqi)})</small>`;
        }

        function pm25Badge(pm25) {
            if (!pm25) return '<span style="color: var(--text-3);">N/A</span>';
            return `<span style="color: ${getPM25TextColor(pm25)}; font-weight: 700;">${pm25}</span>`;
        }

        // Build the comparison HTML
        let html = '';

        // ── Verdict hero ──
        html += `
        <div class="card mb-3" style="border-left: 4px solid ${isImprovement ? 'var(--green-600)' : 'var(--red)'};">
            <div class="card-body" style="text-align: center; padding: 2rem;">
                <div style="font-size: 2.5rem; font-weight: 800; color: ${isImprovement ? 'var(--green-600)' : 'var(--red)'};">
                    ${isImprovement ? '+' : ''}${lifeGain.toFixed(1)} years
                </div>
                <div style="font-size: 1rem; color: var(--text-2); margin-bottom: 1rem;">
                    ${isImprovement ? 'Life expectancy GAINED per person by moving' : 'Life expectancy would DECREASE by moving'}
                </div>
                <div style="font-size: 0.95rem; color: var(--text-1); max-width: 36rem; margin: 0 auto; line-height: 1.6;">
                    ${isImprovement
                        ? `Moving from <strong>${fromName}</strong> to <strong>${toName}</strong> would add ~<strong>${lifeGain.toFixed(1)} years</strong> of life expectancy based on current air quality (AQLI 2025). Your family of ${family} would collectively gain <strong>${(lifeGain * family).toFixed(1)} life-years</strong>.`
                        : `Moving from <strong>${fromName}</strong> to <strong>${toName}</strong> would reduce life expectancy by ~<strong>${Math.abs(lifeGain).toFixed(1)} years</strong>. Consider cities with lower PM2.5 levels.`}
                </div>
                ${isImprovement ? `
                <div style="display: flex; gap: 2rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--green-600);">${Math.round(cigsSavedPerYear)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-3);">cigarettes saved/year</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--green-600);">${(lifeGain * family).toFixed(1)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-3);">family life-years gained</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--green-600);">${Math.abs(pmReduction)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-3);">PM2.5 reduction (ug/m3)</div>
                    </div>
                </div>` : ''}
            </div>
        </div>`;

        // ── Side-by-side comparison table ──
        html += `
        <div class="card mb-3">
            <div class="card-header"><span class="card-title">Side-by-Side Comparison</span></div>
            <div class="card-body" style="padding: 0;">
                <div class="table-wrap">
                <table class="data-table" style="font-size: 0.8125rem; margin: 0;">
                    <thead>
                        <tr>
                            <th style="min-width: 160px;">Metric</th>
                            <th style="text-align: center;">${fromName}</th>
                            <th style="text-align: center;">${toName}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Live AQI</strong></td>
                            <td style="text-align: center;">${aqiBadge(fromLiveAQI)}</td>
                            <td style="text-align: center;">${aqiBadge(toLiveAQI)}</td>
                        </tr>
                        <tr>
                            <td><strong>Live PM2.5</strong> (ug/m3)</td>
                            <td style="text-align: center;">${pm25Badge(fromLivePM25)}</td>
                            <td style="text-align: center;">${pm25Badge(toLivePM25)}</td>
                        </tr>
                        <tr style="background: var(--bg-2, #f9fafb);">
                            <td><strong>Annual PM2.5</strong> (IQAir 2025)</td>
                            <td style="text-align: center;">${fromAnnualPM25 ? pm25Badge(fromAnnualPM25) + ' ug/m3' : '<span style="color:var(--text-3);">N/A</span>'}</td>
                            <td style="text-align: center;">${toAnnualPM25 ? pm25Badge(toAnnualPM25) + ' ug/m3' : '<span style="color:var(--text-3);">N/A</span>'}</td>
                        </tr>
                        <tr>
                            <td><strong>WHO multiple</strong></td>
                            <td style="text-align: center; font-weight: 700; color: ${getPM25TextColor(fromPM25)};">${fromWHO}x</td>
                            <td style="text-align: center; font-weight: 700; color: ${getPM25TextColor(toPM25)};">${toWHO}x</td>
                        </tr>
                        <tr style="background: var(--bg-2, #f9fafb);">
                            <td><strong>Cigarettes/day</strong> equiv.</td>
                            <td style="text-align: center;">${fromCigs.toFixed(1)}/day</td>
                            <td style="text-align: center;">${toCigs.toFixed(1)}/day</td>
                        </tr>
                        <tr>
                            <td><strong>Life-expectancy loss</strong> (AQLI)</td>
                            <td style="text-align: center; color: ${getPM25TextColor(fromPM25)};">${fromLifeLoss.toFixed(1)} years</td>
                            <td style="text-align: center; color: ${getPM25TextColor(toPM25)};">${toLifeLoss.toFixed(1)} years</td>
                        </tr>
                        <tr style="background: var(--bg-2, #f9fafb);">
                            <td><strong>NCAP target city?</strong></td>
                            <td style="text-align: center;">${fromNCAP ? '<span style="color: var(--amber); font-weight: 700;">Yes</span>' : '<span style="color: var(--green-600);">No</span>'}</td>
                            <td style="text-align: center;">${toNCAP ? '<span style="color: var(--amber); font-weight: 700;">Yes</span>' : '<span style="color: var(--green-600);">No</span>'}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>`;

        // ── Source apportionment comparison ──
        if (fromApport || toApport) {
            html += `
            <div class="card mb-3">
                <div class="card-header"><span class="card-title">Pollution Source Breakdown</span></div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">`;

            // Source bars helper
            function renderSourceBars(apport, cityName) {
                if (!apport) return `<div><h4 style="font-size: 0.875rem; margin-bottom: 0.75rem;">${cityName}</h4><p style="font-size: 0.8rem; color: var(--text-3);">No source apportionment data available for this city.</p></div>`;
                const barColors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#6366F1'];
                let barsHtml = `<div><h4 style="font-size: 0.875rem; margin-bottom: 0.75rem;">${cityName}</h4>`;
                apport.sources.forEach((s, i) => {
                    const color = barColors[i % barColors.length];
                    barsHtml += `
                        <div style="margin-bottom: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 2px;">
                                <span>${s.name}</span><span style="font-weight: 700;">${s.pct}%</span>
                            </div>
                            <div style="height: 8px; background: var(--bg-3, #e5e7eb); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${s.pct}%; background: ${color}; border-radius: 4px;"></div>
                            </div>
                        </div>`;
                });
                barsHtml += `<div style="font-size: 0.65rem; color: var(--text-3); margin-top: 0.5rem;">Source: ${apport.citation}</div></div>`;
                return barsHtml;
            }

            html += renderSourceBars(fromApport, fromName);
            html += renderSourceBars(toApport, toName);

            html += `
                    </div>
                </div>
            </div>`;
        }

        // ── Caveat ──
        html += `
        <div class="alert alert-info" style="font-size: 0.8rem;">
            <strong>Methodology notes:</strong> Life-expectancy calculations use the AQLI 2025 formula (each 10 ug/m3 above WHO guideline of 5 ug/m3 = 0.98 years lost). Cigarette equivalence uses Berkeley Earth (1 cigarette ~ 22 ug/m3 daily exposure). Annual PM2.5 values from IQAir World Air Quality Report 2025. Live AQI from WAQI (single nearest station &mdash; snapshot, not annual average). Source apportionment from CEEW 2024, TERI, IIT-Delhi DSS, CSIR-NEERI, and city-specific studies.<br>
            <strong>Caveat:</strong> Live values are today's snapshot. The health calculations use annual averages for a more robust comparison. Actual benefit depends on duration of residence, indoor air quality, and individual health factors.
        </div>
        <div style="text-align: center; margin-top: 1rem;">
            <button onclick="shareMigrationResultWhatsApp()" style="background: #0f766e; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.584-1.476A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.818-6.296-2.187l-.44-.362-3.26 1.05 1.07-3.188-.394-.46A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                Share on WhatsApp
            </button>
        </div>`;

        resultEl.innerHTML = html;
    }

    // ── Accountability Scorecards ──
    const NCAP_DATA = {
        delhi: { target: 40, achieved: 8, fundsAllocated: 81, fundsUtilized: 14, stations: 40, stationsOnline: 32 },
        mumbai: { target: 30, achieved: 15, fundsAllocated: 380, fundsUtilized: 220, stations: 28, stationsOnline: 22 },
        lucknow: { target: 35, achieved: 5, fundsAllocated: 180, fundsUtilized: 72, stations: 12, stationsOnline: 8 },
        patna: { target: 40, achieved: 3, fundsAllocated: 120, fundsUtilized: 84, stations: 6, stationsOnline: 4 },
        kolkata: { target: 30, achieved: 12, fundsAllocated: 95, fundsUtilized: 45, stations: 15, stationsOnline: 11 },
        chennai: { target: 20, achieved: 18, fundsAllocated: 65, fundsUtilized: 52, stations: 10, stationsOnline: 9 },
        bangalore: { target: 25, achieved: 10, fundsAllocated: 85, fundsUtilized: 40, stations: 14, stationsOnline: 10 },
        hyderabad: { target: 25, achieved: 12, fundsAllocated: 70, fundsUtilized: 35, stations: 12, stationsOnline: 9 }
    };

    function generateScorecard() {
        const cityKey = document.getElementById('scorecard-city')?.value;
        if (!cityKey) return;
        // Extended cities aren't eagerly loaded — fetch live AQI on demand, then re-render.
        if (!aqiData[cityKey] && CITIES[cityKey] && !CITIES[cityKey]._fetching) {
            CITIES[cityKey]._fetching = true;
            fetchAQI(cityKey).then(v => { CITIES[cityKey]._fetching = false; if (v) { aqiData[cityKey] = v; if (document.getElementById('scorecard-city')?.value === cityKey) generateScorecard(); } }).catch(() => { CITIES[cityKey]._fetching = false; });
        }
        const ncap = NCAP_DATA[cityKey];
        const cityName = CITIES[cityKey]?.name || cityKey;
        const data = aqiData[cityKey];
        const aqi = data?.aqi || '?';
        const pm25 = CITY_ANNUAL_PM25[cityKey] || '?';

        document.getElementById('scorecard-display').style.display = 'block';

        const fundUtil = ncap ? Math.round(ncap.fundsUtilized / ncap.fundsAllocated * 100) : '?';
        const stationUptime = ncap ? Math.round(ncap.stationsOnline / ncap.stations * 100) : '?';
        const grade = ncap ? (ncap.achieved >= ncap.target * 0.7 ? 'B' : ncap.achieved >= ncap.target * 0.3 ? 'C' : 'D') : '?';
        const gradeColor = grade === 'B' ? '#EAB308' : grade === 'C' ? '#F97316' : '#EF4444';

        document.getElementById('scorecard-content').innerHTML = `
            <div style="text-align: center; padding: 1rem 0; border-bottom: 2px solid var(--border);">
                <div style="font-size: 0.75rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em;">JanVayu Accountability Scorecard</div>
                <div style="font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0;">${cityName}</div>
                <div style="font-size: 4rem; font-weight: 700; color: ${gradeColor};">${grade}</div>
                <div style="font-size: 0.85rem; color: var(--text-2);">Overall Air Quality Grade</div>
            </div>
            ${ncap ? `
            <div class="grid-4 mt-3" style="gap: 1rem; text-align: center;">
                <div><div style="font-size: 0.7rem; color: var(--text-3);">NCAP Target</div><div style="font-size: 1.25rem; font-weight: 700;">-${ncap.target}%</div></div>
                <div><div style="font-size: 0.7rem; color: var(--text-3);">Achieved</div><div style="font-size: 1.25rem; font-weight: 700; color: ${ncap.achieved >= ncap.target * 0.5 ? '#EAB308' : '#EF4444'};">-${ncap.achieved}%</div></div>
                <div><div style="font-size: 0.7rem; color: var(--text-3);">Fund Utilization</div><div style="font-size: 1.25rem; font-weight: 700;">${fundUtil}%</div></div>
                <div><div style="font-size: 0.7rem; color: var(--text-3);">Station Uptime</div><div style="font-size: 1.25rem; font-weight: 700;">${stationUptime}%</div></div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-2); text-align: center;">
                Current AQI: ${aqi} | Annual PM2.5: ${pm25} µg/m³ (${getWHOMultiple(pm25)}x WHO) | Funds: ₹${ncap.fundsUtilized}/${ncap.fundsAllocated} Cr utilized
            </div>` : '<p style="color: var(--text-3); text-align: center; margin-top: 1rem;">NCAP data not available for this city.</p>'}
            <div style="margin-top: 1rem; font-size: 0.65rem; color: var(--text-3); text-align: center;">Generated by JanVayu (janvayu.in) · Data: CPCB, CREA, MoEFCC · ${new Date().toLocaleDateString('en-IN')}</div>`;
    }

    // Map a scorecard city to the RTI form's state option (best-effort; left
    // blank when unknown so we never prefill a wrong state — data honesty).
    const RTI_CITY_STATE = {
        delhi: 'delhi', newdelhi: 'delhi',
        gurgaon: 'haryana', gurugram: 'haryana', faridabad: 'haryana',
        noida: 'up', ghaziabad: 'up', meerut: 'up', kanpur: 'up', lucknow: 'up', varanasi: 'up', agra: 'up', prayagraj: 'up', allahabad: 'up',
        mumbai: 'maharashtra', pune: 'maharashtra', nagpur: 'maharashtra', nashik: 'maharashtra',
        bangalore: 'karnataka', bengaluru: 'karnataka',
        chennai: 'tamilnadu', coimbatore: 'tamilnadu', madurai: 'tamilnadu',
        kolkata: 'westbengal', howrah: 'westbengal', asansol: 'westbengal', durgapur: 'westbengal',
        jaipur: 'rajasthan', jodhpur: 'rajasthan', kota: 'rajasthan',
        bhopal: 'mp', indore: 'mp', gwalior: 'mp',
        patna: 'bihar', gaya: 'bihar', muzaffarpur: 'bihar',
        ludhiana: 'punjab', amritsar: 'punjab', jalandhar: 'punjab', patiala: 'punjab', bathinda: 'punjab',
        ahmedabad: 'gujarat', surat: 'gujarat', vadodara: 'gujarat'
    };

    // One-click: open the RTI Assistant pre-filled to ask this city's pollution
    // board about Clean Air Action Plan implementation (the relevant question
    // when a scorecard shows a missed NCAP target).
    function openRTIForScorecard() {
        const cityKey = document.getElementById('scorecard-city')?.value;
        const state = RTI_CITY_STATE[cityKey] || '';
        showPanel('rti-assistant');
        setTimeout(() => {
            try {
                const st = document.getElementById('rti-state');
                const tp = document.getElementById('rti-topic');
                if (st && state) { st.value = state; if (typeof updateRTIAuthority === 'function') updateRTIAuthority(); }
                if (tp) { tp.value = 'action-plan'; if (typeof updateRTIPreview === 'function') updateRTIPreview(); }
                const cq = document.getElementById('rti-custom-q'); if (cq) cq.style.display = 'none';
                if (typeof generateRTI === 'function') generateRTI();
            } catch (e) { console.warn('openRTIForScorecard:', e); }
        }, 400);
    }
    window.openRTIForScorecard = openRTIForScorecard;

    function shareScorecard(platform) {
        const cityKey = document.getElementById('scorecard-city')?.value;
        const cityName = CITIES[cityKey]?.name || '';
        const text = `${cityName} Air Quality Scorecard from JanVayu — check how your city is performing on clean air targets:`;
        const url = window.location.origin + '#scorecards';
        if (platform === 'twitter') window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        else if (platform === 'copy') { navigator.clipboard.writeText(text + ' ' + url); alert('Link copied!'); }
    }

    function downloadScorecard() {
        alert('Screenshot the scorecard above to share as an image. Use your browser\'s built-in screenshot tool or Ctrl+Shift+S.');
    }

    // ── Data Archive ──
    function initArchiveData() {
        // Accumulate data points in localStorage
        const key = 'janvayu_archive';
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const snapshot = {
            timestamp: new Date().toISOString(),
            cities: {}
        };
        Object.entries(aqiData).forEach(([city, data]) => {
            snapshot.cities[city] = { aqi: data.aqi, pm25: data.pm25, pm10: data.pm10 };
        });
        if (Object.keys(snapshot.cities).length > 0) {
            stored.push(snapshot);
            // Keep max 1000 snapshots (~7 days at 10-min intervals)
            if (stored.length > 1000) stored.splice(0, stored.length - 1000);
            localStorage.setItem(key, JSON.stringify(stored));
        }
        updateArchiveStats();
    }

    function updateArchiveStats() {
        const el = document.getElementById('archive-stats');
        if (!el) return;
        const stored = JSON.parse(localStorage.getItem('janvayu_archive') || '[]');
        if (stored.length === 0) {
            el.innerHTML = '<p style="color: var(--text-3); font-size: 0.85rem;">No accumulated data yet. Keep this tab open to collect data points.</p>';
            return;
        }
        const oldest = new Date(stored[0].timestamp);
        const newest = new Date(stored[stored.length - 1].timestamp);
        el.innerHTML = `
            <div style="font-size: 0.85rem;">
                <div><strong>${stored.length}</strong> snapshots collected</div>
                <div>From: ${oldest.toLocaleString('en-IN')}</div>
                <div>To: ${newest.toLocaleString('en-IN')}</div>
                <div>Cities covered: ${Object.keys(stored[stored.length-1].cities || {}).length}</div>
            </div>`;
    }

    function downloadArchive() {
        const format = document.getElementById('archive-format')?.value || 'csv';
        const selectedCities = Array.from(document.getElementById('archive-cities')?.selectedOptions || []).map(o => o.value);
        const citiesToExport = selectedCities.length > 0 ? selectedCities : Object.keys(aqiData);

        const data = {};
        citiesToExport.forEach(c => {
            if (aqiData[c]) {
                data[c] = {
                    ...aqiData[c],
                    city_name: CITIES[c]?.name,
                    region: CITIES[c]?.region,
                    who_multiple: aqiData[c].pm25 ? getWHOMultiple(aqiData[c].pm25) : null,
                    aqi_category: aqiData[c].aqi ? getAQILabel(aqiData[c].aqi) : null
                };
            }
        });

        let blob, url;
        if (format === 'json') {
            blob = new Blob([JSON.stringify({ timestamp: new Date().toISOString(), source: 'JanVayu / WAQI', cities: data }, null, 2)], { type: 'application/json' });
            url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `janvayu-archive-${new Date().toISOString().split('T')[0]}.json`; a.click();
            URL.revokeObjectURL(url);
        } else {
            let csv = 'City,Region,AQI,AQI_Category,PM2.5,PM10,WHO_Multiple,Station,Timestamp\n';
            Object.entries(data).forEach(([key, d]) => {
                csv += `"${d.city_name || key}","${d.region || ''}",${d.aqi || ''},${d.aqi_category || ''},${d.pm25 || ''},${d.pm10 || ''},${d.who_multiple || ''},"${d.station || ''}","${d.time || ''}"\n`;
            });
            blob = new Blob([csv], { type: 'text/csv' });
            url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `janvayu-archive-${new Date().toISOString().split('T')[0]}.csv`; a.click();
            URL.revokeObjectURL(url);
        }
    }

    function downloadAccumulatedData() {
        const stored = JSON.parse(localStorage.getItem('janvayu_archive') || '[]');
        if (stored.length === 0) { alert('No accumulated data yet.'); return; }
        let csv = 'Timestamp,City,AQI,PM2.5,PM10\n';
        stored.forEach(snap => {
            Object.entries(snap.cities).forEach(([city, d]) => {
                csv += `"${snap.timestamp}","${CITIES[city]?.name || city}",${d.aqi || ''},${d.pm25 || ''},${d.pm10 || ''}\n`;
            });
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `janvayu-timeseries-${new Date().toISOString().split('T')[0]}.csv`; a.click();
        URL.revokeObjectURL(url);
    }

    function clearAccumulatedData() {
        if (confirm('Clear all accumulated data? This cannot be undone.')) {
            localStorage.removeItem('janvayu_archive');
            updateArchiveStats();
        }
    }

    // ── Correlation Explorer ──
    const CITY_CORR_DATA = {
        delhi: { pm25: 100, aqi: 280, population: 20, deaths: 54000, life_years: 3.5, economic_cost: 5.8, hospital: 95 },
        mumbai: { pm25: 42, aqi: 120, population: 21, deaths: 18000, life_years: 1.5, economic_cost: 3.2, hospital: 45 },
        kolkata: { pm25: 84, aqi: 180, population: 15, deaths: 28000, life_years: 2.8, economic_cost: 4.5, hospital: 72 },
        chennai: { pm25: 31, aqi: 85, population: 11, deaths: 7000, life_years: 1.0, economic_cost: 1.8, hospital: 30 },
        bangalore: { pm25: 48, aqi: 110, population: 13, deaths: 12000, life_years: 1.6, economic_cost: 2.5, hospital: 40 },
        hyderabad: { pm25: 55, aqi: 130, population: 10, deaths: 11000, life_years: 1.8, economic_cost: 2.8, hospital: 48 },
        lucknow: { pm25: 88, aqi: 220, population: 3.5, deaths: 8500, life_years: 3.0, economic_cost: 4.8, hospital: 78 },
        patna: { pm25: 96, aqi: 260, population: 2.5, deaths: 6800, life_years: 3.2, economic_cost: 5.2, hospital: 85 },
        jaipur: { pm25: 72, aqi: 170, population: 4, deaths: 7200, life_years: 2.4, economic_cost: 3.8, hospital: 58 },
        ahmedabad: { pm25: 58, aqi: 140, population: 8, deaths: 10500, life_years: 2.0, economic_cost: 3.0, hospital: 50 }
    };

    async function updateCorrelation() {
        try { await ensureChartJs(); } catch (e) { renderLibraryFallback('#panel-container .panel.active', 'Chart.js'); return; }
        const xAxis = document.getElementById('corr-x')?.value || 'pm25';
        const yAxis = document.getElementById('corr-y')?.value || 'deaths';

        const labels = { pm25: 'Annual PM2.5 (µg/m³)', aqi: 'Average AQI', population: 'Population (M)', deaths: 'Est. Deaths/Year', life_years: 'Life Years Lost', economic_cost: 'Economic Cost (% GDP)', hospital: 'Hospital Admissions Index' };

        const points = Object.entries(CITY_CORR_DATA).map(([key, d]) => ({
            x: d[xAxis], y: d[yAxis], label: CITIES[key]?.name || key
        }));

        setTimeout(() => {
            const ctx = document.getElementById('correlationChart');
            if (!ctx) return;
            if (charts.correlation) charts.correlation.destroy();
            charts.correlation = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: `${labels[yAxis]} vs ${labels[xAxis]}`,
                        data: points,
                        backgroundColor: points.map(p => getAQIColor(p.x * (xAxis === 'pm25' ? 2 : 1))),
                        pointRadius: 8, pointHoverRadius: 12
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { x: { title: { display: true, text: labels[xAxis] } }, y: { title: { display: true, text: labels[yAxis] } } },
                    plugins: {
                        tooltip: {
                            callbacks: { label: (ctx) => `${ctx.raw.label}: ${labels[xAxis]}=${ctx.raw.x}, ${labels[yAxis]}=${ctx.raw.y}` }
                        },
                        legend: { display: false }
                    }
                }
            });
        }, 200);
    }

    // ── Populate city dropdowns for new features ──
    // Strip stray markdown so Ask JanVayu answers always render clean, even if
    // the model slips in **bold**, ### headings, `code` or | table | pipes.
    function cleanChatText(s) {
        if (!s) return '';
        return String(s)
            .replace(/\r/g, '')
            .replace(/#{1,6}[ \t]+/g, '')                    // ### headings -> plain (inline too)
            .replace(/\*\*(.+?)\*\*/g, '$1')                 // **bold**
            .replace(/__(.+?)__/g, '$1')                     // __bold__
            .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')           // `code`
            .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, m => m.replace(/\s*\|\s*/g, '  ').trim()) // | table | rows
            .replace(/^[ \t]*[-*][ \t]+/gm, '- ')            // normalise bullets
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }
    window.cleanChatText = cleanChatText;

    // Append the extended (lazy-fetched) cities to the selectors that ship with
    // a hardcoded core list (hero, comparison, alerts), so users can pick any of
    // the 100+ cities. Idempotent via a data flag. The fully-dynamic selectors
    // (handled by populateCityDropdowns + the forecast panel) already list all.
    function populateExtendedCitySelectors() {
        const extEntries = Object.keys(CITIES)
            .filter(k => CITIES[k].ext)
            .map(k => [k, CITIES[k].name])
            .sort((a, b) => a[1].localeCompare(b[1]));
        if (!extEntries.length) return;
        ['hero-city-select', 'compare-city1', 'compare-city2', 'compare-city3', 'alert-city'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel || sel.dataset.extAdded) return;
            const existing = new Set(Array.from(sel.querySelectorAll('option')).map(o => o.value));
            let container = sel;
            if (sel.querySelector('optgroup')) {
                const og = document.createElement('optgroup');
                og.label = 'More cities (A–Z)';
                sel.appendChild(og);
                container = og;
            }
            extEntries.forEach(([k, name]) => {
                if (existing.has(k)) return;
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = name;
                container.appendChild(opt);
            });
            sel.dataset.extAdded = '1';
        });
    }
    window.populateExtendedCitySelectors = populateExtendedCitySelectors;

    function populateCityDropdowns() {
        const dropdowns = ['outside-city', 'exposure-city', 'diary-city', 'purifier-city', 'hyperlocal-city', 'migrate-from', 'migrate-to', 'scorecard-city'];
        const defaults = { 'migrate-to': 'bangalore' }; // Different default for migration destination
        dropdowns.forEach(id => {
            const el = document.getElementById(id);
            if (!el || el.options.length > 1) return;
            const defaultCity = defaults[id] || 'delhi';
            const indianCities = Object.entries(CITIES).filter(([k, v]) => v.region !== 'intl');
            indianCities.forEach(([key, city]) => {
                const opt = document.createElement('option');
                opt.value = key; opt.textContent = city.name;
                if (key === defaultCity) opt.selected = true;
                el.appendChild(opt);
            });
        });
        // Archive multi-select
        const archiveEl = document.getElementById('archive-cities');
        if (archiveEl && archiveEl.options.length === 0) {
            Object.entries(CITIES).filter(([k, v]) => v.region !== 'intl').forEach(([key, city]) => {
                const opt = document.createElement('option');
                opt.value = key; opt.textContent = city.name; opt.selected = true;
                archiveEl.appendChild(opt);
            });
        }
    }

    // ── Panel init hooks ──
    const originalLoadPanel = loadPanel;
    loadPanel = function(panelId) {
        Promise.resolve(originalLoadPanel(panelId)).then(function() {
        setTimeout(() => {
            populateCityDropdowns();
            populateExtendedCitySelectors();
            if (panelId === 'social-feed') loadSocialFeed();
            if (panelId === 'aqi-story') { if (typeof renderEditorialStory === 'function') setTimeout(renderEditorialStory, 100); }
            if (panelId === 'live-news') loadNewsFilter();
            if (panelId === 'voices') {
                loadVoicesLive();
                if (voicesRefreshInterval) clearInterval(voicesRefreshInterval);
                voicesRefreshInterval = setInterval(() => loadVoicesLive(), 15 * 60 * 1000);
            }
            if (panelId === 'testimony') { ensureTestimonies().then(() => { try { initTestimonyToolbar(); renderTestimonies(window.__testimonyLang || 'all'); } catch(e) { console.warn(e); } }); }
            if (panelId === 'aqi-alerts') { renderActiveAlerts(); renderAlertCityStatus(); }
            if (panelId === 'go-outside') checkGoOutside();
            if (panelId === 'school-closure') updateSchoolPrediction();
            if (panelId === 'exposure-report') generateExposureReport();
            if (panelId === 'exposure-diary') initExposureDiary();
            if (panelId === 'rti-assistant') generateRTI();
            if (panelId === 'purifier-calc') calcPurifier();
            if (panelId === 'hyperlocal') loadHyperlocal();
            if (panelId === 'pollution-calendar') renderPollutionCalendar();
            if (panelId === 'migration-calc') calcMigration();
            if (panelId === 'scorecards') generateScorecard();
            if (panelId === 'data-archive') updateArchiveStats();
            if (panelId === 'correlations') updateCorrelation();
        }, 200);
        });
    };

    // ── Floating Search & Feedback Widget ──
    const SECTION_INDEX = [
        { id: 'dashboard', title: 'Dashboard', desc: 'Live AQI, PM2.5, city comparison overview', keywords: 'home overview live aqi pm25 summary' },
        { id: 'health', title: 'Health Impact', desc: 'Deaths, disease burden, GEMM calculator', keywords: 'health deaths mortality disease burden copd asthma cancer gemm who' },
        { id: 'economic', title: 'Economic Cost', desc: 'GDP loss, productivity, healthcare spending', keywords: 'economic cost gdp money billion dollars productivity lancet world bank' },
        { id: 'children', title: "Children's Health", desc: 'Lung development, school closures, stunting', keywords: 'children kids school stunting lung development pediatric' },
        { id: 'gender', title: "Women's Health", desc: 'Indoor cooking, maternal health, occupational exposure, gender data gap', keywords: 'women gender female maternal pregnancy cooking chulha biomass indoor ujjwala lpg caregiver health' },
        { id: 'beyond-lungs', title: 'Beyond the Lungs', desc: 'PM2.5 harm to kidneys, heart, brain, metabolism & pregnancy', keywords: 'kidney renal egfr heart cardiovascular stroke brain cognition dementia diabetes metabolic pregnancy preterm birth weight mental health whole body systemic pm2.5 organ' },
        { id: 'indoor', title: 'Indoor Air Quality', desc: 'Household pollution, cooking fuel, chulha', keywords: 'indoor household cooking chulha solid fuel lpg ujjwala women' },
        { id: 'occupational', title: 'Occupational Exposure', desc: 'Outdoor & informal workers most exposed — vendors, traffic police, gig riders', keywords: 'occupational work worker street vendor traffic police gig delivery rider construction waste picker sanitation informal outdoor environmental justice equity peak expiratory flow respiratory exposure inequality' },
        { id: 'trends', title: 'Historical Trends', desc: 'Timeline 1981 to present, key milestones', keywords: 'history timeline trends historical air act 1981 ncap' },
        { id: 'compare', title: 'City Comparison', desc: 'Metro AQI rankings, live data table', keywords: 'city cities comparison metro delhi mumbai kolkata bangalore chennai' },
        { id: 'map', title: 'Live Map', desc: 'Interactive station markers, real-time', keywords: 'map live stations markers leaflet geographic' },
        { id: 'forecast', title: 'Air Quality Forecast', desc: 'Predictive models, seasonal patterns', keywords: 'forecast prediction weather seasonal imd winter' },
        { id: 'fire-tracker', title: 'Farm Fire Tracker', desc: 'Live stubble-burning fires (NASA FIRMS) in the NW-India belt', keywords: 'fire stubble burning farm crop residue parali punjab haryana ncr firms nasa satellite viirs smoke winter season source' },
        { id: 'policy', title: 'Policy Tracker', desc: 'NCAP targets vs reality, GRAP, CAQM', keywords: 'policy ncap grap caqm government regulation target effectiveness' },
        { id: 'budget', title: 'Budget Tracker', desc: 'NCAP funds, utilisation rates, spending', keywords: 'budget money funding ncap finance commission spending utilisation' },
        { id: 'accountability', title: 'Political Accountability', desc: 'MoEFCC, state compliance, RTI', keywords: 'political accountability moefcc minister state compliance rti parliament' },
        { id: 'corporate', title: 'Industrial Sources', desc: 'Factory emissions, corporate responsibility', keywords: 'industry industrial factory corporate emissions thermal power plant brick kiln' },
        { id: 'mission-tracker', title: 'Clean Air Mission Tracker', desc: 'Government promises vs outcomes', keywords: 'mission tracker promise outcome target achievement' },
        { id: 'city-policy', title: 'City Policy Tracker', desc: 'City-wise NCAP targets, expenditure, government actions', keywords: 'city policy tracker ncap target expenditure spending action government accountability budget utilisation delhi mumbai patna lucknow' },
        { id: 'progress', title: 'Clean Air Wins', desc: 'Positive progress, e-buses, city improvements', keywords: 'progress wins good news positive ebus electric bus varanasi success' },
        { id: 'actions', title: 'Take Action', desc: 'What you can do, advocacy guides', keywords: 'action advocacy citizen guide protest campaign demand' },
        { id: 'citizen-action', title: 'Citizen Plan', desc: 'Personal action planning tools', keywords: 'citizen plan personal steps protection mask purifier' },
        { id: 'legal', title: 'Legal Framework', desc: 'Supreme Court orders, Article 21, NGT', keywords: 'legal law court supreme ngt article 21 right clean air constitution' },
        { id: 'voices', title: 'Citizen Voices', desc: 'Social media, viral posts, public discourse', keywords: 'voices social media twitter reddit viral meme citizen opinion' },
        { id: 'testimony', title: 'Citizen Testimony', desc: 'On-the-ground testimonies in many Indian languages on how bad the air is', keywords: 'testimony testimonial voice ground report personal story hindi tamil bengali marathi telugu kannada gujarati punjabi malayalam odia urdu assamese english multilingual breathe asthma smog city resident first person' },
        { id: 'migration', title: 'Migration & Displacement', desc: 'Climate migration, pollution refugees', keywords: 'migration displacement climate refugee leaving delhi' },
        { id: 'tools', title: 'Tools & Calculators', desc: 'Personal exposure, health risk, comparison', keywords: 'tools calculator exposure risk cigarette equivalent' },
        { id: 'ask-janvayu', title: 'Ask JanVayu (AI)', desc: 'Ask questions about air quality in plain language', keywords: 'ask ai llama question natural language hindi query' },
        { id: 'accountability-brief', title: 'Accountability Brief (AI)', desc: 'Ward-level briefs for councillors and journalists', keywords: 'brief accountability ward councillor journalist ai llama report' },
        { id: 'resources', title: 'Reading List', desc: 'Reports, studies, expert organizations', keywords: 'resources library reading list research report study paper crea cse iqair lancet' },
        { id: 'downloads', title: 'Downloads', desc: 'PDFs, legal docs, data exports', keywords: 'download pdf export data document template rti' },
        { id: 'social-feed', title: 'Social Media Feed', desc: 'Live posts from Reddit, X, Instagram, YouTube about air pollution', keywords: 'social media twitter x reddit instagram youtube feed live posts' },
        { id: 'aqi-story', title: 'The Air We Breathe', desc: 'Editorial story with text flowing around live AQI data', keywords: 'editorial story pretext text layout narrative air quality crisis deaths NCAP' },
        { id: 'live-news', title: 'Live News', desc: 'Auto-updating air quality news from multiple sources', keywords: 'news live updates articles headlines breaking' },
        { id: 'aqi-alerts', title: 'AQI Alerts', desc: 'Browser push notifications for dangerous AQI levels', keywords: 'alerts notifications push warning threshold' },
        { id: 'go-outside', title: 'Should I Go Outside?', desc: 'Real-time outdoor activity recommendation', keywords: 'outside go safe outdoor activity recommendation mask' },
        { id: 'school-closure', title: 'School Closures', desc: 'GRAP-based school closure predictor for NCR', keywords: 'school closure grap ncr children education online' },
        { id: 'exposure-report', title: 'Exposure Report', desc: 'Personal annual air pollution exposure analysis', keywords: 'exposure report personal annual cigarette life expectancy' },
        { id: 'exposure-diary', title: 'Exposure Diary', desc: 'Log your daily routine and get a personalized PM2.5 exposure report', keywords: 'exposure diary daily routine commute cooking sleeping activity personalized cigarette life expectancy reduction tips' },
        { id: 'rti-assistant', title: 'RTI Assistant', desc: 'Generate ready-to-file RTI applications', keywords: 'rti right information filing application pollution board' },
        { id: 'purifier-calc', title: 'Purifier Calculator', desc: 'Find the right air purifier for your room', keywords: 'purifier calculator cadr room filter air cleaner' },
        { id: 'hyperlocal', title: 'My Neighbourhood', desc: 'Station-level air quality within your city', keywords: 'hyperlocal station neighborhood local area monitoring' },
        { id: 'pollution-calendar', title: 'Pollution Calendar', desc: 'Seasonal pollution sources and patterns', keywords: 'calendar seasonal stubble burning diwali monsoon winter inversion' },
        { id: 'migration-calc', title: 'Migration Comparison', desc: 'Side-by-side city comparison for relocation — live AQI, health impact, source apportionment', keywords: 'migration comparison calculator relocate move city health benefit compare side by side apportionment source pollution' },
        { id: 'scorecards', title: 'City Scorecards', desc: 'City accountability report cards', keywords: 'scorecard accountability grade report card ncap target' },
        { id: 'data-archive', title: 'Data Archive', desc: 'Download historical air quality datasets', keywords: 'data archive download historical dataset csv json research' },
        { id: 'correlations', title: 'Pollution Correlations', desc: 'Explore pollution vs health/economic data', keywords: 'correlation scatter plot health deaths economic relationship' },
        { id: 'aqi-explainer', title: 'Understanding AQI', desc: 'What AQI means, six pollutants, CPCB vs EPA scales', keywords: 'aqi explainer composite index pollutant pm25 pm10 no2 so2 ozone co naaqs who epa cpcb sub-index criteria dominant' },
        { id: 'source-selector', title: 'Data Source Selector', desc: 'Choose which data sources to include when viewing AQI', keywords: 'source selector data cpcb waqi aqicn iqair sensor community trust reliability calibration monitor station transparency' },
        { id: 'glossary', title: 'Glossary', desc: 'Air quality terms and acronyms explained', keywords: 'glossary terms definitions acronym explanation pm25 aqi grap ncap who meaning' }
    ];

    // Search / Ask JanVayu / Feedback widget — triggered from the section-nav
    // (the floating button was removed because it blocked content).
    function openWidget(tab) {
        const modal = document.getElementById('widgetModal');
        if (!modal) return;
        if (tab && typeof switchWidgetTab === 'function') switchWidgetTab(tab);
        modal.classList.add('open');
        if (tab === 'search') setTimeout(() => { const s = document.getElementById('widgetSearchInput'); if (s) s.focus(); }, 120);
    }
    function closeWidget() {
        const modal = document.getElementById('widgetModal');
        if (modal) modal.classList.remove('open');
    }
    function toggleWidget() {
        const modal = document.getElementById('widgetModal');
        if (!modal) return;
        if (modal.classList.contains('open')) closeWidget();
        else openWidget('search');
    }
    window.openWidget = openWidget;
    window.closeWidget = closeWidget;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('widgetModal');
            if (modal && modal.classList.contains('open')) toggleWidget();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const modal = document.getElementById('widgetModal');
            if (!modal.classList.contains('open')) { toggleWidget(); switchWidgetTab('search'); }
            else { document.getElementById('widgetSearchInput').focus(); }
        }
    });

    function switchWidgetTab(tab) {
        const tabs = ['search', 'askai', 'feedback'];
        document.querySelectorAll('.widget-tab').forEach((t, i) => {
            t.classList.toggle('active', tab === tabs[i]);
        });
        tabs.forEach(t => {
            const panel = document.getElementById('widget' + t.charAt(0).toUpperCase() + t.slice(1));
            if (panel) panel.classList.toggle('active', tab === t);
        });
        if (tab === 'search') setTimeout(() => document.getElementById('widgetSearchInput').focus(), 50);
        if (tab === 'askai') setTimeout(() => document.getElementById('widgetAiQuestion').focus(), 50);
    }

    async function widgetAskAI() {
        const city = document.getElementById('widgetAiCity').value;
        const question = document.getElementById('widgetAiQuestion').value.trim();
        const responseEl = document.getElementById('widgetAiResponse');
        const metaEl = document.getElementById('widgetAiMeta');
        const btn = document.getElementById('widgetAiBtn');
        if (!question) { responseEl.textContent = 'Please type a question.'; return; }
        btn.disabled = true; btn.textContent = '...';
        responseEl.textContent = 'Thinking...'; responseEl.classList.add('loading');
        metaEl.textContent = '';
        try {
            const res = await fetch('/.netlify/functions/air-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, city }),
            });
            const data = await res.json();
            responseEl.classList.remove('loading');
            responseEl.textContent = cleanChatText(data.answer) || 'No response received.';
            if (data.dataUsed) {
                metaEl.textContent = data.dataUsed.city + ' — AQI: ' + data.dataUsed.aqi + ', PM2.5: ' + (data.dataUsed.pm25 ?? 'N/A') + ' µg/m³';
            }
        } catch (e) {
            responseEl.classList.remove('loading');
            responseEl.textContent = 'Something went wrong. Please try again.';
        } finally {
            btn.disabled = false; btn.textContent = 'Ask';
        }
    }

    function handleWidgetSearch(query) {
        const results = document.getElementById('widgetResults');
        const defaultView = document.getElementById('widgetDefault');
        if (!query.trim()) {
            defaultView.style.display = 'block';
            results.querySelectorAll('.widget-result-item').forEach(r => r.remove());
            return;
        }
        defaultView.style.display = 'none';
        const q = query.toLowerCase();
        const matches = SECTION_INDEX.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q) ||
            s.keywords.includes(q)
        );
        results.querySelectorAll('.widget-result-item').forEach(r => r.remove());
        if (matches.length === 0) {
            const noRes = document.createElement('div');
            noRes.className = 'widget-no-results widget-result-item';
            noRes.textContent = 'No matching sections found. Try different keywords.';
            results.appendChild(noRes);
        } else {
            matches.forEach(m => {
                const btn = document.createElement('button');
                btn.className = 'widget-result widget-result-item';
                btn.innerHTML = '<div class="widget-result-title">' + m.title + '</div><div class="widget-result-desc">' + m.desc + '</div>';
                btn.onclick = () => widgetNav(m.id);
                results.appendChild(btn);
            });
        }
    }

    function widgetNav(panelId) {
        showPanel(panelId);
        toggleWidget();
        document.getElementById('widgetSearchInput').value = '';
        document.getElementById('widgetDefault').style.display = 'block';
        document.querySelectorAll('.widget-result-item').forEach(r => r.remove());
    }

    function submitFeedback() {
        const type = document.getElementById('feedbackType').value;
        const msg = document.getElementById('feedbackMsg').value;
        const email = document.getElementById('feedbackEmail').value;
        const city = document.getElementById('feedbackCity').value;
        if (!msg.trim()) { document.getElementById('feedbackMsg').focus(); return; }
        const feedback = { type, msg, email, city, ts: new Date().toISOString(), lang: currentLang };
        const stored = JSON.parse(localStorage.getItem('janvayu_feedback') || '[]');
        stored.push(feedback);
        localStorage.setItem('janvayu_feedback', JSON.stringify(stored));
        console.log('Feedback stored:', feedback);
        document.getElementById('feedbackForm').style.display = 'none';
        document.getElementById('feedbackSuccess').style.display = 'block';
    }

    function resetFeedback() {
        document.getElementById('feedbackMsg').value = '';
        document.getElementById('feedbackEmail').value = '';
        document.getElementById('feedbackCity').value = '';
        document.getElementById('feedbackForm').style.display = 'flex';
        document.getElementById('feedbackSuccess').style.display = 'none';
    }


    // ══════════════════════════════════════════
    // ── AI FEATURES (Groq / Llama Integration) ─────
    // ══════════════════════════════════════════

    // ── Feature 1: Ask JanVayu ──
    // v26.6.19 — tap a chip on the Ask JanVayu panel to load that question
    // into the input field. The user can then submit, edit it first, or
    // submit immediately by hitting the button (we do NOT auto-submit on
    // chip tap — the user may want to swap the city or language first).
    function loadAskChip(text) {
        const input = document.getElementById('ask-question');
        if (input) { input.value = text; input.focus(); }
    }
    window.loadAskChip = loadAskChip;

    async function submitAirQuery() {
        const city = document.getElementById('ask-city')?.value;
        const lang = document.getElementById('ask-lang')?.value || 'en';
        const question = document.getElementById('ask-question')?.value?.trim();
        const responseEl = document.getElementById('ask-response');
        const dataEl = document.getElementById('ask-data-used');
        const btn = document.getElementById('ask-submit');

        if (!question) { responseEl.textContent = 'Please enter a question.'; return; }

        btn.disabled = true; btn.textContent = 'Asking...';
        responseEl.textContent = ''; responseEl.classList.add('loading');
        dataEl.style.display = 'none';

        try {
            if (!navigator.onLine) throw new Error('offline');
            const res = await fetch('/.netlify/functions/air-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, city, lang }),
            });
            const data = await res.json();
            responseEl.classList.remove('loading');
            responseEl.textContent = cleanChatText(data.answer) || 'No response received.';
            if (data.dataUsed) {
                dataEl.style.display = 'block';
                dataEl.innerHTML = `<strong>Data used:</strong> ${data.dataUsed.city} — AQI: ${data.dataUsed.aqi}, PM2.5: ${data.dataUsed.pm25 ?? 'N/A'} µg/m³, Station: ${data.dataUsed.station}, Updated: ${data.dataUsed.time}`;
            }
        } catch (e) {
            responseEl.classList.remove('loading');
            if (e.message === 'offline') {
                responseEl.textContent = 'You appear to be offline. Some features require an internet connection.';
            } else {
                responseEl.textContent = 'Something went wrong. Please try again.';
            }
        } finally {
            btn.disabled = false; btn.textContent = 'Ask JanVayu';
        }
    }

    // ── Feature 2: AI Health Advisory ──
    async function submitHealthAdvisory() {
        const city = document.getElementById('advisory-city')?.value;
        const age = parseInt(document.getElementById('advisory-age')?.value) || 30;
        const hours = parseInt(document.getElementById('advisory-hours')?.value) || 0;
        const conditionEls = document.querySelectorAll('#advisory-conditions input[type="checkbox"]:checked');
        const conditions = Array.from(conditionEls).map(el => el.value).filter(v => v);
        const btn = document.getElementById('advisory-submit');
        const card = document.getElementById('advisory-card');
        const placeholder = document.getElementById('advisory-placeholder');
        const textEl = document.getElementById('advisory-text');
        const badgeEl = document.getElementById('advisory-risk-badge');
        const metaEl = document.getElementById('advisory-meta');

        // Handle "None" checkbox logic
        if (conditions.includes('none') && conditions.length > 1) {
            conditions.splice(conditions.indexOf('none'), 1);
        }
        if (conditions.length === 0) conditions.push('none');

        btn.disabled = true; btn.textContent = 'Getting advisory...';
        card.style.display = 'none';
        placeholder.style.display = 'block';
        placeholder.textContent = ''; placeholder.classList.add('loading');

        try {
            if (!navigator.onLine) throw new Error('offline');
            const res = await fetch('/.netlify/functions/health-advisory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, age, conditions, hoursOutdoor: hours }),
            });
            const data = await res.json();
            placeholder.classList.remove('loading');
            placeholder.style.display = 'none';
            card.style.display = 'block';
            card.className = 'advisory-card risk-' + (data.riskLevel || 'moderate');
            badgeEl.className = 'risk-badge risk-' + (data.riskLevel || 'moderate');
            badgeEl.textContent = (data.riskLevel || 'moderate').toUpperCase() + ' RISK';
            textEl.textContent = data.advisory || 'No advisory received.';
            if (data.pm25 != null) {
                metaEl.textContent = `PM2.5: ${data.pm25} µg/m³ | AQI: ${data.aqiRaw} | ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
            }
        } catch (e) {
            placeholder.classList.remove('loading');
            if (e.message === 'offline') {
                placeholder.textContent = 'You appear to be offline. Some features require an internet connection.';
            } else {
                placeholder.textContent = 'Something went wrong. Please try again.';
            }
        } finally {
            btn.disabled = false; btn.textContent = 'Get Advisory';
        }
    }

    // ── Feature 3: Accountability Brief ──
    let lastBriefText = '';
    let lastBriefArea = '';

    async function submitAccountabilityBrief() {
        const city = document.getElementById('brief-city')?.value;
        const area = document.getElementById('brief-area')?.value?.trim();
        const period = document.getElementById('brief-period')?.value;
        const outputEl = document.getElementById('brief-output');
        const anomalyEl = document.getElementById('brief-anomaly-banner');
        const actionsEl = document.getElementById('brief-actions');
        const btn = document.getElementById('brief-submit');

        if (!area) { outputEl.textContent = 'Please enter an area or ward name.'; return; }

        btn.disabled = true; btn.textContent = 'Generating...';
        outputEl.textContent = ''; outputEl.classList.add('loading');
        anomalyEl.style.display = 'none';
        actionsEl.style.display = 'none';

        try {
            if (!navigator.onLine) throw new Error('offline');
            const res = await fetch('/.netlify/functions/accountability-brief', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, area, period }),
            });
            const data = await res.json();
            outputEl.classList.remove('loading');
            outputEl.textContent = data.brief || 'No brief generated.';
            lastBriefText = data.brief || '';
            lastBriefArea = area;
            actionsEl.style.display = 'flex';

            if (data.anomalyDetected) {
                const ratio = data.pm25 && data.baseline ? (data.pm25 / data.baseline).toFixed(1) : '?';
                anomalyEl.style.display = 'block';
                anomalyEl.innerHTML = `&#9888; Anomalous reading — PM2.5 is ${ratio}x above seasonal baseline (${data.baseline} µg/m³)`;
            }
        } catch (e) {
            outputEl.classList.remove('loading');
            if (e.message === 'offline') {
                outputEl.textContent = 'You appear to be offline. Some features require an internet connection.';
            } else {
                outputEl.textContent = 'Something went wrong. Please try again.';
            }
        } finally {
            btn.disabled = false; btn.textContent = 'Generate Brief';
        }
    }

    function downloadBrief() {
        if (!lastBriefText) return;
        const date = new Date().toISOString().split('T')[0];
        const safeArea = lastBriefArea.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-').toLowerCase();
        const filename = `janvayu-brief-${safeArea}-${date}.txt`;
        const blob = new Blob([lastBriefText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }

    function copyBrief() {
        if (!lastBriefText) return;
        navigator.clipboard.writeText(lastBriefText).then(() => {
            const btn = document.querySelector('#brief-actions .btn:last-child');
            if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.innerHTML = '<span class="si si-sm si-copy"></span> Copy Brief'; }, 2000); }
        });
    }

    // ── Feature 4: Anomaly Detection ──
    let anomalyDismissed = false;

    async function checkAnomalies() {
        if (anomalyDismissed) return;
        try {
            const res = await fetch('/.netlify/functions/anomaly-check');
            const data = await res.json();
            const container = document.getElementById('anomalyBannerContainer');
            const textEl = document.getElementById('anomalyBannerText');
            if (!container || !textEl) return;

            if (data.spikes && data.spikes.length > 0) {
                const worst = data.spikes.reduce((a, b) => (a.ratio > b.ratio ? a : b));
                let html = `<strong>Unusual PM2.5 spike in ${worst.city}: ${worst.pm25} µg/m³</strong> — ${worst.explanation}`;
                if (data.spikes.length > 1) {
                    const others = data.spikes.filter(s => s.city !== worst.city);
                    html += ` <button class="anomaly-expand-link" onclick="expandAnomalies()">+${others.length} more ${others.length === 1 ? 'city' : 'cities'}</button>`;
                    html += `<div id="anomalyExpanded" style="display:none; margin-top: 8px;">`;
                    others.forEach(s => {
                        html += `<div style="margin-top: 4px;"><strong>${s.city}: ${s.pm25} µg/m³</strong> — ${s.explanation}</div>`;
                    });
                    html += `</div>`;
                }
                textEl.innerHTML = html;
                container.classList.add('visible');
            } else {
                container.classList.remove('visible');
            }
        } catch (e) {
            console.log('Anomaly check failed:', e.message);
        }
    }

    function expandAnomalies() {
        const el = document.getElementById('anomalyExpanded');
        if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }

    function dismissAnomalyBanner() {
        anomalyDismissed = true;
        const container = document.getElementById('anomalyBannerContainer');
        if (container) container.classList.remove('visible');
    }

    // Run anomaly check on load and every 30 minutes
    checkAnomalies();
    setInterval(checkAnomalies, 30 * 60 * 1000);

    // ── Demo Day Mode ──
    (function initDemoMode() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') !== 'true') return;

        // Show demo badge
        const badge = document.getElementById('demoBadge');
        if (badge) badge.classList.add('visible');

        // Wait for panels to be available, then pre-populate on panel load
        const origLoadPanel = loadPanel;
        loadPanel = function(panelId) {
            origLoadPanel(panelId);
            setTimeout(() => applyDemoDefaults(panelId), 200);
        };
    })();

    function applyDemoDefaults(panelId) {
        if (panelId === 'ask-janvayu') {
            const q = document.getElementById('ask-question');
            const c = document.getElementById('ask-city');
            if (q) q.value = 'Is it safe for my 8-year-old to go to school today in Delhi?';
            if (c) c.value = 'delhi';
        }
        if (panelId === 'health') {
            const age = document.getElementById('advisory-age');
            const city = document.getElementById('advisory-city');
            const hours = document.getElementById('advisory-hours');
            const hoursVal = document.getElementById('advisory-hours-val');
            if (age) age.value = 8;
            if (city) city.value = 'delhi';
            if (hours) { hours.value = 3; if (hoursVal) hoursVal.textContent = '3'; }
            // Uncheck all, check "none"
            document.querySelectorAll('#advisory-conditions input').forEach(cb => { cb.checked = cb.value === 'none'; });
        }
        if (panelId === 'accountability-brief') {
            const city = document.getElementById('brief-city');
            const area = document.getElementById('brief-area');
            const period = document.getElementById('brief-period');
            if (city) city.value = 'delhi';
            if (area) area.value = 'Anand Vihar';
            if (period) period.value = 'today';
        }
    }

    // ── City Policy Tracker ──
    const CITY_POLICY_DATA = {
        delhi: {
            name: 'Delhi',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Additional: CAQM year-round GRAP enforcement from May 2026',
            currentPM25: 82.2,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: 'Only 17% NCAP fund utilisation. 0 days met WHO guideline in 2024.',
            expenditure: [
                { year: '2019-20', allocated: 10.00, utilised: 2.00 },
                { year: '2020-21', allocated: 12.00, utilised: 3.50 },
                { year: '2021-22', allocated: 15.00, utilised: 4.10 },
                { year: '2022-23', allocated: 18.00, utilised: 2.50 },
                { year: '2023-24', allocated: 14.36, utilised: 1.00 },
                { year: '2024-25', allocated: 12.00, utilised: 1.00 },
                { year: '2025-26', allocated: null, utilised: null }
            ],
            totalAllocated: 81.36,
            totalUtilised: 14.10,
            utilisationPct: 17
        },
        mumbai: {
            name: 'Mumbai',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'BEST e-bus fleet target: 2,100 by 2026',
            currentPM25: 41.4,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: 'PM2.5 increased 38% since 2019 despite NCAP. 58% fund utilisation.',
            expenditure: [
                { year: '2019-20', allocated: 30.00, utilised: 10.00 },
                { year: '2020-21', allocated: 45.00, utilised: 22.00 },
                { year: '2021-22', allocated: 55.00, utilised: 32.00 },
                { year: '2022-23', allocated: 70.00, utilised: 45.00 },
                { year: '2023-24', allocated: 80.00, utilised: 51.00 },
                { year: '2024-25', allocated: 60.00, utilised: 35.00 },
                { year: '2025-26', allocated: 40.00, utilised: 25.00 }
            ],
            totalAllocated: 380.00,
            totalUtilised: 220.00,
            utilisationPct: 58
        },
        patna: {
            name: 'Patna',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Brick kiln zigzag conversion within 50 km radius',
            currentPM25: 96.8,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: 'Best utilisation rate (70%) among major cities but PM2.5 remains 19x WHO guideline.',
            expenditure: [
                { year: '2019-20', allocated: 8.00, utilised: 5.00 },
                { year: '2020-21', allocated: 12.00, utilised: 8.00 },
                { year: '2021-22', allocated: 18.00, utilised: 13.00 },
                { year: '2022-23', allocated: 22.00, utilised: 16.00 },
                { year: '2023-24', allocated: 25.00, utilised: 18.00 },
                { year: '2024-25', allocated: 20.00, utilised: 14.00 },
                { year: '2025-26', allocated: 15.00, utilised: 10.00 }
            ],
            totalAllocated: 120.00,
            totalUtilised: 84.00,
            utilisationPct: 70
        },
        lucknow: {
            name: 'Lucknow',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Anti-smog gun deployment + mechanised sweeping 200 km/day',
            currentPM25: 76.5,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: '40% utilisation — below 75% threshold, risks losing next allocation.',
            expenditure: [
                { year: '2019-20', allocated: 15.00, utilised: 5.00 },
                { year: '2020-21', allocated: 20.00, utilised: 8.00 },
                { year: '2021-22', allocated: 25.00, utilised: 10.00 },
                { year: '2022-23', allocated: 30.00, utilised: 12.00 },
                { year: '2023-24', allocated: 35.00, utilised: 15.00 },
                { year: '2024-25', allocated: 30.00, utilised: 12.00 },
                { year: '2025-26', allocated: 25.00, utilised: 10.00 }
            ],
            totalAllocated: 180.00,
            totalUtilised: 72.00,
            utilisationPct: 40
        },
        noida: {
            name: 'Noida',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Part of NCR — subject to CAQM GRAP enforcement',
            currentPM25: 80.4,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: 'Critical underutilisation at 13%. One of the worst performing NCAP cities.',
            expenditure: [
                { year: '2019-20', allocated: 5.00, utilised: 0.50 },
                { year: '2020-21', allocated: 8.00, utilised: 1.00 },
                { year: '2021-22', allocated: 10.00, utilised: 1.50 },
                { year: '2022-23', allocated: 10.70, utilised: 1.50 },
                { year: '2023-24', allocated: 10.00, utilised: 1.07 },
                { year: '2024-25', allocated: 7.00, utilised: 1.00 },
                { year: '2025-26', allocated: 5.00, utilised: 0.50 }
            ],
            totalAllocated: 55.70,
            totalUtilised: 7.07,
            utilisationPct: 13
        },
        ghaziabad: {
            name: 'Ghaziabad',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Part of NCR — subject to CAQM GRAP enforcement',
            currentPM25: 92.1,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: '26% utilisation — below threshold.',
            expenditure: [
                { year: '2019-20', allocated: 4.00, utilised: 1.00 },
                { year: '2020-21', allocated: 6.00, utilised: 1.50 },
                { year: '2021-22', allocated: 8.00, utilised: 2.00 },
                { year: '2022-23', allocated: 8.50, utilised: 2.10 },
                { year: '2023-24', allocated: 9.00, utilised: 2.50 },
                { year: '2024-25', allocated: 7.00, utilised: 2.00 },
                { year: '2025-26', allocated: 6.00, utilised: 1.50 }
            ],
            totalAllocated: 48.50,
            totalUtilised: 12.60,
            utilisationPct: 26
        },
        varanasi: {
            name: 'Varanasi',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Showcased as NCAP success story — PM2.5 fell 72% in 5 years',
            currentPM25: 78.4,
            status: 'met',
            statusLabel: 'Met',
            statusNote: 'Best NCAP performer nationally. PM2.5 down 72% in 5 years — but still 15x WHO guideline.',
            expenditure: [
                { year: '2019-20', allocated: 8.00, utilised: 6.00 },
                { year: '2020-21', allocated: 10.00, utilised: 8.00 },
                { year: '2021-22', allocated: 12.00, utilised: 10.00 },
                { year: '2022-23', allocated: 15.00, utilised: 13.00 },
                { year: '2023-24', allocated: 15.00, utilised: 12.00 },
                { year: '2024-25', allocated: 12.00, utilised: 10.00 },
                { year: '2025-26', allocated: 10.00, utilised: 8.00 }
            ],
            totalAllocated: 82.00,
            totalUtilised: 67.00,
            utilisationPct: 82
        },
        kolkata: {
            name: 'Kolkata',
            ncapTarget: '40% PM10 reduction by March 2026',
            cityTarget: 'Focus on vehicle emissions and winter inversions',
            currentPM25: 50.2,
            status: 'not-met',
            statusLabel: 'Not Met',
            statusNote: 'Limited monitoring coverage (7 CAAQMS). Winter inversions + vehicle emissions.',
            expenditure: [
                { year: '2019-20', allocated: 10.00, utilised: 4.00 },
                { year: '2020-21', allocated: 15.00, utilised: 7.00 },
                { year: '2021-22', allocated: 18.00, utilised: 9.00 },
                { year: '2022-23', allocated: 20.00, utilised: 10.00 },
                { year: '2023-24', allocated: 18.00, utilised: 8.00 },
                { year: '2024-25', allocated: 15.00, utilised: 7.00 },
                { year: '2025-26', allocated: 12.00, utilised: 5.00 }
            ],
            totalAllocated: 108.00,
            totalUtilised: 50.00,
            utilisationPct: 46
        }
    };

    function initCityPolicyTracker() {
        const sel = document.getElementById('cityPolicySelector');
        if (!sel) return;
        sel.addEventListener('change', function() { renderCityPolicyData(this.value); });
        renderCityPolicyData(sel.value);
        loadCityPolicyFeedback();
    }

    function renderCityPolicyData(cityKey) {
        const d = CITY_POLICY_DATA[cityKey];
        if (!d) return;

        // Render target area
        const targetArea = document.getElementById('cityPolicyTargetArea');
        if (targetArea) {
            const statusColor = d.status === 'met' ? '#16803C' : d.status === 'on-track' ? '#D97706' : '#EF4444';
            const statusBadge = d.status === 'met' ? 'badge-success' : d.status === 'on-track' ? 'badge-warning' : 'badge-danger';
            const whoMultiple = (d.currentPM25 / 5).toFixed(0);
            targetArea.innerHTML =
                '<div class="grid-2" style="gap: 1rem; margin-bottom: 1rem;">' +
                    '<div class="info-box" style="border-left: 3px solid #3B82F6;">' +
                        '<h4 style="font-size: 0.875rem; color: var(--blue);">Announced Targets</h4>' +
                        '<p style="margin-top: 0.5rem;"><strong>NCAP national target:</strong> ' + d.ncapTarget + '</p>' +
                        '<p><strong>City-specific:</strong> ' + d.cityTarget + '</p>' +
                        '<p style="margin-top: 0.5rem;"><strong>Current PM2.5:</strong> ' + d.currentPM25 + ' &micro;g/m&sup3; (' + whoMultiple + '&times; WHO guideline)</p>' +
                    '</div>' +
                    '<div class="info-box" style="border-left: 3px solid ' + statusColor + ';">' +
                        '<h4 style="font-size: 0.875rem; color: ' + statusColor + ';">Target Status</h4>' +
                        '<div style="margin-top: 0.5rem;"><span class="badge ' + statusBadge + '" style="font-size: 1rem; padding: 0.25rem 0.75rem;">' + d.statusLabel + '</span></div>' +
                        '<p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-2);">' + d.statusNote + '</p>' +
                        '<div style="margin-top: 0.75rem; padding: 0.5rem; background: var(--bg); border-radius: 4px; font-size: 0.8125rem;">' +
                            '<strong>Total allocated:</strong> &rupee;' + d.totalAllocated.toFixed(0) + ' Cr &nbsp;|&nbsp; ' +
                            '<strong>Total utilised:</strong> &rupee;' + d.totalUtilised.toFixed(0) + ' Cr &nbsp;|&nbsp; ' +
                            '<strong>Utilisation:</strong> <span style="color: ' + statusColor + '; font-weight: 700;">' + d.utilisationPct + '%</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        // Render expenditure table
        const tbody = document.getElementById('cityPolicyExpBody');
        if (tbody) {
            tbody.innerHTML = d.expenditure.map(function(row) {
                const alloc = row.allocated !== null ? row.allocated.toFixed(2) : '&mdash;';
                const util = row.utilised !== null ? row.utilised.toFixed(2) : '&mdash;';
                let pct = '&mdash;';
                let pctBadge = '';
                if (row.allocated !== null && row.utilised !== null && row.allocated > 0) {
                    const p = Math.round((row.utilised / row.allocated) * 100);
                    const bc = p >= 60 ? 'badge-success' : p >= 30 ? 'badge-warning' : 'badge-danger';
                    pct = '<span class="badge ' + bc + '">' + p + '%</span>';
                }
                return '<tr><td>' + row.year + '</td><td>' + alloc + '</td><td>' + util + '</td><td>' + pct + '</td></tr>';
            }).join('');
        }
    }

    // ── City Policy Feedback (localStorage) ──
    const CP_FEEDBACK_KEY = 'janvayu-city-policy-feedback';

    function submitCityPolicyFeedback() {
        const input = document.getElementById('cpFeedbackInput');
        const citySelect = document.getElementById('cpFeedbackCity');
        if (!input || !input.value.trim()) return;

        const feedback = JSON.parse(localStorage.getItem(CP_FEEDBACK_KEY) || '[]');
        feedback.unshift({
            city: citySelect ? citySelect.value : 'Unknown',
            text: input.value.trim().substring(0, 500),
            date: new Date().toISOString().split('T')[0]
        });
        // Keep last 50
        if (feedback.length > 50) feedback.length = 50;
        localStorage.setItem(CP_FEEDBACK_KEY, JSON.stringify(feedback));
        input.value = '';
        loadCityPolicyFeedback();
    }

    function loadCityPolicyFeedback() {
        const list = document.getElementById('cpFeedbackList');
        const empty = document.getElementById('cpFeedbackEmpty');
        if (!list) return;

        const feedback = JSON.parse(localStorage.getItem(CP_FEEDBACK_KEY) || '[]');
        if (feedback.length === 0) {
            list.innerHTML = '';
            if (empty) empty.style.display = '';
            return;
        }
        if (empty) empty.style.display = 'none';
        list.innerHTML = feedback.map(function(f) {
            return '<div style="padding: 0.75rem; margin-bottom: 0.5rem; background: var(--bg); border-radius: 6px; border-left: 3px solid var(--accent);">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">' +
                    '<span style="font-weight: 600; font-size: 0.8125rem; color: var(--accent);">' + (f.city || 'Unknown') + '</span>' +
                    '<span style="font-size: 0.75rem; color: var(--text-3);">' + (f.date || '') + '</span>' +
                '</div>' +
                '<p style="font-size: 0.875rem; color: var(--text-2); margin: 0;">' + f.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' +
            '</div>';
        }).join('');
    }



// ── Workshops: bookable-sessions calendar (rendered from /data/workshops.json) ──
// `sessions` = standing offers (booked on request via the walkthrough form);
// `upcoming` = specific public dates the team adds to the JSON. No fixed dates
// are invented here — an empty `upcoming` shows an honest book-on-request note.
window.initWorkshops = (function () {
    var cache = null;
    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    function render(data) {
        var menu = document.getElementById('workshops-sessions');
        var up = document.getElementById('workshops-upcoming');
        var sessions = (data && data.sessions) || [];
        var byId = {}; sessions.forEach(function(s){ byId[s.id] = s; });
        if (menu) {
            menu.innerHTML = sessions.map(function(s){
                return '<div class="card" style="display:flex;flex-direction:column;">' +
                  '<div class="card-body" style="display:flex;flex-direction:column;gap:8px;flex:1;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;">' +
                      '<strong style="font-size:0.98rem;color:var(--ink);">' + esc(s.title) + '</strong>' +
                      '<span style="font-size:0.68rem;color:var(--text-3);white-space:nowrap;">' + esc(s.duration) + '</span>' +
                    '</div>' +
                    '<span style="font-size:0.72rem;color:var(--accent);font-weight:600;">' + esc(s.mode) + '</span>' +
                    '<p style="font-size:0.83rem;color:var(--text-2);line-height:1.5;margin:0;flex:1;">' + esc(s.blurb) + '</p>' +
                    '<button type="button" class="btn btn-sm" onclick="bookWorkshopSession(\'' + esc(s.id) + '\')" style="align-self:flex-start;margin-top:2px;">Request this session</button>' +
                  '</div></div>';
            }).join('');
        }
        if (up) {
            var upcoming = (data && data.upcoming) || [];
            if (!upcoming.length) {
                up.innerHTML = '<div class="alert alert-info" style="margin:0;font-size:0.85rem;">No public group sessions are scheduled right now &mdash; every session below is <strong>booked on request</strong>, and we schedule around the slots you give us. Want to hear when a public session is dated? <a href="mailto:contribute@janvayu.in?subject=Notify%20me%20about%20JanVayu%20workshops">Email us</a> and we\'ll add you.</div>';
            } else {
                up.innerHTML = '<div class="dash-section" style="margin:0 0 0.6rem;"><span class="dash-section-eyebrow">Scheduled &middot; open to book</span></div>' +
                  '<div class="grid-2" style="gap:0.8rem;">' + upcoming.map(function(u){
                    var s = byId[u.session] || {};
                    return '<div class="card" style="border-left:3px solid var(--accent);"><div class="card-body" style="display:flex;flex-direction:column;gap:5px;">' +
                      '<strong style="font-size:0.95rem;color:var(--ink);">' + esc(s.title || u.session) + '</strong>' +
                      '<span style="font-size:0.82rem;color:var(--text-1);"><span class="si si-calendar" style="margin-right:5px;"></span>' + esc(u.date) + (u.time ? ' &middot; ' + esc(u.time) : '') + '</span>' +
                      (u.seatsNote ? '<span style="font-size:0.72rem;color:var(--text-3);">' + esc(u.seatsNote) + '</span>' : '') +
                      '<button type="button" class="btn btn-sm btn-primary" onclick="bookWorkshopSession(\'' + esc(u.session) + '\')" style="align-self:flex-start;margin-top:3px;">Book a seat</button>' +
                    '</div></div>';
                  }).join('') + '</div>';
            }
        }
    }
    return function initWorkshops() {
        if (cache) { render(cache); return; }
        fetch('/data/workshops.json').then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
            if (!d) return; cache = d; render(d);
        }).catch(function(){ /* workshops.json unavailable — the request forms below still work */ });
    };
})();

window.bookWorkshopSession = function (id) {
    var sel = document.getElementById('walkthrough-session-select');
    if (sel && id) { sel.value = id; }
    var form = document.getElementById('walkthrough-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var focusEl = sel || form.querySelector('input[name="name"]');
        if (focusEl) setTimeout(function(){ try { focusEl.focus({ preventScroll: true }); } catch(e){} }, 400);
    }
};
