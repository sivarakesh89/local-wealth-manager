# How to open the PWA correctly

## Laptop
Do **not** double-click `index.html` for normal use. That opens a `file:///` URL. The PWA service worker, Google OAuth and some browser APIs require an origin such as HTTPS (localhost is allowed for local development).

If Python is already installed, double-click `START-LOCAL.bat`. It starts `http://localhost:8000`.

## Android
Copying the folder to Android and opening `index.html` is not a valid way to install a PWA. Android Chrome needs an HTTP(S) origin. For actual phone installation, publish this folder to an HTTPS static host (for example your own web host/GitHub Pages/Cloudflare Pages) and open that HTTPS URL in Chrome, then choose Install app/Add to Home screen.

## Laptop + Android on the same home network
A local HTTP server can be reachable from the phone using the laptop's LAN IP, e.g. `http://192.168.1.10:8000`, but Chrome will not treat that as a fully installable secure PWA in the same way as HTTPS. Use HTTPS hosting for the final installable PWA.
