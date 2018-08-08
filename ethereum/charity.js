import web3 from "./web3";
import Charity from "./build/Charity.json";

/**
 * charity.js:
 * Contains a function that takes an address as an argument and returns new charity contract.
 * It is used to create instances of charity with an address.
 */

export default address => {
  return new web3.eth.Contract(JSON.parse(Charity.interface), address);
};
