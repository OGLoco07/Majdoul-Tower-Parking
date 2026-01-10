fetch('تحديث بيانات الشركات (1).csv')
    .then(res => res.text())
    .then(data => {

        // عرض أول 300 حرف من الملف
        alert(
            'أول جزء من الملف:\n\n' +
            data.substring(0, 300)
        );

        const delimiter = data.includes(';') ? ';' : ',';
        const rows = data.split(/\r?\n/);
        const headers = rows[0].split(delimiter);

        alert(
            'عدد الأعمدة:\n' +
            headers.length +
            '\n\n' +
            headers.join(' | ')
        );

    })
    .catch(() => {
        alert('❌ لم يتم تحميل ملف CSV');
    });
