# Weather Station Data

## Status

Proposed

## Context

One of the reasons the Home Energy Analysis Tool needs to update frequently is to incorporate new weather station data.  The weather station feeds calculations for the design temperature of the home.  The sheet also allows users to override the calculated design temperature.

## Decision

We will automatically pull in new weather station data.
We will automatically select a weather station for a given home based on its location, but we will allow users to change that selection.

## Consequences
Users will have reduced friction by avoiding pulling down new, fresh copies of the sheet to get new weather station data.
Setting the location for users will further reduce friction, while allowing them to set it will still let them override the selection in case of issues.