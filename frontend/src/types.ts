export type Relation = 'SUPPORTED' | 'NOT_SUPPORTED' | 'UNCERTAIN';
export type Assessment = {status: 'RESOLVED' | 'UNRESOLVED'; code: string; rows: {id: string; relation: Relation; quote: string}[]};
export type Nomination = {id: string; erc: string; contributor: string; note: string; url: string; source_digest: string};
export type Basket = {
  id: string; title: string; sponsor: string; contributors: string[]; requirements: string[];
  policy_digest: string; manifest_digest: string; assessment_digest: string; reward_wei: string;
  state: 'OPEN' | 'FROZEN' | 'ASSESSED' | 'CANCELLED' | 'TRANSFERS_EMITTED';
  revision: number; nomination_ids: string[]; selected: string[];
  assessments: Record<string, Assessment>; attempts: Record<string, number>; matching: number[];
  received_wei: string; emitted_wei: string; outbox: {recipient: string; wei: string; kind: string}[];
};
