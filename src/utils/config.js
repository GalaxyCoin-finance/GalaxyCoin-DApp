const configs = {
    kovan: {
        chainId: 42
    },
    mumbai: {

    },
    polygon: {

    },
    local: {
        // put local contracts addresses here
        // local setups can give you more debugging options
    },
}

const conf = configs[process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : 'bscTest'];

module.exports = conf;