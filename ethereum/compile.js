/*
 * steps in this compile script:
 * 1. delete entire build folder
 * 2. read 'campaing.sol' from 'contracts' folder
 * 3. compile both contracts with solc
 * 4. write ouput to 'build' directory
 */

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const charityPath = path.resolve(__dirname, 'contracts', 'Charity.sol');
const source = fs.readFileSync(charityPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

/*
1. loop over output object
2. take each contract that exists inside there and
3. write it in a different file inside build directory
*/
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}
