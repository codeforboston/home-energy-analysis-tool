from rules_engine import engine, helpers  # type: ignore
from rules_engine.pydantic_models import (  # type: ignore
    HeatLoadInput,
    NaturalGasBillingRecordInput,
    NaturalGasBills2x,
    TemperatureInput,
)


def executeGetNormalizedOutput(
    summaryInputJs, temperatureInputJs, gasBillsJs, state_id, county_id
):
    """
    second step: this will be the first time to draw the table
    # two new geocode parameters may be needed for design temp:
    # watch out for helpers.get_design_temp( addressMatches[0].geographies.counties[0]['STATE'] , addressMatches[0].geographies.counties[0]['COUNTY'] county_id)
    # in addition to latitude and longitude from GeocodeUtil.ts object .
    # pack the get_design_temp output into heat_load_input
    """

    summaryInputFromJs = summaryInputJs.to_py()
    temperatureInputFromJs = temperatureInputJs.to_py()

    gasBillsFromJs = gasBillsJs.to_py()
    gasBills = gasBillsFromJs.get("records")
    # Ensure records is a list of dicts for NaturalGasBills2x
    # bills = gas.map(record => ({
    # 	periodStartDate: new Date(record["period_start_date"]),
    # 	periodEndDate: new Date(record["period_end_date"]),
    # 	usageQuantity: Number(record["usage"]),
    # 	inclusionOverride: Number(record["inclusion_override"]),
    # }));

    # We will just pass in this data
    # naturalGasInputRecords = parser.parse_gas_bill(gasBillingDataJs)

    design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
    summaryInput = HeatLoadInput(
        **summaryInputFromJs, design_temperature=design_temp_looked_up
    )

    temperatureInput = TemperatureInput(**temperatureInputFromJs)

    records = []
    for rec in gasBills:
        import re
        from datetime import datetime

        def to_iso(dt):
            if dt is None:
                return None
            s = str(dt)
            # Try ISO first
            try:
                return datetime.fromisoformat(s).isoformat()
            except Exception:
                pass
            # Try JS Date string: 'Fri Oct 02 2020 00:00:00 GMT-0400 (Eastern Daylight Time)'
            match = re.search(r"(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2})", s)
            if match:
                try:
                    # Parse 'Fri Oct 02 2020 00:00:00' format
                    return datetime.strptime(
                        match.group(1), "%a %b %d %Y %H:%M:%S"
                    ).isoformat()
                except Exception:
                    pass
            return s

        start_date_iso = to_iso(rec.get("periodStartDate"))
        end_date_iso = to_iso(rec.get("periodEndDate"))
        record = NaturalGasBillingRecordInput(
            period_start_date=start_date_iso,
            period_end_date=end_date_iso,
            usage_therms=float(rec.get("usageQuantity", 0) or 0),
            inclusion_override=rec.get("inclusionOverride"),
        )
        records.append(record)

    design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
    summaryInput = HeatLoadInput(
        **summaryInputFromJs, design_temperature=design_temp_looked_up
    )

    temperatureInput = TemperatureInput(**temperatureInputFromJs)

    outputs = engine.get_outputs_natural_gas(summaryInput, temperatureInput, records)
    return outputs.model_dump(mode="json")
    # result = outputs.model_dump(mode="json")
    # result["design_temp_lookup"] = design_temp_looked_up
    # return result
