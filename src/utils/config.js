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
        rpcUrl: 'https://polygon-rpc.com',
        explorer: 'https://polygonscan.com/',

        // project info
        galaxyAddress: '0x438374eA6e7AAfEE3BE6f925BA50071DD22ed70b',
        gaxAddress: '0xC8A5BCb5D53CD824497b5381b592Bb747d6D27b3',
        farmAddress: '0x888ee59B74D95d9Bc936208F3ec0Bfb5825Fc20d',
        glxyPoolId: '0xb70c25d96ef260ea07f650037bf68f5d6583885e000100000000000000000048',
        gaxLPAddress: '0x535f4987C013CC15E0055f652C077bE2006B3aBc',

        // other tokens info
        usdcAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        balancerVaultAddress: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        quickswapRouterAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
        maticUsdc: '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827'
    },
    local: {
        // put local contract addresses here
        // local setups can give you more debugging options
    },
}

const conf = configs[process.env.REACT_APP_NETWORK_NAME ? process.env.REACT_APP_NETWORK_NAME : 'mumbai'];

module.exports = conf;