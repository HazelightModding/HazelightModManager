import { useModManager } from "../../ModManagerState";
import Switch from "../ui/Switch";

interface Props {installListCollapsed: boolean}
export default function GameModsToggle(props: Props) {
    const { setModsEnabled, modsEnabledVisual } = useModManager();

    if (!props.installListCollapsed)
        return(<></>);

    return (
        <div id="GameModsToggle" className="">
            <div className="flex h-12 w-full items-center rounded-md bg-zinc-800 px-4">
                <span className="">Mods</span>
                <div className="flex flex-auto items-center justify-end">
                    <Switch checked={modsEnabledVisual} onChange={setModsEnabled}/>
                </div>
            </div>
        </div>
    );
}
