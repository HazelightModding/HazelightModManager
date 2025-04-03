package common

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func MoveFile(src, dst string, createDirs bool) error {
	err := CopyFile(src, dst, createDirs)
	if err != nil {
		return fmt.Errorf("failed copying file: %s", err)
	}

	err = os.Remove(src)
	if err != nil {
		return fmt.Errorf("failed removing original file: %s", err)
	}
	return nil
}

func CopyFile(src, dst string, createDirs bool) error {
	if createDirs {
		dstDir := filepath.Dir(dst)

		if err := os.MkdirAll(dstDir, os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directories: %s", err)
		}
	}

	in, err := os.Open(src)
	if err != nil {
		return fmt.Errorf("couldn't open source file: %s", err)
	}

	out, err := os.Create(dst)
	if err != nil {
		in.Close()
		return fmt.Errorf("couldn't open dest file: %s", err)
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	in.Close()
	if err != nil {
		return fmt.Errorf("writing to output file failed: %s", err)
	}

	err = out.Sync()
	if err != nil {
		return fmt.Errorf("sync error: %s", err)
	}

	si, err := os.Stat(src)
	if err != nil {
		return fmt.Errorf("stat error: %s", err)
	}
	err = os.Chmod(dst, si.Mode())
	if err != nil {
		return fmt.Errorf("chmod error: %s", err)
	}
	return nil
}
