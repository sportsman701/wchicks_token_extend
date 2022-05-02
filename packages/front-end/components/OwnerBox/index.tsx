import * as React from 'react';
import {useCallback, useEffect, useState} from "react";
import {
    Typography,
    Box,
    Link,
    TextField,
    FormControl,
    Container, Divider
} from "@mui/material";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import {useWChicksContract} from "../../hooks/useContract";
import LoadingButton from '@mui/lab/LoadingButton';
import {showToast} from "../Toast";
import {getEtherscanLink} from "../../utils/scan";
import {isAddress} from "ethers/lib/utils";
import {parseWithDecimals} from "../../utils/decimal";

const OwnerBox: React.FC<{}> = ({}) => {
    const {account} = useActiveWeb3React();
    const wChicksContract = useWChicksContract();
    const [minting, setMinting] = useState<boolean>(false);
    const [to, setTo] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const [settingService, setSettingService] = useState<boolean>(false);
    const [serviceAddress, setServiceAddress] = useState<string>("");

    const [settingPresale, setSettingPresale] = useState<boolean>(false);
    const [presaleAddress, setPresaleAddress] = useState<string>("");

    const [settingFee, setSettingFee] = useState<boolean>(false);
    const [fee, setFee] = useState<number>(0);

    const [settingMintingFinished, setSettingMintingFinished] = useState<boolean>(false);
    const [mintingFinished, setMintingFinished] = useState<boolean>(false);

    useEffect(() => {
        const fetchFlags = async () => {
            const mintingFinished = await wChicksContract.mintingFinished();
            setMintingFinished(mintingFinished);
        };
        if(wChicksContract) {
            fetchFlags();
        }
    }, [wChicksContract]);

    const onMint = useCallback(async () => {
        if (account && isAddress(to) && amount > 0) {
            setMinting(true);
            try{
                const tx = await wChicksContract.mint(to, parseWithDecimals(amount));
                await tx.wait();
                setMinting(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getEtherscanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on Etherscan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
                setSettingFee(false);
            }
        } else {
            showToast("error", "Validation", "Invalid Input Values");
            setSettingFee(false);
        }
    }, [account, wChicksContract, to, amount]);

    const onSetService = useCallback(async () => {
        if (account && isAddress(serviceAddress)) {
            setSettingService(true);
            try{
                const tx = await wChicksContract.setService(serviceAddress);
                await tx.wait();
                setSettingService(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getEtherscanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on Etherscan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
                setSettingFee(false);
            }
        } else {
            showToast("error", "Validation", "Invalid Input Values");
            setSettingFee(false);
        }
    }, [account, wChicksContract, serviceAddress]);

    const onSetPresale = useCallback(async () => {
        if (account && isAddress(presaleAddress)) {
            setSettingFee(true);
            try{
                const tx = await wChicksContract.setPresale(presaleAddress);
                await tx.wait();
                setSettingFee(false);
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
    }, [account, wChicksContract, presaleAddress]);


    const onSetMintingFinished = useCallback(async () => {
        if (account) {
            setSettingMintingFinished(true);
            try{
                const tx = await wChicksContract.setMintingFinished(!mintingFinished);
                await tx.wait();
                setSettingMintingFinished(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getEtherscanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on Etherscan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
                setSettingMintingFinished(false);
            }
        } else {
            showToast("error", "Validation", "Invalid Input Values");
            setSettingMintingFinished(false);
        }
    }, [account, wChicksContract]);

    const onSetFee = useCallback(async () => {
        if (account && fee > 0) {
            setSettingFee(true);
            try{
                const tx = await wChicksContract.setFee(fee);
                await tx.wait();
                setSettingFee(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getEtherscanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on Etherscan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
                setSettingFee(false);
            }
        } else {
            showToast("error", "Validation", "Invalid Input Values");
            setSettingFee(false);
        }
    }, [account, wChicksContract, fee]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <div>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField id="to-address" label="To" variant="outlined" defaultValue={to} onChange={(event) => {setTo(event.target?.value??'')}} />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField id="mint-amount" label="Amount" variant="outlined" type="number" defaultValue={amount} onChange={(event) => {setAmount(Number(event.target?.value??0))}} />
                    </FormControl>
                    <LoadingButton variant="contained" loading={minting} disabled={!account} onClick={onMint}>Mint</LoadingButton>
                </div>
            </Box>
            <Divider sx={{my: 4}}/>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField id="service-address" label="Service Address" variant="outlined" defaultValue={serviceAddress} onChange={(event) => {setServiceAddress(event.target?.value??'')}} />
                </FormControl>
                <LoadingButton variant="contained" loading={settingService} disabled={!account} onClick={onSetService}>SetService</LoadingButton>
            </Box>
            <Divider sx={{my: 4}}/>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField id="presale-address" label="Presale Address" variant="outlined" defaultValue={presaleAddress} onChange={(event) => {setPresaleAddress(event.target?.value??'')}} />
                </FormControl>
                <LoadingButton variant="contained" loading={settingPresale} disabled={!account} onClick={onSetPresale}>SetPresaleService</LoadingButton>
            </Box>
            <Divider sx={{my: 4}}/>
            <Box sx={{ textAlign: 'center' }}>
                <Typography component="h2" variant="h5" color="text.primary">
                    MintingFinished: {(mintingFinished) ? 'True' : 'False'}
                </Typography>
                <LoadingButton variant="contained" loading={settingMintingFinished} disabled={!account} onClick={onSetMintingFinished}>{mintingFinished?'ReSetMintFinished':'SetMintFinished'}</LoadingButton>
            </Box>
            <Divider sx={{my: 4}}/>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField id="fee-percent" label="Fee Percentage" variant="outlined"  type="number" defaultValue={fee} onChange={(event) => {setFee(Number(event.target?.value??0))}} />
                </FormControl>
                <LoadingButton variant="contained" loading={settingFee} disabled={!account} onClick={onSetFee}>SetFee</LoadingButton>
            </Box>
        </Container>
    );
}

export default OwnerBox;