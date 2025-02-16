import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";

const Share = () => {
    const [searchParams] = useSearchParams();
    console.log(searchParams);
    const book_id = searchParams.get("book_id");
    console.log(book_id);
    const bookRef = useRef(null);
    const audioRef = useRef(null);
    const [title, setTitle] = useState("");
    const [pages, setPages] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/share?book_id=${book_id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setTitle(data[0].title);
                data = data[0].pages;
                const result = [];
                data.forEach((page) => {
                    result.push({
                        type: "text",
                        content: page.text,
                        voice: page.voice_url,
                    });
                    result.push({
                        type: "image",
                        content: page.image_url,
                    });
                });
                setPages(result);
                audioRef.current.src = data[0].voice_url;
                audioRef.current.play();
            });
    }, []);

    function nextFunction() {
        bookRef.current.pageFlip().flipNext();
        audioRef.current.src = pages[bookRef.current.pageFlip().getCurrentPageIndex() + 2].voice;
        audioRef.current.play();
    }

    function prevFunction() {
        bookRef.current.pageFlip().flipPrev();
        audioRef.current.src = pages[bookRef.current.pageFlip().getCurrentPageIndex() - 2].voice;
        audioRef.current.play();
    }

    return (
        <>
            <div className="book-container">
                {title && <h1 className="title">{title}</h1>}
                <div className="speaking-mouse"></div>
                <HTMLFlipBook width={500} height={620} className="flip-book" drawShadow={true} maxShadowOpacity={0.5} ref={bookRef}>
                    {pages.map((page, index) => (
                        <div key={index} className="page">
                            {page.type === "text" ? (
                                <div className="text">{page.content}</div>
                            ) : (
                                <div className="image" style={{ background: `url(${page.content}) no-repeat center center/cover` }}></div>
                            )}
                        </div>
                    ))}
                </HTMLFlipBook>

                <div onClick={nextFunction} className="next-button"></div>
                <div onClick={prevFunction} className="prev-button"></div>

                <audio hidden ref={audioRef}></audio>
            </div>
        </>
    );
};

export default Share;
