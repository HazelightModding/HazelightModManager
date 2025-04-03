package common

import (
	"encoding/gob"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"sync"

	"maps"

	"github.com/zeebo/xxh3"
)

const workerCount = 8

func GetFileHash(filePath string) (uint64, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	hasher := xxh3.New()
	if _, err := io.Copy(hasher, file); err != nil {
		return 0, err
	}

	return hasher.Sum64(), nil
}

func HashWorker(dir string, files <-chan string, results chan<- map[string]uint64, wg *sync.WaitGroup) {
	defer wg.Done()
	hashes := make(map[string]uint64)

	for file := range files {
		relPath, _ := filepath.Rel(dir, file)
		hash, err := GetFileHash(file)
		if err == nil {
			hashes[relPath] = hash
		}
	}
	results <- hashes
}

func GetFolderHashes(dir string) map[string]uint64 {
	files := make(chan string, workerCount*2)
	results := make(chan map[string]uint64, workerCount)
	var wg sync.WaitGroup

	for range workerCount {
		wg.Add(1)
		go HashWorker(dir, files, results, &wg)
	}

	go func() {
		filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return nil
			}
			if info.IsDir() && info.Name() == ".git" {
				return filepath.SkipDir
			}
			if !info.IsDir() {
				files <- path
			}
			return nil
		})
		close(files)
	}()

	// Wait for workers to finish
	go func() {
		wg.Wait()
		close(results)
	}()

	finalHashes := make(map[string]uint64)
	for result := range results {
		maps.Copy(finalHashes, result)
	}

	return finalHashes
}

func SaveHashesToBinary(hashes map[string]uint64, filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := gob.NewEncoder(file)
	return encoder.Encode(hashes)
}

func SaveHashesToJson(hashes map[string]uint64, filename string) error {
	data, err := json.MarshalIndent(hashes, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filename, data, 0644)
}

func LoadHashesFromJson(filename string) (map[string]uint64, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var hashes map[string]uint64
	err = json.Unmarshal(data, &hashes)
	return hashes, err
}

func LoadHashesListFromJson(filename string) (map[string]map[string]uint64, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var hasheslist map[string]map[string]uint64
	err = json.Unmarshal(data, &hasheslist)
	return hasheslist, err
}

func CompareHashes(hashmap1 map[string]uint64, hashmap2 map[string]uint64) map[string]uint64 {
	differentHashes := make(map[string]uint64)

	for file, hash1 := range hashmap1 {
		hash2, exists := hashmap2[file]
		if !exists {
			differentHashes[file] = 0
		} else if hash1 != hash2 {
			differentHashes[file] = hash2
		}
	}

	for file, hash2 := range hashmap2 {
		if _, exists := hashmap1[file]; !exists {
			differentHashes[file] = hash2
		}
	}

	return differentHashes
}
