// global variables
var data;
var svg;
var x;
var y;
var margin;
var width;
var height;
var intervalTimer;

// create toggles to control these options
//var sort = true;
var racecall = true;

// set up the control links
window.onload = function() {
    var replay = document.getElementById("replay");
    replay.onclick = function() {
        restart();
        // don't reload the page
        return false;
    };
}

// update the announce field
function bigboard(message) {
    d3.select(".announce").html(message);
}

var data_url = "static/data/airline_data_csv_file.csv" 

// Load the route data from CSV
d3.csv(data_url, function(rows) {
    // collect the data into groups by bike
    //console.log(rows);
    
    flights = _.groupBy(rows,function(row){return row.code;})
    //console.log(flights);
    
    data = d3.entries(flights);
    //console.log(data);

    // set up chart area
    margin = {top: 20, right: 10, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    
    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set up the scales based on the data
    // console.log(width);
    x = d3.scale.linear()
        .domain([0, 2000000])     
        .range([0, width]);

    // console.log(height);
    // console.log(data.length);
    y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, height], .1);

    // put an axis on the top
    svg.append("g")  // appends a new group element
        .attr("class", "x axis")
        //.attr("transform", "translate(0," + height + ")")
        .attr("transform", "translate(0,0)")
        .call(d3.svg.axis()
        .scale(x)
        .orient("top"));

    restart();
})

// add some nice colors
var fill = d3.scale.category10();

/* this draws all of the bars */
function redraw(flighttotals,dateString) {
//    console.log(flighttotals);
//    console.log(dateString);
    
    flighttotals.sort(function(a,b) {
        // sort based on total flights descending
        return b.total_flights - a.total_flights;
    });
    
    y.domain(flighttotals.map(function(d) {return d.key;}));

    // get the existing bars that are already on the graph, use key to determine which already exists
    var bar = svg.selectAll(".bar")
        .data(flighttotals, function(d) {return d.key});

    // ENTER - add new bars that weren't there before, according to the key
    var barEnter = bar.enter().insert("g",".axis")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
        .style("fill-opacity",0)
        .style("fill",function(d) {return fill(d.key);});

    barEnter.append("rect")
        .attr("height", y.rangeBand())
        .attr("width", function(d) {
            return x(d['total_flights'])
        });

    barEnter.append("text")
        .attr("text-anchor", "end")
        .attr("x", function(d) { return x(d) - 6; })
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d, i) { return d.key; });

    // UPDATE - update values for the bars that were there before, according to the key
    var barUpdate = d3.transition(bar)
        .attr("transform", function(d,i) {return "translate(0," + (d.y0 = y(d.key)) + ")"; })
        .style("fill-opacity", 1);

    barUpdate.select("rect")
        .attr("width", function(d) {
            return x(d['total_flights'])
        });

    var barExit = d3.transition(bar.exit())
        .attr("transform", function(d) {return "translate(0," + (d.y0 + height) + ")"; })
        .style("fill-opacity",0)
        .remove();

    barExit.select("rect")
        .attr("width", function(d,i) {
            return x(d['total_flights'])
        });

    // clear the timer when we're done so it doesn't continue forever
    if (daterange.length <= 0) {
        clearInterval(intervalTimer);
    }
}

function restart() {
    // clear the timer if it is currently running
    clearInterval(intervalTimer)

    // clear the race call stats
    top_flight = 0.0;
    previous_leader = null;

    // reset the daterange array
    // console.log(data);
    daterange = getDates(data);
    
    // reset 
    flighttotals = getflightTotalArray(data);
    // console.log(flighttotals);
    // restart the interval timer
    startTimer(flighttotals,daterange);
}   

function getDates(data) {
    // extract the array of unique date values from the data set
    datearrays = _(data).map(function(datum){return _.pluck(datum.value,'year_month');})
    // flatten, sort, and unique the resulting data Array
    daterange = _.sortBy(_.flatten(datearrays),function(datevalue) {return datevalue;})
    // for unique values, pass true to tell it that it's already sorted
    daterange = _.uniq(daterange,true)	
    // return sorted array of dates to iterate through
    return daterange;
}

function getflightTotalArray(data) {
    // create container array to hold the cumulative values
    // console.log(data);
    flighttotals = _.map(data, function(flight) {
            flightobj = new Object();
            flightobj.key = flight.key;
            flightobj["total_flights"] = 0;
            // console.log(flightobj);
            return flightobj;
        })
    //console.log(flighttotals);
    return flighttotals;
}

var top_flight = 0.0;
var previous_leader;

function startTimer(flighttotals,daterange) {
    intervalTimer = setInterval(function() {
        // pull out the next date from the array
        datetograph = daterange.shift();
        dailytotals = _.map(data, function(flight) {
            return _.find(flight.value,function(flightmonth) {return flightmonth['year_month'] == datetograph})
        })
        // remove all the carrier from the array that didn't have any values for the datearrays
        dailytotals = _.compact(dailytotals)
        var current_leader = previous_leader;
        top_flight = current_leader? parseFloat(current_leader['total_flights']) : 0.0

        // add the flights to the flight array
        dailytotals.forEach(function(flightmonth) {
                flight = _.find(flighttotals,function(flight){return flight.key == flightmonth.code});
                flight['total_flights'] = parseFloat(flight['total_flights']) + parseFloat(flightmonth['total_flights']);
   
                // calculations for race calls
                if (flight['total_flights'] > top_flight) {
                    current_leader = flight;
                    top_flight = flight['total_flights']
                }
                else {
                    // no change
                }

            });

        // redraw the graph
        redraw(flighttotals,datetograph);

        // draw the date with the new calculations
        bigboard(datetograph);
        //console.log(current_leader);
        // call the Race
        if (current_leader != previous_leader) {
            previous_leader = current_leader
            d3.select("#racecall").html("<b style='color:" + fill(current_leader.key) +";'>" + 
                                        current_leader.key + "</b> has maximum flights")
        }
        else {
            // no change
        }
    }, 50);  
}