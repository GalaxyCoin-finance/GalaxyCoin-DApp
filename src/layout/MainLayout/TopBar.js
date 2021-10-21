import {AppBar, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import useSettings from "../../hooks/useSettings";
import {Box, Moon, Sun} from "react-feather";
import {THEMES} from "../../constants";
import clsx from "clsx";
import {Link as RouterLink} from "react-router-dom";
import Logo from "../../components/Logo";

const topBarStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary
    },
    toolBar: {
        height: 72
    },
    logo: {
        marginRight: theme.spacing(2)
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "flex-end"
    }
}));

const TopBar = ({className, ...rest}) => {
    const {settings, saveSettings} = useSettings();
    const classes = topBarStyles();

    const handleThemeSwitch = () => {
        saveSettings({theme: settings.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT})
    };

    return (
        <AppBar
            color={"primary"}
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Toolbar className={classes.toolBar}>
                <RouterLink to={"/"}>
                    <Logo className={classes.logo}/>
                </RouterLink>
                <Typography variant={"subtitle1"}>
                    INCOG
                </Typography>
                <Box flexGrow={1} className={classes.buttonsContainer}>
                    <IconButton style={{color: "white"}} onClick={handleThemeSwitch}>
                        {settings.theme === THEMES.LIGHT ? <Moon/> : <Sun/>}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;