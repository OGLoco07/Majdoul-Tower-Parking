let carsData = [];

function normalizePlate(t){return t?.toString().replace(/\s+/g,'').toUpperCase();}
function normalizeName(t){return t?.toString().trim().toUpperCase();}

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
    const tbody=document.querySelector('#resultTable tbody');
    const cards=document.getElementById('cards');
    const counter=document.getElementById('counter');
    tbody.innerHTML='';
    cards.innerHTML='';
    counter.textContent = results.length ? `عدد النتائج: ${results.length}` : '';

    results.forEach(car=>{
        const inactive = normalizeName(car['Status'])==='INACTIVE';

        tbody.innerHTML+=`
        <tr>
            <td><b>${car['Employee Name']||'-'}</b><br>${car['Client']||'-'}</td>
            <td>${car['Car No. (English)']||car['Car No. (Arabic)']||'-'}</td>
            <td>${car['Car Color']||'-'}</td>
            <td>${car['Car Model']||'-'}</td>
            <td>
                <span class="status ${inactive?'inactive':'active'}">
                ${inactive?'غير نشط':'نشط'}
                </span>
            </td>
        </tr>`;

        cards.innerHTML+=`
        <div class="card ${inactive?'inactive':'active'}">
            <b>${car['Employee Name']||'-'}</b><br>
            ${car['Client']||'-'}<br>
            🚗 ${car['Car No. (English)']||car['Car No. (Arabic)']||'-'}<br>
            🎨 ${car['Car Color']||'-'} | ${car['Car Model']||'-'}<br>
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

function toggleDarkMode(){
    document.body.classList.toggle('dark');
}
