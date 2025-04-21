import { mdiFolder } from "@mdi/js";
import { useModManager } from "../../ModManagerState";

export default function ModsButton() {
    const { changeView } = useModManager();

    return (
        <div id="ModsButton" className="">
            <button
                className="btn flex h-12 w-full items-center rounded-md bg-zinc-800 px-4 hover:brightness-120"
                onClick={() => changeView("Mods")}
            >
                <span>Mods</span>
                <div className="grow" />
                <svg className="size-8" viewBox="0 0 24 24">
                    <path d={mdiFolder} fill="currentColor"></path>
                </svg>
            </button>
        </div>
    );
}
