# Independent review

Initial source review ran 38 controlled tests independently and found no direct sender,
namespace, matching or replay bypass. It identified the asynchronous external-delivery
financial gate and terminal uncertainty UX boundary; both are explicit in the spec/UI.
A lint call-graph issue was corrected by moving observation into a globally traceable
helper; final local lint/validation must be read from local-verification.json.

Frontend review found three issues, all corrected with regressions:
- A retry must verify attempt/revision advance, not an old UNRESOLVED observation.
- Submitted hashes persist across reconnect/reload for inspection without blind resend.
- Editing the contract selector invalidates the verified workspace and disables writes.

This is a source review, not runtime, payment-delivery or production-wallet verification.

Runner follow-up review identified a stale freeze revision on resume, asynchronous
outbox balance changes during later rejected calls, and a misleading injection
coverage label. Fixed: saved freeze arguments with a resume regression; immutable
accounting check plus separately labelled native custody observation for pending
outboxes; distinct malicious requirement control actually reaching the model.
No live test or actual injection resistance is claimed yet.

Live failure led to v0.2.0 native-value correction. Independent design review required
fixed official RPC, complete explicit proof fields, exact sender/receiver/hash/chain,
known rollback code and empty messages/pending effects, canonical amount, once-only
hash and last-mile replay/balance checks. Implementation review is recorded separately;
controlled recovery fixtures do not establish current-version runtime support.

Final independent v0.2.0 implementation review found no new source blocker;
83 direct tests, 12 client tests and lint/validation passed independently.
Reviewed source SHA-256: 97af2093a0273c494ba0bebfb1a878bbacc616fbcddd5a8019959d73f6223dc1.
The uppercase replay fixture was corrected to include hex letters. No live claim
for this source follows from that review. Refund delivery and eligible recovery
remain exact-deployment gates, with untriggerable branches labelled honestly.
