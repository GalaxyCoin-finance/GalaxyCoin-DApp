const configs = {
    mumbai: {
        // chain info
        chainId: 80001,
        rpcUrl: 'https://matic-mumbai.chainstacklabs.com/',
        explorer: 'https://mumbai.polygonscan.com/',

        // project info
        galaxyAddress: '0x4F8879d00f2fea10a6Ca057715d31f52FB68bf1b',
        gaxAddress: '0xC9619fBe9861E6CE3a0554874332FDB1E24878AB',
        lpAddress: '0xe70d8809237aCcCb4589098172CD5b076Fdd1922',
        farmAddress: '0x6c782f29945f86ae3178a2b7c2597A13584D4547'
    },
    polygon: {
        chainId: 137,
        rpcUrl: 'https://rpc-mainnet.matic.network/',

        // project info
        galaxyAddress: '',
        gaxAddress: '',
        lpAddress: '',
        farmAddress: ''
    },
    local: {
        // put local contract addresses here
        // local setups can give you more debugging options
    },
}

const conf = configs[process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : 'mumbai'];

module.exports = conf;