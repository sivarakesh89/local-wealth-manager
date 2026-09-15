# FinMate — Practical market-price update guide

## Why the current "Refresh market prices" button can fail

FinMate runs as a browser PWA. A browser is not allowed to freely call every finance website because of CORS rules, authentication, rate limits and provider restrictions. Yahoo Finance endpoints are therefore not a dependable direct browser API.

FinMate's current logic is:

1. Indian mutual funds: use the AMFI scheme-code endpoint when a numeric scheme code is entered.
2. Stocks/ETFs: try the configured price proxy first.
3. If no proxy is configured, try the direct Yahoo endpoint and public CORS relays as best-effort fallbacks.

This is useful for experimentation, but it should not be described as guaranteed real-time market data.

## Recommended practical setup: a small HTTPS price proxy

For a long-term FinMate installation, put a tiny HTTPS proxy between FinMate and the market-data provider.

Recommended architecture:

`FinMate PWA → your HTTPS price proxy → market-data provider → FinMate`

The proxy should:

- accept a ticker such as `RELIANCE.NS` or `AAPL`
- fetch the provider's latest quote
- return only the price and timestamp
- apply rate limits
- never receive your FinMate vault, password, PIN or financial records

Then put the proxy URL in:

**Settings → Stock price proxy**

The app expects the proxy URL to end in something like:

`?url=`

so that FinMate can append the encoded market-data URL.

## Easiest no-code-ish alternative: Google Sheets price sheet

If you do not want to maintain a proxy, a practical manual workflow is:

1. Create a private Google Sheet.
2. Put tickers in column A.
3. Use Google Finance formulas where supported, for example:
   `=GOOGLEFINANCE("NSE:RELIANCE","price")`
4. Review the returned values.
5. Export the holdings/price sheet as CSV.
6. Import the updated holdings into FinMate.

This is not guaranteed tick-by-tick real-time data. Google Finance values can be delayed and availability varies by exchange/instrument.

## Best reliability for Indian investments

For Indian stocks, use a data source intended for NSE/BSE market data or your broker's official API/export if your broker provides one. For mutual funds, use AMFI scheme codes. For foreign stocks, use a provider that explicitly supports your required exchange.

Do not scrape a website in the browser and do not put a private broker API secret directly inside `app.js`.

## What I recommend for your FinMate setup

Start with:

- Mutual funds → AMFI scheme code
- Indian stocks → broker/data-provider CSV or API through a proxy
- Foreign stocks/ETFs → proxy-backed market-data provider
- FD/PPF/EPF/NPS/real estate/gold → manual periodic valuation

This is much more reliable than trying to make Yahoo Finance work directly from Chrome.

## FinMate v2.2 market-price behaviour

FinMate now treats Invested Amount and Current Market Value as separate fields. Refresh market prices changes Current Value and Last Price; Profit/Loss is calculated as Current Value minus Invested Amount.

Supported practical examples:
- NSE stock: `RELIANCE.NS`
- US stock: `AAPL`
- Gold futures reference: `GC=F`
- Silver futures reference: `SI=F`
- Crypto: `BTC-USD`
- Indian mutual fund: AMFI scheme code

Gold/Silver unit handling:
- grams → price is converted to a per-gram quote
- ounces → price remains per ounce

The Yahoo-compatible route is best-effort. Browser CORS, rate limits and provider policies can still block it. A working HTTPS proxy in Settings → Stock price proxy is therefore recommended for reliable browser access. FinMate never sends the encrypted vault to the price proxy; only market-data requests are routed there.
