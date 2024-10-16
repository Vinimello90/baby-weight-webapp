const navButton = document.querySelector(".nav__button");
const formBtn = document.querySelector(".form-weight__button");
const fName = "Jack Leo Harper";
const birthDate = new Date("2024-10-13" + "T00:00");
navButton.addEventListener("click", openForm);
document.addEventListener("click", onClickOutside);
formBtn.addEventListener("click", submit);
window.addEventListener("DOMContentLoaded", setupItems);

function openForm() {
  resetForm();
  document.querySelector(".header__form").classList.add("header__form_show");
}

function onClickOutside(e) {
  if (
    e.target.classList[0] === "nav__button" ||
    e.target.classList[0] === "form-weight__inputs" ||
    e.target.classList[0] === "form-weight__button" ||
    e.target.classList[0] === "form-weight__fieldset" ||
    e.target.classList[0] === "nav__add-icon"
  ) {
    return;
  }
  document.querySelector(".header__form").classList.remove("header__form_show");
}

function submit() {
  const bornWeight = 119;
  const selectedDate = new Date(date.value + "T00:00");
  const days =
    (selectedDate.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24;
  const poundsValue = parseFloat(pounds.value);
  const ouncesValue = parseFloat(ounces.value);
  const totalOunces = poundsValue * 16 + ouncesValue;
  let percentChange = (((totalOunces - bornWeight) / bornWeight) * 100).toFixed(
    2
  );
  let kilograms = totalOunces * 0.0283495;
  kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
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
  resetForm();
  displayItem();
}

function resetForm(e) {
  const newDate = new Date().toISOString().slice(0, 10);
  document.getElementById("date").value = newDate;
  document.getElementById("pounds").value = "";
  document.getElementById("ounces").value = "";
}

function createItem(fname, days, date, pounds, ounces, kilograms, percent) {
  const itemList = document.getElementsByTagName("tbody")[0];
  const element = document.createElement("tr");
  var localeDate = new Date(date).toLocaleDateString();
  element.classList.add("track-table__rows");
  element.innerHTML = `
              <td class="track-table__row-item">${days}</td>
              <td class="track-table__row-item">
                <button class="track-table__btn">${localeDate}</button>
              </td>
              <td class="track-table__row-item">${pounds}lbs ${ounces}oz</td>
              <td class="track-table__row-item">${kilograms}kg</td>
              <td class="track-table__row-item">${percent}%</td>
`;
  itemList.appendChild(element);
}

function setupItems() {
  var items = getLocalStorage(fName);
  console.log(items.length);
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
    displayItem();
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
    displayItem();
  });
}

function displayItem() {
  items = getLocalStorage(fName);
  const lastItemIndex = items.length - 1;
  const displayName = document.querySelector(".weight-info__name");
  const displayWeightDate = document.querySelectorAll(".weight-info__date")[0];
  const displayBirthDate = document.querySelectorAll(".weight-info__date")[1];
  const displayDays = document.querySelectorAll(".info-column__value")[0];
  const displayPoundsOunces = document.querySelectorAll(
    ".info-column__value"
  )[1];
  const displayKilograms = document.querySelectorAll(".info-column__value")[2];
  const displayPercent = document.querySelectorAll(".info-column__value")[3];
  displayName.innerHTML = items[lastItemIndex].name;
  console.log(items);
  displayWeightDate.innerHTML =
    "Weight Date " + new Date(items[lastItemIndex].date).toLocaleDateString();
  displayBirthDate.innerHTML =
    "Birthdate " + new Date(birthDate).toLocaleDateString();
  displayDays.innerHTML = items[lastItemIndex].days;
  displayPoundsOunces.innerHTML =
    items[lastItemIndex].pounds + " lbs " + items[lastItemIndex].ounces + " oz";
  displayKilograms.innerHTML = items[lastItemIndex].kilograms + " kg";
  displayPercent.innerHTML = items[lastItemIndex].percent;
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

function getLocalStorage(fName) {
  return localStorage.getItem(fName)
    ? JSON.parse(localStorage.getItem(fName))
    : [];
}
