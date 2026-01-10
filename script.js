let carsData = [];

// =====================
// أدوات تنظيف
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
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;

            const values = lines[i].split(',');
            let obj = {};

            headers.forEach((h, index) => {
                obj[h.trim()] = values[index]?.trim();
            });

            carsData.push(obj);
        }

        console.log('تم تحميل البيانات:', carsData.length);
    })
    .catch(err => {
        console.error(err);
        alert('فشل تحميل ملف CSV');
    });

// =====================
// البحث باللوحة
// =====================
function searchByPlate() {
    document.getElementById('nameInput').value = '';

    const input = normalizePlate(
        document.getElementById('plateInput').value
    );

    renderResults(car =>
        normalizePlate(car['Car No. (English)']).includes(input) ||
        normalizePlate(car['Car No. (Arabic)']).includes(input)
    );
}

// =====================
// البحث بالاسم
// =====================
function searchByName() {
    document.getElementById('plateInput').value = '';

    const input = normalizeName(
        document.getElementById('nameInput').value
    );

    renderResults(car =>
        normalizeName(car['Employee Name']).includes(input)
    );
}

// =====================
// عرض النتائج
// =====================
function renderResults(condition) {
    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!condition) {
        table.style.display = 'none';
        return;
    }

    const results = carsData.filter(condition);

    if (results.length === 0) {
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const status = normalizeName(car['Status']);
        const inactive = status === 'INACTIVE';

        const row = `
            <tr class="${inactive ? 'row-inactive' : 'row-active'}">
                <td>
                    <strong>${car['Employee Name'] || '-'}</strong><br>
                    <small>${car['Client'] || '-'}</small>
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

    table.style.display = 'table';
}
