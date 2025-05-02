package mod

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
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

func (a *Mod) GetBrowsableMods(Game string) ([]ModSummary, error) {

	modListPath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", "ModList.json")

	modListFile, err := os.Open(modListPath)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Println("Mod list not found. Attempting to download...")

			_, err := a.DownloadBrowsableModList()
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

func (a *Mod) DownloadBrowsableModList() (bool, error) {
	modListPath := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", "ModList.json")

	resp, err := http.Get("https://raw.githubusercontent.com/HazelightModding/HazelightMods/refs/heads/main/ModList.json")
	if err != nil {
		return false, fmt.Errorf("failed to fetch remote mod list: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("unexpected status code downloading mod list: %d", resp.StatusCode)
	}

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

func (a *Mod) GetLocalMods(Game string) ([]ModSummary, error) {

	gameFolder := ""
	switch strings.ToLower(Game) {
	case "split fiction":
		gameFolder = "SplitFiction"
	case "it takes two":
		gameFolder = "ItTakesTwo"
	}

	modsFolder := filepath.Join(os.Getenv("LOCALAPPDATA"), "HazelightModManager", gameFolder, "Mods")

	var localMods []ModSummary

	err := filepath.WalkDir(modsFolder, func(path string, dir fs.DirEntry, err error) error {

		if err != nil {
			return err
		}

		if !dir.IsDir() {
			return nil
		}

		entries, err := os.ReadDir(path)
		if err != nil {
			return err
		}

		for _, entry := range entries {
			if entry.IsDir() || !strings.EqualFold(entry.Name(), "mod.json") {
				continue
			}

			jsonPath := filepath.Join(path, entry.Name())
			content, err := os.ReadFile(jsonPath)
			if err != nil {
				continue
			}

			var details ModDetails
			if err := json.Unmarshal(content, &details); err != nil || details.Name == "" {
				continue
			}

			var summary ModSummary
			summary.Name = details.Name
			summary.URL = filepath.Join(path, "mod.json")
			localMods = append(localMods, summary)

			return fs.SkipDir
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return localMods, nil
}

func (a *Mod) GetModDetails(mod ModSummary) (ModDetails, error) {
	url := strings.ToLower(mod.URL)
	if strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://") {
		return a.GetModDetailsFromURL(mod)
	}
	return a.GetModDetailsFromFile(mod)
}

func (a *Mod) GetModDetailsFromFile(mod ModSummary) (ModDetails, error) {
	content, err := os.ReadFile(mod.URL)
	if err != nil {
		return ModDetails{
			Name:             mod.Name,
			ShortDescription: "Failed to read local file",
		}, err
	}

	var details ModDetails
	if err := json.Unmarshal(content, &details); err != nil {
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

func (a *Mod) GetModDetailsFromURL(mod ModSummary) (ModDetails, error) {
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

func (a *Mod) DownloadModWithProgress(url string, destPath string, progressCallback func(percent float64)) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to download file: status %s", resp.Status)
	}

	outFile, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	totalSize := resp.ContentLength
	if totalSize <= 0 {
		return fmt.Errorf("unknown content length")
	}

	var downloaded int64 = 0
	buffer := make([]byte, 32*1024) // 32 KB buffer
	for {
		n, err := resp.Body.Read(buffer)
		if n > 0 {
			outFile.Write(buffer[:n])
			downloaded += int64(n)
			percent := (float64(downloaded) / float64(totalSize)) * 100
			progressCallback(percent)
		}
		if err != nil {
			if err == io.EOF {
				break
			}
			return err
		}
	}

	return nil
}
