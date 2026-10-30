# v0.2.0 live gates â€” pending new deployment

Only the human main wallet deploys contracts/spec_basket.py, constructor arguments [].
No deployment/upgrade capability exists in scripts/live.mjs. Use a frozen deployment.
Do not put keys into VITE variables, source, fixtures, logs or chat.

```powershell
$env:SPECBASKET_CONTRACT='0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9'
$env:GENLAYER_CLI_ENTRY='C:/Users/admin/AppData/Roaming/npm/node_modules/genlayer/dist/index.js'
npm run preflight
npm run test:live
npm run check:delivery
npm run test:negative
npm run test:audit
npm run test:race
node scripts/verify-live.mjs all
node scripts/check-live-ui.mjs
```

Secondary aliases dbl-owner/dbl-adapter must match the authorized public addresses.
Primary sender is never loaded. The sponsor needs faucet GEN for the exact 0.0003 GEN
budget and transaction costs; no Ethereum/Arbitrum mainnet transactions are needed.
Run check:delivery immediately after lifecycle before further recipient transactions,
which would consume gas and contaminate the simple delta. Delta is not a substitute
for a parent-linked transfer receipt. Obtain and bind both actual award/refund child
receipts before closing the financial release gate. The independent verifier now binds all three actual native children to their parents,
recipients and exact values; see PAYMENT_DELIVERY.md.

Expected semantic rows are frozen in samples/controls.json. Do not edit expected
outcomes after seeing model results. Preserve errors/unresolved results and any
investigated retries. An intent with no hash stops; investigate nonce/broadcast
before resuming. Existing saved hashes are polled without resending. JSONL context,
intent/prestate, hash, receipt, readback, verified and phase outcomes are append-only.
The companion Markdown contains every submitted hash linked to the explorer.

After deployment set VITE_SPECBASKET_CONTRACT, build and verify production domain.
A real unmanaged browser wallet must connect, switch network, create/nominate/freeze/
assess/publish as its role permits; authoritative reads must match UI. Keep actual
wallet/approval journey evidence separate from SDK signing and controlled tests.
A reviewer can use their own two wallets and namespace; no deployer-global admin.

Live source outages, provider failures and validator disagreement may not be reliably
induced. Label controlled-only coverage; never fabricate a live malformed model.
Live race supplement: submit competing freeze/cancel/assessment operations and retain
both hashes and final state; stale assessment must not reopen cancellation. The real cancellation race completed with CANCELLED and no funds/outbox.
Browser-wallet signing was deferred by the user and remains unverified.

Audit separates note exclusion from actual prompt attack: one malicious nomination
note is never passed to the model; a separate appended instruction in a requirement
is passed to the model and must yield NOT_SUPPORTED or UNCERTAIN with no award.
These are scoped observations only after actual execution. Source/model retrieval
failures allow one explicitly labelled further attempt within the two-attempt cap.

## Current source vs historical deployment
The existing 0x65Bc... instance is historical v0.1.0 and financial-gate FAILED. Current
runner refuses to sign there because exact source/version/policy must match v0.2.0.
Current known wrong-value test expects execution SUCCESS plus rejected/refund-emitted
business outcome and an exact separate refund receipt, without changing the basket.

For an ACTUAL eligible known rollback credited deposit on the replacement instance:
```powershell
$env:SPECBASKET_FAILED_DEPOSIT='ACTUAL_ELIGIBLE_TX_ON_THIS_INSTANCE'
npm run test:recovery
```
Do not fabricate a transaction or add a production test-only trap to manufacture one.
Generic bootloader exceptions/crashes are not assumed to be known rollback byte1.
If this contingency cannot be induced via a legitimate production path, keep its
coverage controlled-only and state that limit. Parent-linked child delivery remains
separate from both recovery emission and recipient balance-delta observations.

## Supplemental recovery observations
`npm run test:recovery-negative` writes a separate append-only recovery log. Invalid
hash rejection was exercised; the cross-instance proof attempt remained unresolved
without effects. Do not count absent consensus as an authenticated rejection verdict.
Positive eligible failed-parent recovery remains controlled-only: no legitimate eligible
credited rollback on this corrected deployment has been established. Never manufacture
a deposit or reuse the historical instance as a valid current-instance recovery.
