import Page from "../../components/Root/Page";
import {makeStyles} from "@material-ui/core";

const styles = makeStyles((theme) => ({
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

const FarmsPage = () => {
    const classes = styles();

    return (
        <Page
            classname={classes.root}
            title={'Home'}
        >
            Farms page here
        </Page>
    )
}

export default FarmsPage;