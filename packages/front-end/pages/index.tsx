import {useEffect, useState} from "react";
import type {NextPage} from 'next'
import {Box, Divider, Typography} from '@mui/material';
import Head from 'next/head'
import styles from '../styles/Home.module.css';
import {useWChicksContract} from "../hooks/useContract";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import {formatWithDecimals} from "../utils/decimal";
import {BigNumber} from "@ethersproject/bignumber";
import TransferButton from "../components/TransferButton";
import OwnerBox from "../components/OwnerBox";

interface TokenData {
    name: string,
    symbol: string,
    decimals: BigNumber,
    totalSupply: BigNumber,
    owner: string,
    service: string,
    presale: string,
    fee: BigNumber
}

const Home: NextPage = () => {
    const wChicksContract = useWChicksContract();
    const {account} = useActiveWeb3React();

    const [tokenData, setTokenData] = useState<TokenData | null>(null);

    const [balance, setBalance] = useState<BigNumber | null>(null);

    useEffect(() => {
        const fetchTokenDetails = async () => {
            const name = await wChicksContract.name();
            const symbol = await wChicksContract.symbol();
            const decimals = await wChicksContract.decimals();
            const owner = await wChicksContract.owner();
            const supply = await wChicksContract.totalSupply();
            const service = await wChicksContract.service();
            const presale = await wChicksContract.presale();
            const fee = await wChicksContract.fee();

            setTokenData({
                name: name,
                symbol: symbol,
                decimals: decimals,
                totalSupply: supply,
                owner: owner,
                service: service,
                presale: presale,
                fee: fee
            });
        }
        if(wChicksContract){
            fetchTokenDetails();
        }

        const fetchAccountData = async () => {
            console.log('account', account);
            const balance = await wChicksContract.balanceOf(account);
            setBalance(balance);
        }

        if(account && wChicksContract){
            fetchAccountData();
        }
    }, [account, wChicksContract]);

    return (
        <div className={styles.container}>
            <Head>
                <title>WChicks Token</title>
                <meta name="description" content="ETH Betting system using Chainlink"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    WChicks Token Details
                </h1>
                <p className={styles.description}>
                    Name: {tokenData?.name ?? `-`} <br/>
                    Symbol: {tokenData?.symbol ?? '-'} <br/>
                    Decimals: {tokenData?.decimals ?? `-`} <br/>
                    Owner: {tokenData?.owner ?? '-'} <br/>
                    Total Supply: {tokenData ? formatWithDecimals(tokenData.totalSupply, tokenData.decimals) : '-'} <br/>
                    ServiceAddress: {tokenData?.service ?? '-'} <br/>
                    PresaleAddress: {tokenData?.presale ?? '-'} <br/>
                    Fee percentage: { tokenData?.fee ? (Number(tokenData.fee) / 10) : '-'} %
                </p>
                <h2 className="current-total-supply">
                    Your address: {account??'-'}
                </h2>

                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    <Typography component="h2" variant="h3" color="text.primary">
                        Balance: {(balance && tokenData) ? (formatWithDecimals(balance, tokenData.decimals) + ` ${tokenData.symbol}`) : '-'}
                    </Typography>
                    <Divider sx={{my: 4}}/>
                    <TransferButton />
                    <Divider sx={{my: 4}}/>
                    {
                        account && tokenData?.owner === account &&
                        <OwnerBox />
                    }
                </Box>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Created by Seiji Ito
                </a>
            </footer>
        </div>
    )
}

export default Home
