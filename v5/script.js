// Відібрати перший інпут який відповідає за першу дату
const inputDate = document.querySelector("#input-data-1");

// Відібрати другий інпут який відповідає за другу дату
const inputDate2 = document.querySelector("#input-data-2");

// Відібрати інпут який відповідає за те, які дні рахувати (вихідні,..)
const inputPresets = document.querySelectorAll('[name="preset"]');

// Запам'ятовуємо дату з поля 1, 2 + різницю між датами
let valDate1 = false;
let valDate2 = false;
let dateDiff = false;

// Відібрати другий інпут який відповідає за другу дату
let btnSubmit = document.querySelector(".calculate");
let btnSubmitView = document.querySelector(".calculation-result");


function checkDate1()
{
    // Відбираємо значення з поля дати №1
    valDate1 = inputDate.value;

    // Перевіряємо чи в нас є значення дати
    if (valDate1 == '' || valDate1 == false) {

        // Друге поля дати робити неактивним і очищувати дату в ній
        inputDate2.disabled = true;
    } else {

        // Друге поля робити активним
        inputDate2.disabled = false;
        inputDate2.min = valDate1;
    }
}


// Слідкуємо за другим полем і дивимося щоб дата не була менша за дату з першого поля
function checkDate2()
{
    // Відбираємо значення з поля дати №2
    valDate2 = inputDate2.value;

    // Перевіряємо чи дата 2 не більша за дату 1 
    if (valDate2 < valDate1)   
        inputDate2.value = valDate1;
}



// Підрахунок різності дати
function summDates(event)
{
    // Забороняємо стандартний функціонал html form
    event.preventDefault();
    
    // Конвертуємо дату
    const date1 = new Date(valDate1);
    const date2 = new Date(valDate2);

    // Поточна кнопка по якій був клік
    let typeCalc = event.submitter.innerHTML;

    // Відбираємо тип яким будемо підраховувати
    const inputOption = document.querySelector('[name="option"]:checked').value;

    // // Підраховуємо різницю в днях
    dateDiff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)); 
        
    // Підраховуємо вихідні і робочі дні
    let weekDays = calcWeekdays(date1, dateDiff);

    // Створюємо змінну для типу виводу
    let labelType;

    // Вивід відносно умови
    if (typeCalc == 'days' || typeCalc == 'calculate')
        labelType = 'днів';

    else if(typeCalc == 'hours')
        labelType = 'годин';

    else if(typeCalc == 'minutes')
        labelType = 'хвилин';

    else if(typeCalc == 'seconds')
        labelType = 'секунд';
    

    // Вивід відноcно типу пересета    
    if(inputOption == 'all days') {

        // Отримуємо цифру різниці
        dateDiff = viewNumByType(typeCalc, dateDiff);

        // Вивід відносно різних типів
        btnSubmitView.innerHTML = labelType + ' різниці ' + dateDiff;
    }
    else if (inputOption == 'weekdays') {
    
        // Отримуємо цифру різниці
        dateDiff = viewNumByType(typeCalc, weekDays['weekdays']);
    
        // Вивід відносно різних типів
        btnSubmitView.innerHTML = 'робочі ' + labelType + ' різниці ' + dateDiff;
    }
    else if (inputOption == 'weekends') {
        
        // Отримуємо цифру різниці
        dateDiff = viewNumByType(typeCalc, weekDays['weekends']);

        // Вивід відносно різних типів
        btnSubmitView.innerHTML = 'вихідні ' + labelType + ' різниці ' + dateDiff;
    }

    // Запам'ятовуємо вибір
    localStorageRememberDates(labelType);

    // Виводимо дату в таблицю
    localStorageViewAllDates();
}


