import Background from "./Background";
import CreateNew from "./CreateNew";
import Modal from "./Modal";
import WavingMouse from "./WavingMouse";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            return;
        }
        fetch(`http://localhost:3000/login?email=${user.email}&name=${user.name}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [user, isAuthenticated]);

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
