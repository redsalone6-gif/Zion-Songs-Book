# Zion Songs Book App

This is a GitHub-ready static web app package created from your uploaded design export.

## Project structure

- `index.html` - landing page for the app
- `pages/` - app screens converted into standalone pages
- `assets/screens/` - preview images of each screen
- `.nojekyll` - avoids GitHub Pages processing issues

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Extract this ZIP file.
3. Upload all files and folders from this project into the repository root.
4. Commit the files.
5. In GitHub, open **Settings > Pages**.
6. Set **Source** to **Deploy from a branch**.
7. Select **main** branch and **/(root)** folder.
8. Save.

## Important

This package is a **static frontend**. It can be hosted directly on GitHub Pages.

Features that require a backend will not work on GitHub Pages alone, including:

- user accounts or login
- database storage
- saving new songs permanently
- server-side APIs

For those features, connect a backend such as Firebase, Supabase, or Google Apps Script.
