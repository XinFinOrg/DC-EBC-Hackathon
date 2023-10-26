// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ILegacyWallet {
    function submitTransaction(
        bytes calldata signature,
        address payable to,
        uint256 value,
        bytes calldata data
    ) external;

    function confirmTransaction(bytes calldata signature) external;

    function revokeTransaction(bytes calldata signature) external;

    function executeTransaction(
        bytes calldata signature
    ) external returns (bool success, bytes memory result);

    function getNonce() external view returns (uint256 nonce);

    function getTransaction(
        uint256 nonce_
    )
        external
        view
        returns (
            address _to,
            uint256 _value,
            bytes memory _data,
            bool _isBlocked,
            uint256 _executeAfter,
            bool _isExecuted
        );

    function getIsOwnerConfirmed(
        uint256 nonce_,
        address _owner
    ) external view returns (bool _isOwnerConfirmed);

    function getIsOwner(address owner) external view returns (bool _isOwner_);

    event Received(address indexed sender, uint256 indexed value);
    event Fallback(address indexed sender, uint256 indexed value);

    event LogInit(address[] owners, uint256 executionTimeSpanInSeconds);

    event LogSubmission(
        address indexed owner,
        uint256 indexed transactionId,
        bytes data
    );
    event LogConfirmation(address indexed owner, uint256 indexed transactionId);
    event LogExecution(
        address indexed owner,
        uint256 indexed transactionId,
        bytes result,
        bool success
    );
    event LogRevocation(address indexed owner, uint256 indexed transactionId);
}
