import { useContext } from 'react';

import { contractDeployer } from '../funcs/contractDeployer';
import smartSafeAbi from '../abi/SmartSafeABI.json';
import UserWalletContext from './UserWalletContext';


const SmartSafeDeployer = async (props) => {
    const { ownerAddresses, executionTimeSpanInSeconds } = props;
    
    const { wallet, setWallet } = useContext(UserWalletContext);
    const { userProvider, signer, userWallet, userAddress } = wallet;
    // const { setUserProvider, setSigner, setUserWallet, setUserAddress } = setWallet;

    const abi = smartSafeAbi;
    const bytecode = ""; // todo
    // todo - how to send our data to the contract?

    try {
        const contract = await contractDeployer(abi, bytecode, signer);

        console.log(`contract deployed to:`, contract.address);
        return contract.address; // Return deployed contract address
    } catch (error) {
        console.error("Error deploying contract:", error);
        throw new Error; // Rethrow to handle it in the UI or other layers
    }
};

export default SmartSafeDeployer;