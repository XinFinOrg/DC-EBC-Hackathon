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
        assert.equal(finalBalance.toNumber(), size * entryPrice * 1e18);
    });


});
