# Zion Songs Book — GitHub Ready

This package is prepared for a simple GitHub upload and optional GitHub Pages hosting.

## What is included

- `index.html` — landing page for all screens
- `pages/` — cleaned HTML screens
- `assets/screenshots/` — preview images copied from the uploaded zip
- `DESIGN.md` — design notes from the original package

## Important limitation

This is a **static site package**. GitHub Pages can host HTML, CSS, JavaScript, and image files, but it does **not** run Google Apps Script, Node.js, PHP, or any server-side backend.

## Deploy on GitHub (browser method)

1. Create a new repository on GitHub.
2. Click **Add file** → **Upload files**.
3. Upload everything inside this folder.
4. Commit the files.
5. Open **Settings** → **Pages**.
6. Under **Build and deployment**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
7. Save. GitHub will publish the site and give you a live URL.

## Deploy with Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Next recommended step

If you want this to behave like a full app instead of a screen collection, the next step is to combine these screens into one navigation flow and add real data storage.
