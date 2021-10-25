import Page from "../../components/Root/Page";
import {Button, Container, Grid, IconButton, makeStyles, Typography} from "@material-ui/core";
import {useState} from "react";

const styles = makeStyles((theme) => ({
    farmBackground: {
        // backgroundColor: theme.palette.specific.farmBackground,
        backgroundImage: `linear-gradient(to bottom right, ${theme.palette.specific.farmBackground}, ${theme.palette.specific.farmBackgroundTo})`,
        borderRadius: 12,
        marginBottom: '1em',
        //
        borderBottom: `4px solid ${theme.palette.secondary.dark}`,
        borderRight: `2px solid ${theme.palette.secondary.dark}`
    },
    farmName: {
        textAlign: "center",
        width: '100%',
        marginTop: '0.5em',
        color: theme.palette.text.subHeading,
        fontWeight: "bold"
    },
    farmComposition: {
        textAlign: "center",
        width: '100%',
        marginTop: '0.5em',
        color: theme.palette.text.primary,
        fontSize: 12
    },
    button: {
        marginLeft: '3em',
        borderRadius: 20,
        height: '100%',
        backgroundColor: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: "white"
        }
    },
    addIcon: {
        backgroundImage: `url('./images/addButton.svg')`,
        backgroundSize: "cover"
    },
    metamaskIcon: {
        backgroundImage: `url('./images/metamask.svg')`,
        backgroundSize: "cover"
    },
    farmInfoHeading: {
        fontSize: 20,
        color: theme.palette.text.heading,
        width: '100%',
        textAlign: "center",
    },
    farmInfoText: {
        fontSize: 18,
        color: theme.palette.text.primary,
        width: '100%',
        textAlign: "center",
        marginBottom: '0.5em'
    }
}));

const Farm = ({farmName, farmComposition, expandable}) => {
    const classes = styles();

    const [farmAPY, setFarmAPY] = useState(0);
    const [stakedBalance, setStakedBalance] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);

    return (
        <Grid container item xs={8} className={classes.farmBackground}>
            <Grid container item xs={12} justify={"center"} alignContent={"center"} direction={"column"}>
                <Typography className={classes.farmName} variant={"h2"}>
                    {farmName}
                </Typography>

                <Typography className={classes.farmComposition}>
                    {farmComposition}
                </Typography>
            </Grid>

            <Grid container justify={"space-between"} style={{marginTop: '1em'}}>
                {/*LP Wallet Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        APY
                    </Typography>
                    <Typography className={classes.farmInfoText}>
                        {farmAPY}%
                    </Typography>
                </Grid>

                {/*Staked Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Staked Balance
                    </Typography>
                    <Typography className={classes.farmInfoText}>
                        {stakedBalance.toFixed(4)}
                    </Typography>
                </Grid>

                {/*Claimable Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Pending
                    </Typography>
                    <Typography className={classes.farmInfoText}>
                        {pendingBalance.toFixed(4)} GAX
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Farm;