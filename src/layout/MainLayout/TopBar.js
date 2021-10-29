import {
    AppBar,
    Button,
    Divider, Drawer, Grid,
    Hidden, IconButton,
    makeStyles,
    Toolbar, useMediaQuery, useTheme
} from "@material-ui/core";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useWallet, ChainUnsupportedError} from "use-wallet";
import {useHistory, useLocation} from 'react-router-dom';
import {ROUTES_NAMES} from "../../constants";
import MenuIcon from "@material-ui/icons/Menu";
import {chainId} from '../../utils/config';
import {User} from "react-feather";
import {useSnackbar} from 'notistack';
import Logo from "../../components/Root/Logo";
import {galaxyAddress, gaxAddress, usdcAddress} from "../../utils/config";
import {getPriceOfGalaxy, getPriceOfGAX, getPriceOnBalancerForSinglePool} from "../../utils/price-utils";

const drawerWidth = 240;

const topBarStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        borderBottom: '1px solid #373737',
    },
    toolBar: {
        height: '100%',
        justifyContent: 'space-between'
    },
    tabs: {
        flexGrow: 1,
        marginLeft: '0.5em',
    },
    volText: {
        color: theme.palette.primary.main,
        fontSize: '1.1em',
    },
    wrongNetText: {
        color: "red",
        fontSize: '1em',
    },
    boldText: {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        textDecoration: "underline"
    },
    button: {
        padding: '0.5em',
        color: 'white',
        borderRadius: '20px',
        minWidth: 150,
        marginLeft: '10px',
    },
    emptyBar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        opacity: 0.9,
        backgroundColor: theme.palette.background.default
    },
    drawerListItem: {
        color: theme.palette.primary.main,
        paddingLeft: '2em'
    },
    userIcon: {
        color: theme.palette.primary.main
    },
    flewGrow: {
        flexGrow: 1
    },
    tickerWrapper: {
        '&:hover': {
            borderRadius: 8,
            cursor: 'pointer',
            backgroundColor: theme.palette.specific.farmBackgroundTo
        }
    },
    tickerHeading: {
        textAlign: "center",
        fontSize: 20,
        color: "white"
    },
    tickerPrice: {
        textAlign: "center",
        fontSize: 15,
        color: theme.palette.text.heading
    }
}));

const TopBar = ({className, ...rest}) => {
    const classes = topBarStyles();
    const wallet = useWallet();
    const history = useHistory();
    const location = useLocation();

    const {enqueueSnackbar} = useSnackbar();

    const [lastToast, setLastToast] = useState(0);
    const [wrongNet, setWrongNet] = useState(false);

    const theme = useTheme();
    const mdDown = useMediaQuery((theme.breakpoints.down('md')));

    const [galaxyPrice, setGalaxyPrice] = useState(undefined);
    const [gaxPrice, setGaxPrice] = useState(undefined);

    const GalaxyTabs = ({orientation}) => {
        return (
            <Tabs value={location.pathname} onChange={handleChange} className={classes.tabs} orientation={orientation}>
                <Tab className={classes.tabText} label="Home" value={ROUTES_NAMES.HOME}/>
            </Tabs>
        )
    }

    useEffect(() => {
        if (!galaxyPrice && chainId === 137) {
            getPriceOfGalaxy().then((res) => {
                setGalaxyPrice(res);
            });
        }
    }, [galaxyPrice]);

    useEffect(() => {
        if(!gaxPrice && chainId === 137) {
            getPriceOfGAX().then((res) => {
                setGaxPrice(res);
            })
        }
    }, [gaxPrice]);

    useEffect(() => {
        if (wallet.status === 'connected' && wallet.chainId !== chainId) {
            if (lastToast === 0 || performance.now() - lastToast > 5000) {
                enqueueSnackbar(`Unsupported network Galaxy Coin is only available on ${wallet.networkName} with chainId (${chainId})`, {variant: 'error'});
                setLastToast(performance.now());
            }
            setWrongNet(true);
        } else {
            setWrongNet(false);
        }
    }, [wallet]);


    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const handleChange = (event, newValue) => {
        history.push(newValue);
    }

    const handleToGLXY = () => {
        window.open(`https://polygon.balancer.fi/#/trade/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/${galaxyAddress}`, '_blank');
    }

    const handleToGAX = () => {
        window.open(`https://quickswap.exchange/#/swap?outputCurrency=${gaxAddress}`, '_blank');
    }


    const drawer = (
        <div style={{paddingTop: '0.5em',}}>
            <Logo withText={true}/>
            <Divider style={{marginTop: '1em'}}/>
            <GalaxyTabs orientation={"vertical"}/>
            <Divider/>
        </div>
    );

    return (
        <div>
            <AppBar
                position={"fixed"}
                color={"primary"}
                className={clsx(classes.root, className)}
                {...rest}
            >
                <Toolbar className={classes.toolBar}>
                    <Hidden mdUp className={classes.flewGrow}>
                        <IconButton onClick={() => {
                            setMobileOpen(true);
                        }}>
                            <MenuIcon className={classes.volText}/>
                        </IconButton>
                    </Hidden>

                    <Hidden smDown>

                        <Logo withText={!mdDown}/>
                        <GalaxyTabs/>
                    </Hidden>

                    {/*Prices*/}
                    <Ticker name={"Buy GLXY"} value={galaxyPrice} handleClick={handleToGLXY}/>
                    <Ticker name={"Buy GAX"} value={gaxPrice} handleClick={handleToGAX}/>

                    {
                        wrongNet &&
                        <Button variant={"outlined"} className={classes.button}>
                            <Typography variant={"body1"} className={classes.wrongNetText}>
                                Wrong Network
                            </Typography>
                        </Button>
                    }
                    <Button variant={"contained"} color={'secondary'} className={classes.button} onClick={() => {
                        if (wallet.status !== 'connected') {
                            wallet.connect();
                            setLastToast(0);
                        }
                    }}>
                        <User/>
                        <Typography variant={"subtitle1"} style={{fontSize: '0.9em'}}>
                            {
                                wallet.status === 'connected' && wallet.account
                                    ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(wallet.account.length - 4, wallet.account.length)}`
                                    : 'Connect Wallet'
                            }
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>

            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor={"left"}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </div>

    );
}

const Ticker = ({name, value, handleClick}) => {
    const classes = topBarStyles();

    return (
        <Grid container item xs={1} direction={"column"} alignContent={"center"} className={classes.tickerWrapper}
              onClick={handleClick}
        >
            <Typography className={classes.tickerHeading}>
                {name}
            </Typography>
            <Typography className={classes.tickerPrice}>
                ${value}
            </Typography>
        </Grid>
    )
}

export default TopBar;