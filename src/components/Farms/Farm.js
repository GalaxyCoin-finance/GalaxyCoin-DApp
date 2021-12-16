import {
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput,
    Typography
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {formatLongNumber} from "../../utils/general-utils";
import {Alert, Skeleton} from "@material-ui/lab";
import {useWallet} from "use-wallet";
import {approve} from "../../utils/erc20-core";
import {
    deposit,
    emergencyWithdrawFromFarm,
    getRealContract,
    harvest,
    sleep,
    waitForTransaction,
    withdraw
} from "../../utils/farm-core";
import {explorer} from "../../utils/config.js";
import {useSnackbar} from "notistack";
import {erc20ABI} from "../../utils/abi/erc20-abi";
import {FarmAbi} from "../../utils/abi/farm-abi";
import {fromWei, toBN, toWei} from "web3-utils";
import useSingleFarm from "../../hooks/useSingleFarm";
import useFarms from "../../hooks/useFarms";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import {GalaxyGradientButton} from "../Buttons";
import usePrices from "../../hooks/usePrices";

const styles = makeStyles((theme) => ({
    farmBackground: {
        backgroundImage: `linear-gradient(to bottom right, ${theme.palette.specific.farmBackground}, #08092C)`,
        //background: 'linear-gradient(#0e1156ff,#0e1156ff)',
        //border: `1px solid ${theme.palette.secondary.light}`,
        boxShadow: `0 0px 2px #eaeaea55`,
        borderRadius: 12,
        marginBottom: '1em',
        borderBottom: `3px solid ${theme.palette.secondary.light}`,
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
    },
    smallLink: {
        textDecoration: 'underline',
    }
}));


export const ViewOnExplorerButton = ({txHash}) => {
    return (
        <Button onClick={() => window.open(explorer + 'tx/' + txHash, '_blank')}>
            View Transaction
        </Button>
    )
}


const Farm = ({expandable}) => {
    const classes = styles();

    const {globalFarmStats, isInitGlobalStatsLoaded, farms} = useFarms();
    const {farm, userInfo, updateUserInfo, updateFarmInfo} = useSingleFarm();
    const prices = usePrices();
    const [open, setOpen] = useState(false);

    const updateInfos = () => {
        updateUserInfo(true);
        updateFarmInfo(true);
    }

    const toggleCollapse = () => {
        setOpen(!open);
    }

    return (
        farm ? <Grid container item xs={11} sm={11} md={10} lg={10} className={classes.farmBackground}>
            <Grid container item xs={12} justify={"center"} alignContent={"center"} direction={"column"}
                  style={{cursor: expandable ? 'pointer' : "default"}} onClick={toggleCollapse}>
                <Typography className={classes.farmName} variant={"h2"}>
                    {farm.name} 
                </Typography>
                <Typography className={classes.farmComposition}>
                {farm.name} ≈ ${formatLongNumber(prices.lpPrices[farm.pid], 6)}
                </Typography>
                <Typography className={classes.farmComposition}>
                    {farm.composition} <a href={farm.buyLink} style={{color: 'cyan'}}
                                          target={'_blank'} rel="noreferrer"> Get {farm.name} </a>
                </Typography>
            </Grid>

            <Grid container justify={"space-between"} style={{padding: '1em', paddingTop: 0, paddingBottom: 0}}>
                {/*LP Wallet Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        APY
                    </Typography>
                    <Typography className={classes.farmInfoText}>
                        {farm.apy ? formatLongNumber(farm.apy, 2) : <Skeleton animation={"wave"}/>}%
                    </Typography>

                </Grid>

                {/*Staked Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Staked Balance
                    </Typography>
                    {
                        userInfo &&
                        <Typography className={classes.farmInfoText}>
                            {userInfo.staked ? `${Number(fromWei(userInfo.staked.toString())).toFixed(4)} ${farm.name}` : 0}
                        </Typography>
                    }

                    {
                        !userInfo &&
                        <Skeleton animation={"wave"}/>
                    }

                </Grid>

                {/*Claimable Balance*/}
                <Grid item xs={12} md={3}>
                    <Typography className={classes.farmInfoHeading}>
                        Pending
                    </Typography>
                    {
                        userInfo &&
                        <Typography className={classes.farmInfoText}>
                            {userInfo.pending ? Number(fromWei(userInfo.pending.toString())).toFixed(4) : 0} GAX
                        </Typography>
                    }

                    {
                        !userInfo &&
                        <Skeleton animation={"wave"}/>
                    }

                </Grid>
            </Grid>
            {
                expandable && open &&
                <Collapse in={open} style={{width: '100%'}}>
                    <Grid container justify={"space-evenly"} direction={"row"} style={{padding: '1em', paddingTop: 0}}>
                        <ClaimComponent/>
                        <WithdrawComponent/>
                        <VDiv/>
                        {userInfo && Number(userInfo.allowance) > Number(userInfo.balance) ?
                            <DepositComponent/> :
                            <ApproveComponent/>
                        }
                        {
                            userInfo && userInfo.staked > 0 && globalFarmStats.paused &&
                            <>
                                <VDiv/>
                                <EnergencyComponent/>
                            </>
                        }
                        <Typography className={classes.farmComposition}>
                            <p style={{color: 'yellow', cursor: "pointer", textDecoration: 'underline'}}
                               onClick={updateInfos}> Refresh </p>
                        </Typography>
                    </Grid>
                </Collapse>
            }
            {
                !open &&
                <Grid container justify={"center"}>
                    <Button color={'secondary'} onClick={() => setOpen(true)}>
                        Click here for Details
                    </Button>
                </Grid>
            }
        </Grid> : <div/>
    )
}


const VDiv = () => <Grid item xs={12} style={{minHeight: 16}}/>


export const EnergencyComponent = () => {
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();
    const [busy, setBusy] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [open, setOpen] = useState(false);
    const {farmConfig} = useFarms();
    const {updateUserInfo, farm, userInfo, waitForApproval} = useSingleFarm();


    const preConfirm = () => {
        setOpen(true)
    }

    const emergencyWithdraw = async () => {
        setOpen(false);

        if (!wallet || !wallet.account) return;
        setBusy(true);
        let failed = false;
        await handleTransactionPromise(
            {
                transactionPromise: emergencyWithdrawFromFarm(
                    await getRealContract(farmConfig.farms, wallet.ethereum, FarmAbi),
                    farm.pid,
                    wallet
                ),
                successMessage: 'Success!',
                enqueueSnackbar
            }
        ).catch(error => failed = true)
        // TODO :
        if (!failed) {
            setWaiting(true);
            await sleep(20000); // TODO: actually listen to each block for this change
            setWaiting(false);
        }
        setBusy(false);
        updateUserInfo(true);
    }

    return (
        <>
            <CardButton title={waiting ? 'Reading state from Blockchain...' : 'Emergency Withdraw'}
                        onClick={preConfirm} busy={busy || !userInfo} disabled={busy || !userInfo}
                        style={{marginTop: 8}}/>
            <ConfirmDialog open={open} setOpen={setOpen} callBack={emergencyWithdraw}/>
        </>

    )

}


export const ApproveComponent = () => {
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();
    const [busy, setBusy] = useState(false);
    const [waitingForApproval, setWaitingForApproval] = useState(false);
    const {updateUserInfo, farm, userInfo, waitForApproval} = useSingleFarm();
    const {farmConfig, globalFarmStats} = useFarms();

    const approveFarm = async () => {
        if (!wallet || !wallet.account) return;
        setBusy(true);
        let failed = false;
        await handleTransactionPromise(
            {
                transactionPromise: approve(
                    await getRealContract(farm.stakedToken.address, wallet.ethereum, erc20ABI),
                    farmConfig.address,
                    new toBN(2).pow(toBN(256)).sub(toBN('1')), // max uint 256 (2**256)-1 to account for the zero offset
                    wallet
                ),
                successMessage: 'Success!',
                enqueueSnackbar
            }
        ).catch(error => failed = true)
        // TODO :
        if (!failed) {
            setWaitingForApproval(true);
            await waitForApproval();
            setWaitingForApproval(false);
        }
        setBusy(false);
        updateUserInfo(true);
    }

    return (
        <CardButton title={waitingForApproval ? 'Reading Approval state from Blockchain...' : 'Approve'}
                    onClick={approveFarm} busy={busy || !userInfo}
                    disabled={busy || !userInfo || globalFarmStats.paused || !globalFarmStats.active}/>
    )

}


export const DepositComponent = () => {
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();
    const {updateUserInfo, farm, userInfo, waitForDepositOrWithdrawal} = useSingleFarm();
    const {farmConfig, globalFarmStats} = useFarms();
    const prices = usePrices();

    const [value, setValue] = useState("0");
    const [useMax, setUseMax] = useState(false);
    const [busy, setBusy] = useState(false);
    const [open, setOpen] = useState(false);
    const [inError, setInError] = useState('');
    const [waitingForNetwork, setWaitingForNetwork] = useState(false);


    useEffect(() => {
        if (!userInfo) return;
        if (!useMax && Number(value) * 10 ** 18 > Number(userInfo.balance)) {
            setInError('Exceeded Balance');
        } else
            setInError('');
    }, [value, useMax]);

    const handleDeposit = async () => {
        setBusy(true)
        let failed = false;
        await handleTransactionPromise(
            {
                transactionPromise: deposit(
                    await getRealContract(farmConfig.address, wallet.ethereum, FarmAbi),
                    farm.pid,
                    useMax ? userInfo.balance : toWei(value),
                    wallet
                ),
                successMessage: 'Success!',
                enqueueSnackbar
            }
        ).catch(error => failed = true)
        if (!failed) {
            setWaitingForNetwork(true);
            await waitForDepositOrWithdrawal();
            setWaitingForNetwork(false);
        }
        setBusy(false)
        setOpen(false)
        updateUserInfo(true);
    }

    return (
        <Grid item xs={12}>
            <CardButton
                title={waitingForNetwork ? 
                    'Reading On Chain Data...' :
                     `Stake (available: ${userInfo.balance ? formatLongNumber(Number(userInfo.balance) / 10 ** 18, 2) : 0} ${farm.name}) ≈ 
                     ($${userInfo.balance ? formatLongNumber((Number(userInfo.balance) / 10 ** 18) * prices.lpPrices[farm.pid], 2) : formatLongNumber(0.00)})`}
                disabled={!(userInfo && Number(userInfo.balance) > 0) || busy || globalFarmStats.paused || !globalFarmStats.active}
                onClick={() => setOpen(true)}
            />
            {userInfo &&
            <AmountDialog
                title={waitingForNetwork ? 'Reading On Chain Data...' : 'Stake'}
                value={value}
                inError={inError}
                maxAmount={userInfo.balance}
                setUseMax={setUseMax}
                setValue={setValue}
                busy={busy}
                handleAction={handleDeposit}
                open={open}
                setOpen={setOpen}
            />
            }
        </Grid>
    )
}

export const WithdrawComponent = () => {
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();
    const {updateUserInfo, farm, userInfo, waitForDepositOrWithdrawal} = useSingleFarm();
    const {farmConfig, globalFarmStats} = useFarms();
    const prices = usePrices();

    const [value, setValue] = useState("0");
    const [useMax, setUseMax] = useState(false);
    const [busy, setBusy] = useState(false);
    const [open, setOpen] = useState(false);
    const [inError, setInError] = useState('');
    const [waitingForNetwork, setWaitingForNetwork] = useState(false);


    useEffect(() => {
        if (!userInfo) return;
        if (!useMax && Number(value) * 10 ** 18 > Number(userInfo.staked)) {
            setInError('Exceeded Staked Amount');
        } else
            setInError('');
    }, [value, useMax])

    const handleWithdraw = async () => {
        setBusy(true)
        let failed = false;
        await handleTransactionPromise(
            {
                transactionPromise: withdraw(
                    await getRealContract(farmConfig.address, wallet.ethereum, FarmAbi),
                    farm.pid,
                    useMax ? userInfo.staked : toWei(value),
                    wallet
                ),
                successMessage: 'Success!',
                enqueueSnackbar
            }
        ).catch(error => failed = true)
        if (!failed) {
            setWaitingForNetwork(true);
            await waitForDepositOrWithdrawal();
            setWaitingForNetwork(false);
        }
        setBusy(false);
        setOpen(false);
        updateUserInfo(true);
    }

    return (
        <Grid item xs={6} style={{paddingLeft: 6}}>
            <CardButton
                title={waitingForNetwork ? 'Reading On Chain Data...' : `Unstake (${userInfo && userInfo.staked ? formatLongNumber(Number(userInfo.staked) / 10 ** 18, 2) : 0})
                ≈ ($${userInfo && userInfo.staked ? formatLongNumber( (Number(userInfo.staked) / 10 ** 18) * prices.lpPrices[farm.pid] , 2) : 0})
                `}
                disabled={!(userInfo && Number(userInfo.staked) > 0) || busy || globalFarmStats.paused}
                onClick={() => setOpen(true)}
            />
            {userInfo &&
            <AmountDialog
                title={waitingForNetwork ? 'Reading On Chain Data...' : 'Unstake'}
                value={value}
                inError={inError}
                maxAmount={userInfo.staked}
                setUseMax={setUseMax}
                setValue={setValue}
                busy={busy}
                handleAction={handleWithdraw}
                open={open}
                setOpen={setOpen}
            />}
        </Grid>
    )
}

export const ClaimComponent = () => {
    const wallet = useWallet();
    const {updateUserInfo, farm, userInfo, waitForClaim} = useSingleFarm();
    const [busy, setBusy] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [waitingForNetwork, setWaitingForNetwork] = useState(false);
    const {farmConfig, globalFarmStats} = useFarms();
    const prices = usePrices();
    const handleHarvest = async () => {
        setBusy(true);
        let failed = false;
        await handleTransactionPromise(
            {
                transactionPromise: harvest(
                    await getRealContract(farmConfig.address, wallet.ethereum, FarmAbi),
                    farm.pid,
                    wallet
                ),
                successMessage: 'Success! Your $GAX will show in your balance shortly',
                enqueueSnackbar
            }
        ).catch(error => failed = true);

        if (!failed) {
            setWaitingForNetwork(true);
            await waitForClaim();
            setWaitingForNetwork(false);
        }

        setBusy(false);
        updateUserInfo(true);
    };

    return (
        <Grid item xs={6} style={{paddingRight: 6, textAlign: "center"}}>
            <CardButton
                title={waitingForNetwork ? 'Reading On Chain Data...' : `Harvest (${userInfo && userInfo.pending ? formatLongNumber(Number(userInfo.pending) / 10 ** 18, 2) : 0})
                ≈ ($${userInfo && userInfo.pending ? formatLongNumber( (Number(userInfo.pending) / 10 ** 18) * prices.gaxPrice, 2) : 0})`}
                disabled={!(userInfo && Number(userInfo.pending) > 0) || busy || globalFarmStats.paused}
                busy={busy}
                onClick={handleHarvest}
            />
        </Grid>
    )
}

const CardButton = ({title, disabled, busy, onClick}) => {
    const wallet = useWallet();
    const {enqueueSnackbar} = useSnackbar();

    const handleConnect = () => {
        if (wallet)
            wallet.connect();
        else
            enqueueSnackbar(
                "No Supported wallet detected 😢",
                {
                    variant: "error",
                    autoHideDuration: 3000,
                })
    }

    return <GalaxyGradientButton
        disabled={wallet && wallet.status === "connected" && disabled} // ignore disabled when not connected to wallet
        variant={"contained"}
        fullWidth
        color={"secondary"}
        style={{color: 'black'}}
        onClick={wallet && wallet.status === "connected" ? onClick : handleConnect}
    >
        {busy && <CircularProgress style={{height: 24, width: 24, marginRight: 6}}/>}
        {wallet && wallet.status === "connected" ? title : 'Connect Wallet'}
    </GalaxyGradientButton>
}

const AmountDialog = ({title, inError, value, setValue, setUseMax, maxAmount, setOpen, open, handleAction, busy}) => {

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                style: {
                    background: `linear-gradient(to bottom right, #122454, #08092C)`
                },
              }}
        >
            <DialogTitle>
                <Typography variant={"h4"}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity={"info"} style={{
                    marginTop: 6,
                    marginBottom: 24
                }}>{`Current Balance: ${formatLongNumber(Number(maxAmount) / 10 ** 18, 2)}`}</Alert>
                <FormControl error={inError} fullWidth
                             color={"secondary"}/*className={clsx(classes.margin, classes.textField)}*/
                             variant="outlined">
                    <InputLabel>Amount</InputLabel>
                    <OutlinedInput

                        type={'number'}
                        fullWidth
                        value={value}
                        onChange={(event) => {
                            setValue(Number(event.target.value) || Number(event.target.value) === 0 ? event.target.value : value);
                            setUseMax(false)
                        }}
                        endAdornment={<InputAdornment position="end">
                            <Button
                                onClick={() => {
                                    setValue('' + (Number(maxAmount) / 10 ** 18))
                                    setUseMax(true)
                                }}
                            >
                                Use Max
                            </Button>
                        </InputAdornment>}
                        labelWidth={64}
                    />

                </FormControl>
                {inError && <Alert severity={"error"} style={{marginTop: 6, marginBottom: 6}}>{inError}</Alert>}
                <Grid container spacing={2} style={{marginTop: 6}}>
                    <Grid item xs={6}>
                        <GalaxyGradientButton
                            variant={"contained"}
                            fullWidth color={"secondary"}
                            disabled={busy || inError}
                            onClick={handleAction}
                        >
                            {busy && <CircularProgress style={{height: 24, width: 24, marginRight: 6}}/>}
                            {title}
                        </GalaxyGradientButton>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            fullWidth
                            disabled={busy}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>


            </DialogContent>
        </Dialog>
    )
}

// functions
const handleTransactionPromise = async ({transactionPromise, successMessage, enqueueSnackbar}) => {
    let tx;
    try {
        tx = await transactionPromise;
        const receipt = await waitForTransaction(tx);

        if (receipt.status) {
            // transaction mined and did not revert
            enqueueSnackbar(
                successMessage,
                {
                    variant: "success",
                    autoHideDuration: 4000,
                    action: <ViewOnExplorerButton txHash={tx}/>,
                }
            )
        } else {
            // transaction mined and did revert
            enqueueSnackbar(
                "Transaction Reverted 😢",
                {
                    variant: "error",
                    autoHideDuration: 3000,
                    action: <ViewOnExplorerButton txHash={tx}/>
                })
        }
    } catch (error) {
        enqueueSnackbar(
            error.message,
            {
                variant: "error",
                autoHideDuration: 3000,
                action: <ViewOnExplorerButton txHash={tx}/>
            })
        throw 'error';
    }
}

export default Farm;