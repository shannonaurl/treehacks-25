import { useNavigate } from "react-router-dom";

const Background = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="background"></div>
            <div className="nav">
                <div className="icons fav"></div>
                <div className="icons settings"></div>
                <div className="icons profile"></div>
            </div>
            <div
                onClick={() => {
                    navigate("/");
                }}
                className="booksy-logo"
            ></div>
        </>
    );
};

export default Background;
