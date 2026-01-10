let carsData = [];

// تنظيف النص
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

        // 🔑 اكتشاف الفاصل تلقائيًا
        const delimiter = data.includes(';') ? ';' : ',';

        const rows = data.split(/\r?\n/);
        const headers = rows[0].split(delimiter);

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;

            const cols = rows[i].split(delimiter);
            let obj = {};

            headers.forEach((h, index) => {
                obj[h.trim()] = cols[index]?.trim();
            });

            carsData.push(obj);
        }

        console.log('تم تحميل البيانات:', carsData.length);
        console.log('أول سجل:', carsData[0]); // للمراجعة
    })
    .catch(() => alert('فشل تحميل ملف CSV'));

// البحث
function searchCar() {
    const input = normalize(
        document.getElementById('plateInput').value
    );

    const table = document.getElementById('resultTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!input) {
        table.style.display = 'none';
        return;
    }

    const results = carsData.filter(car =>
        normalize(car['Car No. (English)']).includes(input) ||
        normalize(car['Car No. (Arabic)']).includes(input)
    );

    if (results.length === 0) {
        table.style.display = 'none';
        return;
    }

    results.forEach(car => {
        const row = `
            <tr>
                <td>${car['Employee Name'] || '-'}</td>
                <td>${car['Client'] || '-'}</td>
                <td>${car['Car No. (English)'] || car['Car No. (Arabic)'] || '-'}</td>
                <td>${car['Car Color'] || '-'}</td>
                <td>${car['Car Model'] || '-'}</td>
                <td>${car['Status'] || '-'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    table.style.display = 'table';
}
