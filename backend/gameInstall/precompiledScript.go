package gameinstall

import (
	"HazelightModManager/backend/common"
	"fmt"
	"os"
	"path/filepath"
)

type PrecompiledScript struct{}

// Checks if the PrecompiledScript.cache file exists in the games Script directory.
func (a PrecompiledScript) IsPrecompiledScriptActive(game GameInstallInfo) (bool, error) {
	if game.InstallPath == "" || game.ScriptDir == "" {
		return false, fmt.Errorf("install or script directory is invalid")
	}

	_, err := os.Stat(filepath.Join(game.ScriptDir, "PrecompiledScript.Cache"))

	if err == nil {
		return true, nil
	}

	return false, nil
}

// Moves the PrecompiledScript.Cache file between the Script directory and it's own folder, effectively toggling it.
// Returns true if PrecompiledScript.Cache exists in the Script directory.
func (a PrecompiledScript) TogglePrecompiledScriptStatus(game GameInstallInfo, wantEnabled bool) (bool, error) {

	if game.InstallPath == "" || game.ScriptDir == "" {
		return false, fmt.Errorf("install or script directory is invalid")
	}

	_, _, precompEnabled, precompErr := a.GetPrecompiledScriptCache(game)
	if precompErr != nil {
		return false, fmt.Errorf("error getting precompiled script %w", precompErr)
	}

	precompPos1 := filepath.Join(game.ScriptDir, "PrecompiledScript.Cache")
	precompPos2 := filepath.Join(game.ScriptDir, "PrecompiledScript", "PrecompiledScript.Cache")

	os.MkdirAll(filepath.Dir(precompPos2), os.ModePerm)

	fmt.Printf("TogglePrecompiledScriptStatus: precompEnabled=%v, wantEnabled=%v\n", precompEnabled, wantEnabled)

	// Move it back to the Script directory, disabling mods.
	if wantEnabled {
		if precompEnabled {
			fmt.Println("PrecompiledScript is already enabled.")
			return true, nil
		}

		fmt.Println("Attempting to move file:", precompPos2, "->", precompPos1)

		if err := common.MoveFile(precompPos2, precompPos1, false); err != nil {
			fmt.Println("Error moving file:", err)
			return false, fmt.Errorf("error moving file: %w", err)
		}

		return true, nil
	}

	// Move it to Script/PrecompiledScript, enabling mods.
	if !wantEnabled {
		if !precompEnabled {
			fmt.Println("PrecompiledScript is already disabled.")
			return false, nil
		}

		fmt.Println("Attempting to move file:", precompPos1, "->", precompPos2)

		if err := common.MoveFile(precompPos1, precompPos2, false); err != nil {
			fmt.Println("Error moving file:", err)
			return true, fmt.Errorf("error moving file: %w", err)
		}

		return false, nil
	}

	return false, fmt.Errorf("?? this should never be hit")
}

// Returns the filepath, fileinfo, and potentially error for PrecompiledScript.Cache
func (PrecompiledScript) GetPrecompiledScriptCache(game GameInstallInfo) (string, os.FileInfo, bool, error) {
	precompPos1 := filepath.Join(game.ScriptDir, "PrecompiledScript.Cache")
	precompPos2 := filepath.Join(game.ScriptDir, "PrecompiledScript", "PrecompiledScript.Cache")

	// First, double check that there's only one PrecompiledScript.Cache.
	// If there's 2 (i.e. one in the Script directory and one in our made directory), there's likely been a game update.
	precompFileInfo1, precompPos1error := os.Stat(precompPos1)
	precompFileInfo2, precompPos2error := os.Stat(precompPos2)
	if precompPos1error == nil && precompPos2error == nil {
		fmt.Println("Two PrecompiledScript.Cache files exist. A game update may have occurred.")
		if err := os.Remove(precompPos2); err != nil {
			fmt.Println("Error removing secondary PrecompiledScript.Cache ", err)
		}
	}

	if precompPos1error == nil {
		return precompPos1, precompFileInfo1, true, nil
	}

	return precompPos2, precompFileInfo2, false, nil
}

func (a PrecompiledScript) GetPrecompiledScriptCacheSize(game GameInstallInfo) (int64, error) {
	_, precomp, _, err := a.GetPrecompiledScriptCache(game)

	if err != nil {
		return 0, fmt.Errorf("error getting precompiled script %w", err)
	}

	return precomp.Size(), nil
}
