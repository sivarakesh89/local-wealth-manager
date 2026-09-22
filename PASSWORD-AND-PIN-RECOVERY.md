# Password and PIN recovery

FinMate encrypts the vault using a key derived/wrapped for the master password. It does not store the master password or PIN in readable form, so it cannot display, email, or retrieve a forgotten password or PIN.

- **Forgot PIN, know master password:** unlock using the master password, then configure a new PIN in Settings.
- **Forgot master password:** FinMate cannot reset it or decrypt the vault without it. Check your password manager or a secure personal record. Keep an encrypted backup and its password information separate.
- **Forgot both:** if no known master password/recovery material is available, the encrypted data cannot be recovered by FinMate. Do not clear browser storage or delete the Drive vault while investigating.

A future recovery-key feature would need to be deliberately designed and enabled before loss occurs. It cannot retroactively recover an existing vault without a working unlock method.
