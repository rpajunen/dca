/**
 * steps in this compile script:
 * 1. delete entire build folder
 * 2. read 'campaing.sol' from 'contracts' folder
 * 3. compile both contracts with solc
 * 4. write ouput to 'build' directory
 */

const path = require('path');
const solc = require('solc');
// allows the usage of extra functions
const fs = require('fs-extra');
// create build path
const buildPath = path.resolve(__dirname, 'build');
// 1. deletes the build folder and all content of the folder
fs.removeSync(buildPath);

// create path to contract we want to build
const charityPath = path.resolve(__dirname, 'contracts', 'Charity.sol');
// 2. read in the source code of that file and store it in a variable
const source = fs.readFileSync(charityPath, 'utf8');
// 3. compile that source code and store contracts property to a variable
// output variable now contains two seperate objects (outputs of contracts Campaign and CampaignFactory )
const output = solc.compile(source, 1).contracts;

// 4. recreate the build folder
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
