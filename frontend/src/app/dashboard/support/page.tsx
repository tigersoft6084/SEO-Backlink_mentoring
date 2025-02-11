"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import discordAnimation from '../../../../public/lottie/discord.json';
import chromeAnimation from '../../../../public/lottie/chrome.json';
import discordAnimalAnimation from '../../../../public/lottie/discordAnimal.json';

export default function Support() {

    return (

        <div className="flex flex-row justify-center justify-items-center items-center h-screen mx-auto space-x-48" style={{marginTop : "-100px"}}>
            <div className="flex flex-col">
                <a href="https://discord.gg/DtqthxBa" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <Lottie loop animationData={discordAnimalAnimation} play style={{ width: 200, height: 200 }} speed={0.6} />
                </a>
                <a href="https://discord.gg/DtqthxBa" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <Lottie loop animationData={discordAnimation} play style={{ width: 200, height: 200 }} />
                </a>
            </div>
            <div className="flex flex-col mx-auto text-center items-center">
                <a href="" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <Lottie loop animationData={chromeAnimation} play style={{ width: 200, height: 200 }} speed={0.5} />
                </a>
                <h5 className="text-gray-500 dark:text-gray-400 text-lg font-semibold mt-4 loaderL">
                    Chrome Extension
                </h5>
            </div>

        </div>
    );
}
