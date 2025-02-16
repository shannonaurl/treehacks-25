import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import { ReactMic } from "react-mic";
import { motion } from "motion/react";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

const Book = () => {
    const { state } = useLocation();
    const { genre } = state;
    const bookRef = useRef(null);
    const audioRef = useRef(null);
    const [pages, setPages] = useState([]);
    const [bookId, setBookId] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/new?genre=${genre}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBookId(data.book_id);
                setPages((prevPages) => [
                    ...prevPages,
                    {
                        type: "text",
                        content: data.story,
                    },
                    {
                        type: "image",
                        content: data.image,
                    },
                ]);
                audioRef.current.src = data.voice;
                audioRef.current.play();
            });
    }, []);

    const nextFunction = (prompt = "") => {
        fetch(`http://localhost:3000/next?book_id=${bookId}&prompt=${prompt}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPages((prevPages) => [
                    ...prevPages,
                    {
                        type: "text",
                        content: data.story,
                    },
                    {
                        type: "image",
                        content: data.image,
                    },
                ]);
                audioRef.current.src = data.voice;
                audioRef.current.play();
                setTimeout(() => {
                    bookRef.current.pageFlip().flipNext();
                }, 1000);
            })
            .catch((error) => {
                console.error("Error fetching next page:", error);
            });
    };

    async function speechToText(blob) {
        const file = new File([blob], "audio.m4a", { type: "audio/m4a" });

        // Create FormData and append the file
        const formData = new FormData();
        formData.append("file", file);

        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3-turbo",
            response_format: "json",
        });

        nextFunction(transcription.text);
    }

    return (
        <div className="book-container">
            {pages.length > 0 && <div className="speaking-mouse"></div>}
            <HTMLFlipBook width={500} height={620} className="flip-book" drawShadow={true} maxShadowOpacity={0.5} ref={bookRef}>
                {pages.map((page, index) => (
                    <div key={index} className="page">
                        {page.type === "text" ? <div className="text">{page.content}</div> : <div className="image" style={{ background: `url(${page.content}) no-repeat center center/cover` }}></div>}
                    </div>
                ))}
            </HTMLFlipBook>

            {pages.length > 0 && <div onClick={nextFunction} className="flip-button"></div>}
            {pages.length > 0 && (
                <ReactMic
                    record={isRecording}
                    visualSetting="sinewave"
                    strokeColor="#F9B792"
                    backgroundColor="#4A3338"
                    className={"mic"}
                    noiseSuppression={true}
                    onStop={(e) => {
                        speechToText(e.blob);
                    }}
                />
            )}

            {!isRecording && (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                        setIsRecording(true);
                    }}
                    className="start-btn"
                ></motion.div>
            )}
            {isRecording && (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                        setIsRecording(false);
                    }}
                    className="stop-btn"
                ></motion.div>
            )}

            <audio hidden ref={audioRef}></audio>
            {pages.length === 0 && <div className="loading">Generating your story...</div>}
        </div>
    );
};

export default Book;
