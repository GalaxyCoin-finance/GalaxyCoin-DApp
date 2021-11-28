import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from "use-wallet";
import {
    getFarms,
    getRealContract,
    getRealProvider,
    getRewardsPerBlock,
    getTotalAllocPoints,
    isActive,
    isPaused
} from "../utils/farm-core";
import {farmConfigs} from "../utils/farmConfigs";
import usePrices from "../hooks/usePrices";

const {farmAddress, rpcUrl} = require('../utils/config.js');
const {FarmAbi} = require('../utils/abi/farm-abi');

const FarmsContext = createContext({
    globalFarmStats: null,
    initGlobalStats: null,
    isInitGlobalStatsLoaded: false,
    farms: farmConfigs,
});

export const FarmsProvider = ({children}) => {
    const wallet = useWallet();
    const pricesProvider = usePrices();

    const [globalFarmStats, setGlobalFarmStats] = useState({
        totalAllocationPoints: null,
        rewardsPerBlock: null,
    });
    const [isInitGlobalStatsLoaded, setIsInitGlobalStatsLoaded] = useState(false);

    const [farms, setFarms] = useState(farmConfigs);

    useEffect(() => {
        if (!isInitGlobalStatsLoaded)
            setIsInitGlobalStatsLoaded(globalFarmStats.totalAllocationPoints && globalFarmStats.rewardsPerBlock);
    }, [globalFarmStats]);

    useEffect(() => {
        if (pricesProvider.loaded)
            initFarms();
    }, [pricesProvider.loaded]);

    const initFarms = async () => {
        setFarms(
            await getFarms(
                await getRealFarmContract(), wallet && wallet.status === "connected" ? wallet.ethereum : getRealProvider(rpcUrl), await initGlobalStats(), pricesProvider
            )
        )
    }

    const initGlobalStats = async (withUpdate) => {
        const realFarmContract = await getRealFarmContract();

        let rewardsPerBlock = globalFarmStats.rewardsPerBlock;
        if (!globalFarmStats.rewardsPerBlock || withUpdate) {
            rewardsPerBlock = await getRewardsPerBlock(realFarmContract);
            setGlobalFarmStats({...globalFarmStats, rewardsPerBlock});
        }

        let totalAllocationPoints = globalFarmStats.totalAllocationPoints;
        if (!globalFarmStats.totalAllocationPoints || withUpdate) {
            totalAllocationPoints = await getTotalAllocPoints(realFarmContract)
            setGlobalFarmStats({...globalFarmStats, totalAllocationPoints});
        }

        const active = await isActive(realFarmContract);
        const paused = await isPaused(realFarmContract);
        console.log(active);
        setGlobalFarmStats({
            ...globalFarmStats,
            totalAllocationPoints,
            rewardsPerBlock,
            active,
            paused
        });
        return {
            rewardsPerBlock,
            totalAllocationPoints
        }
    }

    useEffect(() => {
        initGlobalStats();
    }, []);


    const getRealFarmContract = async () => {
        return getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        )
    }

    return (
        <FarmsContext.Provider
            value={{
                globalFarmStats,
                isInitGlobalStatsLoaded,
                initGlobalStats,
                farms
            }}
        >
            {children}
        </FarmsContext.Provider>
    );
};

export const FarmsConsumer = FarmsContext.Consumer;

export default FarmsContext;
