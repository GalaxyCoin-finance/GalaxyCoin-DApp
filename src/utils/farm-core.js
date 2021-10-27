import {getBalance, getName, getSymbol, getTokenIconUri, getTotalSupply} from "./erc20-core";

const {rpcUrl, chainId} = require('./config.js');
const Web3 = require('web3');
const Big = require('big.js');
const {erc20ABI} = require('../utils/abi/erc20-abi');
const YEAR_SECONDS = 31536000;
const WEEK_SECONDS = 604800;

let web3 = new Web3(rpcUrl);

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

export const getCurrentBlock = async () => {
    return await web3.eth.getBlockNumber();
}

/**
 *
 * @returns {Promise<number>} average time is seconds
 */
export const getAverageBlockTime = async () => {
    // we average the future bloc time based on the average bloc time in the last one million block
    const currentBlock = await getCurrentBlock();
    const pastBlockTime = (await web3.eth.getBlock(currentBlock - 1000000)).timestamp;
    const currentBlockTime = (await web3.eth.getBlock(currentBlock)).timestamp;
    return (currentBlockTime - pastBlockTime) / 1000000
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
export const getFarms = async (farmContract, ethereum) => {
    const length = await farmContract.methods.poolLength().call();
    const pools = [];

    const rewardsPerBlock = await getRewardsPerBlock(farmContract);
    const totalAllocPoints = await getTotalAllocPoints(farmContract);

    for (let i = 0; i < length; i++) {
        const pool = await farmContract.methods.poolInfo(i).call();
        const realErc20 = await getRealContract(pool.lpToken, ethereum, erc20ABI);

        const poolDistPerBlock = (Number(pool.allocPoint) / Number(totalAllocPoints)) * Number(rewardsPerBlock);
        const averageBlockTime = await getAverageBlockTime();
        const blocksPerWeek = WEEK_SECONDS / averageBlockTime;
        const totalRewardsPerWeek = blocksPerWeek * poolDistPerBlock;

        if(pool.stakedAmount === '0')
            pool.stakedAmount = '1'
        const apy = (new Big(totalRewardsPerWeek).times(52.1775).div(Number(pool.stakedAmount)).times(100))  // roughly 53 weeks a year

        pools.push(
            {
                pid: i,
                stakedToken: {
                    address: pool.lpToken,
                    symbol: await getSymbol(realErc20),
                    name: await getName(realErc20),
                    icon: getTokenIconUri(pool.lpToken)
                },
                allocationPoints: pool.allocPoint,
                lastRewardBlock: pool.lastRewardBlock,
                accBEP20PerShare: pool.accBEP20PerShare,
                totalStaked: pool.stakedAmount,
                totalRewardsPerWeek,
                apy: apy
            }
        )
    }
    return pools.sort((a, b) => {
        return new Big(b.allocationPoints).minus(new Big(a.allocationPoints))
    });
}

export const getStaked = async (farmContract, pid, account) => {
    return farmContract.methods.deposited(pid, account).call();
}

export const getPending = async (farmContract, pid, account) => {
    return farmContract.methods.pending(pid, account).call();
}

export const getTotalAllocPoints = async (farmContract) => {
    return farmContract.methods.totalAllocPoint().call();
}

export const getRewardsPerBlock = async (farmContract) => {
    return farmContract.methods.rewardPerBlock().call();
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
const getGaxValue = async (uniLikePairERC20Contract, realERC20Contract) => {
    const gaxBalance = await getBalance(realERC20Contract, uniLikePairERC20Contract.options.address);
    const totalSupply = await getTotalSupply(uniLikePairERC20Contract);

    // pool has 50% VOl and 50% BNB
    return Number(gaxBalance) * 2 / Number(totalSupply);
}