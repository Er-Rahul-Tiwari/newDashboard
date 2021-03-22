$(document).ready(function() {
    // Specify data, options, and element in which to create the chart
    let data = {
      dataValues: [[9, 9,9 ], [8, 8, 8], [7, 7, 7], [6, 6, 6], [5, 5, 5], [4, 4, 4], [3, 3, 3]], // for a normal bar chart use multiple arrays with 1 value in each array
      legend: ["Employer: K7,500", "Employee: K2,500", "Total: K4,323"], // for stacked bar charts
      legendColors: ["#b2d7e9", "#6969f7", "#06066d"], // bar colors
      barLabels: ["20", "25", "30", "35","40","60","65"], // x-axis labels
      labelColors: ["gray","gray","gray","gray","gray","gray","gray"] // x-axis label colors 
    };
  
    let options = {
      chartWidth: "100%", // use valid css sizing
      chartHeight: "100%", // use valid css sizing
      chartTitle: "", // enter chart title
      chartTitleColor: "#777", // enter any valid css color
      chartTitleFontSize: "1rem", // enter a valid css font size
      yAxisTitle: "", // enter title for y-axis
      xAxisTitle: "", // enter title for x-axis
      barValuePosition: "center", // "flex-start" (top), "center", or "flex-end" (bottom)
      barSpacing: "4%" // "1%" (small), "3%" (medium), "5%" (large)
    };
  
    let element = "#testDiv"; // Use a jQuery selector to select the element to put the chart into
  
    // Generate chart
    drawBarChart(data, options, element);
  
    // Draws individual chart components
    function drawBarChart(data, options, element) {
      drawChartContainer(element);
      drawChartTitle(options);
      drawChartLegend(data);
      drawYAxisTitle(options);
      drawYAxis(data);
      drawChartGrid(data, options);
      drawXAxis(data, options);
      drawXAxisTitle(options);
    }
  
    // Adds chart container to selected element
    function drawChartContainer(element) {
      $(element).prepend("<div class='chartContainer'></div>");
      $(element).css("height", "100%");
    }
  
    // Draws chart title
    function drawChartTitle(options) {
      $(".chartContainer").append("<div class='chartTitle'>" + options.chartTitle + "</div>");
      //$(".chartContainer").append("<input type='text' placeholder='Chart Title...' name='chartTitle' class='chartTitle' ></input>");
      $(".chartTitle").css("color", options.chartTitleColor);
      $(".chartTitle").css("font-size", options.chartTitleFontSize);
    }
  
    // Draws chart legend
    function drawChartLegend(data) {
      $(".chartContainer").append("<div class='chartLegend'></div>");
      for (let i = 0; i < data.legend.length; i++) {
        $(".chartLegend").append("<div class='legendKey legendKey" + i + "'></div>");
        $(".legendKey" + i).css("background-color", data.legendColors[i]);
        $(".chartLegend").append("<span>" + data.legend[i] + "</span>");
      }
    }
  
    // Draws y-axis title
    function drawYAxisTitle(options) {
      $(".chartContainer").append("<div class='yAxisTitle'>" + options.yAxisTitle + "</div>");
    }
  
    // Draws y-axis labels that are properly scaled to the data and have an
    // appropriate number of decimal places
    function drawYAxis(data) {
      $(".chartContainer").append("<div class='yAxis'></div>");
      let maximum = maxScale(tallestBar(data));
      let order = Math.floor(Math.log(maximum) / Math.LN10
                         + 0.000000001);
      for (let i = 1; i > 0; i = i - 0.2) {
        if (order < 0) {
          $(".yAxis").append("<div class='yAxisLabel'>" + (maximum * i).toFixed(Math.abs(order-1)) + "</div>");
        } else {
          $(".yAxis").append("<div class='yAxisLabel'>" + (maximum * i).toFixed(0) + "</div>");
        }
      }
    }
  
    // Finds the array with the largest sum and returns the sum of that array
    function tallestBar(data) {
      let sum = 0;
      for (let i = 0; i < data.dataValues.length; i++) {
        let sumArray = data.dataValues[i].reduce((a, b) => a + b, 0);
        if (sumArray > sum) {
          sum = sumArray;
        }
      return sum;
      }
    }
  
    // Calculates a maximum value for the y-axis scale that is slightly larger
    // than the largest value in the dataset and is rounded suitably
    function maxScale(n) {
      let order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
      let multiple = Math.pow(10,order);
      let result = Math.ceil(n * 1.1 / multiple) * multiple;
      if (order > 0) {
        return result;
      } else if (order == 0) {
        return result.toFixed(1);
      } else {
        return result.toFixed(Math.abs(order));
      }
    }
  
    // Draws chart grid and all data bars
    function drawChartGrid(data, options) {
      // Add container for data
      $(".chartContainer").append("<div class='chartGrid'></div>");
  
      // Calculate maximum y-axis label value
      let maximum = maxScale(tallestBar(data));
  
      // Calculate bar width
      let barWidth = 100 / (data.dataValues.length + 2);
  
      // Add data bars to grid
      for (let i = 0; i < data.dataValues.length; i++) {
        $(".chartGrid").append("<div class='bar bar" + i + "'></div>");
        $(".bar" + i).css("height", "100%");
        $(".bar" + i).css("width", barWidth + "%");
        // Add inner bars
        for (let j = 0; j < data.dataValues[i].length; j++) {
  
          // Create an inner bar if the value is non-zero
          if (data.dataValues[i][j]) {
            $(".bar" + i).prepend("<div class='innerBar innerBar" + i + j + "'></div");
  
            // Calculate height of the bar, set color, and show data value inside the bar
            let height = data.dataValues[i][j] / maximum * 100;
            $(".innerBar" + i + j).css("height", height + "%");
            $(".innerBar" + i + j).css("background-color", data.legendColors[j]);
            $(".innerBar" + i + j).append("<p class='barValue'>" + data.dataValues[i][j] + "</p>");
            $(".barValue").css("align-self", options.barValuePosition);
            $(".barValue").css("margin", "0");
          }
        }
      }
      // Set spacing of data bars
      $(".bar").css("margin", "0 " + options.barSpacing);
    }
  
    // Draws x-axis labels
    function drawXAxis(data, options) {
      $(".chartContainer").append("<div class='emptyBox'></div>");
      $(".chartContainer").append("<div class='xAxis'></div>");
  
      // Calculate width of the x-axis label to be the same as the bar width
      let barWidth = 100 / (data.barLabels.length + 2);
  
      for (let i = 0; i < data.barLabels.length; i++) {
        $(".xAxis").append("<div class='xAxisLabel xAxisLabel" + i + "'>" + data.barLabels[i] + "</div>");
        $(".xAxisLabel").css("width", barWidth + "%");
        $(".xAxisLabel" + i).css("color", data.labelColors[i]);
      }
  
      // Set spacing of x-axis labels
      $(".xAxisLabel").css("margin", "0 " + options.barSpacing);
    }
  
    // Draws x-axis title
    function drawXAxisTitle(options) {
      $(".chartContainer").append("<div class='xAxisTitle'>" + options.xAxisTitle + "</div>");
    }
  
  });
  