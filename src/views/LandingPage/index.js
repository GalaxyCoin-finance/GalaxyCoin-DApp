import Page from "../../components/Root/Page";
import {Box, Card, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import React, {useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {PricesProvider} from "../../contexts/PricesContext";
import {activeFarmConfig, disabledFarmConfig} from "../../utils/farmConfigs";
import {FarmsProvider} from "../../contexts/FarmsContext";
import FarmsList from "../../components/Farms/FarmList";

const styles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff11'
    },
    contentBackground: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    announcementBox: {
        // spacing
        marginTop: '1em',
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
        flexDirection: "column",
    },
    announcementText: {
        width: '100%',
        textAlign: "center",
        color: theme.palette.text.heading,
        fontSize: 22
    },
    activeTabs: {
        marginTop: '4em',
        marginBottom: '1em',
    },
    heading: {
        width: '100%',
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold",
        color: theme.palette.text.heading
    },
    partnershipsHeading: {
        fontSize: 40,
        color: theme.palette.text.heading,
        width: '100%',
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'transparent'
    }
}));

const FarmsView = () => {
    const classes = styles();

    const handleToPharo = () => {
        window.open('https://www.pharo.tech/', '_blank');
    }

    const handleToVolume = () => {
        window.open('https://volume.quest/', '_blank');
    }

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <Page
            className={classes.root}
            title={'Farms'}
        >
            <Container className={classes.contentBackground} maxWidth={"lg"}>

                <Grid container justify={"center"} style={{marginBottom: '2em'}}>
                    <Grid item xs={10} md={8} className={classes.announcementBox}>
                        <Typography className={classes.heading}>
                            Galaxy Farms
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justify={"center"} classes={classes.activeTabs}>
                    <Box
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            background: "linear-gradient(to top, #0A0A0AB2, #000000B2)",
                            borderRadius: 30,
                            paddingRight: 25,
                            paddingLeft: 25,
                            textAlign: 'center',
                            color: 'white',
                        }}>
                        <Tabs value={value} onChange={handleChange} centered indicatorColor={'primary'}
                              style={{display: 'flex', width: '100%'}}
                        >
                            <Tab label="Active Farms"/>
                            <Tab label="Disabled Farms"/>
                        </Tabs>

                    </Box>
                </Grid>

                {/*Wallet Balance*/}
                <Grid component={Card} container item xs={12} className={classes.card} justify={"center"}
                      style={{display: value === 0 ? 'flex' : 'none'}}>

                    <PricesProvider farmConfig={activeFarmConfig}>
                        <FarmsProvider farmConfig={activeFarmConfig}>
                            <FarmsList/>
                        </FarmsProvider>
                    </PricesProvider>


                </Grid>

                <Grid component={Card} container item xs={12} className={classes.card} justify={"center"}
                      style={{display: value === 0 ? 'none' : 'flex'}}>


                    <PricesProvider farmConfig={disabledFarmConfig}>
                        <FarmsProvider farmConfig={disabledFarmConfig}>
                            <FarmsList/>
                        </FarmsProvider>
                    </PricesProvider>
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
                             style={{maxWidth: 160, margin: '16px', cursor: "pointer"}} alt={"Volume NFTs"}/>
                        <img onClick={handleToPharo} src={'./images/pharotech.png'}
                             style={{maxWidth: 160, margin: '16px', cursor: "pointer"}} alt={"pharotech"}/>
                    </Box>
                </Box>
            </Container>
        </Page>
    )
}

export default FarmsView;