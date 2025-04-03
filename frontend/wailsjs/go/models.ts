export namespace gameinstall {
	
	export class GameInstallInfo {
	    Game: string;
	    Version: string;
	    InstallPath: string;
	    Launcher: string;
	    ScriptDir: string;
	
	    static createFrom(source: any = {}) {
	        return new GameInstallInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Game = source["Game"];
	        this.Version = source["Version"];
	        this.InstallPath = source["InstallPath"];
	        this.Launcher = source["Launcher"];
	        this.ScriptDir = source["ScriptDir"];
	    }
	}

}

