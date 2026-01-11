let carsData = [];

/* =====================
   الوضع الليلي
===================== */
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

/* =====================
   أدوات مساعدة
===================== */
function normalize(text) {
    return text?.toString().trim();
}

function isPlate(val) {
    return /[A-Z0-9]/i.test(val) && val.length <= 10;
}

function isColor(val) {
    return /(أبيض|اسود|أسود|فضي|فضي|أحمر|ازرق|أزرق|رمادي|black|white|silver|red|blue|gray)/i.test(val);
}

function isStatus(val) {
    return /(ACTIVE|INACTIVE|نشط|غير)/i.test(val);
}

/* =====================
   تحميل CSV + ترتيب ذكي
===================== */
fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n');

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;

            const cols = rows[i].split(',').map(c => c.trim());

            let car = {
                Client: '',
                Plate: '',
                Model: '',
                Color: '',
                Employee: '',
                Status: ''
            };

            cols.forEach(val => {
                if (!val) return;

                if (!car.Status && isStatus(val)) {
                    car.Status = val;
                } else if (!car.Color && isColor(val)) {
                    car.Color = val;
                } else if (!car.Plate && isPlate(val)) {
                    car.Plate = val;
                } else if (!car.Model && /\d/.test(val)) {
                    car.Model = val;
                } else if (!car.Employee && val.length > 3) {
                    car.Employee = val;
                } else if (!car.Client) {
                    car.Client = val;
                }
            });

            carsData.push(car);
        }
    });

/* =====================
   البحث
===================== */
plateInput.addEventListener('input', search);
employeeInput.addEventListener('input', search);

function search() {
    const plateVal = normalize(plateInput.value);
    const empVal = normalize(employeeInput.value);
    const container = document.getElementById('results');

    container.innerHTML = '';
    if (!plateVal && !empVal) return;

    carsData.filter(car => {
        return (
            (!plateVal || car.Plate.includes(plateVal)) &&
            (!empVal || car.Employee.includes(empVal))
        );
    }).forEach(car => {

        const active = isStatus(car.Status) && !/غير/i.test(car.Status);

        container.innerHTML += `
        <div class="card ${active ? 'active' : 'inactive'}">
            <div><strong>العميل:</strong> ${car.Client || '-'}</div>
            <div><strong>اللوحة:</strong> ${car.Plate || '-'}</div>
            <div><strong>الموديل:</strong> ${car.Model || '-'}</div>
            <div><strong>اللون:</strong> ${car.Color || '-'}</div>
            <div><strong>الموظف:</strong> ${car.Employee || '-'}</div>

            <div class="status ${active ? 'active' : 'inactive'}">
                ${active ? '🟢 نشط' : '🔴 غير نشط'}
            </div>
        </div>`;
    });
}
