import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const Modal = ({ modalVisible, setModalVisible }) => {
    useEffect(() => {
        console.log(modalVisible);
    }, [modalVisible]);
    return (
        <AnimatePresence>
            {modalVisible && (
                <motion.div key="modal" exit={{ opacity: 0, scale: 0.5 }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="modal">
                    <div className="modal-content">
                        <span
                            className="close"
                            onClick={() => {
                                setModalVisible(false);
                            }}
                        >
                            &times;
                        </span>
                        <h2>Select your genre</h2>
                        <div className="buttons-list">
                            <div className="button adv-btn"></div>
                            <div className="button fan-btn"></div>
                            <div className="button mys-btn"></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
