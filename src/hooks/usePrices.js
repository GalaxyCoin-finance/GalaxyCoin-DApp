import {useContext} from 'react';
import PricesContext from "../contexts/PricesContext";

const usePrices = () => useContext(PricesContext);

export default usePrices;