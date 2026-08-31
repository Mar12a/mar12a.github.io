# Mara Brandsen’s portfolio

A static English/Dutch website: artwork kaleidoscope, portfolio grid and personal About/contact page.

## Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:8000/. Use EN / NL in the navigation to switch languages. Language is stored locally and included in navigation URLs (`?lang=en` or `?lang=nl`).

## Editing

- `public/index.html`: main homepage (keep `public/kaleido.html`, the previous preview URL, in sync).
- `public/about.html`: English About copy and photo thumbnails.
- `public/scripts/language.js`: Dutch translations and language navigation.
- `public/scripts/artwork-data.js`: artwork order, colour grouping, dimensions and descriptions.
- `public/styles/kaleido.css` and `public/styles/about.css`: presentation.
- `public/scripts/kaleido.js`: mirrored artwork sectors, controls and PNG export. Automatic motion rotates the artwork only.
- `public/scripts/about.js`: draggable photos, grid reset, motion and email copying.

Portrait and artwork sources stay in the ignored `website-assets/` folder. Only optimized copies are included. Fonts are hosted locally with their OFL licenses. The Mathematical Etudes reference is linked, not copied or embedded.

## Publishing

```sh
python3 scripts/build_site.py
```

The build includes only the current site and its required assets in `_site/`. Earlier local design experiments, reference images and the unlicensed grass experiment are not published. GitHub Actions builds and deploys `_site/` to https://mar12a.github.io/ on pushes to `main`.

No custom-domain or email DNS changes are made. There is no shop, analytics, contact backend or external font dependency. Clicking the contact address copies it to the clipboard. Desktop, mobile and keyboard checks have been performed in the local in-app browser; full Safari/Firefox/Chrome testing is still recommended.
