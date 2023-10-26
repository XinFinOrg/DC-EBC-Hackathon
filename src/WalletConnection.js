import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function WalletConnection() {
    const [address, setAddress] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setAddress(address);
        } else {
            alert("Ethereum provider is not available");
        }
    };

    return (
        <div>
            {address ? 
                <div>Connected Address: {address}</div> : 
                <button className="mt-4 inline-block px-6 py-3 bg-blue-500 rounded-md text-white font-semibold hover:bg-blue-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring focus:ring-blue-300" onClick={connectWallet}>Connect Wallet</button>}
                <div>
                <button
    href="/login"
    className="mt-4 inline-block px-6 py-3 bg-blue-500 rounded-md text-white font-semibold hover:bg-blue-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring focus:ring-blue-300"
  >
    Connect Wallet 2
  </button>
  </div>
  Hello
        </div>
    );
}

export default WalletConnection;
