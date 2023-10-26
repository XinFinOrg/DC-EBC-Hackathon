import { ContractFactory } from 'ethers';

export async function contractDeployer(abi, bytecode, signer, ...constructorArgs) {
    
    
    // --- Venimirs code; needs hardhat (aka local blockchain) to work
    // const deployer = signer;
    // const LegacyWallet = await getContractFactory("LegacyWallet", deployer);
    // constlegacyWallet = await LegacyWallet.deploy(ownersAddresses, executionTimeSpanInSeconds);
    // await legacyWallet.deployed();
    // console.log("LegacyWallet deployed to:", legacyWallet.address);


    // Create a Contract Factory
    const contractFactory = new ContractFactory(abi, bytecode, signer);

    // Deploy the contract and wait for it to be mined
    const contract = await contractFactory.deploy(...constructorArgs);

    // TODO which one to use?
    await contract.deployed();
    // await contract.deployTransaction.wait();

    return contract;

    // $: contract.address
    // '0x00777F1b1439BDc7Ad1d4905A38Ec9f5400e0e26'

    // $: contract.deployTransaction
    // {
    //   accessList: [],
    //   chainId: 123456,
    //   confirmations: 0,
    //   data: '0x608060405234801561001057600080fd5b5060405161012e38038061012e8339818101604052604081101561003357600080fd5b81019080805190602001909291908051906020019092919050505081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060008190555050506088806100a66000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000805490509056fea2646970667358221220926465385af0e8706644e1ff3db7161af699dc063beaadd55405f2ccd6478d7564736f6c634300070400330000000000000000000000005555763613a12d8f3e73be831dff8598089d3dca000000000000000000000000000000000000000000000000000000000000002a',
    //   from: '0x46E0726Ef145d92DEA66D38797CF51901701926e',
    //   gasLimit: { BigNumber: "129862" },
    //   gasPrice: null,
    //   hash: '0x293aeb5aaa782c45d56aa13e67c8dabe5a34726c68539302401c15a1699074fa',
    //   maxFeePerGas: { BigNumber: "1500000014" },
    //   maxPriorityFeePerGas: { BigNumber: "1500000000" },
    //   nonce: 0,
    //   r: '0x6708733f3523a5efc1a5bee891a3020c1d0a622f03ccaa437763241550d93ac7',
    //   s: '0x3065f4437666753b4216bf8518e5c6221d0cf8f86b57857ac268c128a5c2d53c',
    //   to: null,
    //   type: 2,
    //   v: 0,
    //   value: { BigNumber: "0" },
    //   wait: [Function (anonymous)]
    // }
    //  - returns the receipt
    //  - throws on failure (the reciept is on the error)
}