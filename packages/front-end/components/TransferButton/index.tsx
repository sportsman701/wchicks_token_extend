import * as React from 'react';
import {useCallback, useState} from "react";
import {
    Typography,
    Box,
    Link,
    TextField,
    FormControl,
} from "@mui/material";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import {useWChicksContract} from "../../hooks/useContract";
import LoadingButton from '@mui/lab/LoadingButton';
import {showToast} from "../Toast";
import {getEtherscanLink} from "../../utils/scan";
import {isAddress} from "ethers/lib/utils";
import {parseWithDecimals} from "../../utils/decimal";

const TransferButton: React.FC<{}> = ({}) => {
    const {account} = useActiveWeb3React();
    const wChicksContract = useWChicksContract();
    const [transferring, setTransferring] = useState<boolean>(false);
    const [to, setTo] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);


    const onTransfer = useCallback(async () => {
        if (account && isAddress(to) && amount > 0) {
            setTransferring(true);
            try{
                const tx = await wChicksContract.transfer(to, parseWithDecimals(amount));
                await tx.wait();
                setTransferring(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getEtherscanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on Etherscan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
            }
        } else {
            showToast("error", "Validation", "Invalid Input Values");
        }
    }, [account, wChicksContract, to, amount]);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField id="to-address" label="To" variant="outlined" defaultValue={to} onChange={(event) => {setTo(event.target?.value??'')}} />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField id="amount" label="Amount" variant="outlined" type="number" defaultValue={amount} onChange={(event) => {setAmount(Number(event.target?.value??0))}} />
                </FormControl>
                <LoadingButton variant="contained" loading={transferring} disabled={!account} onClick={onTransfer}>Transfer</LoadingButton>
            </div>
        </Box>
    );
}

export default TransferButton;