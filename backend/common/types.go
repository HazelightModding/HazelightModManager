package common

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type Game struct {
	Name        string
	Id          string
	ProjectName string

	LocalAppdata string
	GameDir      string
	ScriptDir    string
	ModsDir      string
	TempDir      string
}

type Games struct {
	ItTakesTwo   *Game
	Splitfiction *Game
}

func NewGame(name, installPath string) (*Game, error) {
	game := &Game{}

	game.LocalAppdata = os.Getenv("LOCALAPPDATA")
	if game.LocalAppdata == "" {
		return nil, fmt.Errorf("LOCALAPPDATA not set")
	}

	switch strings.ToLower(name) {
	case "split fiction":
		game.Name = "Split Fiction"
		game.Id = "SplitFiction"
		game.ProjectName = "Split"
	case "it takes two":
		game.Name = "It Takes Two"
		game.Id = "ItTakesTwo"
		game.ProjectName = "Nuts"
	default:
		return nil, fmt.Errorf("unsupported game: %s", name)
	}

	game.GameDir = installPath
	game.ModsDir = filepath.Join(game.LocalAppdata, game.Id, "Mods")
	game.ScriptDir = filepath.Join(installPath, game.ProjectName, "Script")
	game.TempDir = filepath.Join(os.TempDir(), "HazelightModManager")

	return game, nil
}

type Version struct {
	Major      int
	Minor      int
	Build      int
	Revision   int
	ManifestID int
}

func (v *Version) ToString() string {
	return fmt.Sprintf("%d.%d.%d.%d", v.Major, v.Minor, v.Build, v.Revision)
}

func (v Version) GreaterThan(other Version) bool {
	if v.Major > other.Major {
		return true
	}
	if v.Major == other.Major {
		if v.Minor > other.Minor {
			return true
		}
		if v.Minor == other.Minor {
			if v.Build > other.Build {
				return true
			}
			if v.Build == other.Build {
				return v.Revision > other.Revision
			}
		}
	}
	return false
}

func (v Version) Equal(other Version) bool {
	return v.Major == other.Major && v.Minor == other.Minor &&
		v.Build == other.Build && v.Revision == other.Revision
}

func (v Version) LessThan(other Version) bool {
	return !v.GreaterThan(other) && !v.Equal(other)
}

func VersionFromString(versionStr string) (Version, error) {
	parts := strings.Split(versionStr, ".")

	if len(parts) != 4 {
		return Version{}, fmt.Errorf("invalid version format: %s", versionStr)
	}

	major, err := strconv.Atoi(parts[0])
	if err != nil {
		return Version{}, fmt.Errorf("invalid major version: %s", parts[0])
	}

	minor, err := strconv.Atoi(parts[1])
	if err != nil {
		return Version{}, fmt.Errorf("invalid minor version: %s", parts[1])
	}

	build, err := strconv.Atoi(parts[2])
	if err != nil {
		return Version{}, fmt.Errorf("invalid build version: %s", parts[2])
	}

	revision, err := strconv.Atoi(parts[3])
	if err != nil {
		return Version{}, fmt.Errorf("invalid revision version: %s", parts[3])
	}

	return Version{Major: major, Minor: minor, Build: build, Revision: revision}, nil
}
