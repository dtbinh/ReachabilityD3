var currTime = '2';
var currEvader = '1';
var contourDict = {};
var islands;
var leaveTrails = 0;
var showEvader = 1;

var evaderX;
var evaderY;

$.get("twoislands.txt", 
    function(data) {
        islands = data.split("\n");
    }
);

//initial svg contour
var margin = {top: 80, right: 80, bottom: 80, left: 80},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.linear()
    .domain([1, 31])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([1, 31])
    .range([height, 0]);

var exScale = d3.scale.linear()
    .domain([-1, 1])
    .range([0, width]);

var eyScale = d3.scale.linear()
    .domain([-1, 1])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return xScale(d.y1); })
    .y(function(d) { return yScale(d.x1); });

var obstacleLine = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return exScale(d[0]); })
    .y(function(d) { return eyScale(d[1]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(0, " + height + ")")
.call(xAxis);

svg.append("g")
.attr("class", "axis")
.call(yAxis);

d3.csv("../Iteration6/csv/t1z1Data1.csv", function(mydata)
{
    svg.append("path")
    .datum(mydata)
    .attr("class", "line")
    .attr("d", line);

});

d3.csv("../Iteration6/csv/t1z1Data2.csv", function(mydata)
{
    svg.append("path")
    .datum(mydata)
    .attr("class", "line")
    .attr("d", line);

});

evaderX = getEvaderX(1);
evaderY = getEvaderY(1);

//evader
var evader = svg.append("circle")
                .datum([evaderX, evaderY])
                .attr("cx", function(d) { 
                    return exScale(d[0]);
                })
                .attr("cy", function(d) {
                    return eyScale(d[1]);
                })
                .attr("r", 3)
                .attr("fill", "blue");

//catch radius
svg.append("circle")
.datum([evaderX, evaderY])
.attr("cx", function(d) { 
    return exScale(d[0]);
})
.attr("cy", function(d) {
    return eyScale(d[1]);
})
.attr("r", height/20)
.attr("fill", "none")
.attr("stroke", "black")
.attr("stroke-dasharray", "10 5");

function updateContour() {
    var currFile = "../Iteration6/csv/t" + currTime + "z" + currEvader +"Data";
    var key = "t" + currTime + "z" + currEvader;
//    console.log(d3.selectAll("path"));
    d3.selectAll("path").attr("class", "line");
    if (leaveTrails == 0) {
        d3.selectAll("path").remove();
    }
    if (showEvader == 1) {
        d3.selectAll("circle").remove();
    }
    if (islands.indexOf(key) > -1) {
//        console.log(">1 islands");
        d3.csv(currFile+"1.csv", function(mydata) {
                svg.append("path")
                .datum(mydata)
                .attr("class", "mainline")
                .attr("d", line);
            });
        d3.csv(currFile+"2.csv", function(mydata) {
            svg.append("path")
            .datum(mydata)
            .attr("class", "mainline")
            .attr("d", line);
        });
    } else {
//        console.log("only one island");
        d3.csv(currFile+".csv", function(mydata){
            svg.append("path")
            .datum(mydata)
            .attr("class", "mainline")
            .attr("d", line);
        });
    }
    
    //evader
    evader = svg.append("circle")
                    .datum([evaderX, evaderY])
                    .attr("cx", function(d) { 
                        return exScale(d[0]);
                    })
                    .attr("cy", function(d) {
                        return eyScale(d[1]);
                    })
                    .attr("r", 3)
                    .attr("fill", "blue")
                    .call(drag);
    
    //catch radius
    svg.append("circle")
    .datum([evaderX, evaderY])
    .attr("cx", function(d) { 
        return exScale(d[0]);
    })
    .attr("cy", function(d) {
        return eyScale(d[1]);
    })
    .attr("r", height/20)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-dasharray", "10 5")
    
    //obstacle
    svg.append("path")
    .datum(getObstacle(parseInt(currTime)))
    .attr("class", "obstacle")
    .attr("d", obstacleLine);

    if (leaveTrails == 1) {
        d3.select(".line").remove();
    }
};

var drag = d3.behavior.drag()  
             .on('dragstart', function() { evader.style('fill', 'red'); })
             .on('drag', function() { 
//                 debugger;
                 max_x = exScale(0.6);
                 min_x = exScale(-0.6);
                 max_y = eyScale(-0.8);
                 min_y = eyScale(0.9);
                 if (d3.event.x > max_x) { evaderX = 0.6; temp_x = max_x;} 
                 else if (d3.event.x < min_x) { evaderX = -0.6; temp_x = min_x;}
                 else { temp_x = d3.event.x; }
                    
                 if (d3.event.y > max_y) { evaderY = -0.8; temp_y = max_y;}
                 else if (d3.event.y < min_y) { evaderY = 0.8; temp_y = min_y;}
                 else { temp_y = d3.event.y; }
                 if (evaderX == 0.6) {
                     //we are on the right side
                     console.log("we on the right");
//                    if (d3.event.dy > 0) {
//                        evader
//                    }
                 }
                 else if (evaderX == -0.6) {
                     //we are on the left side
                     console.log("we on the left");
//                    if (d3.event.dy > 0) {
//                        evader
//                    }
                 }
                 else if (evaderY == 0.8) {
                     //we are on the top side
                     console.log("we on the top");
//                    if (d3.event.dy > 0) {
//                        evader
//                    }
                 }
                 else if (evaderY == -0.8) {
                     //we are on the bottom side
                     console.log("we on the bottom");
//                    if (d3.event.dy > 0) {
//                        evader
//                    }
                 }
                 
                 
                 evader.attr('cx', temp_x)
                    .attr('cy', temp_y); })
             .on('dragend', function() { evader.style('fill', 'black'); });


function updateTime(t) {
    currTime = t.toString();
    $('#timeLabel').val(t);
    document.getElementById('timeSlider').value = t;
    updateContour();
}

function getEvaderY(val) {
    var s = (val-1)/85*5.6;
    if (s < 1.2)
        return -0.8;
    else if (s<2.8)
        return -0.8 + (s-1.2);
    else if (s<4.0)
        return 0.8;
    else
        return 0.8 - (s-4.0);
}

function getEvaderX(val) {
    var s = (val-1)/85*5.6;
    if (s < 1.2)
        return s-0.6;
    else if (s<2.8)
        return 0.6;
    else if (s<4.0)
        return 0.6 - (s-2.8);
    else
        return -0.6;
}

function getObstacle(time) {
    var t = time/127.0;
    if (t >= 0 && t < 0.2) {
        var bt = -2*t;
    }
    else if (t < 0.6) {
        var bt = -0.4;
    }
    else if (t < 0.8) {
        var bt = -2.8 + 4*t;
    }
    else {
        var bt = 0.4;
    }
    return([[-0.2,-0.6+bt],[-0.2,0.6+bt],[0.2,0.6+bt],[0.2,-0.6+bt]]);
    
}

function updateEvader(v) {
    currEvader = v.toString();
    $('#evaderLabel').val(v);
    evaderX = getEvaderX(v);
    evaderY = getEvaderY(v);
    document.getElementById('evaderSlider').value = v;
    updateContour();
}

$("input[name=optradio]:radio").change(function () {
    leaveTrails = $(this).val();
    d3.selectAll(".line").remove();
});