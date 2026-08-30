# Mara’s portfolio

A static website hosted on GitHub Pages. The current page is a temporary setup placeholder, not the final design.

## Files

- `public/`: published website files. Put images and other website assets here.
- `.github/workflows/pages.yml`: automatically deploys pushes to `main`.

## First deployment

In the GitHub repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
Then push to `main`, or open **Actions → Deploy portfolio to GitHub Pages → Run workflow**.

The expected URL is https://mar12a.github.io/ after a successful deployment.
No custom domain has been configured. The existing website and email remain unchanged.

## Updates

Edit and review locally, commit the intended files, then push to `main` to publish.
Saving a file alone does not publish it. Only the `public/` directory is deployed,
but all tracked files are visible in the public GitHub repository. Never commit secrets or private files.
Use relative asset links so the site remains portable between hosting locations.

## Local preview

From this folder, run `python3 -m http.server 8000 --directory public`,
then visit http://localhost:8000. Stop with Ctrl+C.

## Launch checklist

- Replace the temporary page with the portfolio.
- Check mobile layout, keyboard access, links and image sizes.
- Replace the placeholder metadata and remove `noindex` when ready for search engines.
- Verify domain ownership and preserve email DNS records before connecting a custom domain.
- Reassess hosting before adding ecommerce because GitHub Pages restricts ecommerce use.
