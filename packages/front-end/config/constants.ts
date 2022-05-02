export const CHAIN_ID = {
    ETHERMAIN: 1,
    //Testnet
    ROPSTEN: 3,
}

export const CHAIN_PARAMS = {
    [CHAIN_ID.ETHERMAIN]: {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/27cf6f60b8d943b0a42a0c35db02788d'],
        blockExplorerUrls: ['https://etherscan.io/'],
    },
    [CHAIN_ID.ROPSTEN]: {
        chainId: '0x3',
            chainName: 'Ropsten',
            nativeCurrency: {
            name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
        },
        rpcUrls: ['https://ropsten.infura.io/v3/27cf6f60b8d943b0a42a0c35db02788d'],
        blockExplorerUrls: ['https://ropsten.etherscan.io'],
    },
}