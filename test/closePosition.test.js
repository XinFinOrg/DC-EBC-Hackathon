const { expectRevert, time } = require('@openzeppelin/test-helpers');
const PerpetualDEX = artifacts.require('PerpetualDEX');

contract('PerpetualDEX', (accounts) => {
    let dexInstance;
    [contractDeployer, long1, long2, short1, short2, user] = accounts

    before(async () => {
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

    it('should close short2 position correctly', async () => {
        const short2Index = 3;
        const initialBalance = await dexInstance.collateralBalances(short2);
        const tx = await dexInstance.closePosition(short2Index, { from: short2 });

        const finalBalance = await dexInstance.collateralBalances(short2);
        console.log('Final balance', finalBalance)
        assert.equal(finalBalance.toNumber(), 0);

        // assert event
        const { logs } = tx;
        assert.ok(Array.isArray(logs));
        assert.equal(logs.length, 1);

        const log = logs[0];
        assert.equal(log.event, 'PositionClosed');
        assert.equal(log.args.profit, 1);
    });

    it('should close long1 position correctly', async () => {
        const short2Index = 0;
        const initialBalance = await dexInstance.collateralBalances(long1);
        const tx = await dexInstance.closePosition(short2Index, { from: long1 });

        const finalBalance = await dexInstance.collateralBalances(long1);
        console.log('Final balance', finalBalance)
        assert.equal(finalBalance.toNumber(), 0);

        // assert event
        const { logs } = tx;
        assert.ok(Array.isArray(logs));
        assert.equal(logs.length, 1);

        const log = logs[0];
        assert.equal(log.event, 'PositionClosed');
        assert.equal(log.args.profit, 0);
    });


    it('should not allow to close already closed position', async () => {
        await dexInstance.closePosition(2, { from: short1 });
        await expectRevert(dexInstance.closePosition(2, { from: short1 }), 'This position is already closed.')
    })

});
