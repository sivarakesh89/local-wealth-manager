# FinMate Stock Price Proxy

FinMate's browser app cannot reliably call Yahoo Finance directly because browsers enforce CORS. A practical browser proxy is CORSPROXY.

Recommended URL prefix format:

`https://corsproxy.io/?key=YOUR_CORS_PROXY_API_KEY&url=`

Replace `YOUR_CORS_PROXY_API_KEY` with your own key. Do not put a Google API key here.

The current CORSPROXY free tier supports browser requests, with usage limits. For production use, configure your FinMate domain in their dashboard and restrict the service as appropriate.

Alternative: deploy your own small HTTPS proxy (Cloudflare Worker) for stronger privacy/control. FinMate v2 keeps the proxy field generic so either approach can be used.
