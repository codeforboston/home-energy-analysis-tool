
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
const __dirname = dirname(fileURLToPath(import.meta.url));
const pEnvPath = `${__dirname}/../../public/pyodide-env`;
const pyodideLockFile = pEnvPath+'/pyodide-lock.json';

const hash = createHash('sha256');



const data = JSON.parse(fs.readFileSync(pyodideLockFile));

const RED = data.packages.rules_engine;

/**
 * Right now the wheel name will always be "rules_engine-0.0.1-py3-none-any.whl"
 * But if/when we implement versioning, then this will just need a bit of logic to get the newest name
 * and update that property (data.packages.rules_engine.file_name) as well as the ...sha256 property.
 */
const wheelFileName = RED.file_name; 
const input = fs.readFileSync(`${pEnvPath}/${wheelFileName}`);
hash.update(input);
const digest = hash.digest('hex');

RED.sha256 = digest;

fs.writeFileSync(pyodideLockFile,JSON.stringify(data, null, 2));