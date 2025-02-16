import Background from "./Background";
import BookSelect from "./BookSelect";
import CreateNew from "./CreateNew";
import Modal from "./Modal";
import WavingMouse from "./WavingMouse";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [allBooks, setAllBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/all-books")
            .then((response) => response.json())
            .then((data) => {
                setAllBooks(data);
            });
    }, []);

    return (
        <>
            <Background />
            <WavingMouse />
            <CreateNew setModalVisible={setModalVisible} />
            <div className="all-books">
                {allBooks.map((book, index) => (
                    <BookSelect key={index} title={book.title} genre={book.genre} />
                ))}
            </div>
            <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </>
    );
};

export default Dashboard;
