const navButton = document.querySelector(".nav__button");
const formBtn = document.querySelector(".form-weight__button");
const toggleBtn = document.querySelector(".toggle-btn");
const editBtn = document.querySelector(".weight-info__edit-btn");
const fName = "Jack Leo Harper";
const birthDate = new Date("2024-10-13" + "T00:00");
window.addEventListener("DOMContentLoaded", setupItems);
navButton.addEventListener("click", openForm);
toggleBtn.addEventListener("click", openForm);
document.addEventListener("click", onClickOutside);
formBtn.addEventListener("click", submit);
editBtn.addEventListener("click", editItem);

function openForm() {
  resetForm();
  document.querySelector(".header__form").classList.add("header__form_show");
  document.querySelector(".nav").scrollIntoView({
    behavior: "smooth",
  });
}

function onClickOutside(e) {
  if (
    e.target.classList[0] === "nav__button" ||
    e.target.classList[0] === "form-weight__inputs" ||
    e.target.classList[0] === "form-weight__button" ||
    e.target.classList[0] === "form-weight__fieldset" ||
    e.target.classList[0] === "nav__add-icon" ||
    e.target.classList[0] === "toggle-btn" ||
    e.target.classList[0] === "toggle-btn__add-icon" ||
    e.target.classList[0] === "weight-info__edit-btn" ||
    e.target.classList[0] === "weight-info__edit-icon"
  ) {
    return;
  }
  closeForm();
}

function closeForm() {
  document.querySelector(".header__form").classList.remove("header__form_show");
}

function submit() {
  const bornWeight = 119;
  const selectedDate = new Date(date.value + "T00:00");
  const days =
    (selectedDate.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24;
  if (
    (pounds.value - Math.floor(pounds.value) !== 0 && !ounces.value) ||
    pounds.value - Math.floor(pounds.value)
  ) {
    const poundsValue = Math.floor(pounds.value);
    let ouncesValue = (pounds.value % 1) * 16;
    const totalOunces = poundsValue * 16 + ouncesValue;
    ouncesValue =
      ouncesValue.toString().length > 4
        ? ouncesValue.toFixed(2)
        : (pounds.value % 1) * 16;
    let percentChange = (
      ((totalOunces - bornWeight) / bornWeight) *
      100
    ).toFixed(2);
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    if (formBtn.innerHTML === "Edit") {
      editLocalStorage(
        fName,
        days,
        selectedDate.toISOString(),
        poundsValue,
        ouncesValue,
        kilograms,
        percentChange
      );
      closeForm();
      return;
    }
    createItem(
      fName,
      days,
      selectedDate,
      poundsValue,
      ouncesValue,
      kilograms,
      percentChange
    );
    setLocalStorage(
      fName,
      days,
      selectedDate,
      poundsValue,
      ouncesValue,
      kilograms,
      percentChange
    );
    const items = getLocalStorage(fName);
    const index = items.length - 1;
    resetForm();
    displayItem(index);
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      if (item.classList.contains("track-table__rows_selected")) {
        item.classList.remove("track-table__rows_selected");
      }
    });
    document
      .querySelectorAll(".track-table__rows")
      [index].classList.add("track-table__rows_selected");
    closeForm();
    return;
  }
  if (pounds.value && !ounces.value) {
    const poundsValue = pounds.value;
    const totalOunces = poundsValue * 16;
    let percentChange = (
      ((totalOunces - bornWeight) / bornWeight) *
      100
    ).toFixed(2);

    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    if (formBtn.innerHTML === "Edit") {
      poundsValue;
      editLocalStorage(
        fName,
        days,
        selectedDate.toISOString(),
        poundsValue,
        0,
        kilograms,
        percentChange
      );
      closeForm();
      return;
    }
    createItem(
      fName,
      days,
      selectedDate,
      poundsValue,
      0,
      kilograms,
      percentChange
    );
    setLocalStorage(
      fName,
      days,
      selectedDate,
      poundsValue,
      0,
      kilograms,
      percentChange
    );
    const items = getLocalStorage(fName);
    const index = items.length - 1;
    resetForm();
    displayItem(index);
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      if (item.classList.contains("track-table__rows_selected")) {
        item.classList.remove("track-table__rows_selected");
      }
    });
    document
      .querySelectorAll(".track-table__rows")
      [index].classList.add("track-table__rows_selected");
    closeForm();
    return;
  }
  const poundsValue = parseFloat(pounds.value);
  const ouncesValue = parseFloat(ounces.value);
  const totalOunces = poundsValue * 16 + ouncesValue;
  let percentChange = (((totalOunces - bornWeight) / bornWeight) * 100).toFixed(
    2
  );

  let kilograms = totalOunces * 0.0283495;
  kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  if (formBtn.innerHTML === "Edit") {
    editLocalStorage(
      fName,
      days,
      selectedDate.toISOString(),
      poundsValue,
      ouncesValue,
      kilograms,
      percentChange
    );
    closeForm();
    return;
  }
  createItem(
    fName,
    days,
    selectedDate,
    parseFloat(pounds.value),
    parseFloat(ounces.value),
    kilograms,
    percentChange
  );
  setLocalStorage(
    fName,
    days,
    selectedDate,
    parseFloat(pounds.value),
    parseFloat(ounces.value),
    kilograms,
    percentChange
  );
  const items = getLocalStorage(fName);
  const index = items.length - 1;
  resetForm();
  displayItem(index);
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    if (item.classList.contains("track-table__rows_selected")) {
      item.classList.remove("track-table__rows_selected");
    }
  });
  document
    .querySelectorAll(".track-table__rows")
    [index].classList.add("track-table__rows_selected");
  closeForm();
}

