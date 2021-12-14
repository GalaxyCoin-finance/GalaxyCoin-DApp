import {FarmAbi} from "./abi/farm-abi";
import {getTokenIconUri} from "./erc20-core";

const Big = require('big-js');
const {getTotalSupply} = require("./erc20-core");
const {rpcUrl} = require('./config');
const {erc20ABI} = require("./abi/erc20-abi");

const Web3 = require('web3');
const web3 = new Web3(rpcUrl);
const {fromWei} = web3.utils;

export const disabledFarmConfig = {
    address: '0x888ee59B74D95d9Bc936208F3ec0Bfb5825Fc20d',
    abi: FarmAbi,
    farms: [
        {
            "name": "mGLXY",
            stakedToken: {
                address: '0xB70c25D96EF260eA07F650037Bf68F5d6583885e',
                symbol: "mGLXY",
                name: "mGLXY",
                icon: getTokenIconUri('0xB70c25D96EF260eA07F650037Bf68F5d6583885e')
            },
            lpToken: '0xB70c25D96EF260eA07F650037Bf68F5d6583885e',
            weightedToken: 'GLXY',
            composition: "mGLXY = GLXY (50%) / WMATIC + USDT + USDC + LINK + CRV (50%)",
            "pid": 0,
            "percentage": 50,
            "tags": "GALAXY,GLXY,MATIC,USDT,USDC,LINK,CRV",
            buyLink: "https://polygon.balancer.fi/#/pool/0xb70c25d96ef260ea07f650037bf68f5d6583885e000100000000000000000048",
            active: true,
        },
        {
            "name": "GLXY",
            stakedToken: {
                address: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
                symbol: "GLXY",
                name: "Galaxy Coin",
                icon: getTokenIconUri('0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b')
            },
            lpToken: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            weightedToken: 'GLXY',
            composition: "GLXY (100%)",
            "pid": 1,
            "percentage": 100,
            "tags": "GALAXY-X,SINGLE-ASSET",
            buyLink: "https://polygon.balancer.fi/#/trade/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b",
            active: true
        },
        {
            "name": "GAX",
            stakedToken: {
                address: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
                symbol: "GAX",
                name: "Galaxy X Coin",
                icon: getTokenIconUri('0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3')
            },
            lpToken: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
            weightedToken: 'GAX',
            composition: "GAX (100%)",
            "pid": 2,
            "percentage": 100,
            "tags": "GALAXY-X,SINGLE-ASSET,GAX",
            buyLink: "https://quickswap.exchange/#/swap?outputCurrency=0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3",
            active: true
        },
        {
            "name": "GAX-MATIC",
            composition: "GAX-MATIC = GAX (50%) / WMATIC (50%)",
            "pid": 3,
            stakedToken: {
                address: '0x535f4987C013CC15E0055f652C077bE2006B3aBc',
                symbol: "QUICKSWAP-LP",
                name: "GAX-MATIC",
                icon: getTokenIconUri('0x535f4987C013CC15E0055f652C077bE2006B3aBc')
            },
            lpToken: '0x535f4987C013CC15E0055f652C077bE2006B3aBc',
            weightedToken: 'GAX',
            "percentage": 50,
            "tags": "GALAXY-X,MATIC,GAX",
            buyLink: "https://quickswap.exchange/#/add/ETH/0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3",
            active: true
        },
        {
            "name": "bGLXY",
            stakedToken: {
                address: '0x432eb5a7e69F0753298f111b0Ce6336423925608',
                symbol: "bGLXY",
                name: "Balancer bGALXY",
                icon: getTokenIconUri('0x432eb5a7e69F0753298f111b0Ce6336423925608')
            },
            lpToken: '0x432eb5a7e69F0753298f111b0Ce6336423925608',
            weightedToken: 'GLXY',
            composition: "GLXY (50%) / BAL (50%)",
            "pid": 4,
            "percentage": 50,
            "tags": "GLXY,BAL,GALAXY",
            active: false
        },
        {
            "name": "vGLXY",
            stakedToken: {
                address: '0x8f4205e1604133d1875a3E771AE7e4F2b0865639',
                symbol: "vGLXY",
                name: "Balancer vGLXY",
                icon: getTokenIconUri('0x8f4205e1604133d1875a3E771AE7e4F2b0865639')
            },
            lpToken: '0x8f4205e1604133d1875a3E771AE7e4F2b0865639',
            weightedToken: 'GLXY',
            composition: "GLXY (55%) / BAL (45%)",
            "pid": 5,
            "percentage": 55,
            "tags": "GLXY,BAL,GALAXY",
            buyLink: "https://polygon.balancer.fi/#/pool/0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f",
            active: true
        },
        {
            "name": "bGLXY",
            stakedToken: {
                address: '0x432eb5a7e69F0753298f111b0Ce6336423925608',
                symbol: "bGLXY",
                name: "Balancer bGALXY",
                icon: getTokenIconUri('0x432eb5a7e69F0753298f111b0Ce6336423925608')
            },
            lpToken: '0x432eb5a7e69F0753298f111b0Ce6336423925608',
            weightedToken: 'GLXY',
            composition: "GLXY (50%) / BAL (50%)",
            "pid": 6,
            "percentage": 50,
            "tags": "GLXY,BAL,GALAXY",
            active: false
        },
    ]

}

export const activeFarmConfig = {
    address: '0xCFf364d0045Df807AB53dDC827d054Ee6807471a',
    abi: FarmAbi,
    farms: []
}

/**
 * Calculation explanation:
 * First off we get the price of the main token (GLXY or GAX). We always want GAX anyway since that is the reward
 * token, so we assign it and get the dollar value of it.
 *
 * We then get the weight of the main token in the pool and get the usd value of the underlying amount:
 * underlyingTokenAmount = LPTotalSupply * weight/100
 *
 * We then get the underlying value by multiplying the price of the main token (GLXY or GAX):
 * underlyingTokenValue = underlyingTokenAmount * price
 *
 * Now we can calculate the value of the entire pool since we have the value of the main token portion:
 * totalPoolValue = underlyingTokenValue*100/weight
 *
 * Now all we need is the price per LP token and since we have the value of the entire pool and its total supply:
 * pricePerLP = totalPoolValue/totalPoolSupply
 *
 * We can now get the APY by using this formula:
 * apy = (valueOfRewardsPerWeek*numWeeksPerYear) / (pricePerLP*amountOfLPStaked)
 *
 * This is basically the following formula:
 *  TODO: Move this to the price provider as this is not the best place for this function
 *
 * @param pid
 * @param pool
 * @param totalRewardsPerWeek
 * @param priceProvider
 * @returns {Promise<number>}
 */
export const getAPYForPID = async (pid, pool, totalRewardsPerWeek, {/*Price provider look at PricesContext*/ getGaxPrice, getGLXYPrice, getLPPricesPrice}) => {
    const priceOfGax = await getGaxPrice();
    const lpPrices = await getLPPricesPrice();

    const priceOfRewardsPerWeek = new Big(totalRewardsPerWeek * 10 ** -18).times(new Big(priceOfGax));

    const pricePerLP = lpPrices[pid];
    if (pool.stakedAmount === '0')
        pool.stakedAmount = '1'
    // roughly 53 weeks a year
    return (Number(priceOfRewardsPerWeek)) * (52.1775) / (Number(pricePerLP * fromWei(pool.stakedAmount))) * 100;
}
/*
    Each LP or rewards has a key token either GAX or GLXY with a known weight
    this function just used that weight and the base price  to determine the value of
    the LP token
 */
export const getLPPrice = async (pid, pool, priceOfWeightedToken, farmConfig) => {
    const weight = farmConfig.farms[pid].percentage;
    const lpContract = new web3.eth.Contract(erc20ABI, pool.lpToken);
    const totalPoolSupply = new Big(fromWei(await getTotalSupply(lpContract)));

    const amountUnderlyingMainTokens = totalPoolSupply.times(weight).div(100);
    const underlyingMainTokenValue = amountUnderlyingMainTokens.times(priceOfWeightedToken);
    const totalPoolValue = underlyingMainTokenValue.times(100).div(weight);

    return Number(totalPoolValue.div(totalPoolSupply));
}