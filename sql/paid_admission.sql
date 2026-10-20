-- Apply only to an existing PostgreSQL database after operator review.
-- Application credentials need SELECT/INSERT/UPDATE on these tables, not DDL.
CREATE TABLE paid_ai_guard (id integer PRIMARY KEY CHECK (id=1), policy_hash text NOT NULL);
CREATE TABLE paid_ai_budget (
  scope text NOT NULL, period bigint NOT NULL, requests bigint NOT NULL,
  tokens bigint NOT NULL, cost_micro bigint NOT NULL, PRIMARY KEY(scope,period)
);
CREATE TABLE paid_ai_admission (
  id uuid PRIMARY KEY, principal text NOT NULL, model text NOT NULL,
  deadline timestamptz NOT NULL, started_at timestamptz, finished_at timestamptz,
  status text NOT NULL DEFAULT 'reserved'
);
-- No automatic policy enrollment or reset. Insert the reviewed fingerprint:
-- INSERT INTO paid_ai_guard VALUES (1, '<python -m paid_access fingerprint>');
