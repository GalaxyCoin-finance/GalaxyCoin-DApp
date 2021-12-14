import _ from 'lodash';
import {colors, unstable_createMuiStrictModeTheme as createMuiTheme, responsiveFontSizes} from '@material-ui/core';
import {THEMES} from '../constants';
import {softShadows} from './shadows';
import typography from './typography';

const baseOptions = {
    direction: 'ltr',
    typography,
    overrides: {
        MuiLinearProgress: {
            root: {
                borderRadius: 3,
                overflow: 'hidden'
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: 32
            }
        },
        MuiChip: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.075)'
            }
        }
    }
};

const themesOptions = [
    {
        name: THEMES.DARK,
        overrides: {
            MuiInputBase: {
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: colors.blueGrey[600]
                    }
                }
            },
        },
        palette: {
            type: 'dark',
            action: {
                active: colors.blueGrey[600]
            },
            background: {
                default: "#121648",
            },
            primary: {
                main: "rgb(38, 164, 254)"
            },
            secondary: {
                main: 'rgb(38, 164, 254)'
            },
            tertiary: {
                main: "#80102a"
            },
            specific: {
                farmBackground: "#122454",
                farmBackgroundTo: "#21266d",
                farmCardBorder: "rgb(38, 164, 254)"
            },
            text: {
                heading: "rgb(38, 164, 254)",
                subHeading: "#E3066B",
                subSubHeading: "#d03f46",
                primary: "#d9d9d9",
            },
        },
        shadows: softShadows,
        typography: {
            fontFamily: [
                'Rubik',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    }
];

export const createTheme = (config = {}) => {
    let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`));
        [themeOptions] = themesOptions;
    }

    let theme = createMuiTheme(
        _.merge(
            {},
            baseOptions,
            themeOptions,
            {direction: config.direction}
        )
    );

    if (config.responsiveFontSizes) {
        theme = responsiveFontSizes(theme);
    }

    return theme;
};

export const theme = () => {
    return themesOptions;
};
