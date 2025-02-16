import { motion } from "motion/react";

// eslint-disable-next-line react/prop-types
const BookSelect = ({ title, genre }) => {
    return (
        <>
            {genre === "adventure" && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} className="select adventure-book">
                    <p className="list-title">{title}</p>
                </motion.div>
            )}
            {genre === "fantasy" && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} className="select fantasy-book">
                    <p className="list-title">{title}</p>
                </motion.div>
            )}
            {genre === "mystery" && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} className="select mystery-book">
                    <p className="list-title">{title}</p>
                </motion.div>
            )}
        </>
    );
};

export default BookSelect;
