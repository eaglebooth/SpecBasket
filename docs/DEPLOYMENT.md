# Production deployment

Website: https://specbasket.vercel.app
GitHub: https://github.com/eaglebooth/SpecBasket
Vercel deployment: dpl_FZsJYaJX7aDd2HKTu8kCn7wCLYb1 (READY, production).
Contract: [0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9](https://explorer-studio.genlayer.com/address/0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9).

[Production browser evidence](live-evidence/UI_PRODUCTION_READBACK.json) was collected
against the hosted domain using real RPC: release source parity, actual basket title,
TRANSFERS EMITTED, three requirements, two supported/four unsupported cells, exact
award/refund outbox, and both parent-bound credited native children. No JS errors or
mobile horizontal overflow observed. The supplied logo is included in the frontend.

[Desktop screenshot](live-evidence/ui-production-desktop.png) ·
[Mobile screenshot](live-evidence/ui-production-mobile.png).

This is read-only browser verification, not browser wallet signing; signing was deferred
by the user. SDK transactions and delivery evidence remain in [live E2E](LIVE_E2E_EVIDENCE.md).
Positive eligible failed-deposit recovery remains controlled-only. Deployment does not
change the contract or remove these limits. No private keys are uploaded to Vercel.

Navigation fix: header tabs and hero actions now scroll to the selected workbench,
update URL fragments and focus the destination. Open existing also switches back
to Workspace and focuses the basket ID. [Production navigation checks](live-evidence/navigation-check.json)
passed for five actions at both 1440px and 390px.
