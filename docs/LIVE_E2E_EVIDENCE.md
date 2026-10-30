# SpecBasket v0.2.0 observed SDK lifecycle

Checked 2026-10-30T07:38:53.433Z. Contract [0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9](https://explorer-studio.genlayer.com/address/0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9). Source parity SHA-256: `97af2093a0273c494ba0bebfb1a878bbacc616fbcddd5a8019959d73f6223dc1`.

37 actual parent test transactions and 3 independently verified native-transfer children. Two secondary signers; main wallet deployed only. Semantic controls, known rejected-value refund, real award/unallocated refund, negative/replay/cancel, an actual prompt attack and cancellation sequence probe were observed. Transient source/model failures and retries remain in append-only evidence. No universal robustness, eligible failed-deposit recovery completion or production browser signing is inferred.

[Independent state/calldata/payment proof](live-evidence/independent-all-0xb2ee483d3874b72af6958bca0e73562d406fbfe9-1793345959703.json) · [Raw append-only events](live-evidence/run-0xb2ee483d3874b72af6958bca0e73562d406fbfe9-primary.jsonl) · [Native child delivery](PAYMENT_DELIVERY.md)

## Actual parent transactions

| Step | Explorer | Execution | Business result |
|---|---|---|---|
| core-create | [tx](https://explorer-studio.genlayer.com/transactions/0x181f1d8cf360fe6f3fd92e219f9c941941b087329daa52132959960a434fd604) | SUCCESS | See canonical business readback |
| core-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xa54c8d6dfffc8e531630aa629920cd9d79a4bf169edd22c571d620a7c61f0e0f) | SUCCESS | See canonical business readback |
| core-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x5fbb187f18fd63df91448817c8dd11ed18e7d86d33a8adb34f3280e2632e62e7) | SUCCESS | See canonical business readback |
| core-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xe0a423bc8fe31097581175516efc8bc61aa2e0519029c99e69c2a7fed5c367a5) | SUCCESS | See canonical business readback |
| core-assess-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xef59af7ef420ba5b04746361be3348c9050f8e14ccb61272c7375e474c3e6ca1) | SUCCESS | See canonical business readback |
| core-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xb27d5794fb4e60d4b316593caf1064712de35e933ad442a1d45d6f05f6ff6d25) | SUCCESS | See canonical business readback |
| core-assess-2981-retry | [tx](https://explorer-studio.genlayer.com/transactions/0x179f4a4e9db846d09cee096b34c1546ac2f4e82e30ee830746dc4b8496735727) | SUCCESS | See canonical business readback |
| core-wrong-value | [tx](https://explorer-studio.genlayer.com/transactions/0xd9ef78d14951be51e79e41661f913b478ca8f30a5d026361feaecc0be9dfa634) | SUCCESS | REJECTED / REFUND EMITTED |
| core-wrong-payer | [tx](https://explorer-studio.genlayer.com/transactions/0xbaef055d2e94ee5cab9d5f8f45678e1e3f601c50027b7c6b5ec30b4180e34944) | ERROR | SPONSOR_ONLY |
| core-publish | [tx](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | SUCCESS | See canonical business readback |
| core-publish-replay | [tx](https://explorer-studio.genlayer.com/transactions/0x5b7b290a28afe4e2c9ff71bcc3d44bc006e5b9ad5cc6cb32063061eb669c3b60) | ERROR | NOT_PAYABLE |
| negative-create | [tx](https://explorer-studio.genlayer.com/transactions/0x775e2e50c8f876940fcc5501abcdd1027d9bb57e5c58c763c55fc06813c7b456) | SUCCESS | See canonical business readback |
| negative-wrong-policy | [tx](https://explorer-studio.genlayer.com/transactions/0xf9cf498ac86fc0d934ffefd8828c56779e886fdc3b15151025b590d6da6cc0b7) | ERROR | POLICY_MISMATCH |
| negative-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xe412c44220d0fff1bee84cb12c7318daeb7e2f532be318f80b674d7694ae6a5f) | SUCCESS | See canonical business readback |
| negative-nomination-replay | [tx](https://explorer-studio.genlayer.com/transactions/0x9d8f0ee70309d982de00cdd324da4c4e94b3940bef9a3a3ebb1619cd3d5455b6) | ERROR | NOMINATION_REPLAY |
| negative-foreign-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xb16a886c1d78f421d541cd3343d04638b05956e0ac9f5a5f1cdff7f279f50a0b) | ERROR | SPONSOR_ONLY |
| negative-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x89e8e2a649604c0c82520ea02a261c587bc03abf9f657fea5db75de31bdad8c3) | SUCCESS | See canonical business readback |
| negative-stale-manifest | [tx](https://explorer-studio.genlayer.com/transactions/0x2d0f56c5d5d83795b0d71c31b6ba1f5d2c81a492ac4e28af9fe48442de1e937d) | ERROR | ASSESSMENT_BINDING |
| negative-unassessed-funding | [tx](https://explorer-studio.genlayer.com/transactions/0x047ae8f80162bcabd107674400b702b38e76a5b55d522cb74785ba6d567e2cc5) | ERROR | NOT_PAYABLE |
| negative-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x92a83f9c485ce9b1b37b320e93bd3ee018a38d755a2948580b0c83ea50a0accf) | SUCCESS | See canonical business readback |
| negative-late-assessment | [tx](https://explorer-studio.genlayer.com/transactions/0x50fdafb28ab7e3eba9dd0231b96feb9a563d8fa7f5d01f58145fe22cfe2330b7) | ERROR | ASSESSMENT_BINDING |
| audit-create | [tx](https://explorer-studio.genlayer.com/transactions/0x154e4acd6ebabf79165182c38501c3d3a34171bb867f73fa70280c2d7d8434e4) | SUCCESS | See canonical business readback |
| audit-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xd735dd6730c7e94beb77ff5d725d946f72e3c227474603481aecdae698b6aad9) | SUCCESS | See canonical business readback |
| audit-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xbf73d707621a230629616ba3d8d7ecd30c91cabcd5783c6a45a1e10143fa9062) | SUCCESS | See canonical business readback |
| audit-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x831388bf6e60fb277f88b37120d5d4ea62a8e2a4c83e9060371c6e106c93ad57) | SUCCESS | See canonical business readback |
| audit-assess-2981-retry | [tx](https://explorer-studio.genlayer.com/transactions/0xd07670c2dc9bd09908178579863eee47577156ee1ced979f3ad273a0331be4e4) | SUCCESS | See canonical business readback |
| audit-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x1202c536bbd2bb6f9bb3dfdb9fa88624908286a40f22fa29503b6302d6402b54) | SUCCESS | See canonical business readback |
| injection-create | [tx](https://explorer-studio.genlayer.com/transactions/0x279de594852483bbcfd0c1ee65761c01884d5d0dd3b1f0c95f49a0d5233f9f84) | SUCCESS | See canonical business readback |
| injection-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xbccac9e405014c16596844499192325b473234ddfa8fc3ee113daf5e27112303) | SUCCESS | See canonical business readback |
| injection-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x9fb86f03239aeb5fc8a21332d98c3fba4f9110624150b2149b00aa5df3736f08) | SUCCESS | See canonical business readback |
| injection-assess | [tx](https://explorer-studio.genlayer.com/transactions/0x05d1fdf3d9303835130b9d034ebedf714d5fa0b232f1eb5c6f803019a5cbd512) | SUCCESS | See canonical business readback |
| injection-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0xd17f770ad88568c141d218e4fedb487660c640c79633525970574fc88ea928ba) | SUCCESS | See canonical business readback |
| race-create | [tx](https://explorer-studio.genlayer.com/transactions/0x1183f6a373ba3f5984f3bbcfb3ee8b9c0c781ea94da15000aadf8d8c5c61affa) | SUCCESS | See canonical business readback |
| race-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xa83ee8674307eea98fa308f304cb5062a71bf3ddc08f3ba069ef1cb180231160) | SUCCESS | See canonical business readback |
| race-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x2bb83f39b9665a3ec0b7b902432469ca00de34345c13422254c1c5bb53a6502c) | SUCCESS | See canonical business readback |
| race-assess | [tx](https://explorer-studio.genlayer.com/transactions/0x5c212b1f75bdcd46afdaa06c27cdb71ec440db5673baca1ccccd1f4ce7893b20) | SUCCESS | See canonical business readback |
| race-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x5031b6d2d4f41b7421bbc45a5d7e9bc411346cf967771b71755dfad608a939a0) | SUCCESS | See canonical business readback |

## Actual native-transfer children

| Transfer | Wei | Recipient | Parent | Delivery |
|---|---|---|---|---|
| REJECTED_VALUE_REFUND | 1 | 0xeb57bc7125fa60d7482ce12058397369ab3581f8 | [parent](https://explorer-studio.genlayer.com/transactions/0xd9ef78d14951be51e79e41661f913b478ca8f30a5d026361feaecc0be9dfa634) | [credited child](https://explorer-studio.genlayer.com/transactions/0xcb831ad946b23e5f97746922863e77844834e7d252ba8bc62e7760bd96206355) |
| RESEARCH_AWARD | 200000000000000 | 0x2da5393d7bbb9a037dc3abb56dbbc5c150fc843f | [parent](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | [credited child](https://explorer-studio.genlayer.com/transactions/0x2378bee3d023940f49f2da9259fd850c3646276ad7fa173883e13d6f1897d388) |
| UNALLOCATED_REFUND | 100000000000000 | 0xeb57bc7125fa60d7482ce12058397369ab3581f8 | [parent](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | [credited child](https://explorer-studio.genlayer.com/transactions/0x40518cad1ee29a23a80e7d96eedb3a23b73d81c5a7cd96debe1fe3c755e2bd33) |

## UI and remaining limits

[Real browser readback](live-evidence/UI_LIVE_READBACK.json) verifies desktop/mobile state,
semantic rows, outbox and parent-linked native credits. Browser wallet signing was
explicitly deferred by the user and is unverified.

[Supplemental recovery probes](RECOVERY_OBSERVATIONS.md) remain separately labelled.
