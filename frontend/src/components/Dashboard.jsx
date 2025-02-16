import Background from "./Background";
import CreateNew from "./CreateNew";
import Modal from "./Modal";
import WavingMouse from "./WavingMouse";
import { useState } from "react";

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <Background />
            <WavingMouse />
            <CreateNew setModalVisible={setModalVisible} />
            <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </>
    );
};

export default Dashboard;
