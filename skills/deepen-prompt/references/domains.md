# Domain cheat sheet

For each field: raw material, instruments, and an outside judge. Use as starting points; always
adapt to the user's actual situation.

| Field | Raw material | Methods and tools | Outside judge |
| --- | --- | --- | --- |
| Software bugs | Crash dumps, logs, failing commit range | Repro scripts, `git bisect`, debuggers, sanitizers | Failing-then-passing regression test in CI |
| Code review | The diff plus callers and tests | Static analysis, mutation testing, running the code | Tests + type checker + a reviewer's checklist |
| Data analysis | Row-level tables, event logs | SQL/DuckDB, pandas, cohorts, survival and causal methods | Held-out backtest, reconciliation to finance |
| ML | Raw labelled data, label guidelines | Baselines, cross-validation, error analysis by slice | Untouched test set, ablations |
| Research | Primary papers, datasets, code | Search logs, citation chasing, replication, GRADE | Replicated number, independent search |
| Journalism | Filings, records, transcripts, data | FOIA, document verification, multiple sourcing | Two independent sources per claim |
| Writing/editing | Author's sources and notes | Reverse outline, fact check, read aloud | Audience reader restates thesis |
| UX/design | Session recordings, support tickets, usage logs | Usability tests, task success metrics | Task completion rate with real users |
| Performance | Field RUM data, traces | Profilers, flame graphs, budgets | Benchmark/Lighthouse CI on fixed hardware |
| Security | Code paths, configs, dependency tree | Threat modelling, fuzzing, SAST/DAST | PoC exploit fails; fuzzer clean for N hours |
| Finance/accounting | Ledgers, contracts, bank statements | Reconciliation, cash-flow models, sensitivity | Ties to statements to the cent |
| Legal | Statutes, contracts, case law | Citators (is the case still good law?), clause comparison | Cited authority verified current |
| Hardware/IoT | Datasheets, scope captures, logs | Oscilloscope/logic analyzer, HIL tests | Measured signal within spec |
| Infrastructure | Configs, IaC state, metrics | `terraform plan`, load tests, chaos tests | SLO dashboards, load test thresholds |
