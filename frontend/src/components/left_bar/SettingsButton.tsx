import { mdiCog } from "@mdi/js";
import { useModManager } from "../../ModManagerState";

export default function SettingsButton() {
    const { changeView } = useModManager();

    return (
        <div id="SettingsButton" className="">
            <button
                className="btn flex h-12 w-full items-center rounded-md bg-zinc-800 px-4 hover:brightness-120"
                onClick={() => changeView("Settings")}
            >
                <span>Settings</span>
                <div className="grow" />
                <svg className="size-8" viewBox="0 0 24 24">
                    <path d={mdiCog} fill="currentColor"></path>
                </svg>
            </button>
        </div>
    );
}
