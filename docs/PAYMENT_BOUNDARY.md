# GEN payment release gate

Official runtime references:
- https://docs.genlayer.com/developers/intelligent-contracts/features/value-transfers
- https://docs.genlayer.com/developers/intelligent-contracts/features/messages

GEN is denominated in wei; payable gl.message.value is the attached amount.
EOA transfers use an EVM recipient interface and emit_transfer. These are external
messages delivered on parent finalization. Emitting does not synchronously execute
all recipients; a parent SUCCESS cannot prove actual receipt. A failed child is not
assumed to return value automatically.

SpecBasket therefore assesses with no funds attached and accepts the full budget
only after a complete known matrix. fund_and_publish emits grouped exact awards
and unallocated refund. The only published payment state is TRANSFERS_EMITTED.
The UI never displays PAID or resends after emission. No long-lived funded assessment,
timeout, unbounded claim queue, or allocation beyond budget is introduced.

Still required on the exact deployment:
1. Known wrong-value rejection: exact refund emission/delivery and unchanged basket.
   For eligible rollback deposits: sender-bound recovery and replay denial.
2. Exact-value receipt; ghost/native balance and outbox reconciliation.
3. Parent-linked external EVM transfer execution, exact destination/value, chain finality
   and recipient balance change. Balance delta alone can have another cause.
4. Actual GEN award AND unallocated sponsor refund; no duplicate emission on replay.
5. Emission failure/rollback and external delivery-failure behavior where controllable.

Local harness rollback is explicitly emulated, never runtime proof. The prepared
SDK delivery command checks a recipient delta and zero remaining native balance,
but labels that as observational and insufficient without parent-linked child receipt.
No v0.2.0 deployed/runtime/transfer evidence exists yet; historical v0.1.0 contains a failed financial gate. Financial completion is not proven.
There is currently no protocol acknowledgement or recovery for failed external delivery;
this limitation must not be hidden by counters or a paid=true field.

## Observed correction v0.2.0 (not yet deployed)

v0.1.0 test tx 0xdfbaf710219042b0be0b5cf3300332eb7afd232fe2de48e66223b68704c41ce5
rolled back with EXACT_VALUE_REQUIRED while native value 1 wei remained credited.
Do not assume exception rollback also refunds native value on this network.

Known positive-value rejection now emits a sender refund and returns the distinct
SUCCESS business result REJECTED_REFUND_EMITTED. No basket is published or mutated.
Separate refund receipts use monotonically allocated IDs and never say delivery is confirmed.

recover_failed_deposit independently observes fixed official RPC eth_chainId 61999
and eth_getTransactionByHash. It requires exact hash/caller/current receiver, explicit
FINALIZED/result6, credited value true, a positive canonical uint256 amount, top-level
type2 call, null triggered_by, empty messages/children, and exactly one leader with
ERROR, no pending transactions and recognized rollback result byte1. Required fields
cannot be absent. Once-only hash consumption is rechecked after consensus; native
balance must cover that proven amount. No owner sweep or caller-supplied amount.

This is deliberately NOT recovery of arbitrary crashes or successful parents with
failed child transfers. Source outage or unrecognized result class fails closed.
A new instance cannot refund the frozen old address's 1 wei. New deployment live
tests must prove the positive rejection refund and eligible failed-deposit recovery
where the latter is genuinely available; a controlled fixture is not a live receipt.
