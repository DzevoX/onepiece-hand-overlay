# One Piece Hand Overlay

Search One Piece TCG cards and show a player's current hand as compact colored
strips for video. Export a transparent PNG or capture the overlay window in OBS.

Unofficial fan tool. Not affiliated with Bandai, Shueisha or Toei Animation.

## Files

| File | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | The tool (plain HTML/CSS/JS, no build step) |
| `scripts/build_cards.py` | Turns punk-records data into one small `data/cards.json` |
| `.github/workflows/update-cards.yml` | Runs nightly: rebuilds the data, then publishes the site |
| `data/` | Created by the workflow (`cards.json`, `meta.json`) |

## Set up (about 10 minutes)

1. Create a new **public** repository on GitHub.
2. Upload everything in this folder, including the hidden `.github` folder.
   (If the web uploader skips it, use **Add file > Create new file** and type
   `.github/workflows/update-cards.yml`, then paste the contents.)
3. **Settings > Pages > Build and deployment > Source: GitHub Actions**.
4. **Settings > Actions > General > Workflow permissions: Read and write**.
5. **Actions** tab > **Update cards and deploy** > **Run workflow**.
6. When it finishes, your site is at `https://<your-username>.github.io/<repo-name>/`.

After that it updates itself every night, and whenever you push a change.

## Using it

- Open the site, search a card, click it to add to the hand, click a strip to remove it.
- **Download PNG** gives a transparent image for your editor.
- **Open overlay window** opens a hand-only window. Set the background to green
  and chroma-key it in OBS, or try the `#overlay` address as a Browser Source.
  OBS's browser doesn't share saved data with Chrome, so if you use it that way,
  run the whole tool inside OBS (View > Docks > Custom Browser Docks) so both
  sides are in the same browser.

## Try it on your computer

Browsers block loading data from a plain `file://` page, so use a tiny server:

    python scripts/build_cards.py <path-to-punk-records> data
    python -m http.server
    # open http://localhost:8000

## Notes

- Card data comes from [punk-records](https://github.com/buhbbl/punk-records)
  (English). Leaders and alternate-art versions (`_p1`, `_r1`) are skipped.
  Change the language by passing a folder name as the last argument in the workflow.
- Card names and data belong to their owners. The tool uses no card images;
  please don't add them to a public site.

## Code and data

- **The code** is yours. With no license file, others are technically not allowed
  to reuse it. To make it free for everyone, add a one-file permissive license
  (MIT or the Unlicense) at the repo root. This is optional.
- **`data/cards.json`** is built from punk-records (AGPL-3.0) and credited in the
  page footer. Keep it in `data/` and treat it separately from your code.
- Card names and game data belong to their owners. This is not legal advice.
