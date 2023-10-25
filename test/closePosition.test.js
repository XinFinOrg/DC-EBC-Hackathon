const { expectRevert, time } = require('@openzeppelin/test-helpers');
const PerpetualDEX = artifacts.require('PerpetualDEX');

contract('PerpetualDEX', (accounts) => {
    let dexInstance;
    [long1 , long2 , short1 , short2 , user] = accounts

    before(async () => {
        console.log('Accounts', accounts[2])
        dexInstance = await PerpetualDEX.new(accounts[0]);
        let size, entryPrice, side


        //long1
        size = 10
        entryPrice = 999
        side = 0
        await dexInstance.openPosition(size, entryPrice, side, { from: long1 });

        //long2
        size = 5
        entryPrice = 998
        side = 0
        await dexInstance.openPosition(size, entryPrice, side, { from: long2 });

        //short1
        size = 5
        entryPrice = 1001
        side = 1
        await dexInstance.openPosition(size, entryPrice, side, { from: short1 });

        //short2
        size = 10
        entryPrice = 1002
        side = 1
        await dexInstance.openPosition(size, entryPrice, side, { from: short2 });

    });

    it('should close short2 position', async () => {
        const initialBalance = await dexInstance.collateralBalances(short2);
        await dexInstance.closePosition(3);

        const finalBalance = await dexInstance.collateralBalances(short2);
        console.log('Final balance', finalBalance)
        assert.equal(finalBalance.toNumber(), size * entryPrice * 1e18);
    });


    // it('should allow closing a position', async () => {
    //     // Open a position first

    //     const positionId = 0;
    //     const initialBalance = await dexInstance.collateralBalances(accounts[1]);
    //     await dexInstance.closePosition(positionId, { from: accounts[1] });

    //     const finalBalance = await dexInstance.collateralBalances(accounts[1]);

    //     assert.equal
    // });


});
