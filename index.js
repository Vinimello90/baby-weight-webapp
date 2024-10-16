const navButton = document.querySelector(".nav__button");
const formBtn = document.querySelector(".form-weight__button");

navButton.addEventListener("click", openForm);
document.addEventListener("click", onClickOutside);
formBtn.addEventListener("click", submit);

function openForm() {
  resetForm();
  document.querySelector(".header__form").classList.add("header__form_show");
}

function submit() {
  var bornWeight = 119;
  var bornDate = new Date("date.value" + "T00:00");
  const selectedDate = new Date(date.value + "T00:00");
  const fullName = document.querySelector(".weight-info__name").innerHTML;
  const poundsValue = parseFloat(pounds.value);
  const ouncesValue = parseFloat(ounces.value);
  const totalOunces = poundsValue * 16 + ouncesValue;
  let percent = (((totalOunces - bornWeight) / bornWeight) * 100).toFixed(2);
  let kilograms = totalOunces * 0.0283495;
  kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];

  console.log(percent);

  resetForm();
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

function resetForm(e) {
  const newDate = new Date().toISOString().slice(0, 10);
  document.getElementById("date").value = newDate;
  document.getElementById("pounds").value = "";
  document.getElementById("ounces").value = "";
}
