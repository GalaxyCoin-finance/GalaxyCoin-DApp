import Page from "../../components/Root/Page";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const styles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url('./images/background-old.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: "round",
        backgroundColor: 'black',
        backgroundAttachment: "fixed",
        height: '100vh',
        width: "100%",
    },
}));

const LandingPage = () => {
    const classes = styles();

    return (
        <Box
            className={classes.root}
        >
        </Box>
    )
}

export default LandingPage;