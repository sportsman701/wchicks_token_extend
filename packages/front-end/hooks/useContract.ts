import {useMemo} from "react";
import {ethers} from 'ethers'
import wChicksSCJson from "../abi/WChicks.json";
import useActiveWeb3React from "./useActiveWeb3React";
import {CHAIN_PARAMS} from "../config/constants";

export const useWChicksContract = () => {
    const {library, chainId} = useActiveWeb3React()
    return useMemo(() => {
        const signerOrProvider = library?.getSigner() ?? new ethers.providers.StaticJsonRpcProvider(CHAIN_PARAMS[chainId].rpcUrls[0]);
        console.log('contract address', wChicksSCJson.address, signerOrProvider);
        return new ethers.Contract(wChicksSCJson.address, wChicksSCJson.abi, signerOrProvider);
    }, [library]);
}