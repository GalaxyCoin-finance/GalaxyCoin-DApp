import {FarmAbi} from "./abi/farm-abi";
import {getTokenIconUri} from "./erc20-core";
import { getAmountOfTokenInBalancerPool, getAmountOfTokenInPool } from "./price-utils";

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
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "mGLXY = GLXY (50%) / WMATIC + USDT + USDC + LINK + CRV (50%)",
            "pid": 0,
            "percentage": 50,
            "tags": "GALAXY,GLXY,MATIC,USDT,USDC,LINK,CRV",
            buyLink: "https://polygon.balancer.fi/#/pool/0xb70c25d96ef260ea07f650037bf68f5d6583885e000100000000000000000048",
            active: true,
            balancerId: "0xb70c25d96ef260ea07f650037bf68f5d6583885e000100000000000000000048"
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
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "GLXY (100%)",
            "pid": 1,
            "percentage": 100,
            "tags": "GALAXY-X,SINGLE-ASSET",
            buyLink: "https://polygon.balancer.fi/#/trade/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b",
            active: true,
            balancerId: "0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f"
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
            weightedTokenAddress: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
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
            weightedTokenAddress: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
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
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "GLXY (50%) / BAL (50%)",
            "pid": 4,
            "percentage": 50,
            "tags": "GLXY,BAL,GALAXY",
            active: false,
            balancerId: "0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f"
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
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "GLXY (55%) / BAL (45%)",
            "pid": 5,
            "percentage": 55,
            "tags": "GLXY,BAL,GALAXY",
            buyLink: "https://polygon.balancer.fi/#/pool/0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f",
            balancerId: "0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f",
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
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "GLXY (50%) / BAL (50%)",
            "pid": 6,
            "percentage": 50,
            "tags": "GLXY,BAL,GALAXY",
            active: false,
            balancerId: "0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f"
        },
    ]

}

export const activeFarmConfig = {
    address: '0xCFf364d0045Df807AB53dDC827d054Ee6807471a',
    abi: FarmAbi,
    farms: [
        {
            "name": "GAX-MATIC",
            composition: "GAX-MATIC = GAX (50%) / WMATIC (50%)",
            "pid": 0,
            stakedToken: {
                address: '0x535f4987C013CC15E0055f652C077bE2006B3aBc',
                symbol: "QUICKSWAP-LP",
                name: "GAX-MATIC",
                icon: getTokenIconUri('0x535f4987C013CC15E0055f652C077bE2006B3aBc')
            },
            lpToken: '0x535f4987C013CC15E0055f652C077bE2006B3aBc',
            weightedToken: 'GAX',
            weightedTokenAddress: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
            "percentage": 50,
            "tags": "GALAXY-X,MATIC,GAX",
            buyLink: "https://quickswap.exchange/#/add/ETH/0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3",
            active: true
        },
        {
            "name": "eGLXY",
            stakedToken: {
                address: '0xD9B84F68Af362159da621473eF0f979709734dB6',
                symbol: "bGLXY",
                name: "Balancer bGALXY",
                icon: getTokenIconUri('0xD9B84F68Af362159da621473eF0f979709734dB6')
            },
            lpToken: '0xD9B84F68Af362159da621473eF0f979709734dB6',
            weightedToken: 'GLXY',
            weightedTokenAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
            composition: "GLXY (51%) / WMATIC (7%) / CRV (7%) / USDC (7%) /AVAX (7%) /LINK(7%) / SOL(7%) / USDT(7%)",
            "pid": 1,
            "percentage": 51,
            "tags": "GLXY,WMATIC,GALAXY,AVAX,LINK",
            buyLink: "https://polygon.balancer.fi/#/pool/0xd9b84f68af362159da621473ef0f979709734db6000100000000000000000071/invest",
            active: true,
            balancerId: "0xd9b84f68af362159da621473ef0f979709734db6000100000000000000000071"
        },
    ]
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

    console.log('priceOfRewardsPerWeek = '+priceOfRewardsPerWeek);
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
    if(weight === 100) return priceOfWeightedToken;
    const lpContract = new web3.eth.Contract(erc20ABI, pool.lpToken);
    const totalPoolSupply = new Big(fromWei(await getTotalSupply(lpContract)));

    const amountofWeightedToken = new Big(farmConfig.farms[pid].weightedToken === 'GLXY' ? 
                await getAmountOfTokenInBalancerPool(
                    {
                        poolID: farmConfig.farms[pid].balancerId,
                        tokenAddress: farmConfig.farms[pid].weightedTokenAddress
                    }
                ) :
                await getAmountOfTokenInPool(
                    {
                        Lptoken: pool.lpToken,
                        tokenAddress: farmConfig.farms[pid].weightedTokenAddress
                    }
                ))

    
    const totalWeightedTpokenValue = amountofWeightedToken.div(farmConfig.farms[pid].weightedToken === 'GLXY' ? 1 : 10**18).times(priceOfWeightedToken);

    const priceOfLP = totalWeightedTpokenValue.times(100).div(weight).div(totalPoolSupply)

    return Number(priceOfLP);
}