import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography} from '@material-ui/core';
import React from "react";

export default function ConfirmDialog({open, setOpen, callBack}) {

    return (
        <Dialog
            open={open}
        >
            <DialogTitle style={{backgroundColor: "#CA0B0099"}}>
                <Typography variant={'h3'}>
                    Emergency withdraw
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant={'subtitle1'} style={{marginTop: 8}}>
                        Emergency widthraw is an extreme function in case of farm critical errors and calling it will
                        withdraw your staked token but it will<b>forfeit your pending rewards</b>.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={callBack} style={{color: "#F0D500"}}>
                    Yes forfeit My Rewards
                </Button>
                <Button onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}