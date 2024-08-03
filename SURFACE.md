# Jelly Gut Up Norf!

Run with Live Server in VSCode.

http://localhost:5500/

## Summary of Changes

New Metrics: Updated checkboxLabels array to ["Clean", "Dry", "Work", "Out"].

Update manifest.json
Make sure the new version has a different name, short_name, and scope. This will help in distinguishing it from the previous version.

Database Path: Changed references to the new database path "NORF:2024/".

 Modify service-worker.js
Ensure that the service worker for the new version has a different cache name to avoid conflicts with the old version.
const CACHE_NAME = "jellygut-cache-norf-v1";

Update the Firebase Realtime Database rules to accommodate the new metrics and the new database path. keep the rules for the CL:2024 path and add new rules for your new database path NORF:2024. Here's how you can do it:

```json
{
  "rules": {
    // Global rule to deny write access to any path
    ".write": "false",

    // Specific rules for the 'CL:2024' path
    "CL:2024": {
      "$date": {
        ".read": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        // Allow write only for the specified user and validate the data structure
        ".write": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".validate": "newData.hasChildren(['Clean', 'Dry', 'Meditate', 'TV8'])"
      }
    },

    // Specific rules for the 'NORF:2024' path
    "NORF:2024": {
      "$date": {
        ".read": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        // Allow write only for the specified user and validate the data structure
        ".write": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".validate": "newData.hasChildren(['Clean', 'Dry', 'Work', 'Out'])"
      }
    },

    // Deny read and write access to all other paths
    "$other": {
      ".read": "false",
      ".write": "false"
    }
  }
}
```


## Service Worker

a service worker is a key requirement for a web application to be installable as a Progressive Web App (PWA).
