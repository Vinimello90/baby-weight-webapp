function getChart() {
  const items = getLocalStorage();
  var data = [];
  items.forEach((item) => {
    const arrayChart = [`${item.days} Day`, item.percentage, -7, -10];
    data.push(arrayChart);
  });

  anychart.onDocumentReady(function () {
    // create a data set
    var dataSet = anychart.data.set(data);

    // map the data for all series
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
    var SecondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
    var ThirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

    // create a line chart
    var chart = anychart.line();

    // set the interactivity mode
    chart.interactivity().hoverMode("single");

    // create the series and name them
    var firstSeries = chart.line(firstSeriesData);
    var SecondSeries = chart.line(SecondSeriesData);
    var ThirdSeries = chart.line(ThirdSeriesData);
    firstSeries.name("Birth weight change");
    SecondSeries.name("Warning");
    ThirdSeries.name("Dangerous");
    firstSeries.normal().stroke("#0d5297", 1.5, "0", "round");
    firstSeries.hovered().stroke("#0d5297", 1.5, "0", "round");
    firstSeries.selected().stroke("#0d5297", 1.5, "0", "round");
    SecondSeries.normal().stroke("#ffd900", 1.5, "10 5", "round");
    SecondSeries.hovered().stroke("#ffd900", 1.5, "10 5", "round");
    SecondSeries.selected().stroke("#ffd900", 1.5, "10 5", "round");
    ThirdSeries.normal().stroke("#d10000db", 1.5, "10 5", "round");
    ThirdSeries.hovered().stroke("#d10000db", 1.5, "10 5", "round");
    ThirdSeries.selected().stroke("#d10000db", 1.5, "10 5", "round");
    // add a legend
    chart.legend().enabled(false);

    // add a title

    chart.background({ fill: "#e6f0fd" });
    // specify where to display the chart
    chart.container("chart");

    // draw the resulting chart
    chart.draw();
  });
}
