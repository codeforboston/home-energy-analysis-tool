"""
Return lists of gas billing data parsed from Eversource and
National Grid CSVs.
"""
import csv
from datetime import datetime, timedelta
import io
from .pydantic_models import NaturalGasBillingInput, NaturalGasBillingRecordInput


class _GasBillRowEversource:
    """
    Holds data for one row of an Eversource gas bill CSV.
    
    The names of the fields correspond to the first row of the Eversource bill.

    Example:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        1/18/2022,184.00,32,5.75,$327.58,30.0
        ...
    """
    def __init__(self, row):
        self.read_date = row["Read Date"]
        self.usage = row["Usage"]
        self.number_of_days = row["Number of Days"]


class _GasBillRowNationalGrid:
    """
    Holds data for one row of an National Grid gas bill CSV.
    
    The names of the fields correspond to the row of the National Grid 
    bill right before the billing data.
    
    Example:
        Name,FIRST LAST,,,,,
        Address,"100 PLACE AVE, BOSTON MA 02130",,,,,
        Account Number,1111111111,,,,,
        Service,Service 1,,,,,
        ,,,,,,
        TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
        Natural gas billing,12/29/2012,1/24/2013,149,therms,$206.91 ,
        ...
    """
    def __init__(self, row):
        self.start_date = row["START DATE"]
        self.end_date = row["END DATE"]
        self.usage = row["USAGE"]


def parse_gas_bill_eversource(data: str) -> NaturalGasBillingInput:
    """
    Return a list of gas bill data parsed from an Eversource CSV 
    received as a string.

    Example:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        1/18/2022,184.00,32,5.75,$327.58,30.0
        ...
    """
    f = io.StringIO(data)
    reader = csv.DictReader(f)
    records = []
    for row in reader:
        data = _GasBillRowEversource(row)
        period_end_date = datetime.strptime(data.read_date, "%m/%d/%Y").date()
        # Calculate period_start_date using the end date and number of days in the bill
        # Care should be taken here to avoid off-by-one errors
        period_start_date = period_end_date - timedelta(days=(int(data.number_of_days) - 1))

        record = NaturalGasBillingRecordInput(
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            usage_therms=data.usage,
            inclusion_override=None,
        )
        records.append(record)

    return NaturalGasBillingInput(records=records)


def parse_gas_bill_national_grid(data: str) -> NaturalGasBillingInput:
    """
    Return a list of gas bill data parsed from an National Grid CSV 
    received as a string.

    Example:
        Name,FIRST LAST,,,,,
        Address,"100 PLACE AVE, BOSTON MA 02130",,,,,
        Account Number,1111111111,,,,,
        Service,Service 1,,,,,
        ,,,,,,
        TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
        Natural gas billing,12/29/2012,1/24/2013,149,therms,$206.91 ,
        ...
    """
    f = io.StringIO(data)
    ROWS_TO_SKIP = 5
    for _ in range(ROWS_TO_SKIP):
        next(f)
    reader = csv.DictReader(f)

    records = []
    for row in reader:
        data = _GasBillRowNationalGrid(row)
        
        period_start_date = datetime.strptime(data.start_date, "%m/%d/%Y").date()
        period_end_date = datetime.strptime(data.end_date, "%m/%d/%Y").date()

        record = NaturalGasBillingRecordInput(
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            usage_therms=data.usage,
            inclusion_override=None,
        )
        records.append(record)
    
    return NaturalGasBillingInput(records=records)
