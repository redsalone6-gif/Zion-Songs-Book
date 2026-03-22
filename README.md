
# Zion Songs Book – Working GitHub App

This is a working static web app for GitHub Pages.

## What works
- Add new songs
- Save songs in browser local storage
- Search library
- Open song details
- Favorite songs
- View grouped collections
- Test microphone permission on the tuner page

## GitHub deployment
1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Open **Settings → Pages**.
4. Set **Deploy from a branch**.
5. Choose **main** and **/(root)**.
6. Save.

## Important
This is a real frontend app, but it is still frontend-only.

That means:
- It works on GitHub Pages
- It saves data in the current browser
- It does not sync across devices
- It does not have login or cloud database

For cloud sync, connect it later to Firebase, Supabase, or Google Apps Script.
