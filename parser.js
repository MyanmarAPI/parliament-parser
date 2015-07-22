#! /usr/bin/env node

// call parser.js Parliament.pdf save.csv

var fs = require("fs");
var pdf_extract = require("pdf-extract");
var csv = require("fast-csv");
var myanmarNumbers = require("myanmar-numbers").myanmarNumbers;

if (process.argv.length > 2) {
  // prepare CSV output file
  var saveFile = "output.csv";
  if (process.argv.length > 3) {
    saveFile = process.argv[3];
  }
  var csvStream = csv.createWriteStream({headers: true});
  var writableStream = fs.createWriteStream(saveFile);
  writableStream.on("finish", function(){
    console.log("Saved to " + saveFile);
  });
  csvStream.pipe(writableStream);

  // use pdf-extract module to parse text
  var srcFile = process.argv[2];
  var processor = pdf_extract(srcFile, { type: 'text' }, function(err) {
    if (err) {
      throw err;
    }
  });
  processor.on('complete', function(data) {
    var serial = null;
    var constituency_number = null;
    var township = null;
    var wards_and_villages = [];
    var ward_village_text = "";
    var wait_for_township = false;

    var processWardsAndVillages = function() {
      // this is the main separator used
      var wvs = ward_village_text.split("၊"); // /၊|။/);
      for (var w = 0; w < wvs.length; w++) {
        // neaten up names
        ward_village = wvs[w].trim().replace(/\s\s+/g, '  ');

        // remove blank wards and villages
        if (!ward_village) {
          continue;
        }

        // output to file
        csvStream.write({
          serial: serial,
          constituency_number: constituency_number,
          township: township,
          ward_village: ward_village
        });
      }
    };

    for (var p = 0; p < data.text_pages.length; p++) {
      var txt = data.text_pages[p];
      lines = myanmarNumbers(txt).split("\n");
      for (var n = 0; n < lines.length; n++) {
        var line = lines[n];
        var sections = line.split(/\s\s\s+/);
        //console.log("->" + line + "<-");

        if (line.indexOf("စဉ") > -1) {
          // header row
          continue;
        }
        if (!line.replace(/\d|\s/g, '')) {
          // blank or page number row
          if (line.match(/\d/)) {
            // township reminder printed before data continues
            wait_for_township = true;
          }
          continue;
        }

        if (sections.length === 2 && !sections[0] && !sections[1].match(/\d/) && !sections[1].match("မများစာရင်း") && !sections[1].match("မဲဆန္ဒနယ်အမှတ်")) {
          // township name - remove any 'continued' message
          township = sections[1].replace('မှအဆက်', '');
          wait_for_township = false;
          continue;
        }

        if (wait_for_township) {
          // when starting the next page
          continue;
        }

        if (line[0] && !line[0].match(/\s/) && !isNaN(line[0] * 1)) {
          // hit a serial number
          if (serial) {
            // output previous constituency and reset
            processWardsAndVillages();
            ward_village_text = "";
          }

          // start new constituency
          serial = line.substring(0, line.indexOf(" ")) * 1;

          // sections doesn't work on the first line of a constituency if there are double-digit serial numbers
          // redo sections
          ward_village_text += line.substring(line.indexOf(" ")).trim().split(/\s\s\s+/)[1];
        } else if (serial) {
          // inside a constituency - add to wards and villages text
          if (line.match(/\(\d+\)/)) {
            // save the constituency_number first, separate from wards and villages text
            constituency_number = line.match(/\d+/)[0] * 1;
            line = line.substring(line.indexOf(')') + 1);
          }
          ward_village_text += line;
        }
      }
    }

    // process the last section
    processWardsAndVillages();

    // save the file
    csvStream.end();
  });

  // only read this for errors =(
  processor.on('error', function(err) {
    console.log(err);
    throw err;
  });
}
