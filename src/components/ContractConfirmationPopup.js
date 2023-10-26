import React from 'react';

import { Button, Modal } from "antd";

function ContractConfirmationPopup(props) {
    return (
        <Modal
            title="Confirmation"
            open={props.isModalOpen}
            onOk={props.handleOk}
            onCancel={props.handleCancel}
        >
            <p>addresses: {props.ownerAddresses}</p>
            <p>hours: {props.hours}</p>

            <br />
            <Button className="custom-modal" type="danger">Reject</Button>
            <Button className="custom-modal" type="primary">Confirm</Button>
        </Modal>
    );
}
export default ContractConfirmationPopup;