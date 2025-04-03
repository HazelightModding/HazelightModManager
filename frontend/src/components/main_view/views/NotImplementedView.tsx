import { useEffect, useState } from "react";
import { Greet } from "../../../../wailsjs/go/main/App";

export default function NotImplementedView() {

    const [displayName, setDisplayName] = useState("Hello!");
    
    useEffect(() => {
        Greet("Jonas").then((result) => {
            setDisplayName(" " + result);
        });
    }, []);

    return (
        <div id="NotImplementedView" className="flex flex-col h-full w-full justify-center relative text-3xl">
            <div>{displayName}</div>
            <div>Under construction!</div>
            <div>Come back later :)</div>
        </div>
    );
}