const LegacyWallet = artifacts.require("LegacyWallet");
const utils = require("./test_utils.js");

contract("Security Wallet tests", accounts => {

  let LegacyWalletInstance;

  let authorized = accounts[9];
  let nonceCounter = 0;
  before(async() => {
    LegacyWalletInstance = await LegacyWallet.deployed();
  });

  describe("LegacyWallet", async () => {
    describe("1.LegacyWallet:revoke transaction", async () => {      
      it("1.should submitTransaction successfully", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.submitTransaction(signature, accounts[9], value, data, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogSubmission", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
      it("2.should confirmTransaction successfully from 1st owner", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.confirmTransaction(signature, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogConfirmation", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
      it("3.should revokeTransaction successfully from 2nd owner", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[1]);

          tx = await LegacyWalletInstance.revokeTransaction(signature, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogRevocation", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
          nonceCounter++
      });
    });

    describe("1.LegacyWallet:execute transaction", async () => {      
      it("1.should submitTransaction successfully", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.submitTransaction(signature, accounts[9], value, data, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogSubmission", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
      it("2.should confirmTransaction successfully from 1st owner", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.confirmTransaction(signature, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogConfirmation", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
      it("3.should executeTransaction successfully from 2nd owner", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[1]);
          await utils.timeTravel(24*60*60)
          tx = await LegacyWalletInstance.executeTransaction(signature, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogExecution", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
          nonceCounter++
      });
    });
    describe("1.LegacyWallet:revoke transaction", async () => {      
      it("1.should submitTransaction successfully", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.submitTransaction(signature, accounts[9], value, data, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogSubmission", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
      it("2.should confirmTransaction successfully from 1st owner", async () => {
        // Given 
          let tx;
          let data;
          let NonceInBN;
          let nonce;
          let value = 0;
        // When
          data = "0x"
          NonceInBN = await LegacyWalletInstance.getNonce();
          nonce = NonceInBN.toString();
          payload = web3.eth.abi.encodeParameters(['address','uint256','bytes','uint256'],[accounts[9],value,data,nonce]);
          payloadHash = web3.utils.soliditySha3(payload);
          signature = await web3.eth.sign(payloadHash, accounts[0]);

          tx = await LegacyWalletInstance.confirmTransaction(signature, {from: accounts[0]});
          // console.log(tx)
        //Then
          assert.equal(true, tx.receipt.status , "Transaction was unsuccessfull!");
          assert.equal("LogConfirmation", tx.receipt.logs[0].event , "Transaction do not emit proper Event!");
          assert.equal(nonceCounter, tx.receipt.logs[0].args[1], "Wrong transctionId!");
      });
    });
  });
  
});