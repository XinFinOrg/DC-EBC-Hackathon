import React from "react";
import { List, Card, Table  } from "antd";
import { Link } from "react-router-dom";


const OwnerList = ({ owners }) => {
  console.log(`Owners: ${owners}`);
  return (
      <Card title="List of Owners" bordered={true}>
        <List
          dataSource={owners}
          renderItem={(owner) => <List.Item><Link to={'https://etherscan.io/address/' + owner}>{owner}</Link></List.Item>}
        />
      </Card>
  );
};

export default OwnerList;
