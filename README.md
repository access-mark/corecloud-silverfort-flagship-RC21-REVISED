# CoreCloud website — RC20

Static HTML/CSS/JavaScript website for deployment at a GitHub Pages repository root.

## Deploy

Extract the ZIP and upload the **contents** (not a containing folder) to the repository root. `index.html`, `assets/`, and the other HTML pages must be at the same level. Keep `.nojekyll` if present. Use a separate RC20 staging repository before promoting to production.

## Configuration and acceptance

- Confirm navigation (Solutions and Resources) overlays all page content and works by mouse, keyboard and touch.
- Check desktop, tablet and mobile layouts, including the Silverfort four-step section in `identity-security.html`.
- Exercise assessment results, NDA requests, contact forms and guide downloads in a real browser.
- Verify live form delivery and recipient configuration before production use. Do not infer successful delivery from local markup alone.
- Check outbound links and GitHub Pages routing on the published domain.

## Documentation

`CHANGELOG.md` records the current change; `docs/STATIC-LEAD-CAPTURE.md` contains legacy capture integration information and may not describe the active form routing. Consult actual form markup and JS for current behaviour.
