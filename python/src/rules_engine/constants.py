class COLUMN_NAMES_TO_SEEK:
    """
    Column names to search for in a natural gas bill to find whether a
    bill comes from National Grid or Eversource.

    Not to be confused with the lists of column names, also in
    constants.py, which are used during parsing once origin has been
    determined.
    """

    NATIONAL_GRID = ("start date", "end date", "usage")


READ_DATE_NAMES_EVERSOURCE = ["read date", "end date"]
NUMBER_OF_DAYS_NAMES_EVERSOURCE = ["number of days", "days in bill"]
USAGE_NAMES_EVERSOURCE = ["usage (therms)", "usage"]

USAGE_NAMES_NATIONAL_GRID = ["usage (therms)", "usage"]
