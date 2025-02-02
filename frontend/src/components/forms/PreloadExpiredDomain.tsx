"use client"
import Lottie from "react-lottie-player";
import loadingAnimation from "../../../public/preload/expiredDomain.json"; // Adjust the path as needed

export default function LoadingExpiredDomains({ color = "#ff0000" }) {
    return (
        <div className="flex justify-center">
            <Lottie
                loop
                animationData={loadingAnimation}
                play
                style={{
                    width: 300,
                    height: 300,
                    filter: `invert(48%) sepia(94%) saturate(200%) hue-rotate(0deg) brightness(90%) contrast(120%)`, // Adjust filter for color change
                }}
            />
        </div>
    );
}


