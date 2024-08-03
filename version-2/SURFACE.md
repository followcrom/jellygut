# Jelly Gut Up Norf!

![Jelly Chef](imgs/jelly-chef.png)

## Development Environment

Run `index.html` with Live Server in VSCode.

http://localhost:5500/

Sign in wth GitHub.

## GitHub Pages

The app is hosted on GitHub Pages at: https://followcrom.github.io/jellygut/

### Create a new branch for the new version of the app

```bash
git checkout -b SURFACE

git add .

git commit -m "New version of Jelly Gut for the North"

git push origin SURFACE
```

### Update GitHub Pages Settings

On the GitHub repository, navigate to the Settings Tab.

On the left sidebar, click the Pages section.

Under the "GitHub Pages" section, you’ll find a source dropdown.
Change the Source to Your New Branch:

Select your new branch (new-version) from the dropdown menu. If you're deploying from a folder like /docs, make sure to select the correct folder if necessary.
Save Your Changes.

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