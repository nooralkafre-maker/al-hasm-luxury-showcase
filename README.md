# AL HASM Luxury Real Estate — GitHub Pages Preview

This repository is an **independent static demonstration** adapted from the AL HASM Laravel project. It showcases Home, Properties, Property Details, Saved Properties, Compare, a read-only Admin Dashboard concept, and a read-only CRM concept.

- Home: `index.html`
- Properties: `properties.html`
- Property: `property.html`
- 3D-style demonstration: `tour.html`
- Dashboard preview: `admin.html` (**not a real dashboard**)
- CRM preview: `crm.html` (**not a real CRM**)
- Sample media: `assets/media/demos/` (image-based illustrative clips, **not filmed property tours**)

**Important:** This website is HTML/CSS/JavaScript only. It does not contain or operate the Laravel backend, private database, authentication, contact processing, or real administrative editing. Real property data, 360° scans, videos and lead management require deploying Laravel on PHP hosting.

## Publishing on GitHub Pages
1. Create a public repository, for example `al-hasm-luxury-showcase`.
2. Upload **the files and folders inside this directory**, keeping `index.html` at the root (not the zip itself).
3. Open the repository **Settings > Pages**, choose **Deploy from a branch**, choose `main` and `/(root)`, and **Save**.
4. The site URL will be `https://<username>.github.io/al-hasm-luxury-showcase/` after GitHub Pages deploys it.

Never upload the original Laravel zip or `.env` and `database.sqlite` to a public repository.
