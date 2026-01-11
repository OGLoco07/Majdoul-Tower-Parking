 let carsData = [];

/* ===== الوضع الليلي ===== */
function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem(
        'darkMode',
        document.body.classList.contains('dark')
    );
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
}

/* ===== تنظيف النص ===== */
function normalize(text) {
    return text?.toString().replace(/\s+/g, '').toUpperCase();
}

/* ===== تحميل CSV ===== */
fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            let obj = {};

            headers.forEach((h, index) => {
                obj[h.trim()] = cols[index]?.trim();
            });

            carsData.push(obj);
        }
    });

/* ===== البحث التلقائي ===== */
plateInput.addEventListener('input', search);
employeeInput.addEventListener('input', search);

function search() {
    const plate = normalize(plateInput.value);
    const employee = normalize(employeeInput.value);
    const container = document.getElementById('results');

    container.innerHTML = '';

    if (!plate && !employee) return;

    carsData.filter(car => {
        const pEn = normalize(car['Car No. (English)']);
        const pAr = normalize(car['Car No. (Arabic)']);
        const emp = normalize(car['Employee Name']);

        return (
            (!plate || pEn?.includes(plate) || pAr?.includes(plate)) &&
            (!employee || emp?.includes(employee))
        );
    }).forEach(car => {

        const active =
            car['Status']?.includes('نشط') ||
            normalize(car['Status']) === 'ACTIVE';

        container.innerHTML += `
        <div class="card ${active ? 'active' : 'inactive'}">
            <div><strong>العميل:</strong> ${car['Client'] || '-'}</div>
            <div><strong>اللوحة:</strong> ${car['Car No. (English)'] || car['Car No. (Arabic)']}</div>
            <div><strong>الموديل:</strong> ${car['Car Model'] || '-'}</div>
            <div><strong>اللون:</strong> ${car['Car Color'] || '-'}</div>
            <div><strong>الموظف:</strong> ${car['Employee Name'] || '-'}</div>

            <div class="status ${active ? 'active' : 'inactive'}">
                ${active ? '🟢 نشط' : '🔴 غير نشط'}
            </div>
        </div>`;
    });
}
