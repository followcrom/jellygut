# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Jelly Gut** is a Progressive Web App (PWA) for tracking daily activities via an interactive calendar interface. It uses Firebase for GitHub authentication and real-time data storage. The app is deployed on GitHub Pages and supports two separate versions running concurrently from different subdirectories.

## Repository Structure

- **version-1/**: Original version tracking ["Clean", "Dry", "Meditate", "TV8"] with database path `CL:2024/`
- **version-2/**: Northern version tracking ["Clean", "Dry", "Work", "Out"] with database path `NORF:2024/`
- **analysis/**: Jupyter notebooks for data analysis and visualization
  - `jellyGut_dataDump.ipynb`: Analysis for version-1 data
  - `jellyGut-NORF_dataDump.ipynb`: Analysis for version-2 data
  - `data/`: Monthly data exports for version-1
  - `data_norf/`: Monthly data exports for version-2
- **index.html**: Root page linking to both versions

Each version subdirectory contains:
- `index.html`: Main HTML
- `js/script.js`: Calendar logic and Firebase interactions
- `js/firebase-init.js`: Firebase configuration
- `service-worker.js`: PWA caching and offline functionality
- `manifest.json`: PWA metadata
- `css/styles.css`: Styling

## Development

### Running Locally

Use Live Server in VSCode to run either version:
- Version 1: http://localhost:5500/version-1/
- Version 2: http://localhost:5500/version-2/

No build process or dependencies required - the app uses vanilla JavaScript with Firebase loaded via CDN.

### Making Changes

When modifying HTML, CSS, or JS files:

1. **Update the service worker cache version** in the appropriate `service-worker.js`:
   - Version 1: `const CACHE_NAME = "jellygut-cache-v#";`
   - Version 2: `const CACHE_NAME = "jellygut-cache-norf-v#";`

2. Users will continue to see cached content until the service worker cache version is incremented.

Alternative: For HTML-only changes that should appear immediately, the service worker can be modified to use network-first strategy for HTML requests (see [SURFACE.md](SURFACE.md:52-75) for example code).

### Deployment

**IMPORTANT**: Pushing to the main branch automatically deploys to GitHub Pages.

- Version 1 URL: https://followcrom.github.io/jellygut/version-1/
- Version 2 URL: https://followcrom.github.io/jellygut/version-2/

Both versions are served from the same branch because GitHub Pages only supports one branch per repository for publishing.

## Architecture

### Authentication & Data Flow

1. User clicks "GitHub Login" button
2. Firebase authenticates via GitHub OAuth (popup flow)
3. On successful auth, calendar interface displays
4. User can mark daily activities (checkboxes) and save to Firebase
5. Data persists to Firebase Realtime Database under user-specific path

### Firebase Structure

The Firebase Realtime Database has two top-level paths:
- `CL:2024/`: Version 1 data with fields {Clean, Dry, Meditate, TV8}
- `NORF:2024/`: Version 2 data with fields {Clean, Dry, Work, Out}

Each date entry follows the format: `YYYY-M-D` (e.g., "2024-8-15")

Database rules enforce:
- Authentication required for read/write
- User-specific access control via UID
- Schema validation for required fields

### PWA Configuration

Each version is a separate PWA with distinct:
- **Cache names**: Prevents conflicts between versions
- **start_url** and **scope**: Points to respective subdirectories (`/jellygut/version-1/` or `/jellygut/version-2/`)
- **Names**: "Jelly Gut 2024" vs "Jelly Gut R.L 2025"

The service worker implements:
- **Install**: Precaches HTML, CSS, and JS
- **Fetch**: Cache-first strategy for offline support
- **Activate**: Removes old cache versions

## Data Analysis

The `analysis/` directory contains Jupyter notebooks for visualizing activity data:

1. Connect to Firebase using service account credentials
2. Export data to JSON files organized by month
3. Generate visualizations:
   - Bar charts showing % completion by day of week
   - Histograms for individual activities
   - Pie charts showing true/false ratios
   - Overall statistics across all categories

Key metrics tracked:
- Percentage of activities completed by day of week
- Total counts and percentages for each activity
- Overall completion rate across all activities

## Creating a New Version

To add a new version (e.g., version-3):

1. Copy an existing version directory
2. Update `checkboxLabels` array in `script.js` with new activity names
3. Change database path in `script.js` (e.g., `NEW:2025/`)
4. Update `manifest.json`:
   - Set unique `name` and `short_name`
   - Set `start_url: "/jellygut/version-3/"`
   - Set `scope: "/jellygut/version-3/"`
5. Update service worker cache name (e.g., `"jellygut-cache-new-v1"`)
6. Add Firebase database rules for the new path with appropriate field validation
7. Update root `index.html` to link to the new version

## Key Implementation Details

- **ES6 Modules**: JavaScript uses ES6 imports from Firebase CDN
- **Date Format**: Dates stored as `YYYY-M-D` (no zero-padding on month/day)
- **Authentication**: Uses Firebase GitHub provider with popup authentication
- **State Management**: No framework - pure DOM manipulation with event listeners
- **Offline Support**: Service worker caches assets for offline use
- **Data Validation**: Each activity tracked as boolean in Firebase
