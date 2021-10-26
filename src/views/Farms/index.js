import Page from "../../components/Root/Page";
import {Card, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import useFarms from "../../hooks/useFarms";
import {useEffect, useState} from "react";
import farmConfigs from "../../utils/farmConfigs";

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
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
}));

const FarmsPage = () => {
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

    return (
        <Page
            className={classes.root}
            title={'Farms'}
        >
            <Container maxWidth={"lg"}>
                {/*Wallet Balance*/}
                <Grid component={Card} container item xs={12} className={classes.card} justify={"center"}>
                    <Typography className={classes.heading}>
                        Galaxy Farms
                    </Typography>

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
            </Container>
        </Page>
    )
}

export default FarmsPage;