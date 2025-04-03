import { mdiResizeBottomRight } from "@mdi/js";
import SVGIcon from "../ui/SVGIcon";

export default function FooterBar(game: any) {
    
    return (
        <div id="FooterBar" className="flex h-6 items-center">
            <div className="flex grow items-center">
                <span className="items-center pl-2 text-zinc-500">
                    Development version {game.Version}
                </span>
            </div>

            <div className="grid h-full">
                <SVGIcon
                    className="h-full w-full pointer-events-none items-center justify-center text-zinc-500"
                    icon={mdiResizeBottomRight}
                />
            </div>
        </div>
    );
}
