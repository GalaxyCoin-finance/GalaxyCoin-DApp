import React from 'react';
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
import Background from "./components/Root/Background";

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const appStyles = makeStyles((theme) => ({
    background: {
        position: "fixed",
        top: '60',
        zIndex: -10,
        filter: 'blur(3px)',
        height: '100%',
        width: "100%",
        backgroundColor: '#00000055'
    },
}));

const App = () => {
    const {settings} = useSettings();
    const classes = appStyles();

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
                            <div className={classes.background}>
                                <Background/>
                            </div>
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