// Підрахунок вихідних і робочих днів
function calcWeekdays(date1, daysDiff)
{
    // Початок дати з якої будемо рахувати
    let dateVal = date1;

    // Заглушка для вихідних і робочих днів
    let weekDays  =  [];
    weekDays['weekends'] = 0;
    weekDays['weekdays'] = 0;

    // Перевіряємо поточну дату на вихідний чи робочий
    if(isWeekend(dateVal))
        weekDays['weekends']++;
    else
        weekDays['weekdays']++;

    // Перебираємо дати і дивимося чи вони вихідні чи робочі
    for (let i = 1; i <= daysDiff; i++) {
        
        // Робимо нову дату + 1 день
        dateVal.setDate(dateVal.getDate() + 1);
        
        if(isWeekend(dateVal))
            weekDays['weekends']++;
        else
            weekDays['weekdays']++;
    }

    return weekDays;
}

// Перевірка дати на вихідний чи робочий
function isWeekend(date = new Date()) {
    return date.getDay() === 6 || date.getDay() === 0;
}

// Виводити цифри відносно потрібно типу (дні, години, секунди...)
function viewNumByType(typeCalc, num)
{
    if (typeCalc == 'days' || typeCalc == 'calculate')
        return num;
    else if(typeCalc == 'hours')
        data = Math.floor(num * 24);
    else if(typeCalc == 'minutes')
        data = Math.floor(num * (24 * 60));
    else if(typeCalc == 'seconds')
        data = Math.floor(num  * (24 * 60 * 60));

    return data;
}

// Формаємо дату в потрібний формат
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Відповідає за presety
function changePreset ()
{
    // Відібраємо значення вибору
    let preset = this.value;
    
    // Перевіряємо чи існує в нас дата початку
    if (valDate1 != '' || valDate1 != false) {
        
        valDate2 = new Date(valDate1);

        if (preset == 'week')
            valDate2.setDate(valDate2.getDate() + 7);
        else if (preset == 'month')
            valDate2.setDate(valDate2.getDate() + 31);

        inputDate2.value = formatDate(valDate2);
    }
}



// По кліку активовути чи не активовути поле другої дати
inputDate.onchange = checkDate1;

// По кліку активовути чи не активовути поле другої дати
inputDate2.onchange = checkDate2;

// // Слідкуємо за зміною підрахунку вихідних чи робочих днів
for (let i = 0; i < inputPresets.length; i++)
    inputPresets[i].onclick = changePreset;



function localStorageGetDates()
{
    return JSON.parse(localStorage.getItem('dates'));
}


function localStorageRememberDates(labelType)
{  

    // Формуємо дані
    let data = {
        start: valDate1,
        end:   valDate2,
        diff:  dateDiff + ' ' + labelType
    }

    // Витягуємо з локального зберігання дані
    let dataFromLocal = localStorageGetDates();

    // Добавляємо до існуючих даних наші останні дані
    if(dataFromLocal == null) {

        // Якщо немає тоді створюємо перший запис
        dataFromLocal = [{
            
                ...data
            
        }];
    } else {

        // Якщо вже є записи тоді добавляємо до низу ще один
        let key = Object.keys(dataFromLocal).pop();
        dataFromLocal[Number(key) + 1] = data;
    }

    // // Обмежуємо кількість масива
    if(typeof dataFromLocal[10] == 'object')
        dataFromLocal.shift();

    localStorage.setItem('dates', JSON.stringify(dataFromLocal));
}



function localStorageViewAllDates()
{
    // Витягуємо з локального зберігання дані
    let allDates = localStorageGetDates();

    // Перебираємо всі збережені дати
    if(allDates != null) {
        
        // Перевертаємо верх ногами
        allDates = allDates.reverse();

        // Таблиця в яку будемо виводити значення
        const tableView = document.getElementById("view-dates");
        tableView.innerHTML = '';
        
        // Проходимося циклом по датам
        for (let index = 0; index < allDates.length; index++) {
            
            // Розбиваємо масив на частини
            let {start, end, diff} = allDates[index];
            
            // Шаблон виводу в таблицю
            let template = `<tr>
                <th>${start}</th>
                <th>${formatDate(end)}</th>
                <th>${diff}</th></tr>`;

            // Виводимо в таблицю
            tableView.innerHTML += template;
        }

    }

}

localStorageViewAllDates();




