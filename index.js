const navButton = document.querySelector(".nav__button");
const formBtn = document.querySelector(".form-weight__button");
const toggleBtn = document.querySelector(".toggle-btn");
const editBtn = document.querySelector(".weight-info__edit-btn");
const alert = document.querySelector(".alert__text");
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
  const birthday = new Date(items[0].birthday);
  const bornWeightOunces = items[0].pounds * 16 + items[0].ounces;
  if (new Date(date.value + "T00:00").getTime() < birthday.getTime()) {
    displayAlert("Measurement cannot be earlier than birth!", "danger");
    document.getElementById("date").classList.add("form-weight__date_focus");
    document.getElementById("date").focus();
    return;
  }

  if (!pounds.value) {
    displayAlert("No weight was specified!", "danger");
    document
      .getElementById("pounds")
      .classList.add("form-weight__pounds_focus");
    document.getElementById("pounds").focus();
    return;
  }

  const selectedDate = new Date(date.value + "T00:00");

  const days =
    (selectedDate.getTime() - birthday.getTime()) / 1000 / 60 / 60 / 24;
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
      ((totalOunces - bornWeightOunces) / bornWeightOunces) *
      100
    ).toFixed(2);
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    if (formBtn.innerHTML === "Edit") {
      editLocalStorage(
        fullName,
        days,
        birthday,
        selectedDate.toISOString(),
        poundsValue,
        ouncesValue,
        kilograms,
        percentChange
      );
      document.querySelectorAll(".track-table__rows").forEach((item) => {
        item.remove();
      });
      setupItems();
      closeForm();
      document.querySelectorAll(".track-table__rows").forEach((item) => {
        if (item.classList.contains("track-table__rows_selected")) {
          item.classList.remove("track-table__rows_selected");
        }
      });
      document
        .getElementById(`${selectedDate.toISOString()}`)
        .classList.add("track-table__rows_selected");
      items = getLocalStorage();
      const index = items.findIndex(
        (item) => item.date === selectedDate.toISOString()
      );
      displayItem(index);
      displayAlert("Entry Successfully Updated", "success");
      return;
    }
    var dateCheck = items.findIndex(
      (item) => item.date === selectedDate.toISOString()
    );
    if (dateCheck > -1) {
      displayAlert("Weight date already added", "danger");
      document.getElementById("date").classList.add("form-weight__date_focus");
      document.getElementById("date").focus();
      closeForm();
      return;
    }

    setLocalStorage(
      fullName,
      days,
      birthday,
      selectedDate.toISOString(),
      poundsValue,
      ouncesValue,
      kilograms,
      percentChange
    );
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      item.remove();
    });
    items = getLocalStorage();
    const index = items.findIndex(
      (item) => item.date === selectedDate.toISOString()
    );
    setupItems();
    resetForm();
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
    displayAlert("New weight added!", "success");
    return;
  }
  if (pounds.value && !ounces.value) {
    const poundsValue = pounds.value;
    const totalOunces = poundsValue * 16;
    let percentChange = (
      ((totalOunces - bornWeightOunces) / bornWeightOunces) *
      100
    ).toFixed(2);
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    if (formBtn.innerHTML === "Edit") {
      poundsValue;
      editLocalStorage(
        fullName,
        days,
        birthday,
        selectedDate.toISOString(),
        poundsValue,
        0,
        kilograms,
        percentChange
      );
      document.querySelectorAll(".track-table__rows").forEach((item) => {
        item.remove();
      });
      setupItems();
      closeForm();
      document.querySelectorAll(".track-table__rows").forEach((item) => {
        if (item.classList.contains("track-table__rows_selected")) {
          item.classList.remove("track-table__rows_selected");
        }
      });
      document
        .getElementById(`${selectedDate.toISOString()}`)
        .classList.add("track-table__rows_selected");
      items = getLocalStorage();
      const index = items.findIndex(
        (item) => item.date === selectedDate.toISOString()
      );
      displayItem(index);
      displayAlert("Entry Successfully Updated", "success");
      return;
    }
    var dateCheck = items.findIndex(
      (item) => item.date === selectedDate.toISOString()
    );
    if (dateCheck > -1) {
      displayAlert("Date already in use!", "danger");
      document.getElementById("date").classList.add("form-weight__date_focus");
      document.getElementById("date").focus();
      closeForm();
      return;
    }
    console.log(selectedDate);
    createItem(
      fullName,
      days,
      birthday,
      selectedDate,
      0,
      kilograms,
      percentChange
    );
    setLocalStorage(
      fullName,
      days,
      birthday,
      selectedDate,
      poundsValue,
      0,
      kilograms,
      percentChange
    );
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      item.remove();
    });
    items = getLocalStorage();
    const index = items.findIndex(
      (item) => item.date === selectedDate.toISOString()
    );
    setupItems();
    resetForm();
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
    displayAlert("New weight added!", "success");
    return;
  }
  const poundsValue = pounds.value;
  const ouncesValue = ounces.value;

  const totalOunces = poundsValue * 16 + parseFloat(ouncesValue);
  let percentChange = (
    ((totalOunces - bornWeightOunces) / bornWeightOunces) *
    100
  ).toFixed(2);
  let kilograms = totalOunces * 0.0283495;
  console.log(poundsValue * 16 + ouncesValue);
  kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  if (formBtn.innerHTML === "Edit") {
    editLocalStorage(
      fullName,
      days,
      birthday,
      selectedDate.toISOString(),
      poundsValue,
      ouncesValue,
      kilograms,
      percentChange
    );
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      item.remove();
    });
    setupItems();
    closeForm();
    document.querySelectorAll(".track-table__rows").forEach((item) => {
      if (item.classList.contains("track-table__rows_selected")) {
        item.classList.remove("track-table__rows_selected");
      }
    });
    document
      .getElementById(`${selectedDate.toISOString()}`)
      .classList.add("track-table__rows_selected");
    items = getLocalStorage();
    const index = items.findIndex(
      (item) => item.date === selectedDate.toISOString()
    );
    displayItem(index);
    displayAlert("Entry Successfully Updated", "success");
    return;
  }
  var dateCheck = items.findIndex(
    (item) => item.date === selectedDate.toISOString()
  );

  if (dateCheck > -1) {
    displayAlert("Date already in use!", "danger");
    document.getElementById("date").classList.add("form-weight__date_focus");
    document.getElementById("date").focus();
    closeForm();
    return;
  }

  setLocalStorage(
    fullName,
    days,
    birthday,
    selectedDate.toISOString(),
    parseFloat(pounds.value),
    parseFloat(ounces.value),
    kilograms,
    percentChange
  );
  document.querySelectorAll(".track-table__rows").forEach((item) => {
    item.remove();
  });
  items = getLocalStorage();
  const index = items.findIndex(
    (item) => item.date === selectedDate.toISOString()
  );
  setupItems();
  resetForm();
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
  displayAlert("New weight added!", "success");
}

