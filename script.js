document.addEventListener('DOMContentLoaded', function () {

let carsData = [];

// عناصر الصفحة
const plateInput = document.getElementById('plateInput');
const nameInput  = document.getElementById('nameInput');
const cards      = document.getElementById('cards');
const counter    = document.getElementById('counter');

// توحيد النصوص
function normalizePlate(t){
    return t?.toString().replace(/\s+/g,'').toUpperCase();
}
function normalizeName(t){
    return t?.toString().trim().toUpperCase();
}

// تحميل CSV
fetch('تحديث بيانات الشركات (1).csv')
.then(res => res.text())
.then(data => {
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const values = lines[i].split(',');
        let obj = {};
        headers.forEach((h, j) => {
            obj[h.trim()] = values[j]?.trim();
        });
        carsData.push(obj);
    }
});

// رسم الكروت
function render(results){
    cards.innerHTML = '';
    counter.textContent = results.length ? `عدد النتائج: ${results.length}` : '';

    results.forEach(car => {
        const inactive = normalizeName(car['Status']) === 'INACTIVE';

        cards.innerHTML += `
        <div class="card ${inactive ? 'inactive' : 'active'}">
            <h3>${car['Employee Name'] || '-'}</h3>
            <div class="company">${car['Client'] || '-'}</div>
            <div class="info">
                اللوحة: ${car['Car No. (English)'] || car['Car No. (Arabic)'] || '-'}<br>
                اللون: ${car['Car Color'] || '-'} | الموديل: ${car['Car Model'] || '-'}
            </div>
            <span class="status ${inactive ? 'inactive' : 'active'}">
                ${inactive ? 'غير نشط' : 'نشط'}
            </span>
        </div>`;
    });
}

// البحث باللوحة
window.searchByPlate = function () {
    nameInput.value = '';
    const v = normalizePlate(plateInput.value);
    render(
        carsData.filter(c =>
            normalizePlate(c['Car No. (English)']).includes(v) ||
            normalizePlate(c['Car No. (Arabic)']).includes(v)
        )
    );
};

// البحث بالاسم
window.searchByName = function () {
    plateInput.value = '';
    const v = normalizeName(nameInput.value);
    render(
        carsData.filter(c =>
            normalizeName(c['Employee Name']).includes(v)
        )
    );
};

// مسح البحث
window.clearSearch = function () {
    plateInput.value = '';
    nameInput.value = '';
    render([]);
};

// الوضع الليلي
window.toggleDark = function () {
    document.body.classList.toggle('dark');
};

});
