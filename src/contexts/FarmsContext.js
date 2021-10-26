import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from "use-wallet";
import {getFarms, getPending, getRealContract, getStaked} from "../utils/farm-core";
import {getAllowance, getBalance} from "../utils/erc20-core";

const {farmAddress, rpcUrl} = require('../utils/config.js');
const {FarmAbi} = require('../utils/abi/farm-abi');
const {erc20ABI} = require('../utils/abi/erc20-abi');
const FarmsContext = createContext({
    farms: null,
    userInfo: null,
    initFarms: null,
    updateUserInfos: null,
});

export const FarmsProvider = ({children}) => {
    const wallet = useWallet();
    const [farms, setFarms] = useState([]);
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        initFarms();
    }, [wallet.status])

    useEffect(() => {
        updateUserInfos();
    }, [farms]);

    useEffect(() => {
        setUserInfo(null);
    }, [wallet.account]);

    const updateUserInfos = () => {
        setUserInfo(null);
        if (wallet.status === "connected" && farms) {
            Promise.all(farms.map(farmInfo => {
                return updateUserInfoForFarm(farmInfo);
            })).then(arr => setUserInfo(arr));
        }
    }

    const initFarms = async () => {

        const realFarmContract = await getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        )


        setFarms(
            await getFarms(
                realFarmContract,
                wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl
            )
        )
    }

    const updateUserInfoForFarm = async (farmArg) => {
        if (!wallet || !wallet.account) return {
            staked: 0,
            balance: 0
        }
        const erc20 = await getRealContract(farmArg.stakedToken.address, wallet.ethereum, erc20ABI);
        const farmContract = await getRealContract(farmAddress, wallet.ethereum, FarmAbi);

        const staked = await getStaked(farmContract, farmArg.pid, wallet.account);

        const myShareRatio = Number(staked) / Number(farmArg.totalStaked);
        return {
            pid: farmArg.pid,
            staked: staked,
            balance: await getBalance(erc20, wallet.account),
            pending: await getPending(farmContract, farmArg.pid, wallet.account),
            allowance: await getAllowance(erc20, wallet.account, farmAddress),
            shareRatio: myShareRatio,
            weeklyRewards: farmArg.totalRewardsPerWeek * myShareRatio
        }
    }

    return (
        <FarmsContext.Provider
            value={{
                farms,
                userInfo,
                initFarms,
                updateUserInfos
            }}
        >
            {children}
        </FarmsContext.Provider>
    );
};

export const FarmsConsumer = FarmsContext.Consumer;

export default FarmsContext;
