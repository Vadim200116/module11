// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления



// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "violet", "weight": 13},
  {"kind": "Дуриан", "color": "green", "weight": 35},
  {"kind": "Личи", "color": "carmazin", "weight": 17},
  {"kind": "Карамбола", "color": "yellow", "weight": 28},
  {"kind": "Тамаринд", "color": "lightbrown", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML='';
  for (let i = 0; i < fruits.length; i++) {
    let li=document.createElement('li'); 
    li.className='fruit__item fruit_'+fruits[i].color;
    let fruit__info=document.createElement('div');
    fruit__info.className='fruit__info';
  
    let divIndex=document.createElement('div');
    divIndex.appendChild(document.createTextNode("index: "+ i));
    fruit__info.appendChild(divIndex);

   for(let key in fruits[i]){
     newText=document.createTextNode(key+': '+ fruits[i][key]);
     let div=document.createElement('div');
     div.appendChild(newText)
     fruit__info.appendChild(div);
     
   }
   li.appendChild(fruit__info);
   fruitsList.appendChild(li);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


// сравнение двух массивов
const arraysAreEqual=(arr1,arr2)=>{
  if (arr1.length!=arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i]!=arr2[i]) {
      return false;
    }
  }
  return true;
}

// перемешивание массива
const shuffleFruits = () => {
  let result = []; // перемешанный массив
  let resultIndex=0;
  let compareFruits=fruits.slice(); // копия массива fruits для проверки на изменение

  while (fruits.length > 0) {
    let randomIndex=getRandomInt(0,fruits.length-1);
    result[resultIndex++]=fruits[randomIndex];
    fruits.splice(randomIndex,1);
  }
  if(arraysAreEqual(result,compareFruits)){
    alert('Порядок не изменился');
}
  fruits = result;
};


shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  sortTimeLabel.textContent ='-';
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

let minWeight;//минимальное значение веса
let maxWeight;//максимальное значение веса

//функция проверки максимального и минимального значений, введенных пользователем
const inputWeightCheck=()=>{
  minWeight=parseInt(document.querySelector('.minweight__input').value)|| 0;
  maxWeight=parseInt(document.querySelector('.maxweight__input').value)|| Infinity;
};

// фильтрация массива
const filterFruits = () => {
  inputWeightCheck();
  fruits=fruits.filter((item) => {
    if(minWeight<=item.weight && item.weight<=maxWeight)
      return item;    
  });
};


filterButton.addEventListener('click', () => {
  filterFruits();
  sortTimeLabel.textContent ='-';
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

// сравнение цвета по порядку первой буквы в алфавите
const comparationColor = (a, b) => {
  let priority=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  let priority1=priority.indexOf(a.color[0]);
  let priority2=priority.indexOf(b.color[0]);
  return priority1>priority2;
};

// разделяет массив на две части
const partition=(arr, left, right,comparation)=>{
  var pivot = arr[Math.floor((right + left) / 2)],
      i = left,
      j = right;
  while (i <= j) {
      while (comparation(pivot, arr[i])) {
          i++;
      }
      while (comparation(arr[j],pivot)) {
          j--;
      }
      if (i <= j) {
          swap(arr, i, j);
          i++;
          j--;
      }
  }
  return i;
};

// меняет местами два элемента в массиве
let swap=(items, firstIndex, secondIndex)=>{
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
};

const sortAPI = {
  // сортировка пузырьком
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) { 
        for (let j = 0; j < n-1-i; j++) { 
            if (comparation(arr[j], arr[j+1])) { 
                swap(arr,j,j+1); 
            }
        }
    }           
    return arr;       
  },

  // быстрая сортировка
  quickSort(arr,comparation,left=0,right=arr.length-1) {
    var index;
    if (arr.length > 1) {
       index = partition(arr, left, right,comparation);
       if (left < index - 1) {
           sortAPI.quickSort(arr,comparation, left, index - 1);
       }
       if (index < right) {
        sortAPI.quickSort(arr,comparation, index, right);
       }
   }
   return arr;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
let sortLabelInitialize=()=>{
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;
}

sortLabelInitialize();

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind=='bubbleSort') {
    sortKind='quickSort';
  }
  else{
    sortKind='bubbleSort';
  }
  sortTime='-';
  sortLabelInitialize();
});


sortActionButton.addEventListener('click', () => {
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortLabelInitialize();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
    let newFruit={
    kind: kindInput.value,
    color:colorInput.value,
    weight:parseInt(weightInput.value),
  };
  
  if(newFruit.kind && newFruit.color && newFruit.weight){
  fruits.push(newFruit);
  display();
  }else{
    alert("Ошибка добавления нового фрукта");
  }
});

