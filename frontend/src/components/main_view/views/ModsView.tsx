import { useEffect, useState } from "react";
import {
    mdiPageFirst,
    mdiArrowLeft,
    mdiArrowRight,
    mdiPageLast,
    mdiDownload,
    mdiInformation,
    mdiHamburger,
    mdiHamburgerCheck,
    mdiDotsVertical,
    mdiDotsHorizontal,
    mdiCheckCircle,
    mdiCloseCircle,
    mdiBlockHelper,
    mdiToggleSwitchOff,
    mdiLoading,
} from "@mdi/js";
import Icon from "@mdi/react";
import sfDefaultIcon from "./../../../assets/images/sf_default.png";
import { mod } from "../../../../wailsjs/go/models";
import {
    GetBrowsableMods,
    GetLocalMods,
    GetModDetails,
    GetVisibleModDetails, DownloadModWithProgress
} from "../../../../wailsjs/go/mod/Mod";
import { useModManager } from "../../../ModManagerState";

interface PaginatorProps {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (amount: number) => void;
}

export function Paginator({
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: PaginatorProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexStart = (currentPage - 1) * itemsPerPage + 1;
    const indexEnd = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-row justify-end overflow-hidden rounded-t-md">
            <select
                aria-label="Select Amount"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="bg-primary-2 px-2 py-1.5 hover:brightness-110 disabled:opacity-50"
            >
                {[8, 16, 32, 64, 100].map((amount) => (
                    <option key={amount} value={amount}>
                        {amount} Items
                    </option>
                ))}
            </select>

            <button
                aria-label="First Page"
                className="bg-primary-2 px-2 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <Icon path={mdiPageFirst} size={1} />
            </button>

            <button
                aria-label="Previous Page"
                className="bg-primary-2 px-2 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Icon path={mdiArrowLeft} size={1} />
            </button>

            <span className="bg-primary-2 w-45 place-content-center px-2 py-1.5">
                {totalItems === 0
                    ? `0 of 0`
                    : `${indexStart}-${indexEnd} of ${totalItems}`}
            </span>

            <button
                aria-label="Next Page"
                className="bg-primary-2 px-2 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Icon path={mdiArrowRight} size={1} />
            </button>

            <button
                aria-label="Last Page"
                className="bg-primary-2 px-2 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <Icon path={mdiPageLast} size={1} />
            </button>
        </div>
    );
}

interface ModBoxProps {
    index: number;
    inMod: mod.ModDetails;
    state?: number;
}

