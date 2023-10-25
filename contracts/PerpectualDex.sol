// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IXRC20.sol";

contract PerpetualDEX {
    address public admin;
    IXRC20 public collateralToken;
    uint256 public lastFundingTimestamp;
    uint256 public fundingRate;
    uint256 public indexPrice;
    uint256 public feeRate; // Trading fee rate, e.g., 0.005 for 0.5%

    enum Side { LONG, SHORT }

    struct Position {
        address trader;
        uint256 size;
        uint256 entryPrice;
        Side side;
    }

    Position[] public positions;
    mapping(address => uint256) public collateralBalances;

    event PositionOpened(address indexed trader, uint256 positionId, uint256 size, uint256 entryPrice, Side side);
    event PositionClosed(address indexed trader, uint256 positionId, uint256 size, uint256 entryPrice, Side side, uint256 profit);
    event FundingPaid(uint256 fundingPayment);

    constructor(address _collateralToken) {
        admin = msg.sender;
        collateralToken = IXRC20(_collateralToken);
        lastFundingTimestamp = block.timestamp;
        fundingRate = 0;
        indexPrice = 1000; // Initial index price
        feeRate = 500; // 0.5% fee
    }

    function openPosition(uint256 size, uint256 entryPrice, Side side) external {
        require(size > 0, "Size must be greater than 0");
        require(entryPrice > 0, "Entry price must be greater than 0");
        require(side == Side.LONG || side == Side.SHORT, "Invalid side");

        // Calculate collateral required
        uint256 collateralRequired = (size * entryPrice) * indexPrice / 1e18;

        require(collateralBalances[msg.sender] >= collateralRequired, "Insufficient collateral");

        positions.push(Position({
            trader: msg.sender,
            size: size,
            entryPrice: entryPrice,
            side: side
        }));

        collateralBalances[msg.sender] -= collateralRequired;

        uint256 positionId = positions.length - 1;
        emit PositionOpened(msg.sender, positionId, size, entryPrice, side);
    }

    function closePosition(uint256 positionId) external {
        require(positionId < positions.length, "Position does not exist");

        Position storage position = positions[positionId];
        require(position.trader == msg.sender, "Only the owner can close the position");

        uint256 size = position.size;
        uint256 entryPrice = position.entryPrice;
        Side side = position.side;

        uint256 pnl = calculateProfitAndLoss(positionId);

        uint256 fee = (pnl * feeRate) / 1e4;
        uint256 profit = pnl - fee;

        collateralBalances[msg.sender] += (entryPrice * size * indexPrice) / 1e18;
        collateralBalances[admin] += fee;

        emit PositionClosed(msg.sender, positionId, size, entryPrice, side, profit);

        // Remove the closed position by moving the last position to this index and truncating the array
        positions[positionId] = positions[positions.length - 1];
        positions.pop();
    }

    function calculateProfitAndLoss(uint256 positionId) internal view returns (uint256) {
        Position storage position = positions[positionId];
        uint256 size = position.size;
        uint256 entryPrice = position.entryPrice;
        Side side = position.side;

        uint256 currentPrice = indexPrice; // Replace with a real price source.

        if (side == Side.LONG) {
            return (currentPrice * size - entryPrice * size) / 1e18;
        } else {
            return (entryPrice * size - currentPrice * size) / 1e18;
        }
    }

    function updateIndexPrice(uint256 newPrice) external {
        require(msg.sender == admin, "Only admin can update index price");
        indexPrice = newPrice;
        uint256 timeElapsed = block.timestamp - lastFundingTimestamp;
        if (timeElapsed > 0) {
            updateFundingRate(timeElapsed);
            lastFundingTimestamp = block.timestamp;
        }
    }

    function updateFundingRate(uint256 timeElapsed) internal {
        // Implement a mechanism to calculate and update the funding rate based on timeElapsed.
        // This is a placeholder for educational purposes.
        // Formula: fundingRate = (indexPrice - previousIndexPrice) / previousIndexPrice * 86400 / timeElapsed
        fundingRate = (indexPrice * 1e18 - indexPrice * 1e18) * 86400 / timeElapsed / indexPrice;
    }

    function payFunding() external {
        uint256 timeElapsed = block.timestamp - lastFundingTimestamp;
        require(timeElapsed > 0, "Not time for funding payment yet");
        uint256 fundingPayment = (positions.length * fundingRate * timeElapsed) / 86400;
        collateralBalances[admin] += fundingPayment;
        emit FundingPaid(fundingPayment);
        lastFundingTimestamp = block.timestamp;
    }
}