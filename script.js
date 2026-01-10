let carsData=[];

function normalizePlate(t){
    return t?.toString().replace(/\s+/g,'').toUpperCase();
}
function normalizeName(t){
    return t?.toString().trim().toUpperCase();
}

fetch('تحديث بيانات الشركات (1).csv')
.then(r=>r.text())
.then(data=>{
    const lines=data.split('\n');
    const headers=lines[0].split(',');
    for(let i=1;i<lines.length;i++){
        if(!lines[i]) continue;
        const v=lines[i].split(',');
        let o={};
        headers.forEach((h,j)=>o[h.trim()]=v[j]?.trim());
        carsData.push(o);
    }
});

function render(results){
    const cards=document.getElementById('cards');
    const counter=document.getElementById('counter');
    cards.innerHTML='';
    counter.textContent=results.length?`عدد النتائج: ${results.length}`:'';

    results.forEach(car=>{
        const inactive=normalizeName(car['Status'])==='INACTIVE';

        cards.innerHTML+=`
        <div class="card ${inactive?'inactive':'active'}">
            <h3>${car['Employee Name']||'-'}</h3>
            <div class="company">${car['Client']||'-'}</div>
            <div class="info">
                اللوحة: ${car['Car No. (English)']||car['Car No. (Arabic)']||'-'}<br>
                اللون: ${car['Car Color']||'-'} | الموديل: ${car['Car Model']||'-'}
            </div>
            <span class="status ${inactive?'inactive':'active'}">
                ${inactive?'غير نشط':'نشط'}
            </span>
        </div>`;
    });
}

function searchByPlate(){
    nameInput.value='';
    const v=normalizePlate(plateInput.value);
    render(carsData.filter(c =>
        normalizePlate(c['Car No. (English)']).includes(v) ||
        normalizePlate(c['Car No. (Arabic)']).includes(v)
    ));
}

function searchByName(){
    plateInput.value='';
    const v=normalizeName(nameInput.value);
    render(carsData.filter(c =>
        normalizeName(c['Employee Name']).includes(v)
    ));
}

function clearSearch(){
    plateInput.value='';
    nameInput.value='';
    render([]);
}

function toggleDark(){
    document.body.classList.toggle('dark');
}
