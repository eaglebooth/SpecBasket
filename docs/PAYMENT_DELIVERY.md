# Observed SpecBasket v0.2.0 native payments

Checked 2026-10-30T07:38:53.433Z. Contract [0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9](https://explorer-studio.genlayer.com/address/0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9).

Each child is an exact-parent-bound type-0 native transfer, FINALIZED, value_credited true, correct source/recipient/value and empty calldata. Native children have no AI consensus; generic result NO_MAJORITY is not treated as a failed contract vote. Parent calls separately require finalized MAJORITY_AGREE and successful execution. This proves these Studionet native credits, not arbitrary downstream delivery reliability.

[Independent proof and raw child records](live-evidence/independent-all-0xb2ee483d3874b72af6958bca0e73562d406fbfe9-1793345959703.json)

| Transfer | Wei | Recipient | Parent | Delivery |
|---|---|---|---|---|
| REJECTED_VALUE_REFUND | 1 | 0xeb57bc7125fa60d7482ce12058397369ab3581f8 | [parent](https://explorer-studio.genlayer.com/transactions/0xd9ef78d14951be51e79e41661f913b478ca8f30a5d026361feaecc0be9dfa634) | [credited child](https://explorer-studio.genlayer.com/transactions/0xcb831ad946b23e5f97746922863e77844834e7d252ba8bc62e7760bd96206355) |
| RESEARCH_AWARD | 200000000000000 | 0x2da5393d7bbb9a037dc3abb56dbbc5c150fc843f | [parent](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | [credited child](https://explorer-studio.genlayer.com/transactions/0x2378bee3d023940f49f2da9259fd850c3646276ad7fa173883e13d6f1897d388) |
| UNALLOCATED_REFUND | 100000000000000 | 0xeb57bc7125fa60d7482ce12058397369ab3581f8 | [parent](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | [credited child](https://explorer-studio.genlayer.com/transactions/0x40518cad1ee29a23a80e7d96eedb3a23b73d81c5a7cd96debe1fe3c755e2bd33) |

Contract native balance: 0 wei. The recorded award balance delta was checked immediately after lifecycle, before recipient test transactions. Eligible failed-parent recovery and a production unmanaged-browser-wallet journey remain separate gates.
