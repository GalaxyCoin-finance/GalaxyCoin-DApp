import {useContext} from 'react';
import SingleFarmContext from "../contexts/SingleFarmContext";

const useSingleFarm = () => useContext(SingleFarmContext);

export default useSingleFarm;