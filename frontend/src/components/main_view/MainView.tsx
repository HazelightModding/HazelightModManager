import AboutView from "./views/AboutView";
import GameInstallProfileView from "./views/GameInstallProfileView";
import LaunchSettingsView from "./views/LaunchSettingsView";
import ModCreatorView from "./views/ModCreatorView";
import ModsView from "./views/ModsView";
import NotImplementedView from "./views/NotImplementedView";
import SaveEditorView from "./views/SaveEditorView";
import SettingsView from "./views/SettingsView";
import { useModManager } from "../../ModManagerState";

function GetCurrentView(state:string) {
    switch (state) {
        case "GameInstallProfile":  return <GameInstallProfileView/>
        case "LaunchSettings":      return <LaunchSettingsView/>
        case "Mods":                return <ModsView/>
        case "SaveEditor":          return <SaveEditorView/>
        case "ModCreator":          return <ModCreatorView/>
        case "Settings":            return <SettingsView/>
        case "About":               return <AboutView/>
        
        default:                    return <NotImplementedView/>
    }
}

export default function MainView(game: any) {

    const { currentView } = useModManager();
    

    return (
        <div id="MainView" className="h-full w-full rounded-md bg-primary-2 p-2">
            {GetCurrentView(currentView)}
        </div>
    );
}