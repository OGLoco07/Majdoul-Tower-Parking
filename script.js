let carsData = [];
let lastAlertKey = null;

// =====================
// تنظيف النص
// =====================
function normalize(text) {
    return text
        ?.toString()
        .replace(/\s+/g, '')
        .toUpperCase();
}

// =====================
// تحميل ملف CSV
// =====================
fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            if (cols.length < headers.length) continue;

            let obj = {};
            headers.forEach((h, index) => {
                obj[h.trim()] = cols[index]?.trim();
            });

            carsData.push(obj);
        }

        console.log('CSV Loaded:', carsData.length);
    })
    .catch(err => {
        console.error(err);
        alert('فشل تحميل ملف البيانات');
    });

// =====================
// تحديد حالة المركبة
// =====================
function isInactive(car) {
    const status = normalize(car['Status']);
    return status === 'INACTIVE' || status === 'غيرنشط';
}

// =====================
// تنبيه صوتي + اهتزاز
// =====================
function alertInactive(key) {
    if (lastAlertKey === key) return;
    lastAlertKey = key;

    const audio = new Audio('alert.mp3'); // ضع ملف صوتي في نفس المجلد
    audio.play().catch(() => {});

    if (navigator.vibrate) {
        navigator.vibrate([300, 200, 300]);
    }
}

// =====================
// البحث (اسم / لوحة)
// =====================
function searchCar() {
    const inputRaw = document.getElementById('plateInput').value;
    const input = normalize(inputRaw);

    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!input) {
        table.style.display = 'none';
        return;
    }

    const results = carsData.filter(car => {
        const plateEn = normalize(car['Car No. (English)']);
        const plateAr = normalize(car['Car No. (Arabic)']);
        const employee = normalize(car['Employee Name']);

        return (
            plateEn.includes(input) ||
            plateAr.includes(input) ||
            employee.includes(input)
        );
    });

    if (results.length === 0) {
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const inactive = isInactive(car);
        const key = car['Car No. (English)'] || car['Car No. (Arabic)'] || car['Employee Name'];

        if (inactive) {
            alertInactive(key);
        }

        const row = `
            <tr class="${inactive ? 'row-inactive' : 'row-active'}">
                <td>
                    <strong>${car['Employee Name'] || '-'}</strong><br>
                    <span>${car['Client'] || '-'}</span>
                </td>
                <td>${car['Car No. (English)'] || car['Car No. (Arabic)'] || '-'}</td>
                <td>${car['Car Color'] || '-'}</td>
                <td>${car['Car Model'] || '-'}</td>
                <td>
                    ${inactive
                        ? '<span class="status inactive">⛔ غير نشط</span>'
                        : '<span class="status active">✅ نشط</span>'}
                </td>
            </tr>
        `;

        tbody.innerHTML += row;
    });

    table.style.display = 'block';
}
