const icons = {
    mumbai: {
        '0xe70d8809237aCcCb4589098172CD5b076Fdd1922' : '/coins-icons/galaxy-bal-lp.svg', // balancer-LP
    },
    polygon: {
        // add mainnet addresses here
    },
    local: {
        // put local contracts addresses here
        // local setups can give you more debugging options
    }
}

module.exports = icons[process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : 'bscTest'];