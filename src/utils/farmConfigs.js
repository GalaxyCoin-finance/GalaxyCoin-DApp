const Big = require('big-js');
const {getPriceOfGAX, getPriceOfGalaxy} = require("./price-utils");
const {getTotalSupply} = require("./erc20-core");
// const {getRealContract} = require("./farm-core");
const {rpcUrl} = require('./config');
const {useWallet} = require("use-wallet");
const {erc20ABI} = require("./abi/erc20-abi");
const Web3 = require('web3');
const web3 = new Web3(rpcUrl);
const {fromWei} = web3.utils;

const farmConfigs = [
    {
        "name": "mGLXY",
        "composition": "mGLXY = GLXY (50%) / WMATIC + USDT + USDC + LINK + CRV (50%)",
        "pid": 0,
        "percentage": 50,
        "tags": "GALAXY,GLXY,MATIC,USDT,USDC,LINK,CRV",
        buyLink: "https://polygon.balancer.fi/#/pool/0xb70c25d96ef260ea07f650037bf68f5d6583885e000100000000000000000048"
    },
    {
        "name": "GLXY",
        "composition": "GLXY (100%)",
        "pid": 1,
        "percentage": 100,
        "tags": "GALAXY-X,SINGLE-ASSET",
        buyLink: "https://polygon.balancer.fi/#/trade/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b"
    },
    {
        "name": "GAX",
        "composition": "GAX (100%)",
        "pid": 2,
        "percentage": 100,
        "tags": "GALAXY-X,SINGLE-ASSET,GAX",
        buyLink: "https://quickswap.exchange/#/swap?outputCurrency=0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3"

    },
    {
        "name": "GAX-MATIC",
        "composition": "GAX-MATIC = GAX (50%) / WMATIC (50%)",
        "pid": 3,
        "percentage": 50,
        "tags": "GALAXY-X,MATIC,GAX",
        buyLink: "https://quickswap.exchange/#/add/ETH/0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3"
    },
    {
        "name": "bGLXY",
        "composition": "GLXY (50%) / BAL (50%)",
        "pid": 4,
        "percentage": 50,
        "tags": "GLXY,BAL,GALAXY"
    },
    {
        "name": "vGLXY",
        "composition": "GLXY (55%) / BAL (45%)",
        "pid": 5,
        "percentage": 55,
        "tags": "GLXY,BAL,GALAXY",
        buyLink: "https://polygon.balancer.fi/#/pool/0x8f4205e1604133d1875a3e771ae7e4f2b086563900020000000000000000006f"
    },
    {
        "name": "bGLXY",
        "composition": "GLXY (50%) / BAL (50%)",
        "pid": 6,
        "percentage": 50,
        "tags": "GLXY,BAL,GALAXY"
    },
]

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
 *
 *
 * @param pid
 * @param pool
 * @param totalRewardsPerWeek
 * @returns {Promise<number>}
 */
const getAPYForPID = async (pid, pool, totalRewardsPerWeek) => {

    for (let i = 0; i < farmConfigs.length; i++) {
        if (farmConfigs[i].pid === pid) {
            let price = new Big(await getPriceOfGAX());
            const priceOfRewardsPerWeek = new Big(totalRewardsPerWeek*10**-18).times(price);

            if(farmConfigs[i].tags.includes('GLXY')) {
                price = new Big(await getPriceOfGalaxy());
            }

            const weight = farmConfigs[i].percentage;
            const lpContract = new web3.eth.Contract(erc20ABI, pool.lpToken);
            const totalPoolSupply = new Big(fromWei(await getTotalSupply(lpContract)));

            const amountUnderlyingMainTokens = totalPoolSupply.times(weight).div(100);
            const underlyingMainTokenValue = amountUnderlyingMainTokens.times(price);
            const totalPoolValue = underlyingMainTokenValue.times(100).div(weight);


            const pricePerLP = totalPoolValue.div(totalPoolSupply);

            if (pool.stakedAmount === '0')
                pool.stakedAmount = '1'
              // roughly 53 weeks a year
            return (Number(priceOfRewardsPerWeek)) * (52.1775) / (Number(pricePerLP*fromWei(pool.stakedAmount))) * 100;
        }
    }
}

module.exports = {
    farmConfigs,
    getAPYForPID
};