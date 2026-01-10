let carsData = [];
let dataLoaded = false;

// =====================
// أدوات تنظيف
// =====================
function normalizePlate(t){
    return (t||'').toString().replace(/\s+/g,'').toUpperCase();
}
function normalizeName(t){
    return (t||'').toString().trim().toUpperCase();
}

// =====================
// تحميل CSV (محصّن)
// =====================
fetch('تحديث بيانات الشركات (1).csv')
.then(r => r.text())
.then(text => {

    // إزالة BOM
    text = text.replace(/^\uFEFF/, '');

    const lines = text.split(/\r?\n/);
    if(lines.length < 2) return;

    // دعم , و ;
    const delimiter = lines[0].includes(';') ? ';' : ',';
    const rawHeaders = lines[0].split(delimiter);

    // توحيد أسماء الأعمدة
    const key = h => h
        .toLowerCase()
        .replace(/\s+/g,'')
        .replace(/[().]/g,'');

    const headers = rawHeaders.map(h => key(h));

    for(let i=1;i<lines.length;i++){
        if(!lines[i].trim()) continue;
        const v = lines[i].split(delimiter);
        let o = {};
        headers.forEach((h,j)=>o[h]=v[j]?.trim()||'');
        carsData.push(o);
    }

    dataLoaded = true;
    console.log('CSV Loaded:', carsData.length);
});

// =====================
// العرض
// =====================
function render(results){
    const tbody = document.querySelector('#resultTable tbody');
    const cards = document.getElementById('cards');
    const counter = document.getElementById('counter');

    tbody.innerHTML = '';
    cards.innerHTML = '';
    counter.textContent = results.length ? `عدد النتائج: ${results.length}` : '';

    results.forEach(car=>{
        const inactive = normalizeName(car.status)==='INACTIVE';

        tbody.innerHTML += `
        <tr>
            <td><b>${car.employeename||'-'}</b><br>${car.client||'-'}</td>
            <td>${car.carnoenglish||car.carnoarabic||'-'}</td>
            <td>${car.carcolor||'-'}</td>
            <td>${car.carmodel||'-'}</td>
            <td>
                <span class="status ${inactive?'inactive':'active'}">
                ${inactive?'غير نشط':'نشط'}
                </span>
            </td>
        </tr>`;

        cards.innerHTML += `
        <div class="card ${inactive?'inactive':'active'}">
            <b>${car.employeename||'-'}</b><br>
            ${car.client||'-'}<br>
            🚗 ${car.carnoenglish||car.carnoarabic||'-'}<br>
            🎨 ${car.carcolor||'-'} | ${car.carmodel||'-'}<br>
            <span class="status ${inactive?'inactive':'active'}">
            ${inactive?'غير نشط':'نشط'}
            </span>
        </div>`;
    });
}

// =====================
// البحث
// =====================
function searchByPlate(){
    if(!dataLoaded) return;
    nameInput.value = '';
    const v = normalizePlate(plateInput.value);
    if(!v) return render([]);

    render(
        carsData.filter(c =>
            normalizePlate(c.carnoenglish).includes(v) ||
            normalizePlate(c.carnoarabic).includes(v)
        )
    );
}

function searchByName(){
    if(!dataLoaded) return;
    plateInput.value = '';
    const v = normalizeName(nameInput.value);
    if(!v) return render([]);

    render(
        carsData.filter(c =>
            normalizeName(c.employeename).includes(v)
        )
    );
}

// =====================
// أدوات
// =====================
function clearSearch(){
    plateInput.value='';
    nameInput.value='';
    render([]);
}

function toggleDarkMode(){
    document.body.classList.toggle('dark');
}
