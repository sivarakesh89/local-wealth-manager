# FinMate Historical Gold Rate Calculator — Integration Package

## What is included
- `index.html` — standalone demo page.
- `gold-rate-calculator.js` — reusable ES module that mounts the calculator into a container.
- `gold-rate-calculator.css` — scoped styles.
- `cloudflare-worker-template.js` — optional future proxy template (does not pretend to be a gold data provider).
- `README.md` — setup, integration, limits, and test notes.

## Run the demo
1. Extract this folder.
2. Serve it from HTTPS or localhost. Do not open `index.html` as a `file://` URL because ES modules, workers, and WebAssembly need a web origin.
3. You can use a static server, for example `python -m http.server 8000`, then open `http://localhost:8000`.
4. Enter a date, purity, and weight, then click **Fetch rate & calculate**.

The first lookup loads DuckDB-WASM from jsDelivr and reads the historical Parquet dataset from GitHub. It requires internet access. This package does not bundle the dataset.

## Integrate into FinMate
Copy `gold-rate-calculator.js` and `gold-rate-calculator.css` to the FinMate root or an appropriate feature directory. Add a container in the intended screen:
```html
<div id="gold-rate-calculator"></div>
```
Load the stylesheet:
```html
<link rel="stylesheet" href="./gold-rate-calculator.css">
```
Mount the component from a JavaScript module:
```js
import { mountGoldRateCalculator } from "./gold-rate-calculator.js";
const goldCalculator = await mountGoldRateCalculator(
  document.getElementById("gold-rate-calculator"),
  { defaultDate: "1989-11-11", defaultCurrency: "INR" }
);
```
If FinMate's current `app.js` is a classic script, don't add a static `import` to it. Instead load a small `type="module"` bootstrap file from `index.html`, or use `import("./gold-rate-calculator.js")` in an async handler. Integrate into FinMate only after testing against the exact current release archive. This package does not modify your existing FinMate vault or application files.

## Data source and limitations
The demo uses the community-maintained `aswinv90/indian-market-historical-data` Parquet files:
- Gold: `data/COMMODITIES/GOLD_INR.parquet`
- FX: `data/MACRO/forex_rates.parquet`

The repository describes daily Indian gold rates for 24K, 22K and 18K from 1970 onward, and daily USD/EUR/GBP/JPY FX data from 2006 onward. The calculator uses the direct 22K and 18K columns where available, not a simple 22/24 conversion. Custom purity is estimated from the 24K reference.
- If no rate exists on the exact date (e.g. a non-trading day), it uses the most recent earlier date and labels it.
- Foreign currency values are conversions of the Indian-market rate, not local market prices.
- The FX series is not described as extending to 1989; for older dates, select INR. It will show an error instead of fabricating an exchange rate.
- Rates exclude making charges, GST, stones, and jeweller-specific premiums/resale deductions.
- Source data is provided as-is and may not be an official benchmark record for every historical date. Verify important valuations independently.

**License caution:** the data repository's license states personal/non-commercial research use and restricts commercial integration/redistribution. This package fetches data directly rather than copying it into the bundle, but a public/distributed FinMate deployment should not rely on this dataset unless the source's current license permits that use. For public/commercial use, use a properly licensed provider such as the official IBJA rates API (paid subscription) and request the historical archive separately. IBJA's public FAQ says its API is paid and older historical data must be requested from IBJA.

Official/primary references:
- Dataset: https://github.com/aswinv90/indian-market-historical-data
- Dataset license: https://github.com/aswinv90/indian-market-historical-data/blob/main/LICENSE
- IBJA rates API information: https://www.indiagoldratesapi.com/Faqs.aspx

## Browser/security notes
- The demo uses external JavaScript/WASM from jsDelivr and data files from GitHub raw. These requests occur from the user's browser.
- Do not place API secrets in front-end JavaScript. If you later configure a licensed API, route requests through a server-side Worker and store secrets as Worker secrets.
- The app is local-first, but rate retrieval is online. This module does not write into FinMate's encrypted vault; it only calculates and displays a value.

## Validation performed
- Static file structure and JavaScript syntax checks are performed when building this package.
- It has not been tested on a physical Android device or inside the current FinMate release. Browser end-to-end verification is still required after deploying to HTTPS.
