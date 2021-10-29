import Page from "../../components/Root/Page";
import {Box, Button, Card, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import useFarms from "../../hooks/useFarms";
import LoadingScreen from "../../components/Root/LoadingScreen";

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

    const {farms, userInfo, initFarms, updateUserInfos} = useFarms();

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
                    <Grid item xs={10} md={8} className={classes.announcementBox}>
                        <Typography className={classes.announcementText}>
                            Welcome to Galaxy Coin App
                        </Typography>
                    </Grid>
                </Grid>

                {/*Wallet Balance*/}
                <Grid component={Card} container item xs={12} className={classes.card} justify={"center"}>
                    <Typography className={classes.heading}>
                        Galaxy Farms
                    </Typography>

                    {
                        !farms &&
                        <LoadingScreen transparent/>
                    }

                    {
                        farms && farms.length > 0 &&
                        farms.map((farm, index) => {
                            if (farm.allocationPoints > 0)
                                return (
                                    <Farm
                                        expandable
                                        key={farm.name}
                                        // farm info
                                        farm={farm}
                                        // user info
                                        userInfo={userInfo ? userInfo[index] : null}
                                    />
                                )
                        })
                    }
                </Grid>

                {/*Partnerships*/}
                <Box style={{marginBottom: 30}}>
                    <Box>
                        <Typography className={classes.partnershipsHeading}>
                            Strategic Partnerships
                        </Typography>
                    </Box>
                    <Box style={{display: "flex", margin: 8, justifyContent: "center"}}>
                        <img onClick={handleToVolume} src={'./images/volume.png'}
                             style={{maxWidth: 160, margin: '16px', cursor: "pointer"}}/>
                        <img onClick={handleToPharo} src={'./images/pharotech.png'}
                             style={{maxWidth: 160, margin: '16px', cursor: "pointer"}}/>
                    </Box>
                </Box>
            </Container>
        </Page>
    )
}

export default LandingPage;