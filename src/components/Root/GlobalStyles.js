import {createStyles, makeStyles} from '@material-ui/core';

// Add global styles here
const useStyles = makeStyles((theme) => createStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            height: '100%',
            width: '100%'
        },
        '#root': {
            height: '100%',
            width: '100%'
        },
    }
}));

const GlobalStyles = () => {
    useStyles();
    return null;
};

export default GlobalStyles;
