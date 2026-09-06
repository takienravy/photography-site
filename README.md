# Yulia Dobronravova — photography site

A minimal static site: a click-through slideshow homepage, a masonry index grid,
a lightbox, and a contact overlay. No build step — just plain HTML/CSS/JS.

## 1. Add your real photos

1. Delete the placeholder `.svg` files in `/images` (or keep them for reference).
2. Copy your actual photo files into `/images` (jpg/png/webp all work).
3. Open `images.js` and replace the list with your own files, in the order
   you want them to appear, e.g.:

   ```js
   const PHOTOS = [
     { src: "images/anemone-01.jpg", alt: "White anemone on a grey background" },
     { src: "images/still-life-butter.jpg", alt: "Butter in a white bowl" },
   ];
   ```

   That's the only file you need to touch to add, remove, or reorder photos —
   the same list drives both the homepage slideshow and the index grid.

4. Open `index.html` in a browser directly (double-click it) to preview
   locally before publishing.

## 2. Publish on GitHub Pages (free)

1. Create a new repository on GitHub (e.g. `yulia-site`).
2. Upload all these files (`index.html`, `style.css`, `app.js`, `images.js`,
   the `images` folder) to the repository — via GitHub's web upload, or:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source**, choose the `main` branch and
   `/ (root)` folder, then save. GitHub gives you a URL like
   `https://<your-username>.github.io/<repo-name>/`.

## 3. Connect your Cloudflare domain

1. In the same GitHub Pages settings screen, enter your custom domain (e.g.
   `yourdomain.com`) in the **Custom domain** field and save. GitHub creates
   a `CNAME` file in your repo automatically.
2. In Cloudflare's DNS dashboard for your domain, add:
   - A **CNAME** record: name `www` → value `<your-username>.github.io`
   - Four **A** records for the root domain (`@`) pointing to GitHub Pages' IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Back in GitHub Pages settings, once DNS has propagated, check **Enforce
   HTTPS** so the site loads securely.

DNS changes can take anywhere from a few minutes to a few hours.

## Notes on the current build

- **Font**: Inclusive Sans (loaded from Google Fonts) is used everywhere, in
  italic, matching the original design.
- **Home**: click the left/right half of the image (or use arrow keys, or
  swipe on mobile) to move through photos — cursor shows a horizontal resize
  icon as a directional hint.
- **Index**: `/#/index` — a masonry-style grid (5 columns on desktop, 2 on
  mobile). Click any image to open it enlarged, with prev/next arrows and a
  close button.
- **Contact**: opens as a blurred overlay on top of whatever page you're on,
  with a `(Close)` link.
- If you ever want to add more photos later, it's just editing `images.js`
  and adding files to `/images` — no other code changes needed.
