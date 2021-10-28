import {Button, CircularProgress, Collapse, Grid, makeStyles, TextField, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import {formatLongNumber} from "../../utils/general-utils";
import {Skeleton} from "@material-ui/lab";
import {useWallet} from "use-wallet";
import {approve} from "../../utils/erc20-core";
import {deposit, getRealContract, harvest, withdraw} from "../../utils/farm-core";
import {farmAddress, rpcUrl, explorer} from "../../utils/config.js";
import {useSnackbar} from "notistack";
import {erc20ABI} from "../../utils/abi/erc20-abi";
import {FarmAbi} from "../../utils/abi/farm-abi";

const Web3 = require('web3');
const {fromWei, toWei} = Web3.utils;

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
    },
    farmImage: {
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        display: 'inline-block'
    },
    farmFunctionHeader: {
        [theme.breakpoints.down('md')]: {
            fontSize: 12,
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 16,
        },
        fontSize: 16,
        color: theme.palette.text.heading,
    },
    farmFunctionButton: {
        marginTop: '0.5em'
    }
}));


export const ViewOnExplorerButton = ({txHash}) => {
    return (
        <Button onClick={() => window.open(explorer + 'tx/' + txHash, '_blank')}>
            View Transaction
        </Button>
    )
}


const Farm = ({
                  farmName, farmComposition, apy, stakedTokenAddress, pid, // farm info
                  expandable,
                  stakedBalance, pendingBalance, balance, approvedAmount, // user info
                  initUserInfo
              }) => {
    const classes = styles();
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();

    const [formattedAPY, setFormattedAPY] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let dum = formatLongNumber(apy, 2);
        setFormattedAPY(dum);
    }, []);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(false);

    useEffect(() => {
        if(wallet.status === 'connected' && !initUserInfo) {
            setFetchingUserInfo(true);
        }

        if(initUserInfo)
            setFetchingUserInfo(false);
    }, [initUserInfo, wallet]);

    const toggleCollapse = () => {
        setOpen(!open);
    }

    // Stake
    const handleStake = async (amount, busyHandler) => {
        busyHandler(true);
        const realFarmContract = await getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        );

        deposit(realFarmContract, pid, toWei(amount.toString()), wallet).then((txHash) => {
            enqueueSnackbar(`Deposit successful`, {
                variant: "success",
                autoHideDuration: 3000,
                action: <ViewOnExplorerButton txHash={txHash}/>
            });

            busyHandler(false);
        }).catch((err) => {
            busyHandler(false);
        });
    }

    const handleUnstaking = async (amount, busyHandler) => {
        busyHandler(true);
        const realFarmContract = await getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        );

        withdraw(realFarmContract, pid, toWei(amount.toString()), wallet).then((txHash) => {
            enqueueSnackbar(`Withdrawal successful`, {
                variant: "success",
                autoHideDuration: 3000,
                action: <ViewOnExplorerButton txHash={txHash}/>
            });
            busyHandler(false);
        }).catch((err) => {
            busyHandler(false);
        });
    }

    const handleHarvest = async (busyHandler) => {
        busyHandler(true);
        const realFarmContract = await getRealContract(
            farmAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            FarmAbi
        );

        harvest(realFarmContract, pid, wallet).then((txHash) => {
            enqueueSnackbar(`Harvest successful`, {
                variant: "success",
                autoHideDuration: 3000,
                action: <ViewOnExplorerButton txHash={txHash}/>
            });
            busyHandler(false);
        }).catch((err) => {
            busyHandler(false);
        });
    }

    return (
        <Grid container item xs={8} className={classes.farmBackground}>
            <Grid container item xs={12} justify={"center"} alignContent={"center"} direction={"column"}
                  style={{cursor: expandable ? 'pointer' : "default"}} onClick={toggleCollapse}>
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
                        {apy ? formattedAPY : 0}%
                    </Typography>

                </Grid>

                {/*Staked Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Staked Balance
                    </Typography>
                    {
                        !fetchingUserInfo &&
                        <Typography className={classes.farmInfoText}>
                            {stakedBalance ? `${Number(fromWei(stakedBalance.toString())).toFixed(4)} ${farmName}` : 0}
                        </Typography>
                    }

                    {
                        fetchingUserInfo &&
                        <Skeleton animation={"wave"}/>
                    }

                </Grid>

                {/*Claimable Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Pending
                    </Typography>
                    {
                        !fetchingUserInfo &&
                        <Typography className={classes.farmInfoText}>
                            {pendingBalance ? Number(fromWei(pendingBalance.toString())).toFixed(4) : 0} GAX
                        </Typography>
                    }

                    {
                        fetchingUserInfo &&
                            <Skeleton animation={"wave"}/>
                    }

                </Grid>
            </Grid>

            {
                expandable &&
                <Collapse in={open} style={{width: '100%'}}>
                    <Grid container justify={"space-evenly"} direction={"row"}>
                        {/*Stake*/}
                        <FarmFunction name={"Unstaked"} value={balance} initUserInfo={initUserInfo} textField hasApprove
                                      buttonText={'Stake'} stakedTokenAddress={stakedTokenAddress}
                                      approvedAmount={approvedAmount}
                                      handleClick={handleStake}
                        />

                        {/*Unstake*/}
                        <FarmFunction initUserInfo={initUserInfo} textField buttonText={'Unstake'}
                                      handleClick={handleUnstaking} value={stakedBalance}
                        />

                        {/*Claim*/}
                        <FarmFunction initUserInfo={initUserInfo} buttonText={'Claim'} handleClick={handleHarvest}/>
                    </Grid>
                </Collapse>
            }
        </Grid>
    )
}

