ROBERTSONS TEAM: WEBSITE
=========================

Plain static site. Upload the contents of this folder to your host (Netlify drag-and-drop works).

Pages: index, products, services, about, commitment, contact, 404

EDITING
- Products & densities: assets/js/data.js (one list, updates the catalog table,
  the density explorer on the home page, and the weight calculator)
- Styles: assets/css/site.css   (brand colors are at the top)
- Interactions: assets/js/site.js, assets/js/catalog.js

QUOTE FORM
- contact.html uses Netlify Forms (form name "rt-quote") with a spam honeypot.
  Submissions appear in Netlify > Forms. New fields: company, quantity,
  destination, packaging, and the products picked on the Products page.

NOTES
- The WTI / natural gas widgets in the footer load from oil-price.net.
- base.html (the old Flask template) is no longer used.
