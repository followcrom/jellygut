# Jelly Gut Up Norf! (Version 2)

<div style="display: flex; align-items: center;">
  <img src="jelly-chef.png" alt="Jelly Chef" width="280" style="margin-right: 10px;"/>
  <span><b>Version 2</b> of the Jelly Gut app is a new version of the app for the North. It has a new set of metrics and a new database path.
  <br><br><b>Both versions</b> of the app are in the same branch. This is so we can use GitHub Pages to host both versions from different subdirectories within the same branch.
  <br><br>
  <b>Version 1</b> can also be found in the main branch in the dir <i>version-1</i>.</span>
</div>

## GitHub Pages

GitHub Pages natively supports only one branch or folder per repository for publishing. Having two versions of the app requires serving both versions from different subdirectories within the same branch.

V1 is hosted on GitHub Pages at: https://followcrom.github.io/jellygut/version-1/

V2 is hosted on GitHub Pages at: https://followcrom.github.io/jellygut/version-2/

### Update GitHub Pages Settings

On the GitHub repository, navigate to the _Settings_ tab.

On the left sidebar, click the _Pages_ section.

# Let's Build! 🚀

## Development Environment

Run `index.html` with Live Server in VSCode.

http://localhost:5500/version-2/

Sign in wth GitHub.

## Changes for 'JG Norf'

### New Metrics

Updated `checkboxLabels` array in `script.js` to ["Clean", "Dry", "Work", "Out"].

### Database Path

Change references in `script.js` to the new database path "NORF:2024/".

### Update `manifest.json`

Make sure the new version has a different name, short_name, and scope. This will help in distinguishing it from the previous version.

### Modify `service-worker.js`

Ensure that the service worker has a different cache name to avoid conflicts with the old version.

`const CACHE_NAME = "jellygut-cache-norf-v1";`

### Firebase Realtime Database

Keep the rules for the **CL:2024** path and add new rules for new database path **NORF:2024**.

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

A service worker is a key requirement for a web application to be installable as a Progressive Web App (PWA). I have kept the service worker from the previous version, but a minimal service worker without those caching features will still ensure the app is installable as a PWA.

### Minimal Service Worker

```javascript
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Perform install steps if necessary
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // This is a simple no-op fetch event handler
});
```