let carsData = [];
let lastAlertKey = null;

// =====================
// تنظيف النص
// =====================
function normalizePlate(text) {
    return text
        ?.toString()
        .replace(/\s+/g, '')
        .toUpperCase();
}

function normalizeName(text) {
    return text
        ?.toString()
        .trim()
        .toUpperCase();
}

// =====================
// تحميل CSV
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
    });

// =====================
// حالة المركبة
// =====================
function isInactive(car) {
    return normalizeName(car['Status']) === 'INACTIVE';
}

// =====================
// تنبيه غير نشط
// =====================
function triggerAlert(key) {
    if (lastAlertKey === key) return;
    lastAlertKey = key;

    const audio = new Audio('alert.mp3');
    audio.play().catch(() => {});

    if (navigator.vibrate) {
        navigator.vibrate([300, 200, 300]);
    }
}

// =====================
// عرض النتائج
// =====================
function renderResults(results) {
    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (results.length === 0) {
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const inactive = isInactive(car);
        const key = car['Car No. (English)'] || car['Employee Name'];

        if (inactive) triggerAlert(key);

        tbody.innerHTML += `
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
    });

    table.style.display = 'block';
}

// =====================
// البحث باللوحة
// =====================
function searchByPlate() {
    document.getElementById('nameInput').value = '';

    const input = normalizePlate(document.getElementById('plateInput').value);
    if (!input) return renderResults([]);

    const results = carsData.filter(car => {
        return (
            normalizePlate(car['Car No. (English)']).includes(input) ||
            normalizePlate(car['Car No. (Arabic)']).includes(input)
        );
    });

    renderResults(results);
}

// =====================
// البحث بالاسم
// =====================
function searchByName() {
    document.getElementById('plateInput').value = '';

    const input = normalizeName(document.getElementById('nameInput').value);
    if (!input) return renderResults([]);

    const results = carsData.filter(car =>
        normalizeName(car['Employee Name']).includes(input)
    );

    renderResults(results);
}
