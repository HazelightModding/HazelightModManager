import GameSelector from "./GameSelector";
import GameVersionInfo from "./GameVersionInfo";
import GameModsToggle from "./GameModsToggle";
import GameLauncher from "./GameLauncher";
import ModsButton from "./ModsButton";
import SaveEditorButton from "./SaveEditorButton";
import SettingsButton from "./SettingsButton";
import AboutButton from "./AboutButton";
import ModCreatorButton from "./ModCreatorButton";
import { useState } from "react";

export default function LeftBar() {

    const [ listCollapsed, setListCollapsed ] = useState(true);
    
    return (
        <div
            id="LeftBar"
            className="flex h-full w-[22rem] min-w-[22rem] flex-col pr-2"
        >
            <div className="flex h-full w-full flex-col gap-2">
            <GameSelector />
                <div className="flex flex-col gap-2 flex-grow min-h-0 h-full overflow-hidden">
                    
                    <GameVersionInfo listCollapsed={listCollapsed} setListCollapsed={setListCollapsed}/>
                    <GameModsToggle  installListCollapsed={listCollapsed}/>
                    <GameLauncher  installListCollapsed={listCollapsed}/>
                </div>
                
                <div className="flex flex-col gap-2">
                    <ModsButton/>
                    <SaveEditorButton/>
                    <ModCreatorButton/>
                    <SettingsButton/>
                    <AboutButton/>
                </div>
            </div>
        </div>
    );
}
