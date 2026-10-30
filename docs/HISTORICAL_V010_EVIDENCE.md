# SpecBasket v0.1.0 historical evidence — FINANCIAL GATE FAILED

Checked 2026-10-30T01:13:20.884Z. Contract [0x65Bc42A6263De86C6Aa1D0DE8a6021b630A5656d](https://explorer-studio.genlayer.com/address/0x65Bc42A6263De86C6Aa1D0DE8a6021b630A5656d).

Exact archived/deployed source SHA-256: `59f0ddd00953f858942674f0df1e027575b4558e782845429d54584c4e74cfa2`.

27 actual finalized majority transactions by two secondary wallets. Real semantic controls and negative/audit phases passed, including one malicious requirement returning NOT_SUPPORTED. Funding was STOPPED: wrong attached value rolled back execution but retained 1 wei in native balance. No award, refund delivery, complete E2E or submission readiness is claimed. The frozen historical instance cannot be repaired by a replacement contract.

[Independent readbacks](live-evidence/historical-independent-1793322814131.json) · [Append-only raw run](live-evidence/run-0x65bc42a6263de86c6aa1d0de8a6021b630a5656d-primary.jsonl) · [Custody failure](CUSTODY_FAILURE.md)

| Step | Explorer | Execution | Observation |
|---|---|---|---|
| core-create | [tx](https://explorer-studio.genlayer.com/transactions/0x3679823cd3b4664ae8a095385af856ed9b00209cf157283c28c98477bdce5edf) | SUCCESS | Observed business state; see readback |
| core-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0x918a0123c216776228a19495888173dbdd729b04146d58fe6b44ba9a3000f42e) | SUCCESS | Observed business state; see readback |
| core-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xaac8608f0e5d5ec9e11f2b69e24b0ec78ae6b6231dd1dc7f38091d2c2d6c496a) | SUCCESS | Observed business state; see readback |
| core-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xa0bb6ef64c776c3180457c885b7b3679b8fdd743d8a5a179f351d0f8e3e3d538) | SUCCESS | Observed business state; see readback |
| core-assess-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0x1a56f8b26cc1ebdb63545afc2250f0ddab6e2d8c224ce4d98a6dafb5920ccb33) | SUCCESS | Observed business state; see readback |
| core-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x3e6c90cd9e7dddd6d4c5ee627cf2a0de67439da699ded3135705a0874fd50446) | SUCCESS | Observed business state; see readback |
| core-wrong-value | [tx](https://explorer-studio.genlayer.com/transactions/0xdfbaf710219042b0be0b5cf3300332eb7afd232fe2de48e66223b68704c41ce5) | ERROR | FAILED_NATIVE_VALUE_RETAINED |
| negative-create | [tx](https://explorer-studio.genlayer.com/transactions/0xdc8cdb64079a3a859d20099b799efbaa328e4f433b681b0e809fa62b89a0a163) | SUCCESS | Observed business state; see readback |
| negative-wrong-policy | [tx](https://explorer-studio.genlayer.com/transactions/0xb27e6f49f8249d57be51b76823edf42060f0509ffe7706a21896a836fd82f32b) | ERROR | POLICY_MISMATCH |
| negative-nominate-1155 | [tx](https://explorer-studio.genlayer.com/transactions/0x06c20dcfff84fececa2de9d6c41bc1d449997864ff6e0bbc3e5cba4eea57ec8c) | SUCCESS | Observed business state; see readback |
| negative-nomination-replay | [tx](https://explorer-studio.genlayer.com/transactions/0x29cd8c255727a583b708d27b508aef2f034077b5a023253b4dd2018b5526e140) | ERROR | NOMINATION_REPLAY |
| negative-foreign-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x7b3a8fef49bc95bb6963fadbf1a0ac94a3e07c89f28568c3233e4f073c5d6ab7) | ERROR | SPONSOR_ONLY |
| negative-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0xd87276fcd99ab46e1c3080d022938d89300b2ec79933a8ff2281a8704da24bd6) | SUCCESS | Observed business state; see readback |
| negative-stale-manifest | [tx](https://explorer-studio.genlayer.com/transactions/0xd59e434609c2256ddb7c594c5c5cd49e59f3267a8eb029ba74a8d7a97c424466) | ERROR | ASSESSMENT_BINDING |
| negative-unassessed-funding | [tx](https://explorer-studio.genlayer.com/transactions/0x25fa5c0960c19fc74098bfd605d065cd3981b090ddea0a854159c6ebf4ea6e36) | ERROR | NOT_PAYABLE |
| negative-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x4e4934e3cd157bcc169c4f55c86f36efb1b67fac79dae9b232f4e7027839dcab) | SUCCESS | Observed business state; see readback |
| negative-late-assessment | [tx](https://explorer-studio.genlayer.com/transactions/0xd83e986fde319faecb0c0f84693eafbc9d1b643c8422a85a9a4ff964ad9fea65) | ERROR | ASSESSMENT_BINDING |
| audit-create | [tx](https://explorer-studio.genlayer.com/transactions/0xf5277e8e476b38a2b1eda8604686abdc5e85f59874d11df046cc7f6de991e303) | SUCCESS | Observed business state; see readback |
| audit-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xdd41609894c844cbeda6fcc75fa931b60d295d486bee36dae35bd5e5265e8412) | SUCCESS | Observed business state; see readback |
| audit-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x409cdc8fa009358f5664b1721c0246f1ffd75ceae37690d0b7f18deedea6248b) | SUCCESS | Observed business state; see readback |
| audit-assess-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0xb113381031ae437115b975594d1a6b1069b144187ca0cafc688c1a4371d7659e) | SUCCESS | Observed business state; see readback |
| audit-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x537544f699bcd17a358d10706817d70e495d2db21b2e9b1cb5613dfb21059cd6) | SUCCESS | Observed business state; see readback |
| injection-create | [tx](https://explorer-studio.genlayer.com/transactions/0xac1536a391b2e00925a30246c44dd761f5014c793b3cb1b594c8f3c125b634c4) | SUCCESS | Observed business state; see readback |
| injection-nominate-2981 | [tx](https://explorer-studio.genlayer.com/transactions/0x56b745983d7119637aaba924a1789684d21bfe317f88f40ae993c8583db5c00a) | SUCCESS | Observed business state; see readback |
| injection-freeze | [tx](https://explorer-studio.genlayer.com/transactions/0x12d2b113515bc438ac94358a5141730c3e9622e3b2bd6e2dad186453a2b2cc27) | SUCCESS | Observed business state; see readback |
| injection-assess | [tx](https://explorer-studio.genlayer.com/transactions/0x93e56dc391a0e532dec4b2309a426df31b7a4c55bf59cbbec4b78ca82c278299) | SUCCESS | Observed business state; see readback |
| injection-cancel | [tx](https://explorer-studio.genlayer.com/transactions/0x68b7feff4ff295a07f73a3957255468c1ef46da4f635d8310ff1ef4fc20082cd) | SUCCESS | Observed business state; see readback |
