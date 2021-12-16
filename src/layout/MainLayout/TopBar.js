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
import {useWallet} from "use-wallet";
import {useHistory, useLocation} from 'react-router-dom';
import {ROUTES_NAMES} from "../../constants";
import MenuIcon from "@material-ui/icons/Menu";
import {chainId} from '../../utils/config';
import {User} from "react-feather";
import {useSnackbar} from 'notistack';
import Logo from "../../components/Root/Logo";
import {galaxyAddress, gaxAddress} from "../../utils/config";
import {getPriceOfGalaxy, getPriceOfGAX} from "../../utils/price-utils";
import Box from "@material-ui/core/Box";
import {GalaxyGradientButton} from "../../components/Buttons";

const drawerWidth = 240;

const topBarStyles = makeStyles((theme) => ({
    root: {
        //backgroundColor: theme.palette.background.default,
        background: 'linear-gradient(#0e1156,#03030f)',
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
    },
    heading: {
        width: '100%',
        textAlign: "center",
        fontSize: 32,
        fontWeight: "bold",
        color: theme.palette.text.heading
    },
    navBorder: {
        backgroundColor: 'red',
        width: '100%',
        height: '2px',
        backgroundImage: 'url(/images/menu-line.png)',
        position: 'absolute',
        bottom: 0,
        left: 0,
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
        if (!gaxPrice && chainId === 137) {
            getPriceOfGAX().then((res) => {
                setGaxPrice(res);
            })
        }
    }, [gaxPrice]);

    useEffect(() => {
        if (wallet.status === 'connected' && wallet.chainId !== chainId) {
            if (lastToast === 0 || performance.now() - lastToast > 5000) {
                enqueueSnackbar(`Unsupported network Galaxy Coin is only available on polygon`, {variant: 'error'});
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
            <Divider style={{marginTop: '1em'}}/>
            <Ticker fullwidth name={"Buy GLXY"} value={galaxyPrice} handleClick={handleToGLXY}/>
            <Divider/>
            <Ticker fullwidth name={"Buy GAX"} value={gaxPrice} handleClick={handleToGAX}/>
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

                        <Logo withText={!mdDown} style={{maxHeight: 36}}/>
                        {/*<GalaxyTabs/>*/}
                        <Box style={{flex: 1}}>

                        </Box>
                        {/*Prices*/}
                        <Ticker name={"Buy GLXY"} value={galaxyPrice} handleClick={handleToGLXY}/>
                        <Ticker name={"Buy GAX"} value={gaxPrice} handleClick={handleToGAX}/>
                        <Box style={{minWidth: 8}}/>
                    </Hidden>


                    {
                        wrongNet &&
                        <Button className={classes.button}>
                            <Typography variant={"body1"} className={classes.wrongNetText}>
                                Wrong Network
                            </Typography>
                        </Button>
                    }
                    <GalaxyGradientButton variant={"contained"} color={'secondary'} className={classes.button}
                                          onClick={() => {
                                              if (wallet.status !== 'connected') {
                                                  try{
                                                  wallet.connect().catch(error => {

                                                  });
                                                } catch(e){} 
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
                    </GalaxyGradientButton>
                </Toolbar>
                <div className={classes.navBorder}></div>
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

const Ticker = ({name, value, handleClick, fullwidth}) => {
    const classes = topBarStyles();

    return (
        <Grid container item xs={fullwidth ? 12 : 1} direction={"column"} alignContent={"center"}
              className={classes.tickerWrapper}
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