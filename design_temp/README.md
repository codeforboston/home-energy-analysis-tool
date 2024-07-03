The Energy Star PDF contains design temperatures by US county. The PDF was downloaded from:
https://www.energystar.gov/ia/partners/bldrs_lenders_raters/downloads/County%20Level%20Design%20Temperature%20Reference%20Guide%20-%202015-06-24.pdf
and copied into pdf_rawcopy.txt. To allow copying, it was downloaded by using Google Chrome, using
the 'print' option and saving it as a PDF.

The script clean.py generates design_temp_by_county.csv from pdf_rawcopy.txt

## Validating county names
The design_temp_by_county.csv uses energystar county names,
But the geocode census API will return a combination and state & county ids.

This will require a dependency 'requests'. `python -m pip install requests`

Running `python validate_counties.py` will generate a full detailed output of
information needed to lookup counties returned by the census API along with their
design temps.