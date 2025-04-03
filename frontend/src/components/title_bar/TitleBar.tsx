import Logo from "../../assets/images/HLMMLogoWhite.svg";
import SVGIcon from "../ui/SVGIcon";
import {
    Quit,
    WindowMinimise,
    WindowToggleMaximise,
    WindowIsMaximised,
} from "../../../wailsjs/runtime";
import {
    mdiWindowClose,
    mdiWindowMaximize,
    mdiWindowMinimize,
    mdiWindowRestore,
} from "@mdi/js";
import "./TitleBar.css";

export default function TitleBar() {
    var maximizeIcon = mdiWindowMaximize;
    
    function ToggleMaximize() {
        WindowToggleMaximise();
        WindowIsMaximised().then((response) =>{
            maximizeIcon = response ? mdiWindowRestore : mdiWindowMaximize;
        })
    }

    return (
        <div id="TitleBar" className="dragregion flex h-8 items-center">
            <div className="flex grow items-center">
                <img
                    className="!h-6 !pr-2 !pl-2"
                    alt="Hazelight Mod Manager Icon"
                    src={Logo}
                />
                <span className="items-center pl-2">Hazelight Mod Manager</span>
            </div>

            <div
                className="grid h-full w-11 cursor-default items-center justify-center p-1.5 hover:bg-gray-500"
                onClick={WindowMinimise}
            >
                <SVGIcon className="h-full w-full" icon={mdiWindowMinimize} />
            </div>

            <div
                className="grid h-full w-11 cursor-default items-center justify-center p-1.5 hover:bg-gray-500"
                onClick={ToggleMaximize}
            >
                <SVGIcon
                    className="h-full w-full"
                    icon={maximizeIcon}
                />
            </div>

            <div
                className="grid h-full w-11 cursor-default items-center justify-center p-1.5 hover:bg-red-600"
                onClick={Quit}
            >
                <SVGIcon className="h-full w-full" icon={mdiWindowClose} />
            </div>
        </div>
    );
}
