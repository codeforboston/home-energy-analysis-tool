- Make easier for new developers to contribute
  - Review existing issues (Andrew)
  - Turn spreadsheet into issues (Steve)
  - Refactor heat-stack code
  - Technical documentation
    - action method
    - how schema definition works
    - prisma
    - architecure: UI (heat-stack) and server code
    - how to: using intent for new actions
    - how app calls heat-stack
    - tip: find where to make field changes by looking for label
- MVP II
  - make robust
    - if error occurs during analysis, return conform error message to display nice message rather than crash
    - implement issues from spreadsheet.
      - WIP: numbers with commas and reset (Ethan)
    - validate address, city, state combination before submit, using API that returns GPS coordinates
    - handle all sample files that are not working, either through conform error message or modifying code to accept additional format
- Post MVP II
  - handle oil
  - persistence 
