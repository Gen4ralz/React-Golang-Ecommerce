package api

import (
	"os"
	"testing"

	"github.com/gen4ralz/react-golang-ecommerce/store"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
)

func newTestServer(t *testing.T,config utils.Config, store store.Store) *Server {

	server := NewServer(config, store)

	return server
}

func TestMain(m *testing.M) {
	// Run the tests
	exitCode := m.Run()

	// Clean up any resources after tests if necessary

	os.Exit(exitCode)
}