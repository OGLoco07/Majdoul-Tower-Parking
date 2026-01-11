/***********************
  GLOBAL DATA
************************/
let carsData = [];

/***********************
  HELPERS
************************/
function normalize(text) {
    return text ? text.toString().trim().toUpperCase() : '';
}

/***********************
  LOAD CSV
************************/
fetch('data.csv')
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
                client: cols[col.client]?.trim() || '-',
                plate: cols[col.plate]?.trim() || '-',
                model: cols[col.model]?.trim() || '-',
                color: cols[col.color]?.trim() || '-',
                employee: cols[col.employee]?.trim() || '-',
                status: cols[col.status]?.trim() || '-'
            });
        }

        console.log('CSV Loaded ✅', carsData.length);
    })
    .catch(err => console.error('CSV Error ❌', err));

/***********************
  SEARCH
************************/
function runSearch() {
    const plateInput = normalize(document.getElementById('plateInput').value);
    const empInput = normalize(document.getElementById('employeeInput').value);
    const container = document.getElementById('results');

    container.innerHTML = '';

    if (!plateInput && !empInput) return;
    if (carsData.length === 0) return;

    const results = carsData.filter(car => {
        const matchPlate = plateInput
            ? normalize(car.plate).includes(plateInput)
            : true;

        const matchEmp = empInput
            ? normalize(car.employee).includes(empInput)
            : true;

        return matchPlate && matchEmp;
    });

    if (results.length === 0) {
        container.innerHTML =
            `<p style="text-align:center;">لا توجد نتائج</p>`;
        return;
    }

    results.forEach(car => {
        const active =
            car.status.toLowerCase().includes('active') ||
            car.status.includes('نشط');

        container.innerHTML += `
        <div class="card ${active ? 'active' : 'inactive'}">
            <div><strong>العميل:</strong> ${car.client}</div>
            <div><strong>اللوحة:</strong> ${car.plate}</div>
            <div><strong>الموديل:</strong> ${car.model}</div>
            <div><strong>اللون:</strong> ${car.color}</div>
            <div><strong>اسم الموظف:</strong> ${car.employee}</div>
            <div class="status ${active ? 'active' : 'inactive'}">
                ${active ? '🟢 نشط' : '🔴 غير نشط'}
            </div>
        </div>`;
    });
}

/***********************
  DARK MODE (MATCH HTML)
************************/
function toggleDark() {
    document.body.classList.toggle('dark');
}

/***********************
  AUTO SEARCH
************************/
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('plateInput')
        .addEventListener('input', runSearch);

    document.getElementById('employeeInput')
        .addEventListener('input', runSearch);
});
