let carsData = [];

/* =====================
   أدوات مساعدة
===================== */
function normalize(text) {
    return text?.toString().trim();
}

/* =====================
   تحميل CSV وربط الأعمدة
===================== */
fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n').filter(r => r.trim() !== '');
        const headers = rows[0]
            .split(',')
            .map(h => h.replace('\ufeff', '').trim());

        const col = {
            client: headers.indexOf('Client'),
            plate: headers.indexOf('Plate'),
            model: headers.indexOf('Model'),
            color: headers.indexOf('Color'),
            employee: headers.indexOf('Employee Name'),
            status: headers.indexOf('Status')
        };

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');

            carsData.push({
                client: normalize(cols[col.client]),
                plate: normalize(cols[col.plate]),
                model: normalize(cols[col.model]),
                color: normalize(cols[col.color]),
                employee: normalize(cols[col.employee]),
                status: normalize(cols[col.status])
            });
        }

        console.log('CSV Loaded ✅', carsData[0]);
    });

/* =====================
   البحث
===================== */
function searchCar() {
    const input = normalize(document.getElementById('plateInput').value);
    const container = document.getElementById('results');

    container.innerHTML = '';

    if (!input) return;

    const results = carsData.filter(car =>
        car.plate?.includes(input)
    );

    if (results.length === 0) {
        container.innerHTML = '<p style="text-align:center;">لا توجد نتائج</p>';
        return;
    }

    results.forEach(car => {
        const active = car.status?.toLowerCase() === 'active';

        container.innerHTML += `
        <div class="card ${active ? 'active' : 'inactive'}">

            <div><strong>العميل:</strong> ${car.client || '-'}</div>
            <div><strong>اللوحة:</strong> ${car.plate || '-'}</div>
            <div><strong>الموديل:</strong> ${car.model || '-'}</div>
            <div><strong>اللون:</strong> ${car.color || '-'}</div>
            <div><strong>اسم الموظف:</strong> ${car.employee || '-'}</div>

            <div class="status ${active ? 'active' : 'inactive'}">
                ${active ? '🟢 نشط' : '🔴 غير نشط'}
            </div>

        </div>`;
    });
}
