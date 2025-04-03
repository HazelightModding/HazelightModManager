import NotImplementedView from "./NotImplementedView";

export default function ModCreatorView() {
    return (
        <div
            id="ModCreatorView"
            className="bg-primary-1 flex h-full w-full flex-col gap-2 rounded-md p-2"
        >
            Mod Creator View (Under Construction)
            <div className="flex h-1/10 gap-2">
                <div className="bg-primary-2 flex grow items-center rounded-md p-2">
                    <div className="text-[130%] font-semibold">Mod Name:</div>
                    <input className="ml-5 h-full grow bg-primary-3 rounded-md p-2"></input>
                </div>
                <div className="bg-primary-2 flex w-1/3 items-center rounded-md p-2">
                    <div className="text-[130%] font-semibold">Version:</div>
                    <input className="ml-5 h-full bg-primary-3 grow w-2/3 rounded-md p-2"></input>
                </div>
            </div>
            <div className="flex h-1/10 gap-2">
                <div className="bg-primary-2 flex w-1/2 items-center rounded-md p-2">
                    <div className="text-[130%] font-semibold">Type:</div>
                    <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
                </div>
                <div className="bg-primary-2 flex w-1/2 items-center rounded-md p-2">
                    <div className="text-[130%] font-semibold">Author:</div>
                    <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
                </div>
            </div>
            <div className="bg-primary-2 flex h-2/10 items-center rounded-md p-2">
            <div className="text-[130%] font-semibold">Mod Description:
                    </div>
                    <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
            </div>

            <div className="bg-primary-2 flex h-1/10 items-center rounded-md p-2">
                <div className="text-[130%] font-semibold">Dependencies:</div>
                <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
            </div>
            <div className="bg-primary-2 flex h-1/10 items-center rounded-md p-2">
                <div className="text-[130%] font-semibold">Conflicts:</div>
                <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
            </div>
            <div className="bg-primary-2 flex h-1/10 items-center rounded-md p-2">
                <div className="text-[130%] font-semibold">Game Version:</div>
                <input className="ml-5 h-full bg-primary-3 grow rounded-md p-2"></input>
            </div>
            <div className="flex h-1/10 gap-2">
                <div className="flex w-3/3"></div>
                <div className="flex w-2/3 rounded-md bg-green-600 p-2 hover:brightness-110">
                    Create Mod
                </div>
            </div>
        </div>
    );
}
