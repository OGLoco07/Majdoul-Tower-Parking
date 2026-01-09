let carsData = [];

// صوت التنبيه
const alertSound = new Audio('alert.mp3');

// تنظيف النص
function normalize(text) {
    return text
        ?.toString()
        .trim()
        .toUpperCase();
}

// تحميل CSV
fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            if (cols.length >= headers.length) {
                let obj = {};
                headers.forEach((h, index) => {
                    obj[h.trim()] = cols[index]?.trim();
                });
                carsData.push(obj);
            }
        }
    });

// الحالة + الصوت
function getStatus(car) {
    const status = normalize(car['Status']);

    if (status === 'INACTIVE' || status === 'غير نشط') {
        alertSound.play();
        return `<span class="status inactive">⛔ غير نشط</span>`;
    }

    return `<span class="status active">✅ نشط</span>`;
}

// البحث
function searchCar() {
    const input = normalize(document.getElementById('plateInput').value);
    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';

    if (!input || input.length < 2) {
        table.style.display = 'none';
        return;
    }

    const results = carsData.filter(car => {
        const en = normalize(car['Car No. (English)']);
        const ar = normalize(car['Car No. (Arabic)']);
        return en.includes(input) || ar.includes(input);
    });

    if (results.length === 0) {
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const row = `
            <tr>
                <td class="client-name">
                    👤 ${car['Employee Name'] || 'غير معروف'}
                    <div class="company-name">
                        🏢 ${car['Client'] || 'غير معروف'}
                    </div>
                </td>

                <td data-label="رقم اللوحة">
                    ${car['Car No. (English)'] || car['Car No. (Arabic)'] || '-'}
                </td>

                <td data-label="لون السيارة">
                    ${car['Car Color'] || '-'}
                </td>

                <td data-label="موديل السيارة">
                    ${car['Car Model'] || '-'}
                </td>

                <td data-label="الحالة">
                    ${getStatus(car)}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    table.style.display = 'block';
}
