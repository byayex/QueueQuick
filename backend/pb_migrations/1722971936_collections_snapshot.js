/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "g26pifh08bzdnfj",
      "created": "2024-05-07 12:10:08.724Z",
      "updated": "2024-05-24 14:25:33.184Z",
      "name": "campaigns",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "mkbg9gzi",
          "name": "owner",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "v8smldh0",
          "name": "title",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 3,
            "max": 100,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "bdbcv730",
          "name": "description",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": 300,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "c7fdwma8",
          "name": "active",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "zyn7fzvu",
          "name": "current_entries",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 0,
            "max": null,
            "noDecimal": true
          }
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_FrgT5Pk` ON `campaigns` (`id`)"
      ],
      "listRule": "owner = @request.auth.id",
      "viewRule": "",
      "createRule": "owner = @request.auth.id",
      "updateRule": "owner = @request.auth.id",
      "deleteRule": "owner = @request.auth.id",
      "options": {}
    },
    {
      "id": "y2nxfqhq1hxqgkp",
      "created": "2024-05-07 12:16:55.856Z",
      "updated": "2024-05-26 10:31:45.810Z",
      "name": "channels",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "ybnmehje",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "8xikm2at",
          "name": "logo",
          "type": "file",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "mimeTypes": [
              "image/webp"
            ],
            "thumbs": [
              "250x250"
            ],
            "maxSelect": 1,
            "maxSize": 15000,
            "protected": false
          }
        },
        {
          "system": false,
          "id": "2pr48sqt",
          "name": "hex_color",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "jqcxobei",
          "name": "text_color",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "uleeaii7",
          "name": "active",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "kcjcdlil",
          "name": "contact_methods",
          "type": "json",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 2000000
          }
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_jb5N62i` ON `channels` (`id`)"
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "p88kd0h93to5e3e",
      "created": "2024-05-13 09:55:45.774Z",
      "updated": "2024-05-26 16:37:29.916Z",
      "name": "channels_config",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "hp3cvprj",
          "name": "user",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "znxco96j",
          "name": "channel",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "y2nxfqhq1hxqgkp",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "kiznbhpv",
          "name": "config",
          "type": "json",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 2000000
          }
        }
      ],
      "indexes": [],
      "listRule": "user = @request.auth.id",
      "viewRule": "user = @request.auth.id",
      "createRule": "user = @request.auth.id",
      "updateRule": "user = @request.auth.id",
      "deleteRule": "user = @request.auth.id",
      "options": {}
    },
    {
      "id": "qp2ztnt7bntpzt2",
      "created": "2024-05-13 11:39:23.489Z",
      "updated": "2024-08-06 17:17:46.742Z",
      "name": "entries",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "ppoowwwk",
          "name": "channel",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "y2nxfqhq1hxqgkp",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "mcq3atvi",
          "name": "campaign",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "g26pifh08bzdnfj",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "rpluefhm",
          "name": "details",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "indexes": [
        "CREATE INDEX `idx_sZ9CPKG` ON `entries` (`campaign`)"
      ],
      "listRule": "campaign.owner.id = @request.auth.id",
      "viewRule": "campaign.owner.id = @request.auth.id",
      "createRule": "campaign.owner.id = @request.auth.id",
      "updateRule": "campaign.owner.id = @request.auth.id",
      "deleteRule": "campaign.owner.id = @request.auth.id",
      "options": {}
    },
    {
      "id": "_pb_users_auth_",
      "created": "2024-08-06 15:06:18.913Z",
      "updated": "2024-08-06 15:08:05.694Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_18LcoPa` ON `users` (`id`)"
      ],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": null,
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": false,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "onlyVerified": true,
        "requireEmail": true
      }
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
