import React from 'react';
import ReactDOM from 'react-dom';
import {SettingsProvider} from './contexts/SettingsContext';
import './index.css';
import App from "./App";


ReactDOM.render(
    <React.StrictMode>
        <SettingsProvider>
            <App/>
        </SettingsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);