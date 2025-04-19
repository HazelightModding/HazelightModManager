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

export namespace mod {
	
	export class ModDependencies {
	    mod_id: string;
	    optional: boolean;
	    condition: string;
	
	    static createFrom(source: any = {}) {
	        return new ModDependencies(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mod_id = source["mod_id"];
	        this.optional = source["optional"];
	        this.condition = source["condition"];
	    }
	}
	export class ModVersionInfo {
	    link: string;
	    dependencies: ModDependencies[];
	    version: string;
	    created_at: string;
	    game_version: string;
	
	    static createFrom(source: any = {}) {
	        return new ModVersionInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.link = source["link"];
	        this.dependencies = this.convertValues(source["dependencies"], ModDependencies);
	        this.version = source["version"];
	        this.created_at = source["created_at"];
	        this.game_version = source["game_version"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class LatestVersions {
	    alpha: ModVersionInfo;
	    beta: ModVersionInfo;
	    release: ModVersionInfo;
	
	    static createFrom(source: any = {}) {
	        return new LatestVersions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.alpha = this.convertValues(source["alpha"], ModVersionInfo);
	        this.beta = this.convertValues(source["beta"], ModVersionInfo);
	        this.release = this.convertValues(source["release"], ModVersionInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ModDetails {
	    mod_id: string;
	    name: string;
	    short_description: string;
	    description_url: string;
	    type: string;
	    author: string;
	    logo: string;
	    source_url: string;
	    hidden: boolean;
	    latestVersions: LatestVersions;
	    tags: any[];
	
	    static createFrom(source: any = {}) {
	        return new ModDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mod_id = source["mod_id"];
	        this.name = source["name"];
	        this.short_description = source["short_description"];
	        this.description_url = source["description_url"];
	        this.type = source["type"];
	        this.author = source["author"];
	        this.logo = source["logo"];
	        this.source_url = source["source_url"];
	        this.hidden = source["hidden"];
	        this.latestVersions = this.convertValues(source["latestVersions"], LatestVersions);
	        this.tags = source["tags"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ModSummary {
	    name: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new ModSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	    }
	}

}

