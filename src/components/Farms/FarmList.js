import {Grid, makeStyles} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import useFarms from "../../hooks/useFarms";
import {SingleFarmProvider} from "../../contexts/SingleFarmContext";
import React, {useEffect, useState} from "react";
import {Alert} from "@material-ui/lab";

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
        borderRadius: 16,
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

const FarmsList = ({value}) => {
    const classes = styles();
    const [farmObjects, setFarmObjects] = useState([]);
    const [sortFunction, setSortFunction] = useState('default');

    const {farmConfig, globalFarmStats, isInitGlobalStatsLoaded, farms} = useFarms();
    const [sorted, setsorted] = useState(farmConfig.farms);

    useEffect(() => {
        setsorted(
            [...farms]
        )
    }, [farms, farmConfig]);


    useEffect(() => {
        setFarmObjects(
            farmConfig.farms.map(farm => {
                return (<SingleFarmProvider pid={farm.pid} key={farm.name}>
                    <Farm
                        expandable
                    />
                </SingleFarmProvider>)
            })
        );

    }, [farmConfig, farms]);

    return (
        <>
            <Grid item xs={11} sm={11} md={10} lg={10} style={{marginBottom: 16}}>
                {isInitGlobalStatsLoaded && globalFarmStats.paused && <Alert severity={"warning"}>
                    Farms have been paused by admin while we work on a fix for a bug in the UI, All funds
                    are recure and all users will be able to withdraw one unpause, users also can use the
                    emergency withdraw but that will forfeit their rewards, we suggest waiting for the problem
                    to be fixed
                </Alert>}

            </Grid>
            <Grid item xs={11} sm={11} md={10} lg={10} style={{marginBottom: 16}}>
                {isInitGlobalStatsLoaded && !globalFarmStats.hasStarted && <Alert severity={"success"}>
                    Farms not started yet stay tuned!
                </Alert>}

                {isInitGlobalStatsLoaded && !globalFarmStats.active && globalFarmStats.hasStarted &&
                <Alert severity={"warning"}>
                    Farms have expired deposits have been disabled, Check the active farms tab to see new active farms!
                </Alert>}
            </Grid>
            {
                sorted.map((farm, index) => {
                    if (farm.active)
                        return farmObjects[farm.pid];
                })
            }
            {
                sorted.length === 0 &&
                <Grid item xs={11} sm={11} md={10} lg={10} style={{marginBottom: 16,}}>
                    {globalFarmStats.hasStarted && <Alert severity={"warning"}>
                        Nothing to show here
                    </Alert>}
                    <div style={{minHeight: '100vh'}}/>
                </Grid>

            }
        </>
    )
}

export default FarmsList;