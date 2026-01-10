let carsData = [];
let dataLoaded = false;

function normalizePlate(t){
    return (t || '').toString().replace(/\s+/g,'').toUpperCase();
}
function normalizeName(t){
    return (t || '').toString().trim().toUpperCase();
}

fetch('تحديث بيانات الشركات (1).csv')
.then(r => r.text())
.then(text => {

    // إزالة BOM
    text = text.replace(/^\uFEFF/, '');

    const lines = text.split(/\r?\n/);
    if(lines.length < 2) return;

    // دعم , أو ;
    const delimiter = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter);

    for(let i=1;i<lines.length;i++){
        if(!lines[i].trim()) continue;
        const values = lines[i].split(delimiter);
        let obj = {};
        headers.forEach((h,j)=>{
            obj[h.trim()] = values[j]?.trim() || '';
        });
        carsData.push(obj);
    }

    dataLoaded = true;
    console.log('CSV Loaded:', carsData.length);
});
