import Page from "../../components/Page";
import {makeStyles} from "@material-ui/core";

const landingStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    cardContainer: {
        paddingBottom: 80,
        paddingTop: 80,
        display: "flex",
        justifyContent: "center"
    },
    cardContent: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400
    },
}));

const LandingPage = () => {

    const classes = landingStyles();

    return (
        <Page
            classname={classes.root}
            title={'Home'}
        >
            Landing page here
        </Page>
    )
}

export default LandingPage;