let carsData = [];

// تنظيف النص (إزالة المسافات وتحويله لحروف كبيرة)
function normalize(text) {
    return text
        ?.toString()
        .replace(/\s+/g, '')
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

function searchCar() {
    const input = normalize(document.getElementById('plateInput').value);
    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';

    const results = carsData.filter(car => {
        const en = normalize(car['Car No. (English)']);
        const ar = normalize(car['Car No. (Arabic)']);
        return en?.includes(input) || ar?.includes(input);
    });

    if (results.length === 0) {
        alert('لم يتم العثور على المركبة');
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const row = `
            <tr>
    <td data-label="الشركة">${car['Client'] || '-'}</td>
    <td data-label="رقم اللوحة">${car['Car No. (English)'] || car['Car No. (Arabic)']}</td>
    <td data-label="لون السيارة">${car['Car Color'] || '-'}</td>
    <td data-label="موديل السيارة">${car['Car Model'] || '-'}</td>
    <td data-label="الحالة">${car['Status'] || '-'}</td>
</tr>`;
        `;
        tbody.innerHTML += row;
    });

    table.style.display = 'table';
}
