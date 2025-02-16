import { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = () => {
    const bookRef = useRef(null);
    return (
        <div className="book-container">
            <HTMLFlipBook width={500} height={620} className="flip-book" drawShadow={true} maxShadowOpacity={0.5} ref={bookRef}>
                <div className="page">Page 1</div>
                <div className="page">Page 2</div>
                <div className="page">Page 3</div>
                <div className="page">Page 4</div>
            </HTMLFlipBook>

            <div onClick={() => bookRef.current.pageFlip().flipNext()} className="flip-button"></div>
        </div>
    );
};

export default Book;
