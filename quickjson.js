var fs = require("fs");
//"csv/states_regions.csv"
fs.readFile("csv/states_regions.csv", { encoding: "utf-8" }, function(err, data) {
  var lines = data.split("\n");
  var output = "[";
  for (var i = 1; i < lines.length - 1; i++) {
    var d = lines[i].split(",");
    var jdoc = {
      constituency_number: d[0] * 1,
      constituency_name: d[1],
      ward_village_number: d[2] * 1,
      ward_village: d[3]
    };
    output += JSON.stringify(jdoc) + ",\n";
  }
  output += "]";
  fs.writeFile("json/states_regions.json", output, { encoding: "utf-8" }, null);
});