function resetForm(e) {
  const newDate = new Date().toISOString().slice(0, 10);
  document.querySelector(".form-weight__button").innerHTML = "Submit";
  document.getElementById("date").value = newDate;
  document.getElementById("pounds").value = "";
  document.getElementById("ounces").value = "";
}

function editItem(e) {
  const items = getLocalStorage("newborn");
  var days = parseInt(document.querySelector(".info-column__value").innerHTML);

  const index = items.findIndex((item) => item.days === days);
  console.log(new Date(items[index].date).toISOString().slice(0, 10));
  openForm();
  document.getElementById("date").value = new Date(items[index].date)
    .toISOString()
    .slice(0, 10);
  document.getElementById("pounds").value = items[index].pounds;
  document.getElementById("ounces").value = items[index].ounces;
  formBtn.innerHTML = "Edit";
}

function createItem(days, date, pounds, ounces, kilograms, percent) {
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
              <td class="track-table__row-item">${percent}%</td>
`);
  itemList.appendChild(element);
  const TrackBtn = element.querySelector(".track-table__btn");
  TrackBtn.addEventListener("click", TrackBtnSelect);
  const tableItems = document.querySelectorAll(".track-table__rows");
}

function TrackBtnSelect(e) {
  const items = getLocalStorage();
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
  document.querySelector(".nav").scrollIntoView({
    behavior: "smooth",
  });
}

function setupItems() {
  const register = document.querySelector(".register");
  const navBtn = document.querySelector(".nav__button");
  const toggleBtn = document.querySelector(".toggle-btn");
  const weightInfo = document.querySelector(".weight-info");
  const dailyTracker = document.querySelector(".daily-tracker");
  var items = getLocalStorage();
  if (items.length === 0) {
    const element = document.createElement("div");
    element.classList.add("register__container");
    element.innerHTML = `
            <h2 class="register__title">Register New Born</h2>
            <p class="register__description">
              Register new born to start your daily weight tracking!
            </p>
            <form action="" class="register__form">
              <fieldset class="register__fieldset">
                <div class="register__name">
                  <label
                    for="fname"
                    class="register__label register__label_fname"
                  >
                    First Name*
                    <input
                      type="text"
                      id="fname"
                      class="register__inputs register__inputs_fname"
                      placeholder="First Name"
                    />
                  </label>
                  <label
                    for="lname"
                    class="register__label register__label_lname"
                  >
                    Last Name*
                    <input
                      type="text"
                      id="lname"
                      class="register__inputs register__inputs_lname"
                      placeholder="Last Name"
                    />
                  </label>
                </div>
                <div class="register__info-container">
                  <label
                    for="weight"
                    class="register__label register__label_weight"
                  >
                    Weight*
                    <div class="register__weight-container">
                      <input
                        id="weight"
                        type="number"
                        name="weight"
                        class="register__inputs register__inputs_kilograms-pounds"
                        placeholder="---"
                      />
                      <span class="register__pounds-abbreviation"
                  >lbs</span
                >
                      <input
                        type="number"
                        id="ounces"
                        name="ounces"
                        class="register__inputs register__inputs_ounces"
                        placeholder="---"
                      />
                      <span class="register__ounces-abbreviation"
                  >oz</span
                >
                      <select
                        id="type"
                        class="register__inputs register__inputs_weight-type"
                        name="type"
                      >
                        <option value="pounds">Pounds</option>
                        <option value="kilograms">Kilograms</option>
                      </select>
                    </div>
                  </label>
                  <label
  for="birthday"
  class="register__label register__label_birthday"
>
  Birthday*
  <input
    type="date"
    id="birthday"
    name="birthday"
    class="register__inputs register__inputs_birthday"
    value="2024-10-19"
  />
  <span
><img
  src="./images/calendar-regular.svg"
  alt=""
  class="register__calendar-icon" /></span>
</label>
<button type="button" class="register__btn">Submit</button>
                  </div>
              </fieldset>
            </form>
`;
    register.appendChild(element);
    element
      .querySelector(".register__btn")
      .addEventListener("click", registerSubmit);
    return;
  }
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
  const items = getLocalStorage();
  const editBtn = document.querySelector(".weight-info__edit-btn");
  fullName = items[index].name;
  if (index === 0) {
    editBtn.disabled = true;
    editBtn.classList.add("weight-info__edit-btn_hidden");
  } else {
    editBtn.disabled = false;
    editBtn.classList.remove("weight-info__edit-btn_hidden");
  }

  const displayName = document.querySelector(".weight-info__name");
  const displayWeightDate = document.querySelectorAll(".weight-info__date")[0];
  const displaybirthday = document.querySelectorAll(".weight-info__date")[1];
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
  displaybirthday.innerHTML =
    "Birthday " + new Date(items[index].birthday).toLocaleDateString();
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
  birthday,
  date,
  pounds,
  ounces,
  kilograms,
  percent
) {
  var items = getLocalStorage();

  const newItem = {
    name,
    days,
    birthday,
    date,
    pounds,
    ounces,
    kilograms,
    percent,
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
  birthday,
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
  oldDateFormated = new Date(oldDateFormated).toISOString();

  const element = document.getElementById(`${oldDateFormated}`);
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
  let items = getLocalStorage();
  items = items.map((item) => {
    return item.date === oldDateFormated
      ? {
          name: name,
          days: days,
          birthday: birthday,
          date: date,
          pounds: pounds,
          ounces: ounces,
          kilograms: kilograms,
          percent: percent,
        }
      : item;
  });
  items = items.sort(
    (a, b) =>
      (new Date(a.date).getTime() || -Infinity) -
      (new Date(b.date).getTime() || -Infinity)
  );
  localStorage.setItem("newborn", JSON.stringify(items));
  const index = items.findIndex((item) => item.date === date);
  displayItem(index);
}

function getLocalStorage() {
  return localStorage.getItem("newborn")
    ? JSON.parse(localStorage.getItem("newborn"))
    : [];
}
