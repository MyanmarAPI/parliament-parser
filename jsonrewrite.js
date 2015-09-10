var fs = require("fs");
var csv = require("fast-csv");

var rows = [];
csv.fromPath('./csv/states_regions.csv', { headers: true })
  .on('data', function(data) {
    rows.push(data);
  })
  .on('end', function(data) {
    fs.writeFile('./json/states_regions.json', JSON.stringify(rows));
  });
