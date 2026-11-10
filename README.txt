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
- The footer "Market watch" charts are TradingView Symbol Overview widgets
  (WTI, Brent, natural gas; visitors pick 1D/1M/3M/1Y/5Y/All). They are in the
  footer of every page. To change a symbol, edit the "symbols" line in each
  page's footer, e.g. OANDA:WTICOUSD. NYMEX futures (CL1!, NG1!) do not load
  in TradingView's free widgets, so these use broker spot prices instead.
- base.html (the old Flask template) is no longer used.