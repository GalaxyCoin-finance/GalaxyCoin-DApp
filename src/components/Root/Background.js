import Page from "../../components/Root/Page";
import {makeStyles} from "@material-ui/core";

const styles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url('./images/background.jpg')`,
        backgroundRepeat: "round",
        backgroundSize: "cover",
        height: '100%',
        width: "100%",
    },
}));

const LandingPage = () => {
    const classes = styles();

    return (
        <Page
            className={classes.root}
            title={'Home'}
        >
        </Page>
    )
}

export default LandingPage;