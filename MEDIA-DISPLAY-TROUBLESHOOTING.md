# Media display troubleshooting

1. Keep the same Chrome profile and app origin used for the core vault and media shard import.
2. Deploy/open this build and fully reload the app. If installed as a PWA, close and reopen it.
3. Do not re-import the core vault. The separate media records are stored in this browser profile's IndexedDB.
4. Open a gold-jewellery entry. A recovered photo should show a PHOTO button/placeholder; an invoice should show View invoice or Open invoice PDF. Click it to load the attachment.
5. If an alert appears, record its exact text. Do not clear site data, delete the vault, or sync to Drive.

The list previously looked only for `photo.data` and `bill.data`, but split-media recovery intentionally clears those fields and stores `mediaRef`. This update makes the list recognize those references.
