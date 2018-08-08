/**
 * setup campaignFactorty contract:
 * this file creates a new CampaignFactory contract and exports the
 * instance so it can be used elsewhere in in the project.
 * 
 * note:
 * -address in the instance must always be the newest!
 * -update it whenever campaignFactory gets redeployed
 */
import web3 from './web3';
import CharityFactory from './build/CharityFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CharityFactory.interface),
    '0x9BD3199113232380AC18BF05527aE9FcdD7825e2'
);

export default instance;
