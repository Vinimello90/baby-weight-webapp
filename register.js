function registerSubmit() {
  const fullName = fname.value + " " + lname.value;
  const birthdayValue = new Date(birthday.value + "T00:00");
  const newWeightDate = new Date(birthday.value + "T00:00");
  var percentChange = 0;
  var days = 0;
  var weightsValues;
  switch (type.value) {
    case "pounds":
      var poundsValue = parseFloat(weight.value);
      var ouncesValue = parseFloat(ounces[1].value);
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
    birthdayValue,
    newWeightDate,
    weightsValues.pounds,
    weightsValues.ounces,
    weightsValues.kilograms,
    percentChange
  );
  document.querySelector(".register").remove();
  setupItems();
}

function calculatePounds(pounds, ounces) {
  if (pounds - Math.floor(pounds) !== 0) {
    const poundsValue = Math.floor(pounds);
    let ouncesValue = (pounds % 1) * 16;
    const totalOunces = poundsValue * 16 + ouncesValue;
    ouncesValue =
      ouncesValue.toString().length > 4
        ? ouncesValue.toFixed(2)
        : (pounds % 1) * 16;
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    return { pounds: poundsValue, ounces: ouncesValue, kilograms: kilograms };
  }
  if (pounds && !ounces) {
    const poundsValue = pounds;
    const totalOunces = poundsValue * 16;
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    return { pounds: poundsValue, ounces: 0, kilograms: kilograms };
  }
  if (pounds && ounces) {
    const poundsValue = parseFloat(pounds);
    const ouncesValue = parseFloat(ounces);
    const totalOunces = poundsValue * 16 + ouncesValue;
    let kilograms = totalOunces * 0.0283495;
    kilograms = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    return { pounds: poundsValue, ounces: ouncesValue, kilograms: kilograms };
  }
}

function calculateKilograms(kilograms) {
  const kilgramsValue = kilograms.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  const poundsValue = Math.floor(kilograms / 0.453592);
  const ouncesValue = ((kilograms / 0.453592) % 1) * 16;
  return {
    pounds: poundsValue,
    ounces: Math.round(ouncesValue).toFixed(2),
    kilograms: kilgramsValue,
  };
}
