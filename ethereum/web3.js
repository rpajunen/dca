/**
 * this file sets up web3 instance. this file gets executed on the server and on the browser.
 * if statement checks whether the user is using metamask and to prevent window is not defined error.
 */
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are executing the file inside the browser and metamask is available
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are on the server *OR* we are on the browser and the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/vcPnK5tVPIX3jzFa86Nj'
    );
    web3 = new Web3(provider);
}

export default web3;