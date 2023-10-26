import React from "react";

const TxInfo = ({ transaction }) => {
  console.log(`Owners: ${transaction}`);
  return (
    <>
      <p>to: {transaction.to}</p>
      <p>amount: {transaction?.value / 1000000000}</p>
      <p>
        status:{" "}
        {transaction?.isBlocked
          ? "Blocked"
          : transaction?.isExecuted
          ? "Executed"
          : transaction?.to !== "0x0000000000000000000000000000000000000000"
          ? "Submitted"
          : "Unknown"}
      </p>
    </>
  );
};

export default TxInfo;
