$(document).ready(function () {                                                 // This runs first on loading the js
    
    var option = '<option value="0">--select --</option>';                  
    d3.csv("companies.csv", function (data) {                                   // Appending companies to the drop down
    
        for (var i = 0; i < data.length; i++) {            
            option += '<option Value="' + data[i].companies + '">' + data[i].companies + '</option>'
        }

        $('#det').html(option);                             //Appending companies to the drop down with id Companydrop

    });

    createLineChart();                                  //Creating the SVG elements and axes

})
var parseDate, svg;
var x, x2, y, y2;
var xaxis, xaxis2, yaxis;
var brushing, d3zoom, Chartarea, Chartarea2, focus, context;
var link = "https://raw.githubusercontent.com/Diksha1206/Stocks-Viz/master/Data/";              //Common part of link
var dropdownsel;
var Company1;

function createLineChart() {

    svg = d3.select("#chart"),                                              //Selecting div having Id chart
     margin = { top: 20, right: 20, bottom: 110, left: 40 },
     margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
     width = +svg.attr("width") - margin.left - margin.right,
     height = +svg.attr("height") - margin.top - margin.bottom,
     height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    parseDate = d3.timeParse("%Y-%m-%d");                       //Parsing the data in the format of Year Month and Day

    x = d3.scaleTime().range([0, width]),                       // Scaling xaxis as TimeScale
        x2 = d3.scaleTime().range([0, width]),                  // Scaling second axis as timeScale
        y = d3.scaleLinear().range([height, 0]),                // Scaling linear Scale or qunatitative values
        y2 = d3.scaleLinear().range([height2, 0]);              // Scaling linear scale for qunatitative values

    xaxis = d3.axisBottom(x),                                   // Plotting xaxis
        xaxis2 = d3.axisBottom(x2),
        yaxis = d3.axisLeft(y);

    brushing = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    d3zoom = d3.zoom()                                //Creates a new zoom behavior. The returned behavior, zoom, is both an object and a function.                
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    Chartarea = d3.area()
       .curve(d3.curveMonotoneX)
       .x(function (d) { return x(d.Date); })
       .y0(height)
       .y1(function (d) { return y(d.High); });

    Chartarea2 = d3.area()
       .curve(d3.curveMonotoneX)
       .x(function (d) { return x2(d.Date); })
       .y0(height2)
       .y1(function (d) { return y2(d.High); });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    focus = svg.append("g")
       .attr("class", "focus")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    context = svg.append("g")
       .attr("class", "context")
       .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
}


$('select[name="Companydropdown"]').change(function () {                // On selecting value from thr drop down
    
    document.getElementById("chart").innerHTML = "";                // Clearing out all the values of previous selection
    createLineChart();                                              //Creating SVG elements and axis
    dropdownsel = $(this).val();                                    //Getting the value of drop down selection    
    var linksel = link + dropdownsel;                               //link conatins common part of the link and dropvalue contains the selected company so appending selected company to the link which creates a complete link of selected company    
    linksel = linksel + ".us.txt";  
    dropvalue = $(this).val();                                         //Getting the value of drop down selection 
         
    var selectedLink = link + dropvalue;                              //link conatins common part of the link and dropvalue contains the selected company so appending selected company to the link which creates a complete link of selected company
    var index = dropdownsel.indexOf(".");    
    Company = dropvalue;    
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
                
                document.getElementById("Openlblcurr1").innerHTML = openvalue;
                document.getElementById("Highlblcurr1").innerHTML = highValue;
                document.getElementById("Lowlblcurr1").innerHTML = lowvalue;
                document.getElementById("Closelblcurr1").innerHTML = closeValue;
                document.getElementById("Volumelblcurr1").innerHTML = volumeValue;
                document.getElementById("Datelblcurr1").innerHTML = getDate;

                // Calling obj every 1000 ms



            })



        setTimeout(apiCall, 60000);


    }


    //API end
    

    d3.csv(linksel, type, function (error, data) {                  // Getting the data of selected link
        if (error) throw error;

        x.domain(d3.extent(data, function (d) { return d.Date; }));
        y.domain([0, d3.max(data, function (d) { return d.High; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", Chartarea);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yaxis);

        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", Chartarea2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xaxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brushing)
            .call(brushing.move, x.range());

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3zoom);


    });



})      //onchange of dropdown

// By defaut the chart drawn will be of a.us

d3.csv("https://raw.githubusercontent.com/Diksha1206/Stocks-Viz/master/Data/a.us.txt", type, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.Date; }));
    y.domain([0, d3.max(data, function (d) { return d.High; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", Chartarea);

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yaxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", Chartarea2);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xaxis);

    context.append("g")
        .attr("class", "brush")
        .call(brushing)
        .call(brushing.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3zoom);
});



function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", Chartarea);
    focus.select(".axis--x").call(xaxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());              //Returns a copy of the continuous scale  whose domain is transformed.
    focus.select(".area").attr("d", Chartarea);
    focus.select(".axis--x").call(xaxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
    d.Date = parseDate(d.Date);
    d.High = +d.High;
    return d;
}