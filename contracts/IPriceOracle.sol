// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;


interface IPriceOracle {
    function getPrice(string memory tradingPair) external view returns (uint256);
}
