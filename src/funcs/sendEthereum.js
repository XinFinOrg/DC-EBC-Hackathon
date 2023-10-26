import { ethers } from "ethers";

export async function sendEthereum(toAddress, amountInEther, signer) {
    if (!signer)
        throw new Error("Signer not initialized");
        
    const value = ethers.utils.parseEther(amountInEther);

    try {
        const tx = {
            to: toAddress,
            value: value
        };

        const txResponse = await signer.sendTransaction(tx);
        console.log("Transaction hash:", txResponse.hash);

        const receipt = await txResponse.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        return receipt;

    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
}