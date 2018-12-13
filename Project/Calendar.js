var rect;
var selecteddate;
var link;
link = "https://raw.githubusercontent.com/Diksha1206/Stocks-Viz/master/Data/";
var selection = "";
var dropvalue;
var comp;
var Date1;
var High1;
var Low1;
var Open1;
var Close1;
var Company;

$(document).ready(function () {                                              // This runs first on loading the js
    var option = '<option value="0">--select --</option>';
    d3.csv("companies.csv", function (data) {                           // Appending companies to the drop down
        

        for (var i = 0; i < data.length; i++) {
        
            option += '<option Value="' + data[i].companies + '">' + data[i].companies + '</option>'
        }

        $('#Companydrop').html(option);                         //Appending companies to the drop down with id Companydrop

    });   // drop down of comapnies
    create();                                                   //Creating the SVG elements and axes
})

var fromyr;
var toyr;

var color;
var formatPercent;
function create() {
    
    var width = 960,                                //setting width height and cellsize, cellsize -> The size of each small square
        height = 136,
        cell = 17;

    formatPercent = d3.format(".1%");

    // Setting color scale domain and range
    color = d3.scaleQuantize()                  // scaleQuantize use a discrete range
        .domain([-0.05, 0.05])
        .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]); // colors

    var svg = d3.select("#calendar")                 //Setting svg and appending it to the div with id calendar
        .selectAll("svg")

        .data(d3.range(fromyr, toyr))               //Creates block only for range that is specified in the text box 

        .enter().append("svg")

        .attr("width", width)
        .attr("height", height)

        .append("g")

        .attr("transform", "translate(" + ((width - cell * 53) / 2) + "," + (height - cell * 7 - 1) + ")");     //????????????????????????????


    svg.append("text")                  // Adding text of year (To show which year the block represents)
        .attr("transform", "translate(-6," + cell * 3.5 + ")rotate(-90)")       // Appending text of years  

        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(function (d) {

            return d;
        });



    // Setting the smaller rectangles i.e smallest block
    //Blocks of days
    rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")

        .data(function (d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })

        .enter().append("rect")

        .attr("width", cell)
        .attr("height", cell)

        .attr("x", function (d) {

            return d3.timeWeek.count(d3.timeYear(d), d) * cell;
        })

        .attr("y", function (d) {
            
            return d.getDay() * cell;
        })


        .datum(d3.timeFormat("%Y-%m-%d"));

    

    // Month blocks 
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")

        .data(function (d) {            
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })

        .enter().append("path")

        .attr("d", pathMonth);



    function pathMonth(t0) {                 //path
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cell + "," + d0 * cell
            + "H" + w0 * cell + "V" + 7 * cell
            + "H" + w1 * cell + "V" + (d1 + 1) * cell
            + "H" + (w1 + 1) * cell + "V" + 0
            + "H" + (w0 + 1) * cell + "Z";
    }
}



$('select[name="Companydropdown"]').change(function () {                // On selecting value from thr drop down

    rect.attr("fill", "none")                                           // Clearing out all the values of previous selection
        .attr("stroke", "#ccc");
    
    dropvalue = $(this).val();
    dropvalue = dropvalue+".us.txt"; 
    //Getting the value of drop down selection
    
    var selectedLink = link + dropvalue;

    //link conatins common part of the link and dropvalue contains the selected company so appending selected company to the link which creates a complete link of selected company
    
    var index = dropvalue.indexOf(".");
  
    Company = dropvalue.substring(0, index);
  

    // API start 

    apiCall();
    var getDate;

    function getdate() {

        getDate = js_yyyy_mm_dd_hh_mm_ss();
    }


    function js_yyyy_mm_dd_hh_mm_ss() {

        now = new Date();
        year = "" + now.getFullYear();
        month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        minute = "" + now.getMinutes();
        if (minute.length == 1) {
            minute = minute - 1;
            minute = "0" + minute;
        }
        else {
            minute = minute - 1;
        }        
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + "00";
    }


    function apiCall() {
        
        getdate();
        // Put the name of the selected company

        var xyz = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + Company + "&interval=1min&apikey=E9MWSWUNDXUEK6X9";
      
        var obj = fetch(xyz, {
            method: 'get'
        })
            .then(response => response.json())
            .then(function (jsonData) {
                
                // Use this between 9:30 to 4pm
                
                openvalue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["1. open"];
                highValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["2. high"];
                lowvalue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["3. low"];
                closeValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["4. close"];
                volumeValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["5. volume"];                
                document.getElementById("Openlblcurr").innerHTML = openvalue;
                document.getElementById("Highlblcurr").innerHTML = highValue;
                document.getElementById("Lowlblcurr").innerHTML = lowvalue;
                document.getElementById("Closelblcurr").innerHTML = closeValue;
                document.getElementById("Volumelblcurr").innerHTML = volumeValue;
                document.getElementById("Datelblcurr").innerHTML = getDate;
                
                // Calling obj every 1000 ms



            })



        setTimeout(apiCall, 60000);


    }


    //API end

    

    d3.csv(selectedLink, function (error, csv) {                        // Getting the data of selected link
    
        if (error) throw error;

        var data = d3.nest()
            .key(function (d) {                
                return d.Date;
            })
            .rollup(function (d) {


                return (d[0].Close - d[0].Open) / d[0].Open;                  // Finding the ratio of opening value with respect to the closing value
            })

            .object(csv)


        rect.filter(function (d) {
            return d in data;
        })

            .attr("fill", function (d) {
                return color(data[d]);
            })
            .on("click", function (d) {
                selecteddate = d;                
                var data1 = d3.nest()
                    .key(function (d) {

                        if (selecteddate == d.Date) {
                            Date1 = d.Date;
                            High1 = d.High;
                            Low1 = d.Low;
                            Close1 = d.Close;
                            Open1 = d.Open;
                            Volume1 = d.Volume;
                            
                            document.getElementById("Datelbl").innerHTML = Date1;
                            document.getElementById("Openlbl").innerHTML = Open1;
                            document.getElementById("Highlbl").innerHTML = High1;
                            document.getElementById("Lowlbl").innerHTML = Low1;
                            document.getElementById("Closelbl").innerHTML = Close1;
                            document.getElementById("Volumelbl").innerHTML = Volume1;
                           
                        }
                       
                        return d.Date;
                    })
                    .rollup(function (d) {
                        return (d[0].Close - d[0].Open) / d[0].Open;                  // Finding the ratio of opening value with respect to the closing value
                    })

                    .object(csv)               
            })

            .append("title")
            .text(function (d) { return d + ": " + formatPercent(data[d]); });
    });


})      //onchange of dropdown




$('#submit').click(function () {                                // On hitting the submit button after entering the years 

    document.getElementById("calendar").innerHTML = "";         //Clearing the previous selection

   
    fromyr = $("#from").val();                  // Getting the current value of the textbox (i.e Year value of from year)
    toyr = $("#to").val();                      // Getting the current value of the textbox (i.e Year value of to year)
    create();                                   // Giving a call to create new view based on new selection.

    
});         //Onsubmit of years


