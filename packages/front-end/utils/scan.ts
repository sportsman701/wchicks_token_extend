import {CHAIN_PARAMS} from "../config/constants";

export function getEtherscanLink(data: string, type: string) {
    const _chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');
    const prefix = `${CHAIN_PARAMS[_chainId].blockExplorerUrls[0]}`

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}