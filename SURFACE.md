# 🪼 Jelly Gut Up Norf! (Version 2) 🍮

<table border="0">
  <tr>
    <td>
      <img src="jelly-chef.png" alt="Jelly Chef" width="600" style="margin-right: 10px;"/>
    </td>
    <td style="font-size: 1.4rem;">
      <b>Version 2</b> of the Jelly Gut app is a new version for the North. It has a new set of metrics and a new database path.
      <br><br>
      <b>Both versions</b> of the app are in the same branch. This is so we can use GitHub Pages to host both versions from different subdirectories within the same branch.
      <br><br>
      <b>Version 1</b> can also be found in the main branch in the dir <i>version-1</i>.
    </td>
  </tr>
</table>

## GitHub Pages 🖥️

### Note: <u>Pushing to the main branch will automatically update GitHub Pages!</u>

GitHub Pages natively supports only one branch per repository for publishing. Having two versions of the app requires serving both versions from different subdirectories within the same branch.

- V1 is hosted on GitHub Pages at: https://followcrom.github.io/jellygut/version-1/

- V2 is hosted on GitHub Pages at: https://followcrom.github.io/jellygut/version-2/

### Update GitHub Pages Settings

On the GitHub repository, navigate to the _Settings_ tab.

On the left sidebar, click the _Pages_ section.

# 🏗️ Let's Build!  🏢

## Development Environment 👨🏻‍💻

Run `index.html` with Live Server in VSCode.

http://localhost:5500/version-2/

## Updates 📝

When you make changes, you'll need to:

1. Increment the service worker cache version name (e.g., change to "jellygut-cache-norf-v3")

2. Redeploy the updated service worker

If you don't update the service worker, users will continue to see the cached (old) version of the site.

**Alternative approach**: If you want HTML changes to appear immediately without updating the service worker every time, you could modify your strategy to use network-first for HTML files specifically:

```javascript
self.addEventListener("fetch", (event) => {
  // Use network-first for HTML requests
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).catch(error => {
        return caches.match(event.request);
      })
    );
  } else {
    // Use cache-first for other assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});
```

## Changes for 'J.G. Norf' 💫

### 🆕 New Metrics

Updated `checkboxLabels` array in `script.js` to ["Clean", "Dry", "Work", "Out"].

### 🆕 Database Path

Change references in `script.js` to the new database path "NORF:2024/".

### 🆕 Removed analytics

Removed Google Analytics code from `firebase-init.js`. It was causing an error in the console. It is still in _version-1_.

### 🆕 Update `manifest.json`

The new version should have a `different name` and `short_name` to help in distinguishing it from the previous version. It must have a different `start_url` and `scope` to ensure it is a separate PWA.

- start_url: This is the URL that will be loaded when the app is launched. It should point to the subdirectory where the app is located.

- scope: This defines the navigation scope of the PWA. It restricts what URLs can be opened within the app. This should also be set to the subdirectory where the app is located so that any link clicked within the app that points outside this scope will open in the browser instead of within the PWA.

```json
{
  "start_url": "/jellygut/version-2/",
  "scope": "/jellygut/version-2/",
}
```

### 🆕 Modify `service-worker.js`

Ensure that the service worker has a different cache name to avoid conflicts with the old version.

`const CACHE_NAME = "jellygut-cache-norf-v1";`

### 🆕 Firebase Realtime Database

Keep the rules for the **CL:2024** path and add new rules for new database path **NORF:2024**.

```json
{
  "rules": {
    ".write": "false",

    "CL:2024": {
      "$date": {
        ".read": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".write": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".validate": "newData.hasChildren(['Clean', 'Dry', 'Meditate', 'TV8'])"
      }
    },

    "NORF:2024": {
      "$date": {
        ".read": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".write": "auth != null && auth.uid === '6ujpFjcT8PWP3btpoAW2zeqSSmB2'",
        ".validate": "newData.hasChildren(['Clean', 'Dry', 'Work', 'Out'])"
      }
    },

    "$other": {
      ".read": "false",
      ".write": "false"
    }
  }
}
```

## Service Worker 👨‍🔧🚽

A service worker is a key requirement for a web application to be installable as a Progressive Web App (PWA). I have kept the service worker from the previous version, but a minimal service worker without those caching features will still ensure the app is installable as a PWA.

The cache name should be unique to each version of the app. This is to ensure that the cache for one version does not conflict with the cache for another version.

### Minimal Service Worker

```javascript
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // This is a simple no-op fetch event handler
});
```