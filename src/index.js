import React from 'react';
import ReactDOM from 'react-dom';
import {SettingsProvider} from './contexts/SettingsContext';
import './index.css';
import App from "./App";
import {UseWalletProvider} from "use-wallet";
import {chainId} from './utils/config';


ReactDOM.render(
    <React.StrictMode>
        <SettingsProvider>
            <UseWalletProvider
                chainId={chainId}
                connectors={{}}
                pollBalanceInterval={2000}
                pollBlockNumberInterval={5000}
                >
                <App/>
            </UseWalletProvider>
        </SettingsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);