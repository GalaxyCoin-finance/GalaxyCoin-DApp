import {rpcUrl, balancerVaultAddress, galaxyAddress, gaxLPAddress, usdcAddress, quickswapRouterAddress, maticUsdc, glxyPoolId} from './config';
import {balancerVaultAbi} from "./abi/balancer-vault-abi";
import {univ2LpAbi} from "./abi/univ2-lp-abi";
import {univ2RouterAbi} from "./abi/univ2-router-abi";
import { erc20ABI } from './abi/erc20-abi';
import { getBalance } from './erc20-core';

const Web3 = require('web3');
const web3 = new Web3(rpcUrl);
const Big = require('big-js');

const {fromWei, toWei} = web3.utils;

export const getPriceOfGalaxy = async () => {
    const vaultContract = new web3.eth.Contract(balancerVaultAbi, balancerVaultAddress);

    const poolTokens = await vaultContract.methods.getPoolTokens('0xd9b84f68af362159da621473ef0f979709734db6000100000000000000000071').call();

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

    return usdcBalance.times('7.2857142857142857142857142857143').div(galaxyBalance).toFixed(4).toString();
}

export const getPriceOfGAX = async () => {
    const uniV2LPContract = new web3.eth.Contract(univ2LpAbi, gaxLPAddress);
    const uniV2RouterContract = new web3.eth.Contract(univ2RouterAbi, quickswapRouterAddress);

    // Get quote of gax/matic
    const res = await uniV2LPContract.methods.getReserves().call();

    const gaxMaticQuote = await uniV2RouterContract.methods.quote(toWei("1"), res._reserve1, res._reserve0).call();
    const priceGAXPerMatic = fromWei(gaxMaticQuote);

    // Get quote of matic/usdc
    const uniV2LPContractM_U = new web3.eth.Contract(univ2LpAbi, maticUsdc);

    const reservesM_U = await uniV2LPContractM_U.methods.getReserves().call();

    const maticUsdcQuote = await uniV2RouterContract.methods.quote(toWei("1"), reservesM_U._reserve0, reservesM_U._reserve1).call();
    const priceMatic = maticUsdcQuote*10**-6;


    return (priceGAXPerMatic*priceMatic).toFixed(6).toString();
}


export const getAmountOfTokenInBalancerPool = async ({poolID , tokenAddress }) => {
    const vaultContract = new web3.eth.Contract(balancerVaultAbi, balancerVaultAddress);
    const poolTokens = await vaultContract.methods.getPoolTokens(poolID).call();


    let balance;
    for(let i = 0; i < poolTokens.tokens.length; i++) {
        if(poolTokens.tokens[i].toLowerCase() === tokenAddress.toLowerCase()) {
            balance = new Big(fromWei(poolTokens.balances[i]));
        }
    }
    return balance;
}


export const getAmountOfTokenInPool = async ({Lptoken , tokenAddress }) => {
    const uniV2LPContract = new web3.eth.Contract(univ2LpAbi, Lptoken);
    const uniV2RouterContract = new web3.eth.Contract(univ2RouterAbi, quickswapRouterAddress);
    const lpErc20Contract = new web3.eth.Contract(erc20ABI, tokenAddress);
    console.log('Lptoken = '+Lptoken)
    const balance = await getBalance(lpErc20Contract, Lptoken);
    console.log('balance gax = '+balance )

    return balance;
}
