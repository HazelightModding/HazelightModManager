package update

import (
	"HazelightModManager/backend/common"
)

type UpdateManager struct{}

type Updateable struct {
	UpdateName string
	JsonURL    string
	UpdateURL  string
	Version    common.Version
}

func (a *UpdateManager) CheckForUpdate() {
	v := &Updateable{
		UpdateName: "Hazelight Mod Manager",
		JsonURL:    "",
		UpdateURL:  "",
		Version:    common.Version{Major: 1, Minor: 2, Build: 3, Revision: 4},
	}

	_ = v

}
