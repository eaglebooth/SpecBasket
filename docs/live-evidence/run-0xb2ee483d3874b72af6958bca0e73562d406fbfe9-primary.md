# Actual SpecBasket transactions

Contract: [0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9](https://explorer-studio.genlayer.com/address/0xb2ee483d3874b72aF6958BCa0E73562d406FbfE9)

Source SHA-256: 97af2093a0273c494ba0bebfb1a878bbacc616fbcddd5a8019959d73f6223dc1

[Append-only raw events](run-0xb2ee483d3874b72af6958bca0e73562d406fbfe9-primary.jsonl)

Parent success establishes execution and canonical state, not external payment delivery. SDK lifecycle does not prove browser-wallet UX.

| Step | Explorer | Expected execution | Verification |
|---|---|---|---|
| core-create | [tx](https://explorer-studio.genlayer.com/transactions/0x181f1d8cf360fe6f3fd92e219f9c941941b087329daa52132959960a434fd604) | SUCCESS; inspect business state | verified |
| core-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xa54c8d6dfffc8e531630aa629920cd9d79a4bf169edd22c571d620a7c61f0e0f) | SUCCESS; inspect business state | verified |
| core-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x5fbb187f18fd63df91448817c8dd11ed18e7d86d33a8adb34f3280e2632e62e7) | SUCCESS; inspect business state | verified |
| core-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xe0a423bc8fe31097581175516efc8bc61aa2e0519029c99e69c2a7fed5c367a5) | SUCCESS; inspect business state | verified |
| core-assess-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xef59af7ef420ba5b04746361be3348c9050f8e14ccb61272c7375e474c3e6ca1) | SUCCESS; inspect business state | verified |
| core-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xb27d5794fb4e60d4b316593caf1064712de35e933ad442a1d45d6f05f6ff6d25) | SUCCESS; inspect business state | verified |
| core-assess-2981-retry | [tx](https://explorer-studio.genlayer.com/transactions/0x179f4a4e9db846d09cee096b34c1546ac2f4e82e30ee830746dc4b8496735727) | SUCCESS; inspect business state | verified |
| core-wrong-value | [tx](https://explorer-studio.genlayer.com/transactions/0xd9ef78d14951be51e79e41661f913b478ca8f30a5d026361feaecc0be9dfa634) | SUCCESS / rejected, refund emitted: EXACT_VALUE_REQUIRED | verified |
| core-wrong-payer | [tx](https://explorer-studio.genlayer.com/transactions/0xbaef055d2e94ee5cab9d5f8f45678e1e3f601c50027b7c6b5ec30b4180e34944) | SPONSOR_ONLY | verified |
| core-publish | [tx](https://explorer-studio.genlayer.com/transactions/0x9cb9da35f8e9c2ae8f6040cd9032ec7ca8588015452f24ce3bb0bdc81d9f744f) | SUCCESS; inspect business state | verified |
| core-publish-replay | [tx](https://explorer-studio.genlayer.com/transactions/0x5b7b290a28afe4e2c9ff71bcc3d44bc006e5b9ad5cc6cb32063061eb669c3b60) | NOT_PAYABLE | verified |
| negative-create | [tx](https://explorer-studio.genlayer.com/transactions/0x775e2e50c8f876940fcc5501abcdd1027d9bb57e5c58c763c55fc06813c7b456) | SUCCESS; inspect business state | verified |
| negative-wrong-policy | [tx](https://explorer-studio.genlayer.com/transactions/0xf9cf498ac86fc0d934ffefd8828c56779e886fdc3b15151025b590d6da6cc0b7) | POLICY_MISMATCH | verified |
| negative-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0xe412c44220d0fff1bee84cb12c7318daeb7e2f532be318f80b674d7694ae6a5f) | SUCCESS; inspect business state | verified |
| negative-nomination-replay | [tx](https://explorer-studio.genlayer.com/transactions/0x9d8f0ee70309d982de00cdd324da4c4e94b3940bef9a3a3ebb1619cd3d5455b6) | NOMINATION_REPLAY | verified |
| negative-foreign-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xb16a886c1d78f421d541cd3343d04638b05956e0ac9f5a5f1cdff7f279f50a0b) | SPONSOR_ONLY | verified |
| negative-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x89e8e2a649604c0c82520ea02a261c587bc03abf9f657fea5db75de31bdad8c3) | SUCCESS; inspect business state | verified |
| negative-stale-manifest | [tx](https://explorer-studio.genlayer.com/transactions/0x2d0f56c5d5d83795b0d71c31b6ba1f5d2c81a492ac4e28af9fe48442de1e937d) | ASSESSMENT_BINDING | verified |
| negative-unassessed-funding | [tx](https://explorer-studio.genlayer.com/transactions/0x047ae8f80162bcabd107674400b702b38e76a5b55d522cb74785ba6d567e2cc5) | NOT_PAYABLE | verified |
| negative-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x92a83f9c485ce9b1b37b320e93bd3ee018a38d755a2948580b0c83ea50a0accf) | SUCCESS; inspect business state | verified |
| negative-late-assessment | [tx](https://explorer-studio.genlayer.com/transactions/0x50fdafb28ab7e3eba9dd0231b96feb9a563d8fa7f5d01f58145fe22cfe2330b7) | ASSESSMENT_BINDING | verified |
| audit-create | [tx](https://explorer-studio.genlayer.com/transactions/0x154e4acd6ebabf79165182c38501c3d3a34171bb867f73fa70280c2d7d8434e4) | SUCCESS; inspect business state | verified |
| audit-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xd735dd6730c7e94beb77ff5d725d946f72e3c227474603481aecdae698b6aad9) | SUCCESS; inspect business state | verified |
| audit-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xbf73d707621a230629616ba3d8d7ecd30c91cabcd5783c6a45a1e10143fa9062) | SUCCESS; inspect business state | verified |
| audit-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x831388bf6e60fb277f88b37120d5d4ea62a8e2a4c83e9060371c6e106c93ad57) | SUCCESS; inspect business state | verified |
| audit-assess-2981-retry | [tx](https://explorer-studio.genlayer.com/transactions/0xd07670c2dc9bd09908178579863eee47577156ee1ced979f3ad273a0331be4e4) | SUCCESS; inspect business state | verified |
| audit-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x1202c536bbd2bb6f9bb3dfdb9fa88624908286a40f22fa29503b6302d6402b54) | SUCCESS; inspect business state | verified |
| injection-create | [tx](https://explorer-studio.genlayer.com/transactions/0x279de594852483bbcfd0c1ee65761c01884d5d0dd3b1f0c95f49a0d5233f9f84) | SUCCESS; inspect business state | verified |
| injection-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xbccac9e405014c16596844499192325b473234ddfa8fc3ee113daf5e27112303) | SUCCESS; inspect business state | verified |
| injection-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x9fb86f03239aeb5fc8a21332d98c3fba4f9110624150b2149b00aa5df3736f08) | SUCCESS; inspect business state | verified |
| injection-assess | [tx](https://explorer-studio.genlayer.com/transactions/0x05d1fdf3d9303835130b9d034ebedf714d5fa0b232f1eb5c6f803019a5cbd512) | SUCCESS; inspect business state | verified |
| injection-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0xd17f770ad88568c141d218e4fedb487660c640c79633525970574fc88ea928ba) | SUCCESS; inspect business state | verified |
| race-create | [tx](https://explorer-studio.genlayer.com/transactions/0x1183f6a373ba3f5984f3bbcfb3ee8b9c0c781ea94da15000aadf8d8c5c61affa) | SUCCESS; inspect business state | verified |
| race-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xa83ee8674307eea98fa308f304cb5062a71bf3ddc08f3ba069ef1cb180231160) | SUCCESS; inspect business state | verified |
| race-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x2bb83f39b9665a3ec0b7b902432469ca00de34345c13422254c1c5bb53a6502c) | SUCCESS; inspect business state | verified |
| race-assess | [tx](https://explorer-studio.genlayer.com/transactions/0x5c212b1f75bdcd46afdaa06c27cdb71ec440db5673baca1ccccd1f4ce7893b20) | probe-specific | verified |
| race-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x5031b6d2d4f41b7421bbc45a5d7e9bc411346cf967771b71755dfad608a939a0) | probe-specific | verified |
