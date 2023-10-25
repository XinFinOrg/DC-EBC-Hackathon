// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IXRC20.sol";

contract PerpetualDEX {
    address public admin;
    IXRC20 public collateralToken;
    uint256 public lastFundingTimestamp;
    uint256 public fundingRate;
    uint256 public currentPrice;
    uint256 public feeRate; // Trading fee rate, e.g., 0.005 for 0.5%

    enum Side { LONG, SHORT }
    enum State { OPEN, CLOSED }

    struct Position {
        address trader;
        uint256 size;
        uint256 entryPrice;
        Side side;
        State state;
    }

    Position[] public positions;
    mapping(address => int256) public collateralBalances;

    event PositionOpened(address indexed trader, uint256 positionId, uint256 size, uint256 entryPrice, Side side, uint256 positionId);
    event PositionClosed(address indexed trader, uint256 positionId, uint256 size, uint256 entryPrice, Side side, int256 profit);
    event FundingPaid(uint256 fundingPayment);

    constructor(address _collateralToken) {
        admin = msg.sender;
        collateralToken = IXRC20(_collateralToken);
        lastFundingTimestamp = block.timestamp;
        fundingRate = 0;
        currentPrice = 1000; // Initial index price
        feeRate = 500; // 0.5% fee
    }

    function openPosition(uint256 size, uint256 entryPrice, Side side) external {
        require(size > 0, "Size must be greater than 0");
        require(entryPrice > 0, "Entry price must be greater than 0");
        require(side == Side.LONG || side == Side.SHORT, "Invalid side");

        // Calculate collateral required
        uint256 collateralRequired = (size * entryPrice);

        positions.push(Position({
            trader: msg.sender,
            size: size,
            entryPrice: entryPrice,
            side: side,
            state: State.OPEN
        }));

        collateralBalances[msg.sender] += int256(collateralRequired);

        uint256 positionId = positions.length - 1;
        emit PositionOpened(msg.sender, positionId, size, entryPrice, side, positionId);
    }

    function closePosition(uint256 positionId) external {
        require(positionId < positions.length, "Position does not exist");

        Position storage position = positions[positionId];
        require(position.trader == msg.sender, "Only the owner can close the position");
        require(position.state == State.OPEN, "This position is already closed");

        uint256 size = position.size;
        uint256 entryPrice = position.entryPrice;
        Side side = position.side;

        int256 pnl = calculateProfitAndLoss(positionId);
        uint256 initialCost = getCostOfOpeningPosition(positionId);
        uint256 fee = (uint256(initialCost) * feeRate) / 1e4;
        int256 profit = pnl - int256(fee);
        collateralBalances[admin] += int256(fee);
        
        int256 adminGets = -profit;
        int256 traderGets = int256(initialCost) + profit;
        if(traderGets > 0){
            collateralToken.transfer(msg.sender, absoluteValue(traderGets));
        }
        
        if(-profit > int256(initialCost)){
            collateralBalances[msg.sender] -= int256(initialCost);
            collateralBalances[admin] += profit + int256(initialCost);
        } else
        {
            if(profit > 0)
                collateralBalances[msg.sender] -= int256(initialCost);
            else {
                collateralBalances[msg.sender] -= traderGets;
            }

            collateralBalances[admin] += adminGets;
        }

        collateralBalances[msg.sender] += int256(currentPrice * size);
        
        if(collateralBalances[msg.sender] < 0) {
            collateralBalances[admin] -= -collateralBalances[msg.sender];
        } else {
            collateralBalances[admin] += collateralBalances[msg.sender];
        }
        collateralBalances[msg.sender] = 0;

        emit PositionClosed(msg.sender, positionId, size, entryPrice, side, profit);

        positions[positionId].state = State.CLOSED;
    }

    function calculateProfitAndLoss(uint256 positionId) internal view returns (int256) {
        Position storage position = positions[positionId];
        uint256 size = position.size;
        uint256 entryPrice = position.entryPrice;
        Side side = position.side;

        if (side == Side.LONG) {
            return int256(currentPrice * size - entryPrice * size);
        } else {
            return int256(entryPrice * size - currentPrice * size);
        }
    }

    function getCostOfOpeningPosition(uint256 positionId) internal view returns (uint256) {
        Position storage position = positions[positionId];
        uint256 size = position.size;
        uint256 entryPrice = position.entryPrice;
        return entryPrice * size * 1e18;
    }

    function updatecurrentPrice(uint256 newPrice) external {
        require(msg.sender == admin, "Only admin can update index price");
        currentPrice = newPrice;
        uint256 timeElapsed = block.timestamp - lastFundingTimestamp;
        if (timeElapsed > 0) {
            updateFundingRate(timeElapsed);
            lastFundingTimestamp = block.timestamp;
        }
    }

    function updateFundingRate(uint256 timeElapsed) internal {
        // Implement a mechanism to calculate and update the funding rate based on timeElapsed.
        // This is a placeholder for educational purposes.
        // Formula: fundingRate = (currentPrice - previouscurrentPrice) / previouscurrentPrice * 86400 / timeElapsed
        fundingRate = (currentPrice * 1e18 - currentPrice * 1e18) * 86400 / timeElapsed / currentPrice;
    }

    function payFunding() external {
        uint256 timeElapsed = block.timestamp - lastFundingTimestamp;
        require(timeElapsed > 0, "Not time for funding payment yet");
        uint256 fundingPayment = (positions.length * fundingRate * timeElapsed) / 86400;
        collateralBalances[admin] += int256(fundingPayment);
        emit FundingPaid(fundingPayment);
        lastFundingTimestamp = block.timestamp;
    }

    function transferTokens(address to, uint256 value) public {
        require(collateralToken.transfer(to, value), "Token transfer failed");
    }

    function getTokenBalance(address owner) public view returns (uint256) {
        return collateralToken.balanceOf(owner);
    }

    function absoluteValue(int256 x) public pure returns (uint256) {
        if (x < 0) {
            return uint256(-x);
        }
        return uint256(x); 
    }
}