/* eslint-disable react/prop-types */
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import useSound from "use-sound";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function App() {
    preload("./src/assets/landing_open.png");
    const bgMusic = "./bg_music.mp3";
    const doorSound = "./door.mp3";
    const transitionSound = "./transition.mp3";
    const doorRef = useRef(null);
    const containerRef = useRef(null);
    const [play, { pause }] = useSound(bgMusic, {
        volume: 0.6,
    });
    const [doorPlay] = useSound(doorSound, {
        volume: 1,
    });
    const [transitionPlay] = useSound(transitionSound, {
        volume: 1,
    });

    useEffect(() => {
        play();
        return () => {
            pause();
        };
    });

    function playDoorSound() {
        pause();
        gsap.to(doorRef.current, {
            duration: 0.7,
            scaleX: 0.6,
            x: -50,
            rotate: -5,
        });
        doorPlay();
        transitionPlay();
        gsap.to(containerRef.current, {
            delay: 0.7,
            duration: 5.1,
            scale: 15,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                window.location.href = "/dashboard";
            },
        });
    }

    return (
        <div ref={containerRef} className="container">
            <div className="landing-main"></div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} onClick={playDoorSound} className="enter-btn"></motion.div>
            <div ref={doorRef} className="door"></div>
        </div>
    );
}

export default App;
