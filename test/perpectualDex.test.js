const { expectRevert, time } = require('@openzeppelin/test-helpers');
const PerpetualDEX = artifacts.require('PerpetualDEX');

contract('PerpetualDEX', (accounts) => {
    let dexInstance;

    before(async () => {
        console.log('Accounts', accounts[2])
        dexInstance = await PerpetualDEX.new(accounts[0]);
    });

    it('should allow opening a position', async () => {
        const size = 10;
        const entryPrice = 1000;
        const side = 0; // 0 for LONG, 1 for SHORT

        // Ensure accounts[1] has enough collateral to open a position

        const initialBalance = await dexInstance.collateralBalances(accounts[1]);
        await dexInstance.openPosition(size, entryPrice, side, { from: accounts[1] });

        const finalBalance = await dexInstance.collateralBalances(accounts[1]);
        console.log('Final balance', finalBalance)
        assert.equal(finalBalance.toNumber(), initialBalance.toNumber() - size * entryPrice);
    });

    it('should not allow opening a position with insufficient collateral', async () => {
        const size = 10;
        const entryPrice = 1000;
        const side = 0;

        // Ensure accounts[2] does not have enough collateral to open a position

        await expectRevert(
            dexInstance.openPosition(size, entryPrice, side, { from: accounts[2] }),
            'Insufficient collateral'
        );
    });

    it('should allow closing a position', async () => {
        // Open a position first

        const positionId = 0;
        const initialBalance = await dexInstance.collateralBalances(accounts[1]);
        await dexInstance.closePosition(positionId, { from: accounts[1] });

        const finalBalance = await dexInstance.collateralBalances(accounts[1]);

        // Add your assertions for profit and balance changes
    });


});
