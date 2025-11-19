Review test.tsx files after code
Reviewed all SingleCaseForm.tsx
new.tsx => SingleCaseForm
        => case.logic.server.ts
            => case.db.server.ts


vite.config.ts: unnecessary coverage changes.
bias- don't merge/commit things we don't understand well from LLM.

remove:
check-coverage.js
check-uncovered.js
heat-stack/tests/playwright-coverage-utils.ts

Parking lot:
- Someone should not be able to reach the /cases/new (or even /cases/*) page without being logged in.
- All three playwright tests for energy-usage are failling because the calculate button forwards playwright browser to the login page.

- choosing to have public login, with risk tradeoffs.