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
import LoadingScreen from "../../components/Root/LoadingScreen";

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

    const {farms, userInfo} = useFarms();

    const [farmInfo, setFarmInfo] = useState([]);
    const [initFarm, setInitFarm] = useState(false);
    const [initUserInfo, setInitUserInfo] = useState(false);

    useEffect(() => {
        if (farms.length > 0 && !initFarm) {
            let arr = [];
            for (let i = 0; i < farms.length; i++) {
                let infoToPush = {
                    pid: i,
                    name: farmConfigs[i].name,
                    composition: farmConfigs[i].composition,
                    apy: farms[i].apy,
                    stakedTokenAddress: farms[i].stakedToken.address
                };

                arr.push(infoToPush);
            }
            setFarmInfo(arr);
            setInitFarm(true);
        }
    }, [farms, initFarm]);

    useEffect(() => {
        // add user info to farms
        if (farmInfo.length > 0 && userInfo && userInfo.length > 0 && !initUserInfo) {
            let arr = farmInfo;

            for (let i = 0; i < userInfo.length; i++) {
                arr[userInfo[i].pid].balance = userInfo[i].balance;
                arr[userInfo[i].pid].stakedBalance = userInfo[i].staked;
                arr[userInfo[i].pid].pending = userInfo[i].pending;
            }

            setFarmInfo(arr);
            setInitUserInfo(true);
        }
    }, [farmInfo, userInfo, initUserInfo]);


    const handleToPharo = () => {
        window.open('https://www.pharo.tech/', '_blank');
    }

    const handleToVolume = () => {
        window.open('https://volume.quest/', '_blank');
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
                        Galaxy Farms
                    </Typography>

                    {
                        !initFarm &&
                            <LoadingScreen transparent/>
                    }

                    {
                        farmInfo.length > 0 &&
                        farmInfo.map((farm) => {
                            return (
                                <Farm
                                    expandable
                                    key={farm.name}
                                    // farm info
                                    farmName={farm.name}
                                    farmComposition={farm.composition}
                                    apy={farm.apy}
                                    // user info
                                    balance={farm.balance}
                                    stakedBalance={farm.stakedBalance}
                                    pendingBalance={farm.pending}
                                    initUserInfo={initUserInfo}
                                    stakedTokenAddress={farm.stakedTokenAddress}
                                    pid={farm.pid}
                                />
                            )
                        })
                    }
                </Grid>

                {/*Partnerships*/}
                <Grid container>
                    <Grid container item xs={12} justify={"center"} alignItems={"center"} direction={"column"}>
                        <Typography className={classes.partnershipsHeading}>
                            Strategic Partnerships
                        </Typography>
                        <Grid item xs={3} onClick={handleToVolume} style={{cursor: 'pointer'}}>
                            <img src={'./images/volume.png'} style={{width: '100%'}}/>
                        </Grid>
                        <Grid item xs={4} onClick={handleToPharo} style={{cursor: 'pointer'}}>
                            <img src={'./images/pharotech.png'} style={{width: '100%'}}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}

export default LandingPage;