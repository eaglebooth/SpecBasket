# SpecBasket protocol specification

## Proposition and boundary
For each pair of a frozen research requirement and a selected official ERC revision,
classify whether the complete specification establishes that requested capability.
Falsifiers include a contrary normative clause, missing required qualification, or
turning an optional behavior into a compulsory one. Published specification text
cannot establish actual implementation, deployment, security, adoption or payment.
The current catalog consists of ERC-20, 721, 1155 and 2981 at the exact commit in
samples/resources.json. User input cannot replace the host, path, commit or digest.

## Bounded reasoning
Each source receives 1..3 requirement IDs. SUPPORTED requires a verbatim 12..480
character source quote. NOT_SUPPORTED and UNCERTAIN may have an exact quote or no
quote. All required IDs must appear exactly once. The validator independently fetches
and checks source bytes and derives all relations; it also checks leader quotes.
Only relation values affect matching; quote wording can differ legitimately.
Source/model failure is UNRESOLVED. Runtime consensus rejection rolls back the call
instead of being caught and turned into a successful negative. No funds are attached
to assessment. All source bytes fit within 65,536 bytes; no silent truncation.

## Matching
Freeze sorts up to three nomination IDs and forbids repeated ERC identity. Enumerate
all bounded assignments and maximize the number of SUPPORTED requirement/source
pairs. A selected source and a requirement each receive at most one award. Among
maximum-cardinality assignments, choose the lexicographically first vector of sorted
nomination indices; unassigned sorts after every real candidate. This is not maximum
market value or a claim that every relevant standard has been discovered.

## Authorization and storage
Any wallet may create a basket; no deployer role or global allowlist. Its sponsor
locks the title, 1..3 requirements, distinct invited contributor wallets and reward
per requirement (integer wei, 1..10^18). Up to 32 baskets per creator; each of up to
three contributors gets three nominations per basket, preventing cross-party flood.
Sponsor selection is intentional authority and not blind impartial judging.

create_basket seals policy including chain, contract, creator, namespace, fixed catalog,
reward semantics and tie rule. nominate binds authenticated sender, basket and policy.
freeze binds exact nomination objects; notes are committed but excluded from judgment.
Only participants assess. Each source has at most two failed attempts. Successful
resolved observations cannot be shopped with repeated assessments. UNCERTAIN is
terminal for that source within the basket and blocks funding. Any sponsor may cancel
its unfunded basket. No deadline or wall-clock availability guarantee is made.

## Last-mile gate
Assessment rechecks state, revision and manifest after nondeterminism. fund_and_publish
requires sponsor sender, ASSESSED state, exact assessment commitment and exact attached
budget. It recomputes the matching and emits nonzero grouped awards/refund. Marking
TRANSFERS_EMITTED before emit prevents replay within supported transactional semantics.
Direct GenVM rollback and asynchronous external delivery are separate runtime gates.
Received value equals the sum of emitted message amounts, not a claim of recipient
receipt. There is no method that marks an unobserved external transfer PAID.

## Public methods
Writes: create_basket, nominate, freeze, assess_source, fund_and_publish (payable), cancel.
Views: get_basket, get_nomination, get_native_balance, get_version.

Frozen release policy. No unsupported upgrader, external arbitrary URL, custom publisher,
privileged admin, automatic scheduler or bypass settlement interface.

## v0.2.0 correction: native credit retention
Positive rejected funding calls emit exactly their own attached value to the authenticated
caller and return REJECTED_REFUND_EMITTED; this is not a publication success. Separate
refund receipts do not change the basket. Zero-value rejected calls still raise UserError.

Refund recovery has an independent source topology, not a model judgment. Fixed official
RPC facts establish finalized, top-level, credited, message-free known rollback and exact
sender/receiver/value on chain61999. Leader and validator independently derive the same
canonical fact tuple. The lowercase deposit hash can be consumed only once, with a
post-consensus replay recheck and available-balance guard before refund emission.
Only rollback byte1 is supported; crashes/unknown formats are not assumed safe.
No new-instance recovery of another deployment and no arbitrary sponsor withdrawal.
New public write: recover_failed_deposit; new view: get_refund_receipt.
