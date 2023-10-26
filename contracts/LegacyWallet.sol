/// @author Venimir Petkov
/// @title Legacy Wallet - Allows multiple parties to agree on transactions before execution.

// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./libraries/ECDSA.sol";
import "./interfaces/ILegacyWallet.sol";

// LegacyWallet => LW

contract LegacyWallet is ILegacyWallet {
    using ECDSA for bytes32;

    uint256 private _nonce;
    bool private _locked;

    uint256 public constant INCREMENT = 1;

    uint256 public immutable EXECUTION_TIME_SPAN;
    uint256 public immutable OWNER_SUBSCRATION_TIME_SPAN;

    mapping(address => bool) internal isOwner;
    mapping(uint => Transaction) internal transactions;

    address[] internal owners;

    struct Transaction {
        address payable to;
        uint value;
        bytes data;
        bool blocked;
        mapping(address => bool) isOwnerConfirmed;
        uint couldExecuteAfter;
        bool executed;
    }

    modifier noReentrancy() {
        require(!_locked, "lw::noReentrancy:Reentrant call.");
        _locked = true;
        _;
        _locked = false;
    }

    constructor(address[] memory _owners_, uint256 executionTimeSpanInSeconds) {
        require(
            executionTimeSpanInSeconds >= INCREMENT,
            "lw::constructor:executionTimeInSeconds must be greater than zero"
        );

        require(
            executionTimeSpanInSeconds % _owners_.length == 0,
            "lw::constructor:executionTimeSpanInSeconds reminder"
        );

        for (uint256 i = 0; i < _owners_.length; i++) {
            require(
                !isOwner[_owners_[i]] && _owners_[i] != address(0),
                "lw::constructor: Invalid owner address or address already registered as owner"
            );
            isOwner[_owners_[i]] = true;
        }

        OWNER_SUBSCRATION_TIME_SPAN = executionTimeSpanInSeconds / _owners_.length;
        _nonce = 0;

        EXECUTION_TIME_SPAN = executionTimeSpanInSeconds;
        emit LogInit(_owners_, executionTimeSpanInSeconds);
    }

    //Check does last transaction is executed and the value and process the transaction for load
    function submitTransaction(
        bytes calldata signature,
        address payable to,
        uint value,
        bytes calldata data
    ) public noReentrancy {
        require(to != address(0), "lw::submitTransaction:to address is 0");

        bytes memory payload = abi.encode(to, value, data, _nonce);
        address signatureOwner = keccak256(payload)
            .toEthSignedMessageHash()
            .recover(signature);
        require(
            isOwner[signatureOwner] == true,
            "lw::submitTransaction:Failed to verify signature"
        );

        addTransaction(to, value, data, _nonce);
        emit LogSubmission(signatureOwner, _nonce, data);
    }

    // Owners can confirm transaction for faster execution
    function confirmTransaction(
        bytes calldata signature
    ) public override noReentrancy {
        Transaction storage txn = transactions[_nonce];
        require(
            txn.to != address(0),
            "lw::confirmTransaction:transaction do not exist"
        );

        bytes memory payload = abi.encode(txn.to, txn.value, txn.data, _nonce);
        address signatureOwner = keccak256(payload)
            .toEthSignedMessageHash()
            .recover(signature);
        require(
            isOwner[signatureOwner] == true,
            "lw::confirmTransaction:Failed to verify signature"
        );

        require(
            txn.isOwnerConfirmed[msg.sender] == false,
            "lw::confirmTransaction:you already confirmed"
        );

        require(
            txn.blocked == false,
            "lw::confirmTransaction:transaction is blocked"
        );

        require(
            txn.executed == false,
            "lw::confirmTransaction:transaction is executed"
        );

        txn.couldExecuteAfter = txn.couldExecuteAfter - OWNER_SUBSCRATION_TIME_SPAN;
        txn.isOwnerConfirmed[msg.sender] = true;

        emit LogConfirmation(signatureOwner, _nonce);
    }

    function revokeTransaction(bytes calldata signature) public noReentrancy {
        Transaction storage txn = transactions[_nonce];
        require(
            txn.couldExecuteAfter != 0,
            "lw::revokeTransaction:transaction do not exist"
        );

        bytes memory payload = abi.encode(txn.to, txn.value, txn.data, _nonce);
        address signatureOwner = keccak256(payload)
            .toEthSignedMessageHash()
            .recover(signature);
        require(
            isOwner[signatureOwner] == true,
            "lw::revokeTransaction:Failed to verify signature"
        );

        require(
            txn.blocked == false,
            "lw::revokeTransaction:Transaction already blocked"
        );
        require(
            txn.executed == false,
            "lw::revokeTransaction:Transaction already executed"
        );

        txn.blocked = true;
        txn.executed = true;
        emit LogRevocation(signatureOwner, _nonce);
        _nonce = _nonce + INCREMENT;
    }

    //Execute transfer and send the value of the transaction
    function executeTransaction(
        bytes calldata signature
    ) public returns (bool success, bytes memory result) {
        Transaction storage txn = transactions[_nonce];
        require(
            txn.to != address(0),
            "lw::executeTransaction:transaction do not exist"
        );

        bytes memory payload = abi.encode(txn.to, txn.value, txn.data, _nonce);
        address signatureOwner = keccak256(payload)
            .toEthSignedMessageHash()
            .recover(signature);
        require(
            isOwner[signatureOwner] == true,
            "lw::confirmTransaction:Failed to verify signature"
        );

        require(
            txn.blocked == false,
            "lw::executeTransaction:transaction is blocked"
        );
        require(
            txn.executed == false,
            "lw::executeTransaction:transaction is executed"
        );

        (success, result) = invoke(txn.to, txn.value, txn.data);
        txn.executed = success;
        emit LogExecution(signatureOwner, _nonce, result, success);
        _nonce = _nonce + INCREMENT;
    }

    function invoke(
        address _to,
        uint256 _value,
        bytes memory _data
    ) private noReentrancy returns (bool success, bytes memory _result) {
        (success, _result) = _to.call{value: _value}(_data);
        if (!success) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

    //Create transaction and push it to the array
    function addTransaction(
        address payable destination,
        uint256 value,
        bytes calldata data,
        uint256 nonce
    ) private {
        Transaction storage t = transactions[nonce];
        t.to = destination;
        t.value = value;
        t.data = data;
        t.blocked = false;
        t.couldExecuteAfter = block.timestamp + EXECUTION_TIME_SPAN;
        t.executed = false;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value);
    }

    /**
     * @dev Returns nonce;
     */
    function getNonce() external view returns (uint256 nonce) {
        return _nonce;
    }

    function getIsOwner(
        address owner
    ) external view override returns (bool _isOwner_) {
        return isOwner[owner];
    }

    function getIsOwnerConfirmed(
        uint256 nonce,
        address owner
    ) external view override returns (bool isOwnerConfirmed) {
        return transactions[nonce].isOwnerConfirmed[owner];
    }

    //Get transaction data
    function getTransaction(
        uint256 nonce_
    )
        public
        view
        returns (
            address _to,
            uint _value,
            bytes memory _data,
            bool _isBlocked,
            uint _executeAfter,
            bool _isExecuted
        )
    {
        Transaction storage txn = transactions[nonce_];
        return (
            txn.to,
            txn.value,
            txn.data,
            txn.blocked,
            txn.couldExecuteAfter,
            txn.executed
        );
    }
}
