# parliament-parser

## Data

The constituencies folder contains original PDFs and output CSVs.

Note that "Pyithu" has a different format and is currently unparsed.

## Install

Get pdftotext command line tool and pdftk (see <a href="https://github.com/nisaacson/pdf-extract">https://github.com/nisaacson/pdf-extract</a>)

Install parliament-parser

```
npm install
```

## Run

```
node parser.js constituencies/AmyotharHulttaw.pdf constituencies/AmyotharHulttaw.csv
```

## Language notes

The legislature docs use an unusual font / encoding. This does not currently fix the encoding to proper Unicode.

Myanmar numerals are converted to digits 0-9 for readability

## License

Open Source under an MIT License
