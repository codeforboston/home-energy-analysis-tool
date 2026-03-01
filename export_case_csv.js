// Node.js script to export case data and billing records as CSVs
// Usage: node export_case_csv.js <caseId> <userId> [--admin]

const fs = require('fs');
const path = require('path');
const { parse } = require('papaparse');

// Import compiled server code (adjust path if needed)
const { getCaseForEditing } = require('./app/utils/db/case.server');

function flatten(obj, prefix = '', res = {}) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      flatten(obj[key], prefix + key + '_', res);
    } else {
      res[prefix + key] = obj[key];
    }
  }
  return res;
}

async function main() {
  const [,, caseIdArg, userId, ...rest] = process.argv;
  const caseId = Number(caseIdArg);
  const isAdmin = rest.includes('--admin');
  if (!caseId || !userId) {
    console.error('Usage: node export_case_csv.js <caseId> <userId> [--admin]');
    process.exit(1);
  }

  // Fetch case data
  const caseRecord = await getCaseForEditing(caseId, userId, isAdmin);
  if (!caseRecord) {
    console.error('Case not found');
    process.exit(1);
  }

  // Prepare main case data (excluding billing records)
  const { analysis, ...mainCase } = caseRecord;
  const flatCase = flatten(mainCase);
  const caseCsv = parse([flatCase], { header: true }).csv;
  fs.writeFileSync(path.join(process.cwd(), `case_${caseId}_main.csv`), caseCsv);
  console.log(`Exported main case data to case_${caseId}_main.csv`);

  // Prepare billing records (from processedEnergyBill)
  let billingRecords = [];
  if (analysis && analysis[0] && analysis[0].heatingInput && analysis[0].heatingInput[0] && analysis[0].heatingInput[0].processedEnergyBill) {
    billingRecords = analysis[0].heatingInput[0].processedEnergyBill;
  }
  if (billingRecords.length > 0) {
    const billingCsv = parse(billingRecords, { header: true }).csv;
    fs.writeFileSync(path.join(process.cwd(), `case_${caseId}_billing.csv`), billingCsv);
    console.log(`Exported billing records to case_${caseId}_billing.csv`);
  } else {
    console.log('No billing records found for this case.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
