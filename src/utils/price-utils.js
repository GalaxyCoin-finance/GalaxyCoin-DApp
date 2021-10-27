import {rpcUrl, balancerVaultAddress, galaxyAddress, gaxAddress, usdcAddress} from './config';
import {balancerVaultAbi} from "./abi/balancer-vault-abi";
import {univ2LpAbi} from "./abi/univ2-lp-abi";

const Web3 = require('web3');
const web3 = new Web3(rpcUrl);
const Big = require('big-js');

const {fromWei} = web3.utils;

export const getPriceOfGalaxy = async (poolId) => {
    const vaultContract = new web3.eth.Contract(balancerVaultAbi, balancerVaultAddress);

    const poolTokens = await vaultContract.methods.getPoolTokens(poolId).call();

    let usdcBalance;
    let galaxyBalance;

    for(let i = 0; i < poolTokens.tokens.length; i++) {
        if(poolTokens.tokens[i].toLowerCase() === galaxyAddress.toLowerCase()) {
            galaxyBalance = new Big(fromWei(poolTokens.balances[i]));
        }

        if(poolTokens.tokens[i].toLowerCase() === usdcAddress.toLowerCase()) {
            usdcBalance = new Big(poolTokens.balances[i]).times(10**-6);
        }
    }

    return usdcBalance.times(5).div(galaxyBalance).toFixed(4).toString();
}

export const getPriceOfGAX = async () => {
    const uniV2LPContract = new web3.eth.Contract(univ2LpAbi, balancerVaultAddress);

    // TODO - implement when the LP is live
    // Get the reserves from the LP itself
    // getQuote from QuickSwap router - feed reserves and amountIn
}



