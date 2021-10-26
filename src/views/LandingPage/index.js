import Page from "../../components/Root/Page";
import {Button, Card, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import {useEffect, useState} from "react";
import useFarms from "../../hooks/useFarms";
import {formatLongNumber} from "../../utils/general-utils";
import {Skeleton} from "@material-ui/lab";
import {useHistory} from "react-router-dom";
import {ROUTES_NAMES} from "../../constants";
import farmConfigs from "../../utils/farmConfigs";
import {useWallet} from "use-wallet";

const Web3 = require('web3');
const {fromWei} = Web3.utils;

const styles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    contentBackground: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    announcementBox: {
        // spacing
        marginTop: '3em',
        marginBottom: '1em',
        // background
        backgroundImage: `url('./images/announcementsBorder.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // display
        height: '100%',
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column"
    },
    announcementText: {
        width: '100%',
        textAlign: "center",
        color: theme.palette.text.heading,
        fontSize: 22
    },
    card: {
        height: '100%',
        marginTop: '5em',
        marginBottom: '3em',
        paddingTop: '1em',
        paddingBottom: '2em',
        // background
        border: `2px solid ${theme.palette.specific.farmCardBorder}`,
        borderRadius: 100,
        backgroundColor: "transparent"
    },
    heading: {
        width: '100%',
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold",
        color: theme.palette.text.heading
    },
    farmWrapper: {
        height: '100%'
    },
    partnershipsHeading: {
        fontSize: 40,
        color: theme.palette.text.heading,
        width: '100%',
        textAlign: 'center'
    },
    addLiquidityText: {
        fontSize: 30,
        textAlign: 'center',
        width: '100%'
    },
    addLiquidityButton: {
        fontSize: 30,
        borderRadius: 20,
        marginTop: '0.5em'
    }
}));

const LandingPage = () => {
    const classes = styles();
    const history = useHistory();
    const wallet = useWallet();

    const {farms, userInfo} = useFarms();

    const [userFarms, setUserFarms] = useState([]);
    const [highestAPY, setHighestAPY] = useState(0);
    const [initApy, setInitApy] = useState(false);

    useEffect(() => {
        if(farms.length > 0 && !initApy){
            let dumHighestAPY = 0;
            for(let i = 0; i < farms.length; i++) {
                if(farms[i].apy > dumHighestAPY) {
                    dumHighestAPY = farms[i].apy
                }
            }
            setHighestAPY(formatLongNumber(dumHighestAPY, 2));
            setInitApy(true);
        }
    }, [farms, initApy]);

    useEffect(() => {
        if (farms.length > 0 && userInfo && userInfo.length > 0) {
            let arr = [];
            for(let i = 0; i < userInfo.length; i++) {
                if(Number(userInfo[i].staked) !== 0){
                    arr.push({
                        pid: i,
                        name: farmConfigs[i].name,
                        composition: farmConfigs[i].composition,
                        apy: farms[i].apy,
                        stakedBalance: userInfo[i].staked,
                        pending: userInfo[i].pending
                    });
                }
            }

            setUserFarms(arr);
        }
    }, [farms, userInfo]);

    const handleGoToFarm = () => {
        history.push(ROUTES_NAMES.FARMS);
    }

    const handleConnect = () => {
        wallet.connect();
    }

    return (
        <Page
            className={classes.root}
            title={'Home'}
        >
            <Container className={classes.contentBackground} maxWidth={"lg"}>

                {/*Announcements*/}
                <Grid container justify={"center"}>
                    <Grid item xs={8} className={classes.announcementBox}>
                        <Typography className={classes.announcementText} >
                            Galaxy Coin launch scheduled for 27 October 2021!
                        </Typography>
                    </Grid>
                </Grid>

                {/*Wallet Balance*/}
                <Grid component={Card} container item xs={12} className={classes.card} justify={"center"}>
                    <Typography className={classes.heading}>
                        Wallet Balance
                    </Typography>

                    {
                        userFarms.map((farm) => {
                            return (
                                <Farm
                                    key={farm.name}
                                    farmName={farm.name}
                                    farmComposition={farm.composition}
                                    stakedBalance={farm.stakedBalance}
                                    apy={farm.apy}
                                    pendingBalance={farm.pending}
                                />
                            )
                        })
                    }

                    {
                        wallet.status === 'connected' && userFarms.length === 0 &&
                            <Grid container direction={"column"} alignItems={"center"}>
                                <Typography className={classes.addLiquidityText}>
                                    Add liquidity into pools now! <br/>
                                    Earn up to
                                </Typography>

                                <Grid item xs={2} className={classes.addLiquidityText}>
                                    <b>{initApy && userFarms.length === 0 ? highestAPY : <Skeleton style={{width: 'auto'}} animation={"wave"} />}</b>% APY
                                </Grid>

                                <Button className={classes.addLiquidityButton} color={"secondary"} variant={"contained"}
                                    onClick={handleGoToFarm}
                                >
                                    Add Liquidity Now!
                                </Button>
                            </Grid>
                    }

                    {
                        wallet.status !== 'connected' &&
                        <Button className={classes.addLiquidityButton} color={"secondary"} variant={"contained"}
                                onClick={handleConnect}
                        >
                            Connect wallet
                        </Button>
                    }
                </Grid>

                {/*Partnerships*/}
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <img src={'./images/GLXY-crest.png'}/>
                    </Grid>

                    <Grid container item xs={12} md={6} justify={"center"}>
                        <Typography className={classes.partnershipsHeading}>
                            Strategic Partnerships
                        </Typography>
                        <Grid item xs={8}>
                            <img src={'./images/pharotech.png'} style={{width: '100%'}}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}

export default LandingPage;