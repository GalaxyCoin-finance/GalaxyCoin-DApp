import Page from "../../components/Root/Page";
import {Container, Grid, makeStyles, Typography} from "@material-ui/core";
import Farm from "../../components/Farms/Farm";
import farmConfigs from '../../utils/farmConfigs';
import {useState} from "react";

const styles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url('./images/background.jpg')`,
        backgroundRepeat: "round",
        backgroundSize: "cover",
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentBackground: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    card: {
        height: '100%',
        marginTop: '3em',
        paddingBottom: '4em',
        // background

        border: `2px solid ${theme.palette.specific.farmCardBorder}`,
        borderRadius: 100
    },
    heading: {
        marginTop: '1.5em',
        width: '100%',
        textAlign: "center",

        fontSize: 40,
        fontWeight: "bold",
        color: theme.palette.text.heading
    },
    farmWrapper: {
        height: '100%'
    }
}));

const LandingPage = () => {
    const classes = styles();

    const [containedTokens, setContainedTokens] = useState();



    return (
        <Page
            className={classes.root}
            title={'Home'}
        >
            <Container className={classes.contentBackground} maxWidth={"lg"}>
                <Grid container item xs={12} className={classes.card} justify={"center"}>
                    <Typography className={classes.heading}>
                        Wallet Balance
                    </Typography>

                    {
                        farmConfigs.farms.map((farm) => {
                            return (
                                <Farm
                                    farmName={farm.name}
                                    farmComposition={farm.composition}
                                />
                            )
                        })
                    }
                </Grid>
            </Container>
        </Page>
    )
}

export default LandingPage;