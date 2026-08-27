# Subhajit Routh — Portfolio

A dark, SCADA/HMI-inspired portfolio site for **Subhajit Routh** (MES · Automation & Digitalization · IT-OT Integration · Industry 4.0), built as a static site for GitHub Pages.

## Files

- `index.html` — page structure & content
- `style.css` — design system (colors, type, layout, animation)
- `script.js` — footer year + scroll-reveal

No build step, no dependencies — just static files.

## Deploy to GitHub Pages

1. **Create a new repository** on GitHub, e.g. `subhajitrouth16.github.io` (this exact name gives you the shortest URL) or any name like `portfolio`.
2. **Upload these three files** (`index.html`, `style.css`, `script.js`) to the repo root — either via the GitHub web UI ("Add file → Upload files") or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. Wait a minute, then your site will be live at:
   - `https://<your-username>.github.io/` (if the repo is named `<your-username>.github.io`), or
   - `https://<your-username>.github.io/<repo-name>/` (any other repo name)

## Before you share the link

- Open `index.html` and update the **GitHub** contact link (currently a placeholder `#`) with your actual GitHub profile URL.
- Double check the phone/email in the **Contact** section are the ones you want public.
- Optional: add a custom domain later via Settings → Pages → Custom domain.

Once it's live, paste the URL straight into the **Featured** section (or the headline URL field) of your LinkedIn profile.
