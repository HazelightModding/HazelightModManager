import { mdiChevronDown, mdiChevronUp, mdiPencil, mdiTrashCan } from "@mdi/js";
import SVGIcon from "../ui/SVGIcon";
import { useModManager } from "../../ModManagerState";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetOrCreateInstallList } from "../../../wailsjs/go/gameinstall/GameInstallation";

interface Props {
    listCollapsed: boolean;
    setListCollapsed: Dispatch<SetStateAction<boolean>>;
}
export default function GameVersionInfo(props: Props) {
    const {
        setCurrentView,
        gameInstalls,
        setGameInstalls,
        currentGame,
        currentGameInstall,
        installIndex,
        setInstallIndex,
    } = useModManager();

    function UpdateList(): void {
        props.setListCollapsed(!props.listCollapsed);

        GetOrCreateInstallList(true).then((result) => {
            setGameInstalls(result);

            if (installIndex[currentGame] === -1 && result.length > 0)
            {
                setInstallIndex(currentGame, 0);
            }
        });

        return;
    }

    function PopulateInstallList(isCollapsed: boolean) {
        if (isCollapsed) {
            return;
        }

        var list = (
            <>
                {gameInstalls
                    .filter((install) => install.Game === currentGame)
                    .map((install, index) => (
                        <div key={currentGame + "_" + index} className="flex h-26 gap-1">
                            <button
                                className={`flex w-[90%] flex-col place-items-start gap-1 overflow-clip rounded-l-md rounded-br-md bg-zinc-700 p-2 align-middle break-all brightness-100 hover:brightness-110 ${installIndex[currentGame] === index ? 'border-2 border-accent-1' : ''}`} 
                                onClick={() =>
                                    setInstallIndex(currentGame, index)
                                }
                            >
                                {/* prettier-ignore */}
                                <p className="font-semibold" >
                                    {   
                                        install.Version != ""
                                        ? install.Game + " (" + install.Version + ")"
                                        : install.Game
                                    }
                                </p>
                                <span className="text-left">
                                    {install.InstallPath}
                                </span>
                            </button>
                            <div className="flex grow flex-col gap-1 align-middle">
                                <button className="aspect-square items-center rounded-tr-md bg-amber-600 hover:bg-amber-500">
                                    <SVGIcon
                                        icon={mdiPencil}
                                        className="p-1.5"
                                    />
                                </button>
                                <button className="aspect-square items-center rounded-br-md bg-red-600 hover:bg-red-500">
                                    <SVGIcon
                                        icon={mdiTrashCan}
                                        className="p-1.5"
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
            </>
        );

        return (
            <div className="overflow-hidden rounded-b-md bg-zinc-800">
                <div className="scrollbar flex h-full min-h-0 w-full flex-col gap-2 overflow-x-hidden overflow-y-auto p-4">
                    {list}

                    <button className="rounded-md bg-blue-500">Add Game</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                id="GameVersionInfo"
                className={`btn flex h-12 w-full flex-shrink-0 items-center bg-zinc-800 px-4 hover:brightness-120 ${props.listCollapsed ? "rounded-md" : "-mb-1.5 rounded-t-md"}`}
                onClick={() => UpdateList()}
            >
                {/* prettier-ignore */}
                <span>
                    {
                        currentGameInstall && currentGameInstall.Version != ""
                        ? currentGameInstall.Game + " (" + currentGameInstall.Version + ")"
                        : currentGameInstall?.Game
                    }
                </span>
                <div className="grow" />
                <SVGIcon
                    className="size-8"
                    icon={props.listCollapsed ? mdiChevronDown : mdiChevronUp}
                />
            </button>
            {PopulateInstallList(props.listCollapsed)}
        </>
    );
}
