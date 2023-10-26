import React from "react";
import UserWalletContext from "./UserWalletContext";

import { useNavigate } from "react-router-dom";

import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

function UserWalletSetup() {
    const { wallet, setWallet } = useContext(UserWalletContext);
    const { userProvider, signer, userWallet, userAddress } = wallet;
    const { setUserProvider, setSigner, setUserWallet, setUserAddress } = setWallet;

    const [isConnected, setIsConnected] = useState(false);
      // Function to check for existing connection
    const checkForWalletConnection = () => {
        if (typeof userAddress!=='undefined' && userProvider!==null){
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    };
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                // Request account access
                // await provider.send('eth_requestAccounts', []);
                
                
                const accounts = await provider.listAccounts();
                if (!accounts.length) 
                    throw new Error('No accounts found on the wallet');

                console.log("already coonnected to wallet", accounts[0].address);
                setIsConnected(true);
                
                setSigner(provider.getSigner());
                setUserAddress(accounts[0]);
                setUserProvider(provider);
                
                console.log("connected to wallet");
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            console.error('Ethereum provider is not available');
        }
    };

    useEffect(() => {
        checkForWalletConnection();
    }, []);
    
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/dashboard');
    };
    
    return (
        <div> 
            <button 
                className="mt-4 inline-block px-6 py-3 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring focus:ring-blue-300" 
                onClick={isConnected ? handleRedirect : connectWallet}
            >
                {isConnected ? "Dashboard" : "Connect Wallet" }
            </button>
        </div>
    );
}

export default UserWalletSetup;