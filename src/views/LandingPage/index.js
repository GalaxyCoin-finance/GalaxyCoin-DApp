import Page from "../../components/Root/Page";
import {Card, Container, Grid, makeStyles, Typography} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import farmConfigs from '../../utils/farmConfigs';
import {useState} from "react";

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
        textAlign: "center"
    }
}));

const LandingPage = () => {
    const classes = styles();

    const [containedTokens, setContainedTokens] = useState('1,5,7');

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
                        farmConfigs.farms.map((farm) => {
                            if(containedTokens.includes(farm.address))
                                return (
                                    <Farm
                                        farmName={farm.name}
                                        farmComposition={farm.composition}
                                    />
                                )

                            return <></>
                        })
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