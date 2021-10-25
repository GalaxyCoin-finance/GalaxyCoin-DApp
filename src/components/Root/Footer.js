import {
    Container,
    makeStyles,
    Divider,
} from "@material-ui/core";
import React from "react";
import ContactUsCard from "../ContactUs";

const aboutStyles = makeStyles((theme) => ({
    divider: {
        color: theme.palette.primary.main
    },
}));

const Footer = () => {
    const classes = aboutStyles();

    return (
        <Container
            style={{padding: 0}}
            maxWidth={false}
        >
            <Divider variant={"fullWidth"} className={classes.divider}/>
            <ContactUsCard/>
        </Container>
    );
}

export default Footer;