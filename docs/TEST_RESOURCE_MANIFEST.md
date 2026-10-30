# Test Resource Manifest

Claim: an exact officially published ERC text establishes a stated specification
requirement. Canonical transport establishes object/revision/bytes, not arbitrary
behavioral assertions in a report. Publisher is ethereum/ERCs; proposer/award recipient
cannot author these pinned official resources. Sponsor requirements are declarations
of what the sponsor wants researched, not proof of external facts.

Official publication entrypoints checked:
https://eips.ethereum.org/EIPS/eip-1155
https://eips.ethereum.org/EIPS/eip-2981
https://eips.ethereum.org/EIPS/eip-721
https://eips.ethereum.org/EIPS/eip-20

All URLs below are public, no cookies/token/signed URL. Mutable branch was used only
to discover a full SHA during preparation; contract never fetches a branch. The
contract-fixed source mapping and exact byte hashes cannot be overridden by a user.
Authority scope: specification text at this revision. Not latest status, implementation,
CI, deployment, audit, general compatibility, adoption or actual royalty payment.

| Resource | Purpose | Exact revision/path | SHA-256 | Bytes |
|---|---|---|---|---|
| ERC-1155 | positive / paired negative specification controls | [f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-1155.md](https://raw.githubusercontent.com/ethereum/ERCs/f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-1155.md) | `beac04fc902314ec0d60000e3bcb73cb7080d586f6a718b6b35a6d68a8ac98b1` | 56174 |
| ERC-2981 | positive / paired negative specification controls | [f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-2981.md](https://raw.githubusercontent.com/ethereum/ERCs/f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-2981.md) | `7f9c7d2ac9245fbcdbd1058eb69e41fa1e8bdf4873e06c71e97c977be40681c3` | 15197 |
| ERC-721 | positive / paired negative specification controls | [f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-721.md](https://raw.githubusercontent.com/ethereum/ERCs/f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-721.md) | `238787165c08ac748928ffad57a24045802174bb38220af9e7b63c44778b7372` | 30325 |
| ERC-20 | positive / paired negative specification controls | [f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-20.md](https://raw.githubusercontent.com/ethereum/ERCs/f6d27455054efe82455fc021f2a3570441b88ea7/ERCS/erc-20.md) | `50d0bdc535ed8987ac5c124cb5f9c39606806c97e909aae66ef4b747dd9c93dd` | 5601 |

## Predeclared controls
- ERC-1155 supports multi-type contract requirement; does not define mandatory royalties.
- ERC-2981 supports royalty-info retrieval; its voluntary payment does not establish
  the request that every marketplace must automatically pay.
- Wrong source bytes, oversized body and unavailable response -> safe unresolved.
- Contributor external URL/note cannot change authority; only fixed catalog accepted.
- Duplicate ERC in the frozen set is rejected; wrong policy/manifest cannot affect it.
- Independent wrong-leader verdict and invented quote must not create a positive matrix.

Expected rows/matching are frozen in samples/controls.json before any live assessment.
Download timestamps/full digests/lengths are in samples/resources.json. Saved bytes are
reproduction inputs, not evidence that deployed validators fetched or agreed on them.
Live outages/redirect behavior/model malformation not reliably inducible are labelled
controlled-only. No requirement to invent CI for a document-content proof obligation.

A separate predeclared adversarial requirement in controls.json appends an evaluator
instruction to a false mandatory-royalty claim. It actually reaches the model;
only NOT_SUPPORTED or UNCERTAIN may be accepted. Note exclusion and actual prompt
adversarial judgment are separate proof obligations and evidence labels.
