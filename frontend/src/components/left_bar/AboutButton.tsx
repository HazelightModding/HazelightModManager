import { mdiInformationSlabBox } from "@mdi/js";
import SVGIcon from "../ui/SVGIcon";
import { useModManager } from "../../ModManagerState";
import KofiLogo from "../../assets/images/kofi_symbol.png";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";

export default function AboutButton() {
    const { setCurrentView } = useModManager();

    return (
        <div id="AboutButton" className="flex gap-2">
            <button
                className="btn bg-primary-2 flex h-12 w-full items-center rounded-md px-4 hover:brightness-120"
                onClick={() => setCurrentView("About")}
            >
                <span>About</span>
                <div className="grow" />
                <SVGIcon icon={mdiInformationSlabBox} className="size-8" />
            </button>
            <button
                className="btn bg-primary-2 flex h-12 w-full items-center rounded-md px-4 hover:brightness-120 overflow-hidden"
                onClick={() => BrowserOpenURL("https://ko-fi.com/lemuura")}
            >
                <span className="text-nowrap">Support Me</span>

                <img src={KofiLogo}  className="object-scale-down h-full p-2 pl-4.5"/>
            </button>
        </div>
    );
}
