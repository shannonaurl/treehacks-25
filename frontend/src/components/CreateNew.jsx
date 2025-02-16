/* eslint-disable react/prop-types */
import { motion } from "motion/react";

const CreateNew = ({ setModalVisible }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            onClick={() => {
                setModalVisible(true);
            }}
            className="create-new"
        ></motion.div>
    );
};

export default CreateNew;
