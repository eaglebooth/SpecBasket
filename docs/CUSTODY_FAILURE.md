# Live financial release gate FAILED

On 2026-10-29, v0.1.0 at 0x65Bc42A6263De86C6Aa1D0DE8a6021b630A5656d
rejected wrong attached value with EXACT_VALUE_REQUIRED, FINALIZED / MAJORITY_AGREE
and rollback. Basket state stayed ASSESSED. Native balance changed from 0 to 1 wei;
a later independent read still returned 1. Authoritative RPC reports value_credited
true and no triggered transactions/messages. This is not a passing value rollback.

[Failed test tx](https://explorer-studio.genlayer.com/transactions/0xdfbaf710219042b0be0b5cf3300332eb7afd232fe2de48e66223b68704c41ce5)

See live-evidence/CUSTODY_FAILURE.json and custody-failure-authoritative-rpc.json.
The runner stopped before actual budget funding. Do not claim money conservation,
full live E2E, or submission readiness. Do not silently weaken the no-custody-mutation
assertion. A safe correction must bind recovery to the actual failed deposit sender,
receiver, amount, finality, credited-value fact and replay protection; no discretionary
sponsor sweep. That recovery must be tested on the exact revised deployment.
The 1 wei on the frozen old deployment cannot be recovered by a new instance.
