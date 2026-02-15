# Micro Sites on GitHub Pages

This repository is structured for multiple small static sites ("micro-sites") hosted with GitHub Pages.

## Structure

- `index.html`: Landing page that lists all micro-sites
- `sites.json`: Registry used by `index.html` to build links
- `sites/<slug>/`: Each micro-site folder with `index.html`, `styles.css`, `script.js`
- `scripts/new-microsite.ps1`: Creates a new micro-site and updates `sites.json`

## Add a New Micro-Site

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-microsite.ps1 -Slug my-new-site -Title "My New Site" -Description "Short description"
```

Then commit and push:

```powershell
git add .
git commit -m "Add my-new-site micro-site"
git push
```

## Publish with GitHub Pages

1. Create a GitHub repository and push this repo:
   - `git remote add origin https://github.com/<your-username>/<repo-name>.git`
   - `git push -u origin main`
2. In GitHub: `Settings` -> `Pages`
3. Under "Build and deployment", set:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`

Your site will be available at:

`https://<your-username>.github.io/<repo-name>/`
