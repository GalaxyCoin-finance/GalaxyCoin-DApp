import React, {useEffect} from 'react';
import {create} from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import {jssPreset, makeStyles, StylesProvider, ThemeProvider} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import GlobalStyles from './components/Root/GlobalStyles';
import useSettings from './hooks/useSettings';
import {createTheme} from './theme';
import routes, {renderRoutes} from './routes';
import {HashRouter} from 'react-router-dom';
import MainLayout from "./layout/MainLayout";

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const App = () => {
    const {settings} = useSettings();

    const theme = createTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        theme: settings.theme
    });

    return (
        <ThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <SnackbarProvider
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        dense
                        maxSnack={3}
                    >
                        <HashRouter>
                            <GlobalStyles/>
                            <MainLayout>
                                {renderRoutes(routes)}
                            </MainLayout>
                        </HashRouter>
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ThemeProvider>
    );
};
export default App;
