async function timeTravel(time) {
    await web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [time] // in seconds
    }, () => {});
    // for unknown reason, omitting the second parameter (callback)
  }

  async function mineBlock() {
    await web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_mine"
    }, () => {});
    // for unknown reason, omitting the second parameter (callback)
  }

  function timeConverter(UNIX_timestamp){
    var a = new Date(parseInt(UNIX_timestamp) * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  async function getTxError(err){
    let txError = err;
    if(!txError.reason && txError.code !== -32000){
        txError.reason = await getRevertReasonFromTx(err.tx);
    }else if(txError.code === -32000){
        txError.reason = txError.message;
    }
    return txError;
  }
  
  async function getRevertReasonFromTx(txHash){
      var result;
      const tx = await web3.eth.getTransaction(txHash);
      try {
        await web3.eth.call(tx, tx.blockNumber);
      } catch (error) {
        result = error.toString().split("0x");
      }
  
      let resultInHex = result[1].startsWith('0x') ? result[1] : `0x${result[1]}`;
  
      if (resultInHex && resultInHex) {
        const reason = toAscii(resultInHex.substring(138));
        return reason;
      } else {
        throw 'Cannot get reason - No return value';
      }
  }
  
  function toAscii(hex) {
    var str = '',
        i = 0,
        l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code === 0){
          continue;
        }
        str += String.fromCharCode(code);
    }
    return str;
  };

module.exports.getTxError = getTxError;
module.exports.timeTravel = timeTravel;
module.exports.mineBlock = mineBlock;
module.exports.timeConverter = timeConverter;