function resetForm(e) {
  const newDate = new Date().toISOString().slice(0, 10);
  document.querySelector(".form-weight__button").innerHTML = "Submit";
  document.getElementById("date").value = newDate;
  document.getElementById("pounds").value = "";
  document.getElementById("ounces").value = "";
}

function editItem(e) {
  const items = getLocalStorage(fName);
  var wDate = document.querySelector(".weight-info__date").innerHTML;
  wDate =
    wDate.substring(18, 23) +
    "-" +
    wDate.substring(15, 17) +
    "-" +
    wDate.substring(12, 14) +
    "T03:00:00.000Z";

  const index = items.findIndex((item) => item.date === wDate);
  openForm();
  document.getElementById("date").value = wDate.substring(0, 10);
  document.getElementById("pounds").value = items[index].pounds;
  document.getElementById("ounces").value = items[index].ounces;
  formBtn.innerHTML = "Edit";
}

function createItem(fname, days, date, pounds, ounces, kilograms, percent) {
  const itemList = document.getElementsByTagName("tbody")[0];
  const element = document.createElement("tr");
  var localeDate = new Date(date).toLocaleDateString();
  element.classList.add("track-table__rows");
  element.setAttribute("id", `${localeDate}`);
  const attr = (element.innerHTML = `
              <td class="track-table__row-item">${days}</td>
              <td class="track-table__row-item">
                <button class="track-table__btn">${localeDate}</button>
              </td>
              <td class="track-table__row-item">${pounds}lbs ${ounces}oz</td>
              <td class="track-table__row-item">${kilograms}kg</td>
              <td class="track-table__row-item">${percent}%</td>
`);
  itemList.appendChild(element);
  const TrackBtn = element.querySelector(".track-table__btn");
  TrackBtn.addEventListener("click", TrackBtnSelect);
}

function TrackBtnSelect(e) {
  const items = getLocalStorage(fName);
  var selectedDate = e.target.innerHTML;
  selectedDate =
    selectedDate.substring(6, 10) +
    "-" +
    selectedDate.substring(3, 5) +
    "-" +
    selectedDate.substring(0, 2) +
    "T03:00:00.000Z";
  const index = items.findIndex((item) => item.date === selectedDate);
  displayItem(index);
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    if (item.classList.contains("track-table__rows_selected")) {
      item.classList.remove("track-table__rows_selected");
    }
  });
  e.target.parentNode.parentNode.classList.add("track-table__rows_selected");
}

function setupItems() {
  var items = getLocalStorage(fName);
  const elements = items.sort(
    (a, b) =>
      (new Date(a.date).getTime() || -Infinity) -
      (new Date(b.date).getTime() || -Infinity)
  );
  console.log(elements);
  if (items.length === 0) {
    const birtdayItem = {
      fName: "Jack Leo Harper",
      days: 0,
      date: birthDate,
      pounds: 7,
      ounces: 5,
      kilograms: 3.317,
      percent: 0,
    };

    createItem(
      birtdayItem.fName,
      birtdayItem.days,
      birtdayItem.date,
      birtdayItem.pounds,
      birtdayItem.ounces,
      birtdayItem.kilograms,
      birtdayItem.percent
    );
    setLocalStorage(
      birtdayItem.fName,
      birtdayItem.days,
      birtdayItem.date,
      birtdayItem.pounds,
      birtdayItem.ounces,
      birtdayItem.kilograms,
      birtdayItem.percent
    );
    displayItem(0);
    document
      .querySelectorAll(".track-table__rows")[0]
      .classList.add("track-table__rows_selected");
    return;
  }
  items.map((item) => {
    createItem(
      item.fName,
      item.days,
      item.date,
      item.pounds,
      item.ounces,
      item.kilograms,
      item.percent
    );
    const index = items.length - 1;
    displayItem(index);
  });
  const index = items.length - 1;
  document
    .querySelectorAll(".track-table__rows")
    [index].classList.add("track-table__rows_selected");
}

