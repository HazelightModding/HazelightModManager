import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { CheckForUpdate } from "../wailsjs/go/update/UpdateManager";
import { GetOrCreateInstallList } from "../wailsjs/go/gameinstall/GameInstallation";
import {
    GetPrecompiledScriptCache,
    IsPrecompiledScriptActive,
    TogglePrecompiledScriptStatus,
} from "../wailsjs/go/gameinstall/PrecompiledScript";
import { gameinstall } from "../wailsjs/go/models";
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
    activeGame: string;
    setActiveGame: (game: string) => void;

    currentView: string;
    changeView: (view: string) => void;

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

export function ModManagerState({ children }: { children: ReactNode }) {
    const [currentGame, setCurrentGame] = useState("Split Fiction");
    const [currentView, setCurrentView] = useState("About");

    const [gameInstalls, setGameInstalls] = useState<
        Array<gameinstall.GameInstallInfo>
    >([]);

    const [selectedInstallIndex, setSelectedInstallIndex] = useState<{
        [gameName: string]: number;
    }>({
        "Split Fiction": -1,
        "It Takes Two": -1,
    });
    const currentGameInstall =
        selectedInstallIndex[currentGame] >= 0
            ? gameInstalls.filter((install) => install.Game === currentGame)[
                  selectedInstallIndex[currentGame]
              ]
            : {
                  Game: "No Game",
                  Version: "",
                  InstallPath: "",
                  Launcher: "",
                  ScriptDir: "",
              };

    const setInstallIndex = (gameName: string, index: number) => {
        setSelectedInstallIndex((prevState) => ({
            ...prevState,
            [gameName]: index, // Update the selected index for the given game
        }));
    };

    const [mods, setMods] = useState<Mod[]>([]);

    const [modsEnabled, setModsEnabled] = useState(false);
    const [modsEnabledVisual, setModsEnabledVisual] = useState(false);
    const toggleMods = () => setModsEnabled((prev) => !prev);

    const [viewHistory, setViewHistory] = useState<string[]>(["About"]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const changeView = (newView: string) => {
        setViewHistory((prevHistory) => {
            const current = prevHistory[historyIndex];
            if (current === newView) return prevHistory;
            const newTrimmedHistory = prevHistory.slice(0, historyIndex + 1);
            const newHistory = [...newTrimmedHistory, newView];
            if (newHistory.length > 100) {
                newHistory.shift();
            }
            return newHistory;
        });

        setHistoryIndex((prevIndex) => prevIndex + 1);
        setCurrentView(newView);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentView(viewHistory[newIndex]);
        }
    };

    const goForward = () => {
        if (historyIndex < viewHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentView(viewHistory[newIndex]);
        }
    };

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

            if (selectedInstallIndex[currentGame] === -1 && result.length > 0) {
                setInstallIndex(currentGame, 0);
            }
        });
    }, [currentGame]);

    useEffect(() => {
        if (!currentGameInstall || !currentGameInstall.InstallPath) return;

        IsPrecompiledScriptActive(currentGameInstall).then((result) => {
            LogDebug(currentGameInstall.Game + " Mods Enabled: " + !result);
            setModsEnabled(!result);
        });
    }, [currentGameInstall]);

    useEffect(() => {
        LogDebug("Current Game Install: " + currentGameInstall.Game);
        LogDebug("Mods Enabled: " + modsEnabled);

        TogglePrecompiledScriptStatus(currentGameInstall, !modsEnabled).then(
            (result) => {
                setModsEnabledVisual(!result);
            },
        );
    }, [modsEnabled]);

    useEffect(() => {
        let lastTime = 0;

        const handleInputs = (e: Event) => {
            const now = Date.now();
            if (now - lastTime < 300) return;
            lastTime = now;

            if (e instanceof KeyboardEvent) {
                if (e.altKey && e.code === "ArrowLeft") {
                    goBack();
                } else if (e.altKey && e.code === "ArrowRight") {
                    goForward();
                }
            }

            if (e instanceof MouseEvent) {
                if (e.button === 3) {
                    goBack();
                } else if (e.button === 4) {
                    goForward();
                }
            }
        };

        window.addEventListener("keydown", handleInputs);
        window.addEventListener("mouseup", handleInputs);
        return () => {
            window.removeEventListener("keydown", handleInputs);
            window.removeEventListener("mouseup", handleInputs);
        };
    }, [goBack, goForward, historyIndex, viewHistory]);

    return (
        <ModManagerContext.Provider
            value={{
                activeGame: currentGame,
                setActiveGame: setCurrentGame,
                currentView,
                changeView,
                gameInstalls,
                setGameInstalls,
                currentGameInstall,
                installIndex: selectedInstallIndex,
                setInstallIndex,
                mods,
                setMods,
                modsEnabled,
                setModsEnabled,
                toggleMods,
                modsEnabledVisual,
                setModsEnabledVisual,
            }}
        >
            {children}
        </ModManagerContext.Provider>
    );
}

export function useModManager() {
    const context = useContext(ModManagerContext);
    if (!context)
        throw new Error("useModManager must be used within a ModManagerState");
    return context;
}
