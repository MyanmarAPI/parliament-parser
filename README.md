# parliament-parser

## Data

The pdf folder contains original PDFs from the Myanmar Union Election Commission.

Word Docs are not available to the public but were essential to getting the organized-txt files and final constituency lists.

The organized-txt folder contains a list of constituencies using the format:

```
1st_KNOWN_CONSTITUENCY_NAME
list of wards in the 1st constituency (typically separated by a ၊ mark)
additional lines with more wards in the first constituency
(BLANK LINE)
list of wards in the 2nd constituency
...
2nd_KNOWN_CONSTITUENCY_NAME
```

The csv folder contains CSVs with a row for each ward.

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

The legislature PDFs are based on Unicode characters and Myanmar3 font, but have unusual errors with the order and placement of diacritics. Use my-diacritic-sort module to sort them.

Myanmar numerals are converted to digits 0-9 for readability

## License

Open Source under an MIT License