const FarmFunction = ({
                          name, // function name eg. Staked, Unstaked
                          textField, hasApprove, // Options
                          value, setValue, // value of function eg. 10.0005 unstaked LP
                          buttonText, handleClick, // eg. Stake, Claim
                          approvedAmount, // other user info
                          initUserInfo, fetchingInfo, // controller for data display
                          stakedTokenAddress, // farm info
                      }) => {

    const classes = styles();
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();

    const [amount, setAmount] = useState(0);
    const [notEnough, setNotEnough] = useState(false);
    const [approving, setApproving] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (initUserInfo && value) {
            console.log(amount);
            console.log(Number(fromWei(value.toString())));
            if (amount > Number(fromWei(value.toString()))) {
                setNotEnough(true);
            } else {
                setNotEnough(false);
            }
        }
    }, [amount]);

    const handleApprove = async () => {
        if (amount === 0) {
            return;
        }
        setApproving(true);
        // approve farm spend
        const realTokenContract = await getRealContract(
            stakedTokenAddress,
            wallet && wallet.status === "connected" ? wallet.ethereum : rpcUrl,
            erc20ABI
        );

        approve(realTokenContract, farmAddress, toWei(amount.toString()), wallet).then((txHash) => {
            enqueueSnackbar(`Approve successful`, {
                variant: "success",
                autoHideDuration: 3000,
                action: <ViewOnExplorerButton txHash={txHash}/>
            });
            setApproving(false);
        });
    }

    return (
        <Grid container item xs={12} md={3} direction={"column"} style={{margin: '1em'}}>
            <Grid container justify={"space-between"}>
                <Typography className={classes.farmFunctionHeader} style={{marginTop: name ? 0 : '1.5em'}}>
                    {name ? `${name}:` : ''}
                </Typography>
                <Typography className={classes.farmFunctionHeader}>
                    {
                        wallet.status === 'connected' && name &&
                        <b>{!initUserInfo ? <Skeleton style={{width: '50px'}}
                                                      animation={"wave"}/> : `${Number(fromWei(value ? value.toString() : '0')).toFixed(5)}`}</b>
                    }
                    {
                        wallet.status !== 'connected' && name &&
                        ``
                    }
                </Typography>
            </Grid>

            {
                textField &&
                <TextField
                    value={amount}
                    onChange={(event) => {
                        const regex = /^[0-9]*\.?[0-9]*$/;

                        if (regex.test(event.target.value)) {
                            setAmount(event.target.value);
                        }
                    }}
                    variant={"outlined"}
                    color={"secondary"}
                />
            }

            {
                hasApprove &&
                <Button className={classes.farmFunctionButton} variant={"contained"} color={"secondary"}
                        disabled={!initUserInfo || approving}
                        hidden={approvedAmount >= amount}
                        onClick={handleApprove}
                >
                    {approving && <CircularProgress style={{padding: '0.5em', marginRight: '0.2em'}}/>}
                    {approving ? `Approving` : wallet.status !== 'connected' ? 'Connect Wallet' : 'Approve'}
                </Button>
            }

            <Button className={classes.farmFunctionButton} variant={"contained"} color={"secondary"}
                    onClick={() => handleClick(amount, setBusy)} disabled={notEnough || wallet.status !== 'connected'}>
                {busy && <CircularProgress style={{padding: '0.5em', marginRight: '0.2em'}}/>}
                {notEnough ? 'Insufficient Funds' : wallet.status !== 'connected' ? 'Connect Wallet' : buttonText}
            </Button>
        </Grid>
    )
}

export default Farm;