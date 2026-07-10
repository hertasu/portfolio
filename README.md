# Portfolio — Nurjaxon Rustamov

A single-page portfolio site. Content lives in `/data/*.json` and images in
`/images/`. The page (`index.html`, `style.css`, `script.js`) reads those
files automatically — you almost never need to touch the page code itself.

## How to update content

Each file in `/data/` is a plain list. To add an entry, copy an existing
`{ ... }` block, edit the values, and make sure there's a comma between
entries (but not after the last one).

| File | Section on the page |
|---|---|
| `data/bio.json` | Name, headline, summary, LinkedIn (top of page) |
| `data/experience.json` | Exhibit A — Working Experience |
| `data/projects.json` | Exhibit B — Projects |
| `data/certificates.json` | Exhibit C — Certificates |
| `data/publications.json` | Exhibit D — Publications |
| `data/extracurriculars.json` | Exhibit E — Extracurriculars & Volunteering |
| `data/letters.json` | Exhibit F — Letters of Appreciation |

### Adding a certificate or letter (with image/PDF)

1. Drop the file into `images/certificates/` (or `images/letters/`).
2. Add an entry to the matching JSON file, e.g.:
   ```json
   {
     "name": "Certificate Name",
     "issuer": "Issuing Organization",
     "date": "2026-08",
     "score": "optional, e.g. 95/100",
     "image": "your-file-name.pdf"
   }
   ```
   The `"image"` value must exactly match the file name you uploaded.
3. If the file isn't there yet, the card will still show — with a note
   telling you which file to add. Nothing breaks.

### Adding a job / role

Add an entry to `data/experience.json`:
```json
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "City, Country",
  "duration": "Month Year - Present",
  "industry": "Industry",
  "description": "One-line summary of the role.",
  "responsibilities": [
    "What you did",
    "What you did"
  ]
}
```

### Adding a project

Add an entry to `data/projects.json`:
```json
{
  "title": "Project Name",
  "role": "Your Role",
  "duration": "Month Year - Month Year",
  "description": "What the project is and what you did.",
  "tech": ["Tool 1", "Tool 2"],
  "link": "https://..."
}
```

## Validating your JSON

JSON is strict — a missing comma or quote will stop that section from
loading (the rest of the page still works). Before pushing, you can paste
a file into [jsonlint.com](https://jsonlint.com) to check it, or just
open the site locally and check the browser console (F12) for a red error
naming the file.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
2. Upload all files in this folder, keeping the same structure
   (`index.html`, `style.css`, `script.js`, `data/`, `images/`).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
5. After a minute, your site is live at:
   `https://<your-github-username>.github.io/<repo-name>/`

Every time you edit a JSON file or add an image and push the change, the
live site updates automatically within about a minute — no rebuild step.

## Testing locally before you push (optional)

Opening `index.html` directly by double-clicking it won't load the JSON
(browsers block local `fetch` for security). To preview changes locally,
run a tiny local server from this folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