export const ModBox: React.FC<ModBoxProps> = ({ index, inMod, state }) => {
    const [modState, setModState] = useState<
        "Idle" | "Starting" | "Downloading" | "Enabled" | "Disabled"
    >("Idle");
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    useEffect(() => {}, [modState]);

    const stateButton = (
        name: string,
        icon: string,
        styles: string,
        iconStyles: string = "",
    ) => {
        var displayText =
            modState == "Idle" ||
            modState == "Enabled" ||
            modState == "Disabled";

        const handleClick = () => {
            if (modState === "Idle") {
                setModState("Starting");
                DownloadModWithProgress(inMod.latestVersions.release.link, )
                

                // Simulate starting download (replace this with your real Go-side logic)
                setTimeout(() => {
                    setModState("Downloading");

                    // Simulate download progress
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += Math.random() / 5;
                        if (progress >= 100) {
                            clearInterval(interval);
                            setDownloadProgress(100);
                            setModState("Disabled");
                        } else {
                            setDownloadProgress(progress);
                        }
                    }, 1);

                    // TODO: Hook this into Go-side download system and update progress from there
                }, 1); // Simulate network delay before download starts
            }
            else if (modState === "Disabled")
            {
                setModState("Enabled");
            }
            else if (modState === "Enabled")
            {
                setModState("Disabled");
            }   
        };

        return (
            <button
                className={`flex flex-row items-center h-[1.9rem] w-[7rem] rounded-sm ${styles} p-0.5 text-[1rem] hover:brightness-110 transition-all`}
                onClick={handleClick}
            >
                {displayText ? <><span className="px-1">{name}</span> <div className="flex grow"/></> : <></>}
                <Icon path={icon} size={1} className={iconStyles} />
            </button>
        );
    };

    var StateButton: JSX.Element = stateButton(
        "Download",
        mdiDownload,
        "bg-zinc-500",
    );
    switch (modState) {
        case "Downloading":
            StateButton = (
                <div className="relative h-[1.9rem] w-[7rem] overflow-hidden rounded-sm bg-zinc-700 text-xs">
                    <div
                        className="absolute top-0 left-0 h-full bg-cyan-600 transition-all"
                        key={`progress-${Math.floor(downloadProgress)}`}
                        style={{ width: `${downloadProgress}%` }}
                    ></div>
                    <div className="relative z-10 flex h-full items-center justify-center text-white">
                        {Math.floor(downloadProgress)}%
                    </div>
                </div>
            );
            break;
        case "Starting":
            StateButton = stateButton(
                "",
                mdiLoading,
                "bg-zinc-500",
                "animate-spin",
            );
            break;
        case "Disabled":
            StateButton = stateButton(
                "Disabled",
                mdiCloseCircle,
                "bg-red-500 saturate-80",
            );
            break;
        case "Enabled":
            StateButton = stateButton(
                "Enabled",
                mdiCheckCircle,
                "bg-lime-600 saturate-80",
            );
            break;
        case "Idle":
        default:
            StateButton = stateButton("Download", mdiDownload, "bg-zinc-500");
            break;
    }

    return (
        <div
            key={index}
            className="bg-primary-3 border-primary-3 flex h-40 flex-row overflow-hidden rounded-2xl border-4"
        >
            <img
                src={inMod.logo || sfDefaultIcon}
                className="aspect-square h-full object-cover"
                alt={`${inMod.name} icon`}
            />
            <div className="flex w-full flex-col overflow-hidden pl-2">
                <h1 className="truncate text-start text-[1.2rem] font-semibold">
                    {inMod.name}
                </h1>
                <p className="line-clamp-4 text-start text-sm">
                    {inMod.short_description || "Loading..."}
                </p>

                <div className="grow" />

                {/* Button Group */}
                <div className="flex flex-row gap-0.5 self-end pt-2 align-bottom">
                    {StateButton}

                    <button className="rounded-sm bg-zinc-500 p-0.5 hover:brightness-110">
                        <Icon path={mdiInformation} size={1} />
                    </button>

                    <button className="rounded-sm bg-zinc-500 p-0.5 hover:brightness-110">
                        <Icon path={mdiDotsHorizontal} size={1} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ModsView() {
    const { activeGame: currentGame } = useModManager();
    const [activeTab, setActiveTab] = useState("myMods");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLocalModsPage, setCurrentLocalModsPage] = useState(1);
    const [currentBrowseModsPage, setCurrentBrowseModsPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const [browseMods, setBrowseMods] = useState<mod.ModSummary[]>([]);
    const [localMods, setLocalMods] = useState<mod.ModSummary[]>([]);
    const [modDetails, setModDetails] = useState<
        Record<number, mod.ModDetails>
    >({});

    const totalItems =
        activeTab === "myMods" ? localMods.length : browseMods.length;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const browsableMods = browseMods
        .slice(startIndex, startIndex + itemsPerPage)
        .map((mod, idx) => {
            const globalIndex = startIndex + idx;
            return (
                modDetails[globalIndex] || {
                    name: mod.name,
                    short_description: "No description provided.",
                }
            );
        });

    const myMods = localMods
        .slice(startIndex, startIndex + itemsPerPage)
        .map((mod, idx) => {
            const globalIndex = startIndex + idx;
            return (
                modDetails[globalIndex] || {
                    name: mod.name,
                    short_description: "No description provided.",
                }
            );
        });

    const visibleMods = activeTab === "myMods" ? myMods : browsableMods;
    const mods = activeTab === "myMods" ? localMods : browseMods;

    useEffect(() => {
        GetBrowsableMods(currentGame)
            .then((data) => {
                setBrowseMods(data);
            })
            .catch((err) => {
                console.error(
                    "Failed to load mods for game:",
                    currentGame,
                    err,
                );
            });

        GetLocalMods(currentGame)
            .then((data) => {
                setLocalMods(data);
            })
            .catch((err) => {
                console.error(
                    "Failed to load mods for game:",
                    currentGame,
                    err,
                );
            });

        if (activeTab === "myMods") {
            setCurrentPage(currentLocalModsPage);
        } else if (activeTab === "browseMods") {
            setCurrentPage(currentBrowseModsPage);
        }
    }, [currentGame, activeTab]);

    useEffect(() => {
        visibleMods.forEach((mod, idx) => {
            const globalIndex = startIndex + idx;
            if (!modDetails[globalIndex]) {
                GetModDetails(mods[globalIndex])
                    .then((details) => {
                        setModDetails((prev) => ({
                            ...prev,
                            [globalIndex]: details,
                        }));
                    })
                    .catch((err) => {
                        console.error(
                            "Failed to fetch mod info for",
                            mod.name,
                            err,
                        );
                    });
            }
        });
    }, [visibleMods, modDetails, startIndex, mods]);

    return (
        <div
            id="ModsView"
            className="relative flex h-full w-full flex-col text-lg"
        >
            <div className="bg-primary-1 flex flex-row">
                <div className="border-primary-2 flex shrink-0 overflow-hidden rounded-t-md border-t-4 border-r-4 border-l-4">
                    {/* My Mods Tab */}
                    <div
                        className={`transition-all ${
                            activeTab === "myMods"
                                ? "bg-primary-1"
                                : "bg-primary-2"
                        }`}
                    >
                        <div
                            className={`h-full cursor-pointer px-4 py-2 transition-all ${
                                activeTab === "myMods"
                                    ? "bg-primary-2 rounded-tr-md text-white"
                                    : "bg-primary-1 rounded-br-md text-gray-200"
                            }`}
                            onClick={() => setActiveTab("myMods")}
                        >
                            My Mods
                        </div>
                    </div>

                    {/* Browse Mods Tab */}
                    <div
                        className={`transition-all ${
                            activeTab === "browseMods"
                                ? "bg-primary-1"
                                : "bg-primary-2"
                        }`}
                    >
                        <div
                            className={`h-full cursor-pointer px-4 py-2 transition-all ${
                                activeTab === "browseMods"
                                    ? "bg-primary-2 rounded-tl-md text-white"
                                    : "bg-primary-1 rounded-bl-md text-gray-200"
                            }`}
                            onClick={() => setActiveTab("browseMods")}
                        >
                            Browse Mods
                        </div>
                    </div>
                </div>

                <span className="flex grow"></span>

                <Paginator
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(amount) => {
                        setItemsPerPage(amount);
                        setCurrentPage(1);
                    }}
                />
            </div>
            <div className="bg-primary-2 flex h-full overflow-y-auto px-1 py-2">
                <div
                    id="ModsContainer"
                    className="scrollbar grid h-full grid-cols-1 content-start gap-2 overflow-y-auto px-1 xl:grid-cols-2 2xl:grid-cols-3"
                >
                    {visibleMods.map((mod, i) => (
                        <ModBox index={i} inMod={mod} state={2} />
                    ))}
                </div>
            </div>
        </div>
    );
}
