import React, {createContext, useEffect, useState} from 'react';
import {getLPPrice} from "../utils/farmConfigs";
import {getPriceOfGalaxy, getPriceOfGAX} from "../utils/price-utils";

const PricesContext = createContext({
    lpPrices: null,
    gaxPrice: null,
    glxyPrice: null,
    getGaxPrice: null,
    getGLXYPrice: null,
    getLPPricesPrice: null,
    loaded: false
});

export const PricesProvider = ({farmConfig, children}) => {

    const [lpPrices, setLpPrices] = useState(farmConfig.farms.map(farm => null));
    const [gaxPrice, setGaxPricce] = useState(null);
    const [glxyPrice, setGlxyPrice] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
    }, [farmConfig]);

    useEffect(() => {
        if (!loaded) {
            let hasLoadd = glxyPrice && gaxPrice;
            lpPrices.forEach(price => hasLoadd = hasLoadd && price);
            setLoaded(hasLoadd);
        }
    }, [lpPrices, gaxPrice, glxyPrice, farmConfig, loaded]);

    const getGaxPrice = async (forceUpdate) => {
        let gax = gaxPrice;
        if (!gax || forceUpdate) {
            gax = await getPriceOfGAX();
            setGaxPricce(gax)
        }
        return gax;
    }

    const getGLXYPrice = async (forceUpdate) => {
        let glxy = glxyPrice;
        if (!glxy || forceUpdate) {
            glxy = await getPriceOfGalaxy();
            setGlxyPrice(glxy);
        }
        return glxy;
    }

    const getLPPricesPrice = async (forceUpdate) => {
        const lpPrx = await Promise.all(
            farmConfig.farms.map(async farm => {
                if (lpPrices[farm.pid] && !forceUpdate) return lpPrices[farm.pid];
                return getLPPrice(
                    farm.pid,
                    farm,
                    farm.weightedToken === 'GAX' ? await getGaxPrice() : await getGLXYPrice(),
                    farmConfig
                )
            })
        )
        setLpPrices(lpPrx);
        return lpPrx;
    }

    useEffect(() => {
        getGaxPrice();
        getGLXYPrice();
        getLPPricesPrice();
    }, [farmConfig]);

    return (
        <PricesContext.Provider
            value={{
                lpPrices,
                gaxPrice,
                glxyPrice,
                loaded,
                getGaxPrice,
                getGLXYPrice,
                getLPPricesPrice
            }}
        >
            {children}
        </PricesContext.Provider>
    );
}

export const PricesConsumer = PricesContext.Consumer;

export default PricesContext;
