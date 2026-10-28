ROBERTSONS TEAM: WEBSITE
=========================

Plain static site. Hosted on Render as a Static Site (auto-deploys from GitHub).
Render settings: Build command = (leave blank), Publish directory = .

Pages: index, products, services, about, commitment, contact, 404

EDITING
- Products & densities: assets/js/data.js (one list, updates the catalog table,
  the density explorer on the home page, and the weight calculator)
- Styles: assets/css/site.css   (brand colors are at the top)
- Interactions: assets/js/site.js, assets/js/catalog.js

QUOTE FORM
- contact.html posts to Formspree (formspree.io). Replace YOUR_FORM_ID in the
  form's action with your Formspree form ID. Formspree emails each submission
  to the address set in your Formspree dashboard. Honeypot field: _gotcha.
- The form sends in the background and shows a thank-you message on success.
- Fields: name, company, email, phone, products (from the Products page quote
  list), packaging, quantity, destination, timeline, message.

NOTES
- The WTI / natural gas widgets in the footer load from oil-price.net.
- base.html (the old Flask template) is no longer used.