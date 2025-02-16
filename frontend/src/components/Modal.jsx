import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Modal = ({ modalVisible, setModalVisible }) => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log(modalVisible);
    }, [modalVisible]);
    return (
        <AnimatePresence>
            {modalVisible && (
                <motion.div key="modal" exit={{ opacity: 0, scale: 0.5 }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="modal">
                    <div className="modal-content">
                        <motion.span
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.8 }}
                            className="close"
                            onClick={() => {
                                setModalVisible(false);
                            }}
                        >
                            &times;
                        </motion.span>
                        <h2>Select your genre</h2>
                        <div className="buttons-list">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => {
                                    navigate("/book", { state: { genre: "adventure" } });
                                }}
                                className="button adv-btn"
                            ></motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => {
                                    navigate("/book", { state: { genre: "fantasy" } });
                                }}
                                className="button fan-btn"
                            ></motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => {
                                    navigate("/book", { state: { genre: "mystery" } });
                                }}
                                className="button mys-btn"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
