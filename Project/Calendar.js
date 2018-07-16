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

$(document).ready(function () {                                              // This runs first on loading the js
    debugger;
    //window.onscroll = function () { myFunction() };
    //var navbar = document.getElementById("navbar");
    //var sticky = navbar.offsetTop;
    //function myFunction() {
    //    if (window.pageYOffset >= sticky) {
    //        navbar.classList.add("sticky");
    //    }
    //    else {

    //        navbar.classList.remove("sticky");
    //    }

    //}
    //alert("In document of calendar ok?");
    var option = '<option value="0">--select --</option>';              
    d3.csv("companies.csv", function (data) {                           // Appending companies to the drop down
        //var z = "a.us.txt";
        //console.log(data.z);

        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].companies);
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
    debugger;
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

         //  console.log("d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)));", d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)));
         return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
     })
        
       .enter().append("rect")
        
       .attr("width", cell)
       .attr("height", cell)
        
       .attr("x", function (d) {
           //   console.log("X attribute of smaller rectangles");
           return d3.timeWeek.count(d3.timeYear(d), d) * cell;
       })
        
       .attr("y", function (d) {

           // console.log("Y attribute of smaller rectangles ");
           return d.getDay() * cell;
       })
        

       .datum(d3.timeFormat("%Y-%m-%d"));
    
   




    //svg.on("click", function() {
    //    var coords = d3.mouse(this);

    //    // Normally we go from data to pixels, but here we're doing pixels to data
    //    var newData= {
    //        x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
    //        y: Math.round( yScale.invert(coords[1]))
    //    };



   

    // Month blocks 
    svg.append("g")
   .attr("fill", "none")
   .attr("stroke", "#000")
   .selectAll("path")
        
   .data(function (d) {
       //  console.log("Data in the blocks of month is",d);
       //  console.log("In the block of month",d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)));
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


    dropvalue = $(this).val();                                         //Getting the value of drop down selection 
    //alert(dropvalue);
    //alert(link + dropvalue);
    console.log(link + dropvalue);
    var selectedLink = link + dropvalue;                              //link conatins common part of the link and dropvalue contains the selected company so appending selected company to the link which creates a complete link of selected company
    debugger;                                                        

    d3.csv(selectedLink, function (error, csv) {                        // Getting the data of selected link
        debugger;
        if (error) throw error;

        var data = d3.nest()
            .key(function (d) {
                // console.log("In the block of CSV key function",d);
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
                console.log("only d",d);
                var data1 = d3.nest()
            .key(function (d) {
                
                if (selecteddate == d.Date)
                {
                    Date1 = d.Date;
                    High1 = d.High;
                    Low1 = d.Low;
                    Close1 = d.Close;
                    Open1 = d.Open;
                    Volume1 = d.Volume;
                    console.log(Date1);
                    console.log(High1);
                    console.log(Low1);
                    console.log(Close1);
                    console.log(Volume1);
                    debugger;
                    document.getElementById("Datelbl").innerHTML = Date1;
                    document.getElementById("Openlbl").innerHTML = Open1;
                    document.getElementById("Highlbl").innerHTML = High1;
                    document.getElementById("Lowlbl").innerHTML = Low1;
                    document.getElementById("Closelbl").innerHTML = Close1;
                    document.getElementById("Volumelbl").innerHTML = Volume1;
                    //console.log("selected value is", selecteddate);
                    //console.log("Key", d.Date);
                    //console.log("High", d.High);
                    //console.log("Low", d.Low);
                    //console.log("Open", d.Open);
                    //console.log("Close", d.Close);
                    //console.log("Close", d.Volume);
                }

                
                
                // console.log("In the block of CSV key function",d);
                return d.Date;
            })
            .rollup(function (d) {

                //if (d[0].Date == selecteddate)
                //{
                //    //alert("In equals");
                //    console.log("High",d[0].High);
                //    console.log("Low",d[0].Low);
                //    console.log("Open",d[0].Open);
                //    console.log("Close", d[0].Close);
                //}
                
                //console.log("In the rollup of onclick",d[0].Date);
                return (d[0].Close - d[0].Open) / d[0].Open;                  // Finding the ratio of opening value with respect to the closing value
            })

          .object(csv)
                //alert(d.Close);
            })
       
      .append("title")
        .text(function (d) { return d + ": " + formatPercent(data[d]); });
    });
    

})      //onchange of dropdown


$('#submit').click(function () {                                // On hitting the submit button after entering the years 
    
    document.getElementById("calendar").innerHTML = "";         //Clearing the previous selection

    //  $("body").empty();

    // rect.attr("fill", "none")
    //.attr("stroke", "#ccc");

    fromyr = $("#from").val();                  // Getting the current value of the textbox (i.e Year value of from year)
    toyr = $("#to").val();                      // Getting the current value of the textbox (i.e Year value of to year)
    //alert(fromyr);
    //alert(toyr);
    create();                                   // Giving a call to create new view based on new selection.
});         //Onsubmit of years


