import { useEffect, useState } from "react";
import NotImplementedView from "./NotImplementedView";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useModManager } from "../../../ModManagerState";

export default function SaveEditorView() {
    const { activeGame: currentGame } = useModManager();

    const ItTakesTwoFiles = ["SaveData.Nuts", "LocalSettings.Nuts", "Settings.Nuts"];
    const SplitFictionFiles = ["SaveData.Split", "LocalSettings.Split", "Settings.Split", "StartupInfo.Split"];

    const [files, setFiles] = useState<string[]>([]); 
    const [fileContents, setFileContents] = useState<{ [key: string]: string }>({}); 
    const [activeTab, setActiveTab] = useState<string>(""); 

    useEffect(() => {
        
        if (currentGame === "It Takes Two") {
            setFiles(ItTakesTwoFiles); 
        } else if (currentGame === "Split Fiction") {
            setFiles(SplitFictionFiles); 
        }

    }, [currentGame]);


    return (
        <div id="SaveEditorView" className="h-full w-[99%] -pr-1"> {/*w-full just doesn't work with resizing this...*/}
            <Editor theme="vs-dark" defaultLanguage="json" options={{ automaticLayout: true }}/>
            
        </div>
    );
}