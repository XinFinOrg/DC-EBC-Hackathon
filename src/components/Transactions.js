import React, { useState, useContext} from "react";
import { Card, Button, Input, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import TxInfo from "./TxInfo";

import UserWalletContext from "./UserWalletContext";
import { utils } from 'ethers';

const Transactions = ({ transaction, contract }) => {
  const { wallet, setWallet } = useContext(UserWalletContext);
  const { userProvider, signer, userWallet, userAddress } = wallet;
  const { setUserProvider, setSigner, setUserWallet, setUserAddress } = setWallet;

  console.log(transaction);
  console.log(`executeAfter: ${Number(transaction?._executeAfter)}`);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    console.log("Generate & sign a new tx");

    // Given 
      let tx;
      let data;
      let NonceInBN;
      let nonce;
      let value = 0;
      let destination = ""; //
      
    // When
      data = "0x"
      NonceInBN = await contract.getNonce();
      nonce = NonceInBN.toString();
      const payload = utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes', 'uint256'],
          [destination, value, data, nonce]
      );
      
      const payloadHash = utils.solidityKeccak256(['bytes'], [payload]);
      const signature = await signer.signMessage(utils.arrayify(payloadHash));

      tx = await contract.submitTransaction(signature, destination, value, data); // , {from: userAddress} // chatgpt says its unnecessary
      console.log(tx)
    
      //Then
      // assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
      // assert.equal("LogSubmission", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
      // assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
    
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleRevoke = async () => {
    console.log("Generate & sign a revoke tx");

    // Given 
      let tx;
      let data;
      let NonceInBN;
      let nonce;
      let value = 0;
      let destination = ""; //
      
    // When
      data = "0x"
      NonceInBN = await contract.getNonce();
      nonce = NonceInBN.toString();
      const payload = utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes', 'uint256'],
          [destination, value, data, nonce]
      );
      
      const payloadHash = utils.solidityKeccak256(['bytes'], [payload]);
      const signature = await signer.signMessage(utils.arrayify(payloadHash));

      tx = await contract.revokeTransaction(signature, destination, value, data); // , {from: userAddress} // chatgpt says its unnecessary
      console.log(tx)
  };
  const handleApprove = async () => {
    console.log("Generate & sign an approve tx");

    // Given 
      let tx;
      let data;
      let NonceInBN;
      let nonce;
      let value = 0;
      let destination = ""; 
      
    // When
      data = "0x"
      NonceInBN = await contract.getNonce();
      nonce = NonceInBN.toString();
      const payload = utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes', 'uint256'],
          [destination, value, data, nonce]
      );
      
      const payloadHash = utils.solidityKeccak256(['bytes'], [payload]);
      const signature = await signer.signMessage(utils.arrayify(payloadHash));

      tx = await contract.confirmTransaction(signature, destination, value, data); // , {from: userAddress} // chatgpt says its unnecessary
      console.log(tx)
  };
  return (
    <>
      {transaction && (transaction._isBlocked || transaction._isExecuted) ? (
        // Show transaction information and a "Submit Transaction" button
        <Card title="Last Transaction">
          <TxInfo transaction={transaction} />
          <Button type="primary" className="custom-modal" onClick={showModal}>
            New Transaction
          </Button>
        </Card>
      ) : transaction._to === "0x0000000000000000000000000000000000000000" ? (
        <Card title="No Transactions">
          <Button type="primary" className="custom-modal" onClick={showModal}>
            New Transaction
          </Button>
        </Card>
      ) : transaction._to !== "0x0000000000000000000000000000000000000000" &&
        Number(transaction?._executeAfter) > Date.now()*0 ? (
        // Show transaction with "Revoke" and "Approve" buttons
        <Card title="Transaction Action">
          <TxInfo transaction={transaction} />
          <Button type="danger" onClick={handleRevoke}>
            Revoke
          </Button>
          <Button type="primary" onClick={handleApprove}>
            Approve
          </Button>
        </Card>
      ) : (
        <>N/A</>
      )}
      <Modal   
        title="New Transaction"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <Input placeholder="To Address" prefix={<UserOutlined />} />
        <br />
        <Input placeholder="Amount in ETH" prefix={<UserOutlined />} />
      </Modal>
    </>
  );
};

export default Transactions;
