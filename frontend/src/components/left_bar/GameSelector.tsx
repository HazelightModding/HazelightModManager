import { useState } from "react";
import SplitFiction from "../../assets/images/SplitFictionStackedFlat.png";
import ItTakesTwo from "../../assets/images/itTakesTwoFlat.png";
import { useModManager } from "../../ModManagerState";

export default function GameSelector() {
    const { currentGame, setCurrentGame, installIndex, setInstallIndex, gameInstalls } = useModManager();

    return (
        <div className="flex h-25 items-center overflow-hidden rounded-md bg-zinc-800 flex-shrink-0">
            {/* Left Button */}
            <button
                className={`h-full p-3 flex-grow transition-all hover:scale-105 hover:brightness-120 ${
                    currentGame === "Split Fiction" ? "grayscale-0 w-[60%]" : "grayscale w-[40%]"
                }`}
                
                onClick={UpdateGame("Split Fiction")}
            >
                <div className="absolute inset-0 bg-blue-500 w-2/1"></div>
                <img src={SplitFiction} className="h-full w-max mix-blend-screen overflow-hidden relative" />
                
            </button>

            {/* Right Button */}
            <button
                className={`flex h-full items-center justify-end p-3 transition-all hover:scale-105 hover:brightness-120 ${
                    currentGame === "It Takes Two" ? "grayscale-0 w-[60%]" : "grayscale w-[40%]"
                }`}
                onClick={UpdateGame("It Takes Two")}
            >
                <div className="absolute inset-0 bg-orange-400"></div>
                <img src={ItTakesTwo} className="h-full w-max relative overflow-hidden mix-blend-screen" />
            </button>
        </div>
    );

    function UpdateGame(game: string) {
        
        return () => {
            setCurrentGame(game);

            if (installIndex[currentGame] === -1 && gameInstalls.filter((install) => install.Game === currentGame).length > 0)
            {
                setInstallIndex(currentGame, 0);
            }
        }
    }
}
