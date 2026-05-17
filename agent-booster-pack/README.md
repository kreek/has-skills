# Agent Booster Pack

Agent Booster Pack (ABP) for [Pi](https://pi.dev), in one package.

The Pi runtime surface is intentionally small:

- **Proof** — proof-first mode with `/proof`, `proof_start`, and `proof_done`.
- **Self-review** — a final-pass self-review gate with `/abp:self-review`, aligned with the Claude and Codex ABP self-review hooks.

ABP skills are bundled in this package under `skills/`. There are no separate Pi packages for proof, contract-first, specify, or skills in this package layout.

## Install

```sh
pi install npm:agent-booster-pack
```

Then in Pi:

```text
/reload
```

## Migration notes

- The old Pi `Final Value Guard` is now **Self-review**.
- `/abp:final-value` is removed; use `/abp:self-review`.
- Pi runtime extensions for pre-work, scaffold, specify, contract-first, branch isolation, and code-review runtime are no longer installed by this package. Their skills remain available when present in the bundled skills directory.

## License

MIT — see `LICENSE`. Third-party/adapted extension notices are listed in
`THIRD_PARTY_NOTICES.md`.
