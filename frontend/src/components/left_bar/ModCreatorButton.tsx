import { mdiFolderPlus } from "@mdi/js";
import { useModManager } from "../../ModManagerState";

export default function ModCreatorButton() {
    const { changeView } = useModManager();

    return (
        <div id="ModCreatorButton" className="">
            <button
                className="btn flex h-12 w-full items-center rounded-md bg-zinc-800 px-4 hover:brightness-120"
                onClick={() => changeView("ModCreator")}
            >
                <span>Mod Creator</span>
                <div className="grow" />
                <svg className="size-8" viewBox="0 0 24 24">
                    <path d={mdiFolderPlus} fill="currentColor"></path>
                </svg>
            </button>
        </div>
    );
}
