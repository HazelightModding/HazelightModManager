import { mdiContentSaveCog } from "@mdi/js";
import SVGIcon from "../ui/SVGIcon";
import { useModManager } from "../../ModManagerState";

export default function SaveEditorButton() {
    const { setCurrentView } = useModManager();

    return (
        <div id="SaveEditorButton" className="">
            <button
                className="btn flex h-12 w-full items-center rounded-md bg-zinc-800 px-4 hover:brightness-120"
                onClick={() => setCurrentView("SaveEditor")}
            >
                <span>Save Editor</span>
                <div className="grow" />
                <svg className="size-8" viewBox="0 0 24 24">
                    <path d={mdiContentSaveCog} fill="currentColor"></path>
                </svg>
            </button>
        </div>
    );
}
