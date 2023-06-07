# MVP: Home Square Footage

## Status

Proposed

## Context

Users of the home energy analysis tool need to input square footage of the home.  In the Excel sheet, this is cell B10 on the Summary tab.

We explored whether we could automatically fetch square footage data for homes by address from publicly available information.  We found that while this data is accessible online, cities store it in different formats and expose it with different APIs.  It would be difficult to fetch this data in a consistent way.

## Decision

Automatically fetching square footage of homes will not be a part of the MVP deliverable.

## Consequences

Users will still need to enter home square footage manually.
