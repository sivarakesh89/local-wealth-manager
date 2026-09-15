# FinMate Stock Price Proxy

FinMate's browser app cannot reliably call Yahoo Finance directly because browsers enforce CORS. A practical browser proxy is CORSPROXY.

Recommended URL prefix format:

`https://corsproxy.io/?key=YOUR_CORS_PROXY_API_KEY&url=`

Replace `YOUR_CORS_PROXY_API_KEY` with your own key. Do not put a Google API key here.

The current CORSPROXY free tier supports browser requests, with usage limits. For production use, configure your FinMate domain in their dashboard and restrict the service as appropriate.

Alternative: deploy your own small HTTPS proxy (Cloudflare Worker) for stronger privacy/control. FinMate v2 keeps the proxy field generic so either approach can be used.

## v2.2 recommendation

For a personal/testing FinMate deployment, a proxy in the Stock price proxy field can be used for browser CORS. For a more reliable long-term market-data layer, consider a dedicated market-data provider and a small HTTPS proxy that you control. Twelve Data currently documents stock, ETF, mutual-fund, commodity and cryptocurrency coverage, while its individual plans have data-use and licensing restrictions that should be checked before public redistribution. Metals-API documents dedicated Gold Price India and precious-metal endpoints, but availability depends on the subscription plan.

FinMate does not require these services for normal bookkeeping; market-price refresh is an optional enhancement.
