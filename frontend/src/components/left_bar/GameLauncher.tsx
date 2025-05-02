import { mdiCog } from "@mdi/js";
import { useState } from "react";

interface Props {
    installListCollapsed: Boolean;
}
export default function GameLauncher(props: Props) {
    if (!props.installListCollapsed) return <></>;

    const [launchOptionsVisible, setLaunchOptionsvisible] = useState(false);

    var launchOptions;
    if (!launchOptionsVisible) {
        launchOptions = <></>;
    } else {
        launchOptions = (
            <div id="LaunchOptions" className="flex gap-2">
                <div className="bg-primary-2 flex flex-col h-12 w-full items-start rounded-md px-4">
                    <span>Launch Arguments:</span>
                    
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="GameLauncher" className="flex gap-2">
                <button className="btn flex h-12 w-full items-center rounded-md bg-lime-600 saturate-80 px-4 hover:brightness-120">
                    <span>Launch Game</span>
                    <div className="grow" />
                </button>

                <button
                    className="btn bg-primary-2 flex size-12 rounded-md px-4 hover:brightness-120"
                    onClick={() => {
                        setLaunchOptionsvisible(!launchOptionsVisible);
                    }}
                >
                    <svg className="overflow-visible" viewBox="7 -3 30 30">
                        <path d={mdiCog} fill="currentColor"></path>
                    </svg>
                </button>
            </div>
            {launchOptions}
        </>
    );
}
