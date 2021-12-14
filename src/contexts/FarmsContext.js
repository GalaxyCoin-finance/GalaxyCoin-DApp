import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from "use-wallet";
import {
    getFarms,
    getRealContract,
    getRealProvider,
    getRewardsPerBlock,
    getTotalAllocPoints, hasFarmStarted,
    isActive,
    isPaused
} from "../utils/farm-core";
import usePrices from "../hooks/usePrices";

const {rpcUrl} = require('../utils/config.js');
const {FarmAbi} = require('../utils/abi/farm-abi');

const FarmsContext = createContext({
    farmConfig: null,
    globalFarmStats: null,
    initGlobalStats: null,
    isInitGlobalStatsLoaded: false,
    farms: [],
});

export const FarmsProvider = ({farmConfig, children}) => {
    const wallet = useWallet();
    const pricesProvider = usePrices();

    const [globalFarmStats, setGlobalFarmStats] = useState({
        totalAllocationPoints: null,
        rewardsPerBlock: null,
    });
    const [isInitGlobalStatsLoaded, setIsInitGlobalStatsLoaded] = useState(false);

    const [farms, setFarms] = useState(farmConfig.farms);

    useEffect(() => {
        setFarms(farmConfig.farms);
        setIsInitGlobalStatsLoaded(false);
        setGlobalFarmStats({
            totalAllocationPoints: null,
            rewardsPerBlock: null,
        })
    }, [farmConfig])

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
                await getRealFarmContract(),
                wallet && wallet.status === "connected" ? wallet.ethereum : getRealProvider(rpcUrl),
                await initGlobalStats(),
                pricesProvider,
                farmConfig
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
        const hasStarted = await hasFarmStarted(realFarmContract);
        setGlobalFarmStats({
            ...globalFarmStats,
            totalAllocationPoints,
            rewardsPerBlock,
            active,
            paused,
            hasStarted
        });
        return {
            rewardsPerBlock,
            totalAllocationPoints
        }
    }

    useEffect(() => {
        initGlobalStats();
    }, [farmConfig]);


    const getRealFarmContract = async () => {
        return getRealContract(
            farmConfig.address,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        )
    }

    return (
        <FarmsContext.Provider
            value={{
                farmConfig,
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
