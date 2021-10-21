import React, {useEffect} from 'react';
import {createBrowserHistory} from 'history';
import {create} from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import {jssPreset, StylesProvider, ThemeProvider} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import GlobalStyles from './components/root/GlobalStyles';
import useSettings from './hooks/useSettings';
import {createTheme} from './theme';
import routes, {renderRoutes} from './routes';
import {BrowserRouter} from 'react-router-dom';
import CookiesNotification from "./components/root/CookiesNotification";

const jss = create({plugins: [...jssPreset().plugins, rtl()]});
const history = createBrowserHistory();

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
              <BrowserRouter history={history}>
                <GlobalStyles/>
                <CookiesNotification/>
                {renderRoutes(routes)}
              </BrowserRouter>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </ThemeProvider>
  );
};
export default App;
