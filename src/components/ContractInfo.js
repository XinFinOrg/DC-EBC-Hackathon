import React from "react";
import { Card, Statistic, Button } from "antd";
import OwnerList from "./OwnerList";
import Transactions from "./Transactions";

const ContractInfo = ({ contractData }) => {
  const { contract, transaction, executionTime } = contractData;
  //TODO Wallet Funds

  //TODO Transaction History

  //TODO Notify to fund the wallet
  //   ------ implement sendEthereum() function
  //           sendEthereum(destinationAddress, amountInEther, signer)

  return (
    <div className="text-center py-4 w-1/2 mx-auto">
      <Card>
        {contractData?.etherBalance >= 0 && (
          <Statistic
            title="Smart Safe Funds"
            value={contractData.etherBalance}
            precision={4}
            suffix="ETH"
          />
        )}
        {contractData?.owners.length > 0 && (
          <OwnerList owners={contractData.owners} />
        )}
        {transaction && <Transactions transaction={transaction} contract={contract}/>}
      </Card>
    </div>
  );
};

export default ContractInfo;
