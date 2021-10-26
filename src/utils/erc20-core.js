const tokenIcons = require('./tokenIcons');
const {chainId} = require('./config.js');

export const getBalance = async (realContract, account) => {
    return realContract.methods.balanceOf(account).call();
}

export const getSymbol = async (realContract) => {
    return realContract.methods.symbol().call();
}

export const getName = async (realContract) => {
    return realContract.methods.name().call();
}

export const getTotalSupply = async (realContract) => {
    return realContract.methods.totalSupply().call();
}

export const getTokenIconUri = (address) => {
    return tokenIcons[address]
}

export const getAllowance = async (realContract, owner, spender) => {
    return realContract.methods.allowance(owner, spender).call();
}

// write functions

export const approve = async (realContract, spender, amount, wallet) => {
    const data = realContract.methods.approve(spender, amount).encodeABI();

    const transactionParams = {
        nonce: '0x00',
        to: realContract.options.address,
        from: wallet.account,
        data: data,
        chainId: chainId
    }

    return wallet.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
    })
}

