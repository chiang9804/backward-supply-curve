// Return regression data, labels, max of x, max of y
function filterDataByKey(data, key) {
    if (data.length <= 0) {
        console.log("filterDataByKey: data empty");
        return;
    }
    if (!data[0].hasOwnProperty(key)) {
        console.log("filterDataByKey: key not found");
        return;
    }

    var data_group = {};
    for (var i in data){
        if (typeof(data_group[data[i][key]]) == "undefined") {
            data_group[data[i][key]] = [data[i]];
        } else {
            data_group[data[i][key]].push(data[i]);
        }
    }
    data_array = []
    labels = []
    maxXs = []
    maxYs = []
    for (var key in data_group) {
        var subdata = data_group[key];
        var data_work_wage = subdata.map(function(d) { return [ +d["work_per_week"], +d["wage"] ]; });
        var line_data = getRegressionDataForY(data_work_wage);
        var maxX = d3.max(line_data, function(d) { return d[0]; });
        var maxY = d3.max(line_data, function(d) { return d[1]; });
        data_array.push(line_data);
        labels.push(key);
        maxXs.push(maxX);
        maxYs.push(maxY);
    }
    var maxX = Math.max.apply(Math, maxXs);
    var maxY = Math.max.apply(Math, maxYs);
    return [data_array, labels, maxX, maxY];
}

function getRegressionDataForY(data) {
    data = data.map(function(d) { return [ +d[1], +d[0] ]; });
    xmax = d3.max(data, function(d) { return d[0]; });
    var myRegression = regression('polynomial', data, degree);
    var equation = myRegression.equation;
    reg_data = [];
    for (var x=0; x<xmax; ++x) {
        var y = 0;
        for(var i=0; i<equation.length; ++i) {
            y += Math.pow(x, i) * equation[i];
        }
        reg_data.push([y, x]);
    }
    // console.log(reg_data);
    return reg_data;
}

function getMedianForY(data) {
    var xs_y = {};
    for (var point of data) {
        x = parseInt(point[0]);
        y = parseInt(point[1]);
        if (xs_y.hasOwnProperty(y)) {
            xs_y[y][0].push(x);
        } else {
            xs_y[y] = [[x], y];
        }
    }
    console.log(Object.keys(xs_y).length);

    var median_data = [];
    for (var key in xs_y) {
        xs = xs_y[key][0];
        y = xs_y[key][1];
        xs.sort(sortInt);
        median = xs[Math.floor(xs.length/2)];
        if (median == undefined) {
            console.log(xs);
        }
        // median_data.push([y, median]);
        median_data.push([median, y]);
    }
    return median_data;
}

function sortInt(a,b) { return a - b; }
