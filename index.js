let timer = document.querySelector(".time");
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("setAlarm");
let alarmsArr = [];
let sound = new Audio("Boombayah.mp3");

let startHour = 0,
  startMinute = 0,
  alarmInd = 0;

  window.onload = () => {
    setInterval(timeDisplay);
    startHour = 0;
    startMinute = 0;
    alarmInd = 0;
    alarmsArr = [];
    hour.value = addZero(startHour);
    minute.value = addZero(startMinute);
  };

// --------------> Adding zeroes for single digit <--------------------
const addZero = (value) =>(value < 10 ? "0" + value : value);

// --------------> Search for value in object <------------------
const findObj = (parameter, value) => {
  let alarmObject,
    objIndex,
    isPresent = false;
    alarmsArr.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      isPresent = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [isPresent, alarmObject, objIndex];
};

// -----------------> Display Time <------------------
function timeDisplay() {
  let time = new Date();
  let [hours, minutes, seconds] = [
    addZero(time.getHours()),
    addZero(time.getMinutes()),
    addZero(time.getSeconds()),
  ];

  timer.innerHTML = `${hours}:${minutes}:${seconds}`;

  // --------------> Alarm <-----------------
  alarmsArr.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        sound.play();
        sound.loop = true;
      }
    }
  });
}

const checkInput = (input) => {
  input = parseInt(input);
  if (input < 10) {
    input = addZero(input);
  }
  return input;
};

hour.addEventListener("input", () => {
  hour.value = checkInput(hour.value);
});

minute.addEventListener("input", () => {
  minute.value = checkInput(minute.value);
});

// ----------------> Create Alarm Div <-----------------

const createAlarm = (alarmObj) => {
  // ---------------> Keys from Object <------------------
  const { id, alarmHour, alarmMinute } = alarmObj;
  // ---------------> Alarm Div <------------------
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("alarm-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  // ---------------> Checkbox <------------------
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  // ---------------> Delete Button <-----------------
  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteBtn);
  activeAlarms.appendChild(alarmDiv);
};

 // ----------------> Set Alarm <------------------
setAlarm.addEventListener("click", () => {
  alarmInd += 1;

  // -----------------> AlarmObject <-----------------
  let alarmObj = {};
  alarmObj.id = `${alarmInd}_${hour.value}_${minute.value}`;
  alarmObj.alarmHour = hour.value;
  alarmObj.alarmMinute = minute.value;
  alarmObj.isActive = false;
  console.log(alarmObj);
  alarmsArr.push(alarmObj);
  createAlarm(alarmObj);
  hour.value = addZero(startHour);
  minute.value = addZero(startMinute);
});

// ----------------> Start Alarm <-------------------
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("alarm-id");
  let [isPresent, obj, index] = findObj("id", searchId);
  if (isPresent) {
    alarmsArr[index].isActive = true;
  }
};

// ------------------> Stop Alarm <----------------
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("alarm-id");
  let [isPresent, obj, index] = findObj("id", searchId);
  if (isPresent) {
    alarmsArr[index].isActive = false;
    sound.pause();   
  }
};

// ------------------> Delete Alarm <--------------------
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("alarm-id");
  let [isPresent, obj, index] = findObj("id", searchId);
  if (isPresent) {
    e.target.parentElement.parentElement.remove();
    alarmsArr.splice(index, 1);
  }
};

  

