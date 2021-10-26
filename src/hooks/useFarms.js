import {useContext} from 'react';
import FarmsContext from "../contexts/FarmsContext";

const useFarms = () => useContext(FarmsContext);

export default useFarms;