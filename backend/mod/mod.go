package mod

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Mod struct{}

type ModList struct {
	SplitFictionMods []ModSummary `json:"split_fiction_mods"`
	ItTakesTwoMods   []ModSummary `json:"it_takes_two_mods"`
}

type ModSummary struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type ModDependencies struct {
	ModID     string `json:"mod_id"`
	Optional  bool   `json:"optional"`
	Condition string `json:"condition"`
}

type ModVersionInfo struct {
	Link         string            `json:"link"`
	Dependencies []ModDependencies `json:"dependencies"`
	Version      string            `json:"version"`
	CreatedAt    string            `json:"created_at"`
	GameVersion  string            `json:"game_version"`
}

type ModDetails struct {
	ModID            string         `json:"mod_id"`
	Name             string         `json:"name"`
	ShortDescription string         `json:"short_description"`
	DescriptionURL   string         `json:"description_url"`
	Type             string         `json:"type"`
	Author           string         `json:"author"`
	Logo             string         `json:"logo"`
	SourceURL        string         `json:"source_url"`
	Hidden           bool           `json:"hidden"`
	LatestVersions   LatestVersions `json:"latestVersions"`
	Tags             []any          `json:"tags"`
}

type LatestVersions struct {
	Alpha   ModVersionInfo `json:"alpha"`
	Beta    ModVersionInfo `json:"beta"`
	Release ModVersionInfo `json:"release"`
}

func (a *Mod) GetAvailableMods(Game string) ([]ModSummary, error) {

	modListPath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", "Mods", "ModList.json")

	modListFile, err := os.Open(modListPath)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Println("Mod list not found. Attempting to download...")

			_, err := a.DownloadModList()
			if err != nil {
				return nil, fmt.Errorf("failed to download mod list: %w", err)
			}

			modListFile, err = os.Open(modListPath)
			if err != nil {
				return nil, fmt.Errorf("failed to open newly downloaded mod list: %w", err)
			}
		} else {
			return nil, err
		}
	}

	var fullList ModList
	if err := json.NewDecoder(modListFile).Decode(&fullList); err != nil {
		return []ModSummary{}, err
	}

	switch strings.ToLower(Game) {
	case "split fiction":
		return fullList.SplitFictionMods, nil
	case "it takes two":
		return fullList.ItTakesTwoMods, nil
	default:
		return nil, fmt.Errorf("no mod list found for game: %s", Game)
	}
}

func (a *Mod) DownloadModList() (bool, error) {
	modListPath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", "Mods", "ModList.json")

	resp, err := http.Get("https://raw.githubusercontent.com/HazelightModding/HazelightMods/refs/heads/main/ModList.json")
	if err != nil {
		return false, fmt.Errorf("failed to fetch remote mod list: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("unexpected status code downloading mod list: %d", resp.StatusCode)
	}

	// Save the downloaded file locally
	if err := os.MkdirAll(filepath.Dir(modListPath), os.ModePerm); err != nil {
		return false, fmt.Errorf("failed to create directory for mod list: %w", err)
	}

	out, err := os.Create(modListPath)
	if err != nil {
		return false, fmt.Errorf("failed to create mod list file: %w", err)
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return false, fmt.Errorf("failed to write mod list to file: %w", err)
	}
	return true, nil
}

func GetAvailableLocalMods(Game string) {

}

func (a *Mod) GetModDetails(mod ModSummary) (ModDetails, error) {
	resp, err := http.Get(mod.URL)
	if err != nil {
		return ModDetails{
			Name:             mod.Name,
			ShortDescription: "Failed to load mod info",
		}, err
	}
	defer resp.Body.Close()

	var details ModDetails
	if err := json.NewDecoder(resp.Body).Decode(&details); err != nil {
		return ModDetails{
			Name:             mod.Name,
			ShortDescription: "Malformed json",
		}, err
	}

	if details.Name == "" {
		details.Name = mod.Name
	}

	return details, nil
}

func (a *Mod) GetVisibleModDetails(mods []ModSummary) ([]ModDetails, error) {
	details := make([]ModDetails, 0, len(mods))
	for _, mod := range mods {
		modDetail, _ := a.GetModDetails(mod)
		details = append(details, modDetail)
	}
	return details, nil
}
