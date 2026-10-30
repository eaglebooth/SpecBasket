# SpecBasket build plan — 2026-10-29

1. Lock official ERC resources and predeclared semantic controls (done).

2. Implement fixed-catalog source retrieval and independent matrix re-derivation.

3. Deterministic bounded matching and real payable GEN outbox; separate emission

   from delivery. No funded pending consensus; no automatic clock assumptions.

4. Build research workspace, wallet connection, create/nominate/freeze/assess/

   fund-and-publish/cancel and canonical reads. Reviewer owns their own namespaces.

5. Direct production-entrypoint tests, independent review, lint/schema, TS/build,

   browser visual and interaction verification. SDK and browser-wallet gates separate.

6. User main wallet deploys; only then source parity and two-secondary live lifecycle.

   Do not deploy or invent an address/tx/evidence. No GitHub/Vercel publish yet requested.



Correction to proposal: external GEN transfers are asynchronous messages. A parent

receipt does not establish delivery; canonical status is TRANSFERS_EMITTED, never

PAID. Actual recipient transfer receipts/balance changes must be independently

verified before any payout-success claim. No unsafe resend of emitted messages.


## Status update 2026-10-30
Historical v0.1.0 completed 27 actual transactions but failed native credit rollback;
no budget funding was performed after the failed 1-wei test. Exact source/evidence
archived. Current v0.2.0 corrects known rejections with caller refunds and adds strict
sender-bound failed-deposit recovery. Main wallet must deploy a replacement; no
automatic deploy or upgrade. Frontend reads historical v0.1.0 but blocks its writes.
