import { useEffect, useState } from "react";
import {
    mdiPageFirst,
    mdiArrowLeft,
    mdiArrowRight,
    mdiPageLast,
    mdiDownload,
    mdiInformation,
} from "@mdi/js";
import Icon from "@mdi/react";
import sfDefaultIcon from "./../../../assets/images/sf_default.png";
import { mod } from "../../../../wailsjs/go/models";
import {
    GetAvailableMods,
    GetModDetails,
    GetVisibleModDetails,
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
        <div className="flex flex-row justify-end gap-4 pr-4 pb-2">
            <select
                aria-label="Select Amount"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="bg-primary-3 rounded-md px-3 py-1.5 hover:brightness-110 disabled:opacity-50"
            >
                {[8, 16, 32, 64, 100].map((amount) => (
                    <option key={amount} value={amount}>
                        {amount} Items
                    </option>
                ))}
            </select>

            <button
                aria-label="First Page"
                className="bg-primary-3 rounded-md px-3 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <Icon path={mdiPageFirst} size={1} />
            </button>

            <button
                aria-label="Previous Page"
                className="bg-primary-3 rounded-md px-3 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Icon path={mdiArrowLeft} size={1} />
            </button>

            <span className="bg-primary-3 rounded-md px-4 py-1.5">
                {totalItems === 0
                    ? `0 of 0`
                    : `${indexStart} - ${indexEnd} of ${totalItems}`}
            </span>

            <button
                aria-label="Next Page"
                className="bg-primary-3 rounded-md px-3 py-1.5 hover:brightness-110 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Icon path={mdiArrowRight} size={1} />
            </button>

            <button
                aria-label="Last Page"
                className="bg-primary-3 rounded-md px-3 py-1.5 hover:brightness-110 disabled:opacity-50"
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
    mod: mod.ModDetails;
}

export const ModBox: React.FC<ModBoxProps> = ({ index, mod }) => {
    return (
        <div
            key={index}
            className="bg-primary-3 flex h-40 flex-row rounded-2xl"
        >
            <img
                src={mod.logo || sfDefaultIcon}
                className="aspect-square h-full rounded-l-2xl object-cover"
                alt={`${mod.name} icon`}
            />
            <div className="text-primary-5 flex w-full flex-col items-start overflow-hidden p-2">
                <h2 className="truncate text-2xl font-semibold">{mod.name}</h2>
                <p className="mt-2 line-clamp-2 grow text-sm">
                    {mod.short_description || "Loading..."}
                </p>
                <div className="flex flex-row gap-1 self-end align-bottom">
                    <button className="bg-primary-4 rounded-md p-1.5 hover:brightness-110">
                        <Icon path={mdiInformation} size={1.2} />
                    </button>
                    <button className="bg-primary-4 rounded-md p-1.5 hover:brightness-110">
                        <Icon path={mdiDownload} size={1.2} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ModsView() {
    const { currentGame } = useModManager();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const [mods, setMods] = useState<mod.ModSummary[]>([]);
    const [modDetails, setModDetails] = useState<
        Record<number, mod.ModDetails>
    >({});

    const totalItems = mods.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleMods = mods
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

    useEffect(() => {
        GetAvailableMods(currentGame)
            .then((data) => {
                setMods(data);
            })
            .catch((err) => {
                console.error(
                    "Failed to load mods for game:",
                    currentGame,
                    err,
                );
            });
    }, [currentGame]);

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
            <Paginator
                totalItems={totalItems}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(amount) => {
                    setItemsPerPage(amount);
                    setCurrentPage(1); // reset to page 1
                }}
            />

            <div
                id="ModsContainer"
                className="3xl:grid-cols-4 scrollbar grid h-full grid-cols-1 content-start gap-2 overflow-y-auto px-4 xl:grid-cols-2 2xl:grid-cols-3"
            >
                {visibleMods.map((mod, i) => (
                    <ModBox index={i} mod={mod} />
                ))}
            </div>
        </div>
    );
}
