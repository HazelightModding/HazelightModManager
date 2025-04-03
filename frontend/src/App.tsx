import { useEffect } from "react";
import "./App.css";
import FooterBar from "./components/footer_bar/FooterBar";
import LeftBar from "./components/left_bar/LeftBar";
import MainView from "./components/main_view/MainView";

import TitleBar from "./components/title_bar/TitleBar";
import { ModManagerState } from "./ModManagerState";
import { CheckForUpdate } from "../wailsjs/go/update/UpdateManager"

function App() {

    

    return (
        <div
            id="App"
            className="dark-theme overflow-hidden bg-primary-1 text-primary-5 scrollbar-track-primary-2 scrollbar-corner-primary-2 scrollbar-thumb-primary-4"
        >
            <ModManagerState>
                <div className="flex h-screen w-screen flex-col select-none">
                    <TitleBar />
                    <div className="flex h-0 grow p-2 pb-0">
                        <LeftBar />
                        <MainView />
                    </div>
                    <FooterBar />
                </div>
            </ModManagerState>
        </div>
    );
}

export default App;
