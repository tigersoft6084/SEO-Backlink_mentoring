"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/preload/subscription.json";

export default function PreloadSubscription({ onLoad }: { onLoad: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onLoad();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onLoad]);

    if (!isVisible) return null;

    return (
        <div className="flex justify-center items-center py-10">
            <Lottie animationData={animationData} loop className="w-64 h-64" />
        </div>
    );
}
