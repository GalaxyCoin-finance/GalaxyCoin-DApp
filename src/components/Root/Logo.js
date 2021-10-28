import React, {useEffect} from 'react';
import {Box, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {ROUTES_NAMES} from "../../constants";

const styles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.5em',
            cursor: 'Pointer',
        },
    })
);

const Logo = ({withText}) => {
    const history = useHistory();
    const classes = styles();

    return (
        <Box className={classes.root} onClick={() => {
            history.push(ROUTES_NAMES.HOME)
        }}>
            {
                withText &&
                <img
                    alt="Logo"
                    height={62}
                    src={"/images/logo.png"}
                />
            }

            {
                !withText &&
                <img
                    alt="Logo"
                    height={62}
                    src={"/images/logo-topbar-smdown.png"}
                />
            }
        </Box>
    )
};

export default Logo;


