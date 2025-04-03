import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CheckForUpdate } from "../wailsjs/go/update/UpdateManager";
import { GetOrCreateInstallList } from "../wailsjs/go/gameinstall/GameInstallation";
import { 
    GetPrecompiledScriptCache, 
    IsPrecompiledScriptActive, 
    TogglePrecompiledScriptStatus 
} from "../wailsjs/go/gameinstall/PrecompiledScript";
import { gameinstall } from '../wailsjs/go/models';
import { LogDebug } from "../wailsjs/runtime/runtime";

interface Mod {
    name: string;
    description: string;
    modVersion: string;
    gameVersion: string;
    downloadUrl: string;
    type: "Angelscript" | "Plugin" | "Pak";
}


interface ModManagerState {
    currentGame: string;
    setCurrentGame: (game: string) => void;

    currentView: string;
    setCurrentView: (view: string) => void;

    gameInstalls: Array<gameinstall.GameInstallInfo>;
    setGameInstalls: (installs: Array<gameinstall.GameInstallInfo>) => void;
    currentGameInstall: gameinstall.GameInstallInfo;
    installIndex: { [gameName: string]: number };
    setInstallIndex: (gameName: string, index: number) => void;

    mods: Mod[];
    setMods: (mods: Mod[]) => void;

    modsEnabled: boolean;
    setModsEnabled: (enabled: boolean) => void;
    toggleMods: () => void;
    modsEnabledVisual: boolean;
    setModsEnabledVisual: (enabled: boolean) => void;
}

const ModManagerContext = createContext<ModManagerState | undefined>(undefined);

export function ModManagerState({ children }: { children: ReactNode }){
    const [currentGame, setCurrentGame] = useState("Split Fiction");
    const [currentView, setCurrentView] = useState("About");

    const [gameInstalls, setGameInstalls] = useState<Array<gameinstall.GameInstallInfo>>([]);

    const [selectedInstallIndex, setSelectedInstallIndex] = useState<{ [gameName: string]: number }>({
        "Split Fiction": -1,
        "It Takes Two": -1,
    });
    const currentGameInstall =
        selectedInstallIndex[currentGame] >= 0
        ? gameInstalls.filter((install) => install.Game === currentGame)[selectedInstallIndex[currentGame]]
        : { Game: "No Game", Version: "", InstallPath: "", Launcher: "", ScriptDir: "" };

    const setInstallIndex = (gameName: string, index: number) => {
        setSelectedInstallIndex(prevState => ({
            ...prevState,
            [gameName]: index, // Update the selected index for the given game
        }));
    };

    
    const [mods, setMods] = useState<Mod[]>([]);

    const [modsEnabled, setModsEnabled] = useState(false);
    const [modsEnabledVisual, setModsEnabledVisual] = useState(false);
    const toggleMods = () => setModsEnabled((prev) => !prev);



    useEffect(() => {
        CheckForUpdate().then(() => {
            // If there's an update
            // Display a popup, with new version info and changelog since your current version

            // If update
            // Restart self and apply update??
        });
    }, []);

    useEffect(() => {

        GetOrCreateInstallList(true).then((result) => {
            setGameInstalls(result);

            if (selectedInstallIndex[currentGame] === -1 && result.length > 0)
            {
                setInstallIndex(currentGame, 0);
            }
        })
        
    }, [currentGame]);

    useEffect(() => {
        if (!currentGameInstall || !currentGameInstall.InstallPath) return;
    
        IsPrecompiledScriptActive(currentGameInstall).then((result) => {
            LogDebug(currentGameInstall.Game + " Mods Enabled: " + !result);
            setModsEnabled(!result);
        });
    }, [currentGameInstall]); 

    useEffect(() => {

        LogDebug("Current Game Install: " +  currentGameInstall.Game);
        LogDebug("Mods Enabled: " + modsEnabled);

        TogglePrecompiledScriptStatus(currentGameInstall, !modsEnabled).then((result) => {
            setModsEnabledVisual(!result);
        })
        
    }, [modsEnabled]);
        

    return (
        <ModManagerContext.Provider
            value = {{
                currentGame, setCurrentGame,
                currentView, setCurrentView,
                gameInstalls, setGameInstalls, currentGameInstall, installIndex: selectedInstallIndex, setInstallIndex,
                mods, setMods,
                modsEnabled, setModsEnabled, toggleMods, modsEnabledVisual, setModsEnabledVisual
            }}
        >
            {children}
        </ModManagerContext.Provider>
    );
};

export function useModManager() {
    const context = useContext(ModManagerContext);
    if (!context) throw new Error("useModManager must be used within a ModManagerState");
    return context;
}