const selectUnit = document.querySelector(".form-weight__inputs_weight-units");
selectUnit.addEventListener("change", changeUnits);

function setupRegisterForm() {
  const register = document.querySelector(".register");
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
                        class="register__inputs register__inputs_weight"
                        placeholder="---"
                      />
                      <span class="register__pounds-abbreviation"
                  >lbs</span
                >
                      <input
                        type="number"
                        id="ouncesWeight"
                        name="ouncesWeight"
                        class="register__inputs register__inputs_ounces"
                        placeholder="---"
                      />
                      <span class="register__ounces-abbreviation"
                  >oz</span
                >
                      <select
                        id="units"
                        class="register__inputs register__inputs_weight-units"
                        name="units"
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
  element
    .querySelector(".register__inputs_weight-units")
    .addEventListener("change", changeUnits);
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
  element.querySelector(".register__inputs_birthday").value = currentDate;
}

function changeUnits(e) {
  console.log(e.target.id);
  const weightUnits =
    e.target.id === "form_weight_units" ? form_weight_units.value : units.value;

  switch (weightUnits) {
    case "pounds":
      if (e.target.id === "form_weight_units") {
        document.querySelector(".form-weight__pounds-abbreviation").innerHTML =
          "lbs";
        document.querySelector(".form-weight__ounces-abbreviation").innerHTML =
          "oz";
        document.getElementById("ounces").disabled = false;
        resetForm();
        return;
      }
      document.querySelector(".register__pounds-abbreviation").innerHTML =
        "lbs";
      document.querySelector(".register__ounces-abbreviation").innerHTML = "oz";
      document.getElementById("ouncesWeight").disabled = false;
      break;
    case "kilograms":
      if (e.target.id === "form_weight_units") {
        document.querySelector(".form-weight__pounds-abbreviation").innerHTML =
          "kg";
        document.querySelector(".form-weight__ounces-abbreviation").innerHTML =
          "";
        document.getElementById("ounces").disabled = true;
        resetForm();
        return;
      }
      document.querySelector(".register__pounds-abbreviation").innerHTML = "kg";
      document.querySelector(".register__ounces-abbreviation").innerHTML = "";
      document.getElementById("ouncesWeight").disabled = true;
      break;
  }
}

function registerSubmit() {
  const fullName = fname.value + " " + lname.value;
  const selectedDate = new Date(birthday.value + "T00:00");
  var percentageChange = 0;
  var days = 0;
  var weightsValues;

  if (!fname.value || !lname.value) {
    !fname.value
      ? displayAlert("First name missing!", "danger")
      : displayAlert("Last name missing!", "danger");
    !fname.value
      ? document.getElementById("fname").focus()
      : document.getElementById("lname").focus();
    !fname.value
      ? document
          .getElementById("fname")
          .classList.add("register__inputs_fname_focus")
      : document
          .getElementById("lname")
          .classList.add("register__inputs_lname_focus");
    return;
  }

  if (!weight.value) {
    displayAlert("No weight was specified!", "danger");
    document.getElementById("weight").focus();
    document
      .getElementById("weight")
      .classList.add("register__inputs_weight_focus");
    return;
  }

  switch (units.value) {
    case "pounds":
      var poundsValue = parseFloat(weight.value);
      var ouncesValue = parseFloat(ouncesWeight.value);
      weightsValues = calculatePounds(poundsValue, ouncesValue);
      break;
    case "kilograms":
      var kilogramsValue = parseFloat(weight.value);
      weightsValues = calculateKilograms(kilogramsValue);
      break;
  }
  setLocalStorage(
    fullName,
    days,
    selectedDate,
    weightsValues.pounds,
    weightsValues.ounces,
    weightsValues.kilograms,
    weightsValues.percentage
  );
  document.querySelector(".register").remove();
  setupItems();
}

function calculatePounds(pounds, ounces) {
  const items = getLocalStorage();
  var poundsValue;
  var ouncesValue;
  var totalOunces;
  var kilograms;
  if (pounds - Math.floor(pounds) !== 0) {
    poundsValue = Math.floor(pounds);
    ouncesValue = (pounds % 1) * 16;
    totalOunces = poundsValue * 16 + ouncesValue;
    ouncesValue =
      ouncesValue.toString().length > 4
        ? ouncesValue.toFixed(2)
        : (pounds % 1) * 16;
    kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  } else if (pounds && !ounces) {
    poundsValue = pounds;
    ouncesValue = 0;
    totalOunces = poundsValue * 16;
    kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  } else if (pounds && ounces) {
    poundsValue = parseFloat(pounds);
    ouncesValue = parseFloat(ounces);
    totalOunces = poundsValue * 16 + ouncesValue;
    kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  }
  const bornWeightOunces =
    items.length === 0 ? totalOunces : items[0].pounds * 16 + items[0].ounces;
  let percentage = ((totalOunces - bornWeightOunces) / bornWeightOunces) * 100;
  percentage % 1 !== 0
    ? (percentage =
        percentage % 1 < 0.01 ? Math.floor(percentage) : percentage.toFixed(2))
    : (percentage = percentage);
  return {
    pounds: poundsValue,
    ounces: ouncesValue,
    kilograms: kilograms,
    percentage: percentage,
  };
}

function calculateKilograms(kilograms) {
  const items = getLocalStorage();
  const kilgramsValue = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  const poundsValue = Math.floor(kilograms / 0.453592);
  let ouncesValue = ((kilograms / 0.453592) % 1) * 16;
  const totalOunces = poundsValue * 16 + ouncesValue;
  const bornWeightOunces =
    items.length === 0 ? totalOunces : items[0].pounds * 16 + items[0].ounces;
  let percentage = ((totalOunces - bornWeightOunces) / bornWeightOunces) * 100;
  percentage.toString().length > 1
    ? (percentage = percentage.toFixed(2))
    : (percentage = percentage);
  ouncesValue.toString().length > 1
    ? (ouncesValue = ouncesValue.toFixed(2))
    : (ouncesValue = ouncesValue);
  return {
    pounds: poundsValue,
    ounces: ouncesValue,
    kilograms: kilgramsValue,
    percentage: percentage,
  };
}
