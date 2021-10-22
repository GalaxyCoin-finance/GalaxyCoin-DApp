const configs = {
    kovan: {
        chainId: 42,
        provider: 'kovan.poa.network'
    },
    mumbai: {
        chainId: 80001,
        provider: ""
    },
    polygon: {
        chainId: 42,
        provider: ""
    },
    local: {
        // put local contract addresses here
        // local setups can give you more debugging options
    },
}

const conf = configs[process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : 'mumbai'];

module.exports = conf;