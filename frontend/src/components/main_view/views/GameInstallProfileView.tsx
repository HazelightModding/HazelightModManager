import { ReactNode } from "react";
import { useModManager } from "../../../ModManagerState";
import NotImplementedView from "./NotImplementedView";

export default function GameInstallProfileView() {
    const { gameInstalls, activeGame: currentGame } = useModManager();
    function PopulateInstallList() {
        return (
            <>
                {gameInstalls
                    .filter((install) => install.Game === currentGame)
                    .map((install, index) => (
                        <div key={index} className="p-2 bg-gray-700 text-white rounded mb-2">
                            <span>{install.InstallPath}</span>
                            <button className="ml-2 bg-red-500 px-3 py-1 rounded">Remove</button>
                        </div>
                    ))}
    
                <button key="add" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    + Add Install Path
                </button>
            </>
        );
    }
    return (
        <div id="GameInstallProfileView" className="flex flex-col h-full w-full justify-center relative text-3xl">
            {PopulateInstallList()}
        </div>
    );
}