import Big from "big-js";
import {getAPYForPID} from "../utils/farmConfigs.js";

const {rpcUrl, chainId} = require('./config.js');
const Web3 = require('web3');
const WEEK_SECONDS = 604800;

let web3 = new Web3(rpcUrl);
const {BN} = web3.utils;

export const getRealProvider = async (ethereum) => {
    let realProvider;

    if (typeof ethereum === 'string') {
        if (ethereum.includes('wss')) {
            realProvider = new Web3.providers.WebsocketProvider(
                ethereum,
                {timeout: 10000},
            )
        } else {
            realProvider = new Web3.providers.HttpProvider(
                ethereum,
                {timeout: 10000},
            )
        }
    } else {
        realProvider = ethereum
    }

    return new Web3(realProvider)
}

export const getRealContract = async (address, ethereum, abi) => {
    const web3 = await getRealProvider(ethereum);
    return new web3.eth.Contract(abi, address);
}

export const getRewardToken = async (farmContract) => {
    return await farmContract.methods.erc20();
}

export const getCurrentBlock = async (web3Arg) => {
    return web3Arg ? await web3Arg.eth.getBlockNumber() : await web3.eth.getBlockNumber();
}

/**
 *
 * @returns {Promise<number>} average time is seconds
 */
export const getAverageBlockTime = async (web3Args) => {
    // we average the future bloc time based on the average bloc time in the last one million block
    web3Args = web3Args ? web3Args : web3;
    const currentBlock = await getCurrentBlock(web3Args);
    const pastBlockTime = (await web3Args.eth.getBlock(currentBlock - 1000000)).timestamp;
    const currentBlockTime = Date.now() / 1000
    return (currentBlockTime - pastBlockTime) / 1000000;
}


/**
 *
 * @param farmContract
 * @param ethereum
 * @returns {Promise<[]>} {
 *     stakedToken: address
 *     allocationPoints: uint256
 *     lastRewardBlock: blockWhereRewards were distributed
 *     accBEP20PerShare: Accumulated BEP20s per share, times 1e36.
 *     stakedAmount: total staked by all users
 * }
 */
export const getFarms = async (farmContract, ethereum, {rewardsPerBlock, totalAllocationPoints}, pricesProvider, farmConfig) => {
    const pools = [...farmConfig.farms];

    for (let i = 0; i < farmConfig.farms.length; i++) {
        pools[i] = await getFarmDetails({
            farm: pools[i],
            rewardsPerBlock,
            totalAllocPoints: totalAllocationPoints,
            farmContract,
            ethereum,
            pricesProvider
        });
    }
    return pools;
}

export const getFarmDetails = async ({farm, rewardsPerBlock, totalAllocPoints, farmContract, ethereum, pricesProvider}) => {
    let pool = await farmContract.methods.poolInfo(farm.pid).call();

    const poolDistPerBlock = (Number(pool.allocPoint) / Number(totalAllocPoints)) * Number(rewardsPerBlock);
    const blocksPerWeek = WEEK_SECONDS / 2.370920137000084;
    const totalRewardsPerWeek = blocksPerWeek * poolDistPerBlock;
    const active = await isActive(farmContract);

    const apy = active ? await getAPYForPID(farm.pid, pool, totalRewardsPerWeek, pricesProvider) : new Big('0');
    return {
        ...farm,
        // some legacy functions depend on this we remove when we clear them out
        lpToken: pool.lpToken,
        allocationPoints: pool.allocPoint,
        lastRewardBlock: pool.lastRewardBlock,
        accBEP20PerShare: pool.accBEP20PerShare,
        totalStaked: pool.stakedAmount,
        totalRewardsPerWeek,
        apy: apy
    }
}

export const getStaked = async (farmContract, pid, account) => {
    return farmContract.methods.deposited(pid, account).call();
}

export const getPending = async (farmContract, pid, account) => {
    // TODO revert this workaround 
    try {
        const pending = await farmContract.methods.pending(pid, account).call();
        return pending;
    } catch ( error ) { 
    await sleep(500);
    const userInfo = await farmContract.methods.userInfo(pid, account).call();

    const poolInfo = await farmContract.methods.poolInfo(pid).call();

    const accERC20PerShare = poolInfo.accERC20PerShare;

    return new BN(userInfo.amount).mul(new BN(accERC20PerShare)).div(new BN('1000000000000000000000000000000000000')).sub(new BN(userInfo.rewardDebt));
    }

}

export const getTotalAllocPoints = async (farmContract) => {
    return farmContract.methods.totalAllocPoint().call();
}

export const getRewardsPerBlock = async (farmContract) => {
    return farmContract.methods.rewardPerBlock().call();
}

export const isPaused = async (farmContract) => {
    return farmContract.methods.paused().call();
}

export const isActive = async (farmContract) => {
    return (await farmContract.methods.endBlock().call()) > (await getCurrentBlock());
}

export const hasFarmStarted = async (farmContract) => {
    return (await farmContract.methods.endBlock().call()) != 0;
}

// write
export const harvest = async (farmContract, pid, wallet) => {
    const data = farmContract.methods.deposit(pid, '0').encodeABI();

    const transactionParams = {
        nonce: '0x00',
        to: farmContract.options.address,
        from: wallet.account,
        data: data,
        chainId: chainId
    }

    return wallet.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

export const withdraw = async (farmContract, pid, amount, wallet) => {
    const data = farmContract.methods.withdraw(pid, amount).encodeABI();

    const transactionParams = {
        nonce: '0x00',
        to: farmContract.options.address,
        from: wallet.account,
        data: data,
        chainId: chainId
    }

    return wallet.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

export const emergencyWithdrawFromFarm = async (farmContract, pid, wallet) => {
    const data = farmContract.methods.emergencyWithdraw(pid).encodeABI();

    const transactionParams = {
        nonce: '0x00',
        to: farmContract.options.address,
        from: wallet.account,
        data: data,
        chainId: chainId
    }

    return wallet.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

export const deposit = async (farmContract, pid, amount, wallet) => {
    const data = farmContract.methods.deposit(pid, amount).encodeABI();

    const transactionParams = {
        nonce: '0x00',
        to: farmContract.options.address,
        from: wallet.account,
        data: data,
        chainId: chainId
    }

    return wallet.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

// helper functions
export const waitForTransaction = async (pendingTxHash) => {
    return new Promise(async (resolve, reject) => {
        let receipt;
        do {
            await sleep(2200); // this will be roughly one block on Polygon main net
            receipt = await web3.eth.getTransactionReceipt(pendingTxHash);
        } while (!receipt)
        await sleep(4000); // lets wait for 2 more blocks to comfirm
        resolve(receipt)
    })
}


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}