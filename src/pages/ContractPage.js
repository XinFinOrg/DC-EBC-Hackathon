import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContractInfo from "../components/ContractInfo";
import { ethers } from "ethers";
import { Input, Button } from "antd";
import SMART_SAFE_ABI from "../abi/SmartSafeABI.json";

const SMART_SAFE_INFURA_URL = "https://erpc.apothem.network";

const ContractPage = () => {
  const { contractAddress } = useParams();
  const navigate = useNavigate();
  const [inputAddress, setInputAddress] = useState("");
  const [contractData, setContractData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contractAddress) {
      readContractData(contractAddress);
    }
  }, [contractAddress]);

  const handleSearch = () => {
    if (inputAddress) {
      // Redirect to the new contract page with the entered address
      navigate(`/safe/${inputAddress}`);
    } else {
      setError("Please enter a contract address.");
    }
  };

  // Implement contract data retrieval and error handling here
  const readContractData = async (contractAddress) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        SMART_SAFE_INFURA_URL
      );
      provider.getBlockNumber().then((result) => {
        console.log("Current block number: " + result);
      });
      const contract = new ethers.Contract(
        contractAddress,
        SMART_SAFE_ABI,
        provider
      );

      const nonce = await contract.getNonce();
      const lastTransaction = await contract.getTransaction(nonce);
      let etherBalance = 0
      //TODO readTransaction

      const filter = contract.filters.LogInit();
      //const filterSubmissions = contract.filters.LogSubmission(null, nonce);
      //const filterConfirmations = contract.filters.LogConfirmation(null, nonce);
      const logs = await contract.queryFilter(filter);

      await provider.getBalance(contractAddress)
        .then((balance) => {
          // Convert Wei to Ether (1 Ether = 10^18 Wei)
          etherBalance = ethers.utils.formatEther(balance);
          console.log(`Balance of the contract: ${etherBalance} Ether`);
        })
        .catch((error) => {
          console.error("Error fetching contract balance:", error);
        });

      let owners = [];
      for (let log of logs) {
        for (let owner of log.args[0]) {
          console.log(owner);
          owners.push(owner.toString());
        }
      }
      //const owners = [contractAddress,contractAddress,contractAddress,contractAddress,contractAddress]
      const executionTime = Number(logs[0].args[1]);

      // Read data from the contract
      const contractData = {
        contract,
        etherBalance,
        nonce,
        owners,
        executionTime,
        transaction: lastTransaction,
      };

      setContractData(contractData);
    } catch (error) {
      setError("Error reading contract data: " + error.message);
    }
  };

  return (
    <div>
      <div className='text-center py-4 '>
      <h3 className="pt-8 pb-8">Contract Address: </h3>
  <div className="bg-blue-500 text-black px-4 rounded-full pb-2 pt-3 inline-flex bg-opacity-30 items-center">
    
    <h4>{contractAddress}</h4>
</div>


</div>

      {contractAddress ? (
        <>
          {contractData ? (
            <div>
              {contractData && <ContractInfo contractData={contractData} />}
            </div>
          ) : (
            <div>
              <p>Loading contract data...</p>
            </div>
          )}
          {error && <div>{error}</div>}
        </>
      ) : (
        <div>
          <p>Enter a contract address:</p>
          <Input
            type="text"
            placeholder="Contract Address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          {error && <div>{error}</div>}
        </div>
      )}{" "}
    </div>
  );
};

export default ContractPage;

/*
 */
