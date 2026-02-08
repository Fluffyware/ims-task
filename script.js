document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const otrInput = $('otr'), dpInput = $('dp'), dpPrefix = $('dpPrefix');
    const dpNominal = $('dpModeNominal'), dpPercent = $('dpModePercent'), dpPill = $('dpPill');
    const durMonth = $('durationModeMonth'), durYear = $('durationModeYear'), durPill = $('durationPill');
    const monthsInput = $('months'), calcBtn = $('calculateBtn'), resSec = $('resultSection'), copyBtn = $('copyBtn');
    const resVal = $('resultValue'), intInfo = $('interestInfo'), compInfo = $('completionInfo'), totInfo = $('totalInfo');

    let dpMode = 'nominal', durationMode = 'months';

    const format = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const unformat = s => parseFloat(s.replace(/\./g, '')) || 0;
    const updateFmt = i => { let v = i.value.replace(/\D/g, ''); i.value = v ? format(v) : ''; };
    const pulse = p => { p.classList.remove('pulse'); void p.offsetWidth; p.classList.add('pulse'); setTimeout(() => p.classList.remove('pulse'), 300); };
    const getMonthName = m => ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'][m];

    otrInput.addEventListener('input', () => updateFmt(otrInput));
    dpInput.addEventListener('input', () => dpMode === 'nominal' && updateFmt(dpInput));

    const setDP = (m, p, x, a, i) => { if (dpMode === m) return pulse(dpPill); dpMode = m; dpPrefix.textContent = p; dpInput.value = ''; dpPill.style.transform = `translateX(${x})`; a.className = 'toggle-btn flex-1 py-1.5 text-gray-800 font-bold'; i.className = 'toggle-btn flex-1 py-1.5 text-gray-400 font-bold'; };
    dpNominal.addEventListener('click', () => setDP('nominal', 'Rp', '0', dpNominal, dpPercent));
    dpPercent.addEventListener('click', () => setDP('percent', '%', '100%', dpPercent, dpNominal));

    const setDur = (m, ph, x, a, i) => { if (durationMode === m) return pulse(durPill); durationMode = m; monthsInput.placeholder = ph; durPill.style.transform = `translateX(${x})`; a.className = 'toggle-btn flex-1 py-1.5 text-gray-800 font-bold'; i.className = 'toggle-btn flex-1 py-1.5 text-gray-400 font-bold'; };
    durMonth.addEventListener('click', () => setDur('months', 'Masukkan bulan', '0', durMonth, durYear));
    durYear.addEventListener('click', () => setDur('years', 'Masukkan tahun', '100%', durYear, durMonth));

    copyBtn.addEventListener('click', () => {
        const text = `*PENAWARAN ESTIMASI KREDIT - IMS FINANCE*\n\nBerikut adalah rincian estimasi angsuran berdasarkan data yang Anda masukkan:\n\n*DATA KENDARAAN & DP:*\n- Harga OTR: Rp ${otrInput.value}\n- Uang Muka (DP): ${dpPrefix.textContent} ${dpInput.value}\n- Tenor/Durasi: ${monthsInput.value} ${durationMode === 'years' ? 'Tahun' : 'Bulan'}\n\n*DETAIL ANGSURAN:*\n- Angsuran per Bulan: Rp ${resVal.textContent}\n- ${intInfo.textContent}\n- ${compInfo.textContent}\n- ${totInfo.textContent}\n\n_Catatan: Hasil ini merupakan estimasi awal. Untuk informasi lebih lanjut, silakan hubungi tim kami._`;
        navigator.clipboard.writeText(text).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="text-green-500">Tersalin!</span>';
            setTimeout(() => copyBtn.innerHTML = original, 2000);
        });
    });

    calcBtn.addEventListener('click', () => {
        const otr = unformat(otrInput.value), rawDur = parseFloat(monthsInput.value) || 0;
        if (rawDur <= 0) return alert('Silakan masukkan durasi yang valid.');

        let months = durationMode === 'years' ? rawDur * 12 : rawDur;
        let actualDp = dpMode === 'percent' ? (otr * unformat(dpInput.value)) / 100 : unformat(dpInput.value);
        let principal = otr - actualDp, rate = months <= 12 ? 0.12 : months <= 24 ? 0.14 : 0.165;
        const install = Math.round((principal + (principal * rate)) / months);
        const endD = new Date(); endD.setMonth(endD.getMonth() + Math.round(months));

        resSec.classList.remove('hidden');
        setTimeout(() => {
            resVal.textContent = format(install);
            intInfo.textContent = `SUKU BUNGA: ${parseFloat((rate * 100).toFixed(2))}%`;
            compInfo.textContent = `ESTIMASI SELESAI: ${getMonthName(endD.getMonth())} ${endD.getFullYear()}`;
            totInfo.textContent = `TOTAL PEMBAYARAN: RP ${format(install * Math.round(months))}`;
            resSec.style.opacity = '1';
            resSec.style.transform = window.innerWidth < 1024 ? 'translateY(0)' : 'translateX(0)';
        }, 50);
    });
});
