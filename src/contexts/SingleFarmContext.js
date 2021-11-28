import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from "use-wallet";
import {getFarmDetails, getPending, getRealContract, getStaked, sleep} from "../utils/farm-core";
import {getAllowance, getBalance} from "../utils/erc20-core";
import {farmConfigs} from "../utils/farmConfigs";
import useFarms from "../hooks/useFarms";
import usePrices from "../hooks/usePrices";

const {farmAddress, rpcUrl, gaxAddress} = require('../utils/config.js');
const {FarmAbi} = require('../utils/abi/farm-abi');
const {erc20ABI} = require('../utils/abi/erc20-abi');

const SingleFarmContext = createContext({
    farm: null,
    userInfo: null,
    updateUserInfo: null,
    updateFarmInfo: null,
    waitForApproval: null,
    waitForDepositOrWithdrawal: null,
    waitForClaim: null
});

export const SingleFarmProvider = ({pid, children}) => {
    const wallet = useWallet();
    const pricesProvider = usePrices();

    const {
        globalFarmStats,
        isInitGlobalStatsLoaded,
    } = useFarms();

    const [farm, setFarm] = useState(farmConfigs[pid]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (isInitGlobalStatsLoaded)
            updateFarmInfo(pid);
    }, [isInitGlobalStatsLoaded]);

    useEffect(() => {
        updateUserInfo(true);
    }, [wallet.account]);

    const getRealFarmContract = async () => {
        return getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        )
    }


    const updateFarmInfo = async () => {
        const realFarmContract = await getRealFarmContract()

        const {rewardsPerBlock, totalAllocationPoints} = globalFarmStats;

        const farmRes = await getFarmDetails({
            farm: farmConfigs[pid],
            farmContract: realFarmContract,
            rewardsPerBlock,
            totalAllocPoints: totalAllocationPoints,
            ethereum: wallet.ethereum ? wallet.ethereum : rpcUrl,
            pricesProvider
        });
        setFarm(farmRes);
    }

    const updateUserInfo = async (foreground) => {
        if (foreground)
            setUserInfo(null);

        let userInfo = {
            pid: pid,
            staked: 0,
            balance: 0,
            pending: 0,
            allowance: 0,
            shareRatio: 0,
            weeklyRewards: 0
        };

        if (wallet.account) {
            const erc20 = await getRealContract(farm.stakedToken.address, wallet.ethereum, erc20ABI);
            const gaxContract = await getRealContract(gaxAddress, wallet.ethereum, erc20ABI);
            const farmContract = await getRealContract(farmAddress, wallet.ethereum, FarmAbi);

            const staked = await getStaked(farmContract, pid, wallet.account);

            const myShareRatio = Number(staked) / Number(farm.totalStaked);

            userInfo = {
                pid: pid,
                staked: staked,
                gaxBalance: await getBalance(gaxContract, wallet.account),
                balance: await getBalance(erc20, wallet.account),
                pending: await getPending(farmContract, pid, wallet.account),
                allowance: await getAllowance(erc20, wallet.account, farmAddress),
                shareRatio: myShareRatio,
                weeklyRewards: farm.totalRewardsPerWeek * myShareRatio,
            }
        }
        setUserInfo(userInfo);
    }

    const waitForClaim = async () => {
        const oldBalance = Number(userInfo.gaxBalance);
        const gaxContract = await getRealContract(gaxAddress, wallet.ethereum, erc20ABI);
        let currBalance = Number(await getBalance(gaxContract, wallet.account));
        do {
            currBalance = Number(await getBalance(gaxContract, wallet.account));
            await sleep(2300); // one block
        } while (currBalance === oldBalance);
    }


    const waitForDepositOrWithdrawal = async () => {
        const oldDeposit = Number(userInfo.staked);
        const farmContract = await getRealContract(farmAddress, wallet.ethereum, FarmAbi);
        let currStake = Number(await getStaked(farmContract, pid, wallet.account));
        do {
            currStake = Number(await getStaked(farmContract, pid, wallet.account));
            await sleep(2300); // one block
        } while (currStake === oldDeposit);
    }

    const waitForApproval = async () => {
        const erc20 = await getRealContract(farm.stakedToken.address, wallet.ethereum, erc20ABI);
        let allowance = 0;
        do {
            allowance = Number(await getAllowance(erc20, wallet.account, farmAddress));
            await sleep(2300); // one block
        } while (allowance === 0);
    }

    return (
        <SingleFarmContext.Provider
            value={{
                farm,
                userInfo,
                updateUserInfo,
                updateFarmInfo,
                waitForApproval,
                waitForDepositOrWithdrawal,
                waitForClaim
            }}
        >
            {children}
        </SingleFarmContext.Provider>
    );
}


export const SingleFarmConsumer = SingleFarmContext.Consumer;

export default SingleFarmContext;
