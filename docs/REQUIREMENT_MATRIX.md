# Requirement-to-evidence matrix

Current deployment: 0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9.
See [all 37 parent transactions](LIVE_E2E_EVIDENCE.md) and [3 native credits](PAYMENT_DELIVERY.md).

| Invariant | Controlled evidence | Observed live evidence |
|---|---|---|
| Official full source identity | pinned commit, exact SHA and bound checks | deployed parity and real validator rows |
| Semantic matrix and matching | forged quote, wrong leader, uncertainty, bounded allocation | ERC-1155/2981 rows and matching [0,1,-1] |
| Untrusted notes / prompt attack | exclusion and malicious requirement controls | actual appended requirement NOT_SUPPORTED; no award |
| Sender and namespace | unauthorized entrypoints | two secondary-wallet negative lifecycle |
| Conservation and replay | exact value, grouped outbox, replay controls | 1 wei refund, 0.0002 GEN award, 0.0001 GEN refund; balance zero |
| Cancellation race | controlled last-mile interleaving | competing cancel/assessment; terminal CANCELLED, no outbox |
| Source/model failure | bounded failure cases | original MODEL_FAILED plus labelled permitted retry retained |
| Frontend state | 14 client checks | actual RPC desktop/mobile readback and native-child links |
| Browser wallet signing | not replaced by SDK coverage | deferred by user, unverified |
| Failed-parent recovery | sender/network/hash/rollback/replay/accounting controls | positive eligible recovery controlled-only; wrong-instance probe unresolved without effects |
| Release | 83 contract tests, lint, schema, build | source SHA parity; Vercel production real RPC UI verified |

Harness substitutes runtime/network/model and is not real GenVM consensus or transfer
proof. Historical v0.1.0 rollback FAILED; its evidence remains separately labelled.
Live SDK proofs do not establish universal LLM resistance or every scheduling order.
