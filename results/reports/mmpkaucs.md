# Benchmark Report: mmpkaucs

Generated: 2026-03-14T00:15:54.343Z

## Summary

| Task | Service | CLI Cost | MCP Cost | CLI Tokens | MCP Tokens | CLI Duration | MCP Duration | Winner |
|------|---------|----------|----------|------------|------------|-------------|-------------|--------|
| G1 | github | $0.0411 | $0.0421 | 179 | 213 | 10903ms | 11653ms | CLI |
| G2 | github | $0.0424 | $0.0417 | 224 | 202 | 15235ms | 12803ms | MCP |
| G3 | github | $0.0401 | $0.0412 | 157 | 195 | 14046ms | 13142ms | CLI |
| G4 | github | $0.0409 | $0.0407 | 187 | 184 | 12145ms | 12095ms | MCP |
| N1 | notion | $0.1340 | $0.0675 | 602 | 314 | 31373ms | 16480ms | MCP |
| N2 | notion | $0.1887 | $0.0573 | 1512 | 256 | 53215ms | 16848ms | MCP |
| N3 | notion | $0.2364 | $0.1207 | 1973 | 643 | 80239ms | 25759ms | MCP |
| N4 | notion | $0.1163 | $0.1214 | 1051 | 763 | 41253ms | 31671ms | CLI |
| P1 | postgres | $0.0945 | $0.1552 | 646 | 1159 | 25098ms | 41905ms | CLI |
| P2 | postgres | $0.0527 | $0.1190 | 263 | 846 | 14737ms | 32319ms | CLI |
| P3 | postgres | $0.0530 | $0.1051 | 269 | 846 | 14686ms | 27263ms | CLI |
| S1 | slack | $0.1078 | $0.0706 | 901 | 671 | 33149ms | 24882ms | MCP |
| S2 | slack | $0.1250 | $0.0685 | 934 | 368 | 43677ms | 15806ms | MCP |
| S3 | slack | $0.1235 | $0.0550 | 841 | 254 | 39526ms | 13821ms | MCP |
| S4 | slack | $0.1414 | $0.0593 | 1100 | 371 | 39496ms | 13002ms | MCP |

## Totals

- **CLI total cost:** $1.5380
- **MCP total cost:** $1.1653
- **Cost ratio:** MCP is 0.76x CLI
- **CLI wins:** 6
- **MCP wins:** 9
- **Ties:** 0

## By Service

### github

- CLI cost: $0.1645
- MCP cost: $0.1657
- Ratio: MCP is 1.01x CLI

### notion

- CLI cost: $0.6755
- MCP cost: $0.3669
- Ratio: MCP is 0.54x CLI

### postgres

- CLI cost: $0.2002
- MCP cost: $0.3792
- Ratio: MCP is 1.89x CLI

### slack

- CLI cost: $0.4978
- MCP cost: $0.2534
- Ratio: MCP is 0.51x CLI

## Tool Call Analysis

*No tool call data available (run SDK pass for detailed analysis)*

## Accuracy

- CLI average accuracy: 100.0%
- MCP average accuracy: 100.0%
