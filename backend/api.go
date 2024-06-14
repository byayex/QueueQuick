package main

import (
	"fmt"
	"net/http"
	"net/smtp"
	"strconv"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
)

func sendNotification(app *pocketbase.PocketBase) echo.HandlerFunc {
	return func(c echo.Context) error {

		info := apis.RequestInfo(c)

		// Access app context or database using app parameter
		campaignID := c.QueryParam("campaign_id")

		data := apis.RequestInfo(c).Data

		subject := data["subject"].(string)
		message := data["message"].(string)

		if subject == "" || message == "" {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "subject and/or message are missing or empty."})
		}

		record, err := app.Dao().FindRecordById("campaigns", campaignID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch category"})
		}

		canAccess, err := app.Dao().CanAccessRecord(record, info, record.Collection().UpdateRule)

		if !canAccess {
			return apis.NewForbiddenError("", err)
		}

		// User is validated after this. He has the permission to send messages for the campaign.
		records, err := app.Dao().FindRecordsByFilter("channels_config", "*", "-created", 0, 0)

		var successAmount = 0
		var errorAmount = 0

		if err != nil {
			errorAmount += 1
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch channel settings"})
		}

		for _, configRecord := range records {

			if errs := app.Dao().ExpandRecord(configRecord, []string{"channel"}, nil); len(errs) > 0 {
				errorAmount += 1
				continue
			}

			channel := configRecord.ExpandedOne("channel")

			if channel.GetString("name") == "email" {

				result := Email{}
				err := configRecord.UnmarshalJSONField("config", &result)

				if err != nil {
					errorAmount += 1
					continue
				}

				// Extract entries here

				emailEntries, err := app.Dao().FindRecordsByFilter("entries", "campaign = {:campaignId} && channel = {:channelId}", "-created", 0, 0, dbx.Params{"campaignId": campaignID, "channelId": channel.Id})

				if err != nil {
					errorAmount += 1
					continue
				}

				var emailAddresses []string
				for _, entry := range emailEntries {
					emailAddresses = append(emailAddresses, entry.GetString("details"))
				}

				auth := smtp.PlainAuth(
					"",
					result.Username,
					result.Password,
					result.Host,
				)

				from := result.SenderAddress
				subject := subject
				body := message
				msg := []byte(subject + "\r\n" + body + "\r\n")

				smtpError := smtp.SendMail(
					result.Host+":"+strconv.Itoa(result.Port),
					auth,
					from,
					emailAddresses,
					msg,
				)

				if smtpError != nil {
					errorAmount += 1
					continue
				}

				successAmount += 1
			}

		}

		return c.JSON(http.StatusOK, campaignID)
	}
}

func getAvailableChannels(app *pocketbase.PocketBase) echo.HandlerFunc {
	return func(c echo.Context) error {

		campaignID := c.QueryParam("campaign_id")

		record, err := app.Dao().FindRecordById("campaigns", campaignID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch available channels"})
		}

		if errs := app.Dao().ExpandRecord(record, []string{"owner"}, nil); len(errs) > 0 {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add owner to campaign."})
		}

		userRecord := record.ExpandedOne("owner")

		if userRecord == nil {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Failed to fetch available channels"})
		}

		userID := userRecord.GetString("id")

		channelConfigs, err := app.Dao().FindRecordsByFilter("channels_config", "user = {:userID}", "-created", 10, 0, dbx.Params{"userID": userID})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch available channels"})
		}

		if errs := app.Dao().ExpandRecords(channelConfigs, []string{"channel"}, nil); len(errs) > 0 {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add to campaign."})
		}

		response := make([]string, len(channelConfigs))

		for i, config := range channelConfigs {
			channel := config.ExpandedOne("channel")
			if channel.GetBool("active") {
				channelID := channel.GetString("id")
				response[i] = channelID
			}
		}

		return c.JSON(http.StatusOK, response)
	}
}

func addSelfToCampaign(app *pocketbase.PocketBase) echo.HandlerFunc {
	return func(c echo.Context) error {

		campaignID := c.QueryParam("campaign_id")
		channelID := c.QueryParam("channel_id")
		details := c.QueryParam("details")

		details = strings.TrimSpace(details)

		collection, err := app.Dao().FindCollectionByNameOrId("entries")

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add to campaign."})
		}

		existingRecord, err := app.Dao().FindRecordsByFilter(
			"entries", "channel = {:channelID} && campaign = {:campaignID} && details = {:details}",
			"-created",
			1,
			0,
			dbx.Params{
				"channelID":  channelID,
				"campaignID": campaignID,
				"details":    details,
			},
		)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to query database."})
		}

		if len(existingRecord) > 0 {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add to campaign."})
		}

		record := models.NewRecord(collection)

		form := forms.NewRecordUpsert(app, record)

		form.LoadData(map[string]any{
			"channel":  channelID,
			"campaign": campaignID,
			"details":  details,
		})

		if err := form.Submit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add to campaign. +" + err.Error()})
		}

		return c.JSON(http.StatusOK, "Added to Campaign List.")
	}
}

func removeSelfFromCampaign(app *pocketbase.PocketBase) echo.HandlerFunc {
	return func(c echo.Context) error {

		campaignID := c.QueryParam("campaign_id")
		entryID := c.QueryParam("entry_id")

		record, err := app.Dao().FindRecordById("entries", entryID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to remove the entry."})
		}

		if errs := app.Dao().ExpandRecord(record, []string{"campaign"}, nil); len(errs) > 0 {
			return fmt.Errorf("failed to expand: %v", errs)
		}

		campaign_record := record.ExpandedOne("campaign")

		if campaign_record.GetString("id") == campaignID {
			if err := app.Dao().DeleteRecord(record); err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to remove from campaign."})
			}
		}

		return c.JSON(http.StatusOK, "Removed the entry successfully.")
	}
}
