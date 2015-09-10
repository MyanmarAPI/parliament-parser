var fs = require('fs');

var lower = require('./json/lower_house.json');

var output = fs.createWriteStream('./json/lower_house_update.json');

fs.readFile('./csv/states_regions.csv', { encoding: 'utf-8' }, function (err, data) {
  var contents = data.split("\n");
  for (var c = 1; c < contents.length; c++) {
    var line = contents[c].split(",");
    var constituency = line[1];
    var foundConstituency = false;
    for (var s = 0; s < lower.length; s++) {
      for (var f = 0; f < lower[s].constituencies.length; f++) {
        if (constituency === lower[s].constituencies[f]) {
          state = lower[s].area;
          output.write(state + "," + line.join(",") + "\n");
          foundConstituency = true;
          break;
        }
      }
      if (foundConstituency) {
        break;
      }
    }
  }
  output.end();
});
