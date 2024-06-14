package main

import (
	"errors"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		25,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	var queryTimeout int
	app.RootCmd.PersistentFlags().IntVar(
		&queryTimeout,
		"queryTimeout",
		30,
		"the default SELECT queries timeout in seconds",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (hooks and migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	// GitHub selfupdate
	ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{})

	app.OnAfterBootstrap().PreAdd(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), indexFallback))

		// Adding custom API Routes
		var prefix string = "/api/queueQuick/"

		e.Router.POST(prefix+"sendNotification", sendNotification(app), apis.RequireAdminOrRecordAuth("users"))
		e.Router.GET(prefix+"getAvailableChannels", getAvailableChannels(app))
		e.Router.POST(prefix+"addSelfToCampaign", addSelfToCampaign(app))
		e.Router.POST(prefix+"removeSelfFromCampaign", removeSelfFromCampaign(app))

		return nil
	})

	// LIMIT USERNAME TO 10
	app.OnRecordBeforeCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {

		if len(e.Record.GetString("username")) > 10 {
			return errors.New("username cannot be longer than 10 characters")
		}

		return nil
	})
	app.OnRecordBeforeUpdateRequest("users").Add(func(e *core.RecordUpdateEvent) error {

		if len(e.Record.GetString("username")) > 10 {
			return errors.New("username cannot be longer than 10 characters")
		}

		if e.Record.GetBool("emailVisibility") {
			return errors.New("email cannot be set to public")
		}

		return nil
	})
	// LIMIT USERNAME TO 10

	app.OnRecordBeforeCreateRequest("channels_config").Add(func(e *core.RecordCreateEvent) error {

		userId := apis.RequestInfo(e.HttpContext).AuthRecord.Id
		records, _ := app.Dao().FindRecordsByFilter("channels_config", "channel = {:channelId} && user = {:userId}", "-created", 0, 0, dbx.Params{"channelId": e.Record.GetString("channel"), "userId": userId})

		if len(records) > 0 {
			return errors.New("you already created a config for this channel")
		}

		if errs := app.Dao().ExpandRecord(e.Record, []string{"channel"}, nil); len(errs) > 0 {
			return errors.New("error while finding the channel")
		}

		channel := e.Record.ExpandedOne("channel")

		if channel.GetString("name") == "email" {
			result := Email{}
			err := e.Record.UnmarshalJSONField("config", &result)
			if err != nil {
				return errors.New("JSON is not Valid")
			}
			e.Record.Set("config", result)
		}
		// Add new channels here for validation
		// Copy below

		return nil
	})
	app.OnRecordBeforeUpdateRequest("channels_config").Add(func(e *core.RecordUpdateEvent) error {

		if errs := app.Dao().ExpandRecord(e.Record, []string{"channel"}, nil); len(errs) > 0 {
			return errors.New("error while finding the channel")
		}

		channel := e.Record.ExpandedOne("channel")

		if channel.GetString("name") == "email" {
			result := Email{}
			err := e.Record.UnmarshalJSONField("config", &result)
			if err != nil {
				return errors.New("JSON is not Valid")
			}
			e.Record.Set("config", result)
		}
		// Add new channels here for validation
		// Copy top

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

type Email struct {
	Host          string `json:"host"`
	Port          int    `json:"port"`
	Username      string `json:"username"`
	Password      string `json:"password"`
	SenderAddress string `json:"sender_address"`
	SenderName    string `json:"sender_name"`
}
