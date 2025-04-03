package gameinstall

import (
	"HazelightModManager/backend/common"
	"strconv"
	"strings"

	"encoding/json"
	"fmt"
	"os"
	"path"
	"path/filepath"

	"maps"

	"github.com/andygrunwald/vdf"
	"golang.org/x/sys/windows/registry"
)

type GameInstallation struct {
}

type GameInstallInfo struct {
	Game        string
	Version     string
	InstallPath string
	Launcher    string
	ScriptDir   string
}

func GetAllGameInstalls() {

	//installList := GetOrCreateInstallList()
	// Load list of installs, if it doesn't exist, create it.
	// If the list is empty, scan for game installs. (registry etc)

}

func (a *GameInstallation) GetOrCreateInstallList(bForceFindInstalls bool) []GameInstallInfo {
	appDataPath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager")
	os.MkdirAll(appDataPath, os.ModePerm)

	filePath := filepath.Join(appDataPath, "GameInstallList.json")

	installList := []GameInstallInfo{}

	if _, err := os.Stat(filePath); os.IsNotExist(err) || bForceFindInstalls {
		installList = a.FindGameInstalls()
		SaveInstallList(filePath, installList)
		return installList
	}

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file: ", err)
		return installList
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&installList); err != nil {
		fmt.Println("Error decoding JSON: ", err)
		return installList
	}

	if len(installList) == 0 {
		installList = a.FindGameInstalls()
		SaveInstallList(filePath, installList)
	}

	return installList
}

func (a *GameInstallation) FindGameInstalls() []GameInstallInfo {

	installList := []GameInstallInfo{
		*FindGameInstall("ItTakesTwo"),
		*FindGameInstall("SplitFiction"),
	}

	return installList
}

func FindGameInstall(game string) *GameInstallInfo {

	// Check registry
	key, err := registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\Hazelight\`+game, registry.QUERY_VALUE)
	if err == nil {
		installDir, _, err := key.GetStringValue("Install Dir")
		if err == nil {
			return GetInstallInfo(installDir, game)
		}
	}
	if err != nil {
		fmt.Println("Failed to open registry key: ", err)
	}
	defer key.Close()

	// Check steam
	var steamInstallPath string
	key, err = registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\WOW6432Node\Valve\Steam`, registry.QUERY_VALUE)
	if err != nil {
		fmt.Println("Failed to open registry key: ", err)
	}
	steamInstallPath, _, _ = key.GetStringValue("InstallPath")
	defer key.Close()

	if steamInstallPath != "" {
		steamGameID := "1426210" // It Takes Two

		if game == "SplitFiction" {
			steamGameID = "2001120"
		}

		libraryFoldersFile := path.Join(steamInstallPath, "steamapps", "libraryfolders.vdf")

		file, err := os.Open(libraryFoldersFile)
		if err != nil {
			fmt.Println("Error opening Library Folders file: ", err)
		}

		libraryFoldersMap, err := vdf.NewParser(file).Parse()
		if err != nil {
			fmt.Println("Error parsing Library Folders file: ", err)
		}

		libraryFolders, ok := libraryFoldersMap["libraryfolders"].(map[string]interface{})
		if !ok {
			fmt.Println("Invalid libraryfolders structure")
		}

		for _, folderData := range libraryFolders {
			folderMap, ok := folderData.(map[string]any)
			if !ok {
				continue
			}
			apps, ok := folderMap["apps"].(map[string]any)
			if !ok {
				continue
			}
			steamPath, ok := folderMap["path"].(string)
			if !ok {
				continue
			}
			if _, exists := apps[steamGameID]; exists {
				folderName := "ItTakesTwo"
				if game == "SplitFiction" {
					folderName = "Split Fiction"
				}
				installDir := filepath.Join(filepath.Clean(steamPath), "steamapps", "common", folderName)
				return GetInstallInfo(installDir, game)
			}
		}

		fmt.Println(libraryFoldersMap)
	}

	return &GameInstallInfo{}
	// TODO: Look at EA and Epic alternatives?
}

func GetInstallInfo(installDir string, game string) *GameInstallInfo {

	var projectName string
	var precompVersions map[uint64]common.Version

	var gameLabel = ""

	if game == "ItTakesTwo" {
		gameLabel = "It Takes Two"
		projectName = "Nuts"
		precompVersions = map[uint64]common.Version{
			0x4A17A12: {Major: 1, Minor: 0, Build: 0, Revision: 4, ManifestID: 3216230827772959550},
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 3401192366988229428}, // Steam native update
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 3374707419180799751},
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 3821862291216614697},
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 5869418373172440680}, // Language update
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 6566570740130404825}, // Revert
			//0x1111111: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 7753702927653051937}, // Accidental update (language)
			//0x0000002: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 4029035475036676543}, // Remove origin update
			//0x0000001: {Major: 1, Minor: 0, Build: 0, Revision: 2, ManifestID: 8061422152918769981}, // Accessibility update
			//0x0000000: {Major: 1, Minor: 0, Build: 0, Revision: 1, ManifestID: 1680810948345347632}, // Launch
		}
	}

	if game == "SplitFiction" {
		gameLabel = "Split Fiction"
		projectName = "Split"
		precompVersions = map[uint64]common.Version{
			1907097446713166008: {Major: 1, Minor: 0, Build: 0, Revision: 1, ManifestID: 3717533875463683035}, // March 17th 2025
			4653301727957864470: {Major: 1, Minor: 0, Build: 0, Revision: 0, ManifestID: 2362165511384914299}, // Launch (day 0 patch, includes in-game timer)
		}
	}

	gameInfo := &GameInstallInfo{
		Game:        gameLabel,
		Version:     "",
		InstallPath: installDir,
		Launcher:    "",
		ScriptDir:   filepath.Join(installDir, projectName, "Script"),
	}

	hlmmGamePath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", game)
	os.MkdirAll(hlmmGamePath, os.ModePerm)

	hashes := common.GetFolderHashes(gameInfo.ScriptDir)
	common.SaveHashesToJson(hashes, filepath.Join(hlmmGamePath, "ScriptHash.json"))

	/*hashesList, _ := common.LoadHashesListFromJson(filepath.Join(hlmmGamePath, "ScriptHashes.json"))
	launchHash := hashesList["0"]
	compHash := common.CompareHashes(launchHash, hashes)

	for file := range compHash {

		absPath := filepath.Join(gameInfo.ScriptDir, file)
		copyTo := filepath.Join(hlmmGamePath, game, "Script", file)

		common.CopyFile(absPath, copyTo, true)
	}

	common.SaveHashesToJson(compHash, filepath.Join(hlmmGamePath, game, "ScriptHash_COMP.json"))*/

	for file, hash := range hashes {
		if strings.Contains(file, "PrecompiledScript.Cache") {
			if val, ok := precompVersions[hash]; ok {
				gameInfo.Version = val.ToString()
				comparisonHash := DetermineComparisonHash(gameInfo, val)
				common.SaveHashesToJson(comparisonHash, filepath.Join(hlmmGamePath, "ScriptHash_Comparison.json"))
			} else {
				gameInfo.Version = fmt.Sprint(hash)
			}
			break
		}
	}

	return gameInfo
}

func SaveInstallList(filePath string, installList []GameInstallInfo) {
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error creating file: ", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "    ")
	_ = encoder.Encode(installList)
}

func DetermineComparisonHash(game *GameInstallInfo, version common.Version) map[string]uint64 {
	gameID := ""
	if game.Game == "It Takes Two" {
		gameID = "ItTakesTwo"
	}
	if game.Game == "Split Fiction" {
		gameID = "SplitFiction"
	}

	hashesList, _ := common.LoadHashesListFromJson(filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", "Hashes", gameID+"_ScriptHashes.json"))

	comparisonHash := hashesList["0"]
	for patchVersionStr, hashes := range hashesList {
		patchVersion, _ := strconv.Atoi(patchVersionStr)

		if patchVersion > int(version.Revision) {
			continue
		}

		maps.Copy(comparisonHash, hashes)
	}

	return comparisonHash
}
