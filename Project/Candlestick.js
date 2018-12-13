$(document).ready(function () {                                             // This runs first on loading the js
    
    //alert("In document");
    var option = '<option value="0">--select --</option>';
    d3.csv("companies.csv", function (data) {                                // Appending companies to the drop down
        //var z = "a.us.txt";
        //console.log(data.z);

        for (var i = 0; i < data.length; i++) {
            option += '<option Value="' + data[i].companies + '">' + data[i].companies + '</option>'
        }

        $('#Companydrop').html(option);                                  //Appending companies to the drop down with id Companydrop

    });   // drop down of comapnies
    createCandlestick();                                                //Creating the SVG elements and axes
})

var margin, width, height, parseDateToYMD, x, y, d3zoom, CandleS, xaxis, yaxis, svg;
var zoomIn;
var link = "https://raw.githubusercontent.com/Diksha1206/Stocks-Viz/master/Data/";
var selectedcompany;
function createCandlestick() {
    margin = { top: 20, right: 20, bottom: 30, left: 50 },      //setting width height 
       width = 960 - margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;

    parseDateToYMD = d3.timeParse("%Y-%m-%d");                   // Parsing the data in year month and day format

    x = techan.scale.financetime()             // plots only points available in the data's date domain without linear (weekend, market holiday) gaps.            // Creating x axis 
           .range([0, width]);

    y = d3.scaleLinear()                                    // Creating Linear scale on Y axis
           .range([height, 0]);

    d3zoom = d3.zoom()
           .on("zoom", zoomingFunction);                         //Creates a new zoom behavior. The returned behavior, zoom, is both an object and a function.



    CandleS = techan.plot.candlestick()                 //construct a candlestick.
            .xScale(x)
            .yScale(y);

    xaxis = d3.axisBottom(x);                       // Creating xaxis

    yaxis = d3.axisLeft(y);                         // Creating yaxis


    svg = d3.select("#candle").append("svg")                                // selecting the div with id candle and appending svg to the div
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Clippath -> path of a SVG shape that can be used in combination with another shape to remove any parts of the combined shape that doesn’t fall within the clipPath


    svg.append("clipPath")                      //defining a clipPath
            .attr("id", "clip")                 //Giving the clipPath an Id
        .append("rect")                         // Shape it as a rectangle
            .attr("x", 0)                       // x positioning
            .attr("y", y(1))                    // y positioning
            .attr("width", width)               // Set the height
            .attr("height", y(0) - y(1));       // set the width


    svg.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#clip)");


    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")                         // Appending text to yaxis
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

    svg.append("rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .call(d3zoom);    
}


$('select[name="Companydropdown"]').change(function () {                    // On selecting value from thr drop down

    document.getElementById("candle").innerHTML = "";                        // Clearing out all the values of previous selection
    selectedcompany = $(this).val();                                        //Getting the value of drop down selection
    var linktogo = link + selectedcompany;                                  //link conatins common part of the link and dropvalue contains the selected company so appending selected company to the link which creates a complete link of selected company    
    linktogo = linktogo + ".us.txt";
    var index = selectedcompany.indexOf(".");    
    Company = selectedcompany.substring(0, index);    

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
        var xyz = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + Company + "&interval=1min&apikey=E9MWSWUNDXUEK6X9";
        var obj = fetch(xyz, {
            method: 'get'
        })
            .then(response => response.json())
            .then(function (jsonData) {
                openvalue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["1. open"];
                highValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["2. high"];
                lowvalue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["3. low"];
                closeValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["4. close"];
                volumeValue = ((jsonData["Time Series (1min)"])["" + getDate + ""])["5. volume"];
                document.getElementById("Openlblcurr2").innerHTML = openvalue;
                document.getElementById("Highlblcurr2").innerHTML = highValue;
                document.getElementById("Lowlblcurr2").innerHTML = lowvalue;
                document.getElementById("Closelblcurr2").innerHTML = closeValue;
                document.getElementById("Volumelblcurr2").innerHTML = volumeValue;
                document.getElementById("Datelblcurr2").innerHTML = getDate;

                // Calling obj every 1000 ms
                
            })
        
        setTimeout(apiCall, 60000);        
    }


    //API end
    
    createCandlestick();                                            //Creating SVG elements and axis

    var result = d3.csv(linktogo, function (error, data) {          // Getting the data of selected link
        var accessor = CandleS.accessor();

        data = data.slice(0, 200).map(function (d) {                    // Mapping the values from the data
            return {
                date: parseDateToYMD(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function (a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        x.domain(data.map(accessor.d));
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());
        svg.select("g.candlestick").datum(data);
        drawCandleStick();
        // Associate the zoom with the scale after a domain has been applied        
        zoomIn = x.zoomable().clamp(false).copy();
    });


})
function drawCandleStick() {
    svg.select("g.candlestick").call(CandleS);         
    svg.select("g.x.axis").call(xaxis);
    svg.select("g.y.axis").call(yaxis)
}


function zoomingFunction() {
    var YValuerescale = d3.event.transform.rescaleY(y);                             //Returns a copy of the continuous scale y whose domain is transformed.
    yaxis.scale(YValuerescale);                                                     // Giving this rescaled value to Yaxis to scale according to the changed value
    CandleS.yScale(YValuerescale);                                                  // Rescaling Y scale                                     
    x.zoomable().domain(d3.event.transform.rescaleX(zoomIn).domain());
    drawCandleStick();
}