function displayItem(index) {
  const items = getLocalStorage(fName);
  const displayName = document.querySelector(".weight-info__name");
  const displayWeightDate = document.querySelectorAll(".weight-info__date")[0];
  const displayBirthDate = document.querySelectorAll(".weight-info__date")[1];
  const displayDays = document.querySelectorAll(".info-column__value")[0];
  const displayPoundsOunces = document.querySelectorAll(
    ".info-column__value"
  )[1];
  const displayKilograms = document.querySelectorAll(".info-column__value")[2];
  const displayPercent = document.querySelectorAll(".info-column__value")[3];
  const displaySlideValue = document.querySelector(".slide-bar__infographic");
  const displaySlideStatus =
    document.getElementsByClassName("slide-bar__status")[0];

  displayName.innerHTML = items[index].name;
  displayWeightDate.innerHTML =
    "Weight Date " + new Date(items[index].date).toLocaleDateString();
  displayBirthDate.innerHTML =
    "Birthdate " + new Date(birthDate).toLocaleDateString();
  displayDays.innerHTML = items[index].days;
  displayPoundsOunces.innerHTML =
    items[index].pounds + " lbs " + items[index].ounces + " oz";
  displayKilograms.innerHTML = items[index].kilograms + " kg";
  displayPercent.innerHTML = items[index].percent + "%";
  displaySlideValue.value = items[index].percent;
  if (items[index].percent > -7) {
    displaySlideStatus.innerHTML = "Normal";
    displaySlideStatus.style.backgroundColor = "#0eaa0e";
  }
  if (items[index].percent <= -7) {
    displaySlideStatus.innerHTML = "Warning";
    displaySlideStatus.style.color = "#e6f0fd";
    displaySlideStatus.style.backgroundColor = "#ffdd00";
  }
  if (items[index].percent <= -10) {
    displaySlideStatus.innerHTML = "Dangerous";
    displaySlideStatus.style.color = "#e6f0fd";
    displaySlideStatus.style.backgroundColor = "#d10000db";
  }
}

function setLocalStorage(name, days, date, pounds, ounces, kilograms, percent) {
  var items = getLocalStorage(fName);
  const newItem = {
    name,
    days,
    date,
    pounds,
    ounces,
    kilograms,
    percent,
  };
  items.push(newItem);
  localStorage.setItem(name, JSON.stringify(items));
}

function editLocalStorage(
  name,
  days,
  date,
  pounds,
  ounces,
  kilograms,
  percent
) {
  const oldDate = document
    .querySelectorAll(".weight-info__date")[0]
    .innerHTML.substring(12);
  var oldDateFormated =
    oldDate.substring(6, 10) +
    "-" +
    oldDate.substring(3, 5) +
    "-" +
    oldDate.substring(0, 2) +
    "T00:00";
  oldDateFormated = new Date(oldDateFormated);
  const element = document.getElementById(
    `${oldDateFormated.toLocaleDateString()}`
  );
  const tableDays = element.children[0];
  const tableDate = element.children[1].children[0];
  const tablePoundsOunces = element.children[2];
  const tableKilograms = element.children[3];
  const tablePercent = element.children[4];
  tableDays.innerHTML = days;
  tableDate.innerHTML = new Date(date).toLocaleDateString();
  tablePoundsOunces.innerHTML = `${pounds}lbs ${ounces}oz`;
  tableKilograms.innerHTML = `${kilograms}kg`;
  tablePercent.innerHTML = `${percent}%`;
  let items = getLocalStorage(fName);
  items = items.map((item) => {
    console.log(item.date === oldDateFormated.toISOString());
    return item.date === oldDateFormated.toISOString()
      ? {
          name: name,
          days: days,
          date: date,
          pounds: pounds,
          ounces: ounces,
          kilograms: kilograms,
          percent: percent,
        }
      : item;
  });
  localStorage.setItem(fName, JSON.stringify(items));
  const index = items.findIndex((item) => item.date === date);
  displayItem(index);
}

function getLocalStorage(fName) {
  return localStorage.getItem(fName)
    ? JSON.parse(localStorage.getItem(fName))
    : [];
}
