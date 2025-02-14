"use client"


import { useSearchView } from "../../../hooks/useSearchView";
import Lottie from "react-lottie-player";
import findLinks from '../../../../public/lottie/findLinks.json'
import ProjectRowView from "./ProjectRowView";
import ProjectDetailsView from "./ProjectDetailsView";
import { useState } from "react";

export default function Projects() {

    const { currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const [loading, setProjectRowLoading] = useState(false);

    const handleRowSelection = (id: number) => {
        setProjectRowLoading(true);

        try{
            switchToResults(id);
        }catch(error){
            console.error("Project Details view failed : ", error);
        }finally{
            setProjectRowLoading(false);
        }
    };

    return(
        <div className="flex-1 p-6 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
            {loading ? (
                // Show Lottie animation while loading
                <div className="flex flex-col justify-center items-center h-screen" style={{marginTop : "-100px"}}>
                    <Lottie loop animationData={findLinks} play style={{ width: 200, height: 200 }} />
                    <p className="text-gray-500 dark:text-gray-300 text-lg font-semibold mt-4 loaderL">
                        Fetching results... This may take a second.
                    </p>
                </div>
            ) : currentView === "input" ? (
                // Show InputView only when not loading
                <ProjectRowView
                    onSearch={handleRowSelection}
                    setProjectRowLoading={setProjectRowLoading} // Pass down loading function
                />
            ) : (
                // Show results when loading is complete
                <ProjectDetailsView responseData={responseData} onBack={switchToInput}/>
            )}
        </div>
    )
}