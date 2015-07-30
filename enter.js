#! /usr/bin/env node

// call enter.js formatted_doc.txt constituencies_list.txt output.csv

var fs = require("fs");
var csv = require("fast-csv");
var myanmarNumbers = require("myanmar-numbers").myanmarNumbers;

// prepare CSV output file
var saveFile = "output.csv";
if (process.argv.length > 4) {
  saveFile = process.argv[4];
}
var csvStream = csv.createWriteStream({headers: true});
var writableStream = fs.createWriteStream(saveFile);
writableStream.on("finish", function(){
  console.log("Saved to " + saveFile);
});
csvStream.pipe(writableStream);

if (process.argv.length > 3) {
  var srcFile = process.argv[2];
  var constituencies = [];
  fs.readFile(srcFile, { encoding: 'utf-8' }, function(err, doc) {
    if (err) {
      throw err;
    }
    fs.readFile(process.argv[3], { encoding: 'utf-8' }, function(err, constituency_doc) {
      if (err) {
        throw err;
      }
      constituencies = constituency_doc.split("\n");

      var lines = doc.split("\n");
      var current_constituency = null;
      var constituency_number = 0;
      var ward_village_text = "";

      var processWardsAndVillages = function() {
        // this is the main separator used
        var wvs = ward_village_text.replace(/(စု|\))\s+(\d+)။/g, "$1၊$2။").split("၊"); // /၊|။/);
        for (var w = 0; w < wvs.length; w++) {
          // neaten up names
          ward_village = wvs[w].trim().replace(/\s\s+/g, '  ');
          ward_village = ward_village.replace(/(\d)ဝ/g, '$10');
          var wv_num = (ward_village.match(/\d+\s?။\s?/) || ['0'])[0].replace(/\s?။\s?/, "");
          ward_village = ward_village.replace(/\d+\s?။/g, '').replace(/။/g, '').trim();

          // remove blank wards and villages
          if (!ward_village) {
            continue;
          }

          // output to file
          csvStream.write({
            constituency_number: constituency_number,
            constituency_name: current_constituency,
            ward_village_number: wv_num,
            ward_village: ward_village
          });
        }
      };

      for (var n = 0; n < lines.length; n++) {
        var line = (myanmarNumbers(lines[n]) || '').replace(/__/g, '');
        if (line && (constituencies.indexOf(line) > -1 || constituencies.indexOf(line + "့မြို့နယ်") > -1)) {
          // started a constituency
          constituency_number = 1;
          current_constituency = line;
          continue;
        }
        if (line.trim() === "" && ward_village_text !== "") {
          // blank line - add a constituency_number
          processWardsAndVillages();
          ward_village_text = "";
          constituency_number++;
          continue;
        }
        // remaining here - must be wards and villages info
        ward_village_text += line;
      }
    });
  });
} else {
  console.log('node enter.js organized-txt/src.txt constituencies/src.txt csv/output.csv');
}
