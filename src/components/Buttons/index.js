import {Button, makeStyles} from "@material-ui/core";
import React from "react";

const styles = makeStyles((theme) => ({
    gradientButton: {
        background: `linear-gradient(90deg, rgb(255, 157, 219) 0%, rgb(38, 164, 254) 100%)`,
        transition: 'all 1s ease!important',

        "&:hover": {
            transition: 'all 1s ease!important',
            background: `linear-gradient(90deg, rgb(254, 201, 254) 0%, rgb(56, 233, 253) 100%)`,
        },
        "&:disabled": {
            background: `linear-gradient(90deg, #2a2a2a55 0%, #2a2a2a55 100%)`,
            color: 'gray!important'
        }
    },

}));

export const GalaxyGradientButton = ({children, ...rest}) => {
    const classes = styles();

    return (
        <Button {...rest} className={classes.gradientButton}>
            {children}
        </Button>
    )
}