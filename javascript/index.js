const navButton = document.querySelector(".nav__button");
const formBtn = document.querySelector(".form-weight__button");
const toggleBtn = document.querySelector(".toggle-btn");
const editBtn = document.querySelector(".weight-info__edit-btn");
const alert = document.querySelector(".alert__text");
var edit = false;

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
  document
    .getElementById("pounds")
    .classList.remove("form-weight__pounds_focus");
  document.getElementById("date").classList.remove("form-weight__date_focus");
}

function submit() {
  let items = getLocalStorage();
  const fullName = items[0].name;
  const selectedDate = new Date(date.value + "T00:00");
  const birthday = new Date(items[0].date);
  let days =
    (selectedDate.getTime() - birthday.getTime()) / 1000 / 60 / 60 / 24;
  days = Math.round(days);
  const displayedDays =
    document.querySelector(".info-column_days").children[1].innerHTML;
  var index = items.findIndex(
    (item) => item.date === selectedDate.toISOString()
  );
  var poundsValue = parseFloat(pounds.value);
  var ouncesValue = parseFloat(ounces.value);
  var kilogramsValue = poundsValue;
  if (
    (index > -1 && !edit) ||
    (index > -1 &&
      parseInt(displayedDays) === 0 &&
      selectedDate.getTime() !== birthday.getTime() &&
      edit)
  ) {
    displayAlert("Date is already in use!", "danger");
    document.getElementById("date").classList.add("form-weight__date_focus");
    document.getElementById("date").focus();
    return;
  }
  if (
    (selectedDate.getTime() <= birthday.getTime() && !edit) ||
    (selectedDate.getTime() <= birthday.getTime() &&
      parseInt(displayedDays) !== 0 &&
      edit)
  ) {
    displayAlert("Additional measurement must be after birthday", "danger");
    document.getElementById("date").classList.add("form-weight__date_focus");
    document.getElementById("date").focus();
    return;
  }

  if (!poundsValue || !kilogramsValue) {
    displayAlert("No weight was specified!", "danger");
    document
      .getElementById("pounds")
      .classList.add("form-weight__pounds_focus");
    document.getElementById("pounds").focus();
    return;
  }
  switch (form_weight_units.value) {
    case "pounds":
      weightsValues = calculatePounds(poundsValue, ouncesValue);
      break;
    case "kilograms":
      weightsValues = calculateKilograms(kilogramsValue);
      break;
  }
  switch (edit) {
    case false:
      setLocalStorage(
        fullName,
        days,
        selectedDate,
        weightsValues.pounds,
        weightsValues.ounces,
        weightsValues.kilograms,
        weightsValues.percentage
      );
      break;
    case true:
      editLocalStorage(
        fullName,
        days,
        selectedDate.toISOString(),
        weightsValues.pounds,
        weightsValues.ounces,
        weightsValues.kilograms,
        weightsValues.percentage
      );
      break;
  }
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    item.remove();
  });
  items = getLocalStorage();
  index = items.findIndex((item) => item.date === selectedDate.toISOString());
  setupItems();
  displayItem(index);
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    if (item.classList.contains("track-table__rows_selected")) {
      item.classList.remove("track-table__rows_selected");
    }
  });
  document
    .getElementById(`${selectedDate.toISOString()}`)
    .classList.add("track-table__rows_selected");
  closeForm();
  edit === false
    ? displayAlert("New weight added!", "success")
    : displayAlert("Weight has been edited!", "success");
  resetForm();
}

function resetForm(e) {
  const date = new Date();
  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  if (day.toString().length < 2) {
    day = "0" + day;
  }
  if (month.toString().length < 2) {
    month = "0" + month;
  }
  var currentDate = year + "-" + month + "-" + day;

  document.querySelector(".form-weight__button").innerHTML = "Submit";
  document.getElementById("date").value = currentDate;
  document.getElementById("pounds").value = "";
  document.getElementById("ounces").value = "";
  edit = false;
}

function editItem(e) {
  const items = getLocalStorage("newborn");
  var days = parseInt(document.querySelector(".info-column__value").innerHTML);

  const index = items.findIndex((item) => item.days === days);
  openForm();
  document.getElementById("date").value = new Date(items[index].date)
    .toISOString()
    .slice(0, 10);
  document.getElementById("pounds").value = items[index].pounds;
  document.getElementById("ounces").value = items[index].ounces;
  formBtn.innerHTML = "Edit";
  edit = true;
}

function calculateDays() {
  var items = getLocalStorage();
  const birthday = new Date(items[0].date);
  items = items.map((item) => {
    const datemiliseconds = new Date(item.date);
    const days =
      (datemiliseconds.getTime() - birthday.getTime()) / 1000 / 60 / 60 / 24;
    return item.date === datemiliseconds.toISOString()
      ? {
          name: item.name,
          days: Math.round(days),
          date: item.date,
          pounds: item.pounds,
          ounces: item.ounces,
          kilograms: item.kilograms,
          percentage: item.percentage,
        }
      : item;
  });
  items = items.sort(
    (a, b) =>
      (new Date(a.date).getTime() || -Infinity) -
      (new Date(b.date).getTime() || -Infinity)
  );
  localStorage.setItem("newborn", JSON.stringify(items));
}

function calculatePercent() {
  var items = getLocalStorage();
  const birthWeight = items[0].pounds * 16 + items[0].ounces;
  items = items.map((item) => {
    const itemWeight = item.pounds * 16 + item.ounces;
    var percentage = ((itemWeight - birthWeight) / birthWeight) * 100;
    percentage % 1 !== 0
      ? (percentage =
          percentage % 1 < 0.01
            ? Math.floor(percentage)
            : percentage.toFixed(2))
      : (percentage = percentage);
    return {
      name: item.name,
      days: item.days,
      date: item.date,
      pounds: item.pounds,
      ounces: item.ounces,
      kilograms: item.kilograms,
      percentage: percentage,
    };
  });
  localStorage.setItem("newborn", JSON.stringify(items));
}

function createItem(days, date, pounds, ounces, kilograms, percentage) {
  const itemList = document.getElementsByTagName("tbody")[0];
  const element = document.createElement("tr");
  var localeDate = new Date(date).toLocaleDateString();
  var idDate = new Date(date).toISOString();
  element.classList.add("track-table__rows");
  element.setAttribute("id", `${idDate}`);
  const attr = (element.innerHTML = `
              <td class="track-table__row-item">${days}</td>
              <td class="track-table__row-item">
                <button class="track-table__btn">${localeDate}</button>
              </td>
              <td class="track-table__row-item">${pounds}lbs ${ounces}oz</td>
              <td class="track-table__row-item">${kilograms}kg</td>
              <td class="track-table__row-item">${percentage}%</td>
`);
  itemList.appendChild(element);
  const TrackBtn = element.querySelector(".track-table__btn");
  TrackBtn.addEventListener("click", TrackBtnSelect);
  const tableItems = document.querySelectorAll(".track-table__rows");
}

function TrackBtnSelect(e) {
  const items = getLocalStorage();
  var selectedDate = e.target.parentNode.parentNode.children[0].innerHTML;
  const index = items.findIndex((item) => item.days === parseInt(selectedDate));
  displayItem(index);
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    if (item.classList.contains("track-table__rows_selected")) {
      item.classList.remove("track-table__rows_selected");
    }
  });
  e.target.parentNode.parentNode.classList.add("track-table__rows_selected");
  document.querySelector(".nav").scrollIntoView({
    behavior: "smooth",
  });
}

function setupItems() {
  const navBtn = document.querySelector(".nav__button");
  const toggleBtn = document.querySelector(".toggle-btn");
  const weightInfo = document.querySelector(".weight-info");
  const dailyTracker = document.querySelector(".daily-tracker");
  var items = getLocalStorage();
  if (items.length === 0) {
    setupRegisterForm();
    return;
  }
  calculateDays();
  calculatePercent();
  navBtn.classList.add("nav__button_show");
  toggleBtn.classList.add("toggle-btn_show");
  weightInfo.classList.add("weight-info_show");
  dailyTracker.classList.add("daily-tracker_show");
  const chart = document.querySelector(".chart");
  const chartChildren = document.getElementById("chart");
  chartChildren.children.length === 1
    ? chartChildren.children[0].remove()
    : null;
  getChart();
  chart.classList.add("chart_show");
  items.map((item) => {
    createItem(
      item.days,
      item.date,
      item.pounds,
      item.ounces,
      item.kilograms,
      item.percentage
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
  const items = getLocalStorage();
  fullName = items[index].name;
  const displayName = document.querySelector(".weight-info__name");
  const displayWeightDate = document.querySelectorAll(".weight-info__date")[0];
  const displaybirthday = document.querySelectorAll(".weight-info__date")[1];
  const displayDays = document.querySelectorAll(".info-column__value")[0];
  const displayPoundsOunces = document.querySelectorAll(
    ".info-column__value"
  )[1];
  const displayKilograms = document.querySelectorAll(".info-column__value")[2];
  const displaypercentage = document.querySelectorAll(".info-column__value")[3];
  const displaySlideValue = document.querySelector(".slide-bar__infographic");
  const displaySlideStatus =
    document.getElementsByClassName("slide-bar__status")[0];
  displayName.innerHTML = items[index].name;
  displayWeightDate.innerHTML =
    "Weight Date " + new Date(items[index].date).toLocaleDateString();
  displaybirthday.innerHTML =
    "Birthday " + new Date(items[0].date).toLocaleDateString();
  displayDays.innerHTML = items[index].days;
  displayPoundsOunces.innerHTML =
    items[index].pounds + " lbs " + items[index].ounces + " oz";
  displayKilograms.innerHTML = items[index].kilograms + " kg";
  displaypercentage.innerHTML = items[index].percentage + "%";
  displaySlideValue.value = items[index].percentage;
  if (items[index].percentage > -7) {
    displaySlideStatus.innerHTML = "Normal";
    displaySlideStatus.style.backgroundColor = "#0eaa0e";
  }
  if (items[index].percentage <= -7) {
    displaySlideStatus.innerHTML = "Warning";
    displaySlideStatus.style.color = "#e6f0fd";
    displaySlideStatus.style.backgroundColor = "#ffdd00";
  }
  if (items[index].percentage <= -10) {
    displaySlideStatus.innerHTML = "Dangerous";
    displaySlideStatus.style.color = "#e6f0fd";
    displaySlideStatus.style.backgroundColor = "#d10000db";
  }
}

function displayAlert(text, action) {
  alert.innerHTML = text;
  alert.classList.add(`alert__text_${action}`);
  setTimeout(() => {
    alert.innerHTML = "";
    alert.classList.remove(`alert__text_${action}`);
  }, 2000);
}

function setLocalStorage(
  name,
  days,
  date,
  pounds,
  ounces,
  kilograms,
  percentage
) {
  var items = getLocalStorage();
  const newItem = {
    name,
    days,
    date,
    pounds,
    ounces,
    kilograms,
    percentage,
  };
  items.push(newItem);
  items = items.sort(
    (a, b) =>
      (new Date(a.date).getTime() || -Infinity) -
      (new Date(b.date).getTime() || -Infinity)
  );
  localStorage.setItem("newborn", JSON.stringify(items));
}

function editLocalStorage(
  name,
  days,
  date,
  pounds,
  ounces,
  kilograms,
  percentage
) {
  const oldDaysValue = parseInt(
    document.querySelectorAll(".info-column__value")[0].innerHTML
  );
  let items = getLocalStorage();
  items = items.map((item) => {
    return item.days === oldDaysValue
      ? {
          name: name,
          days: days,
          date: date,
          pounds: pounds,
          ounces: ounces,
          kilograms: kilograms,
          percentage: percentage,
        }
      : item;
  });
  items = items.sort(
    (a, b) =>
      (new Date(a.date).getTime() || -Infinity) -
      (new Date(b.date).getTime() || -Infinity)
  );
  localStorage.setItem("newborn", JSON.stringify(items));
  calculateDays();
  calculatePercent();
}

function getLocalStorage() {
  return localStorage.getItem("newborn")
    ? JSON.parse(localStorage.getItem("newborn"))
    : [];
}
