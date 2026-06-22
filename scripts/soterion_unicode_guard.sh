#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SCRIPT_DIR

python3 - "$@" <<'PY'
import argparse
import os
import re
import subprocess
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

CJK_RE = re.compile(r"[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]")

@dataclass
class Finding:
    path: str
    line_no: int
    kind: str
    chars: str
    line: str

def run_diff(repo: Path, revision: str) -> str:
    completed = subprocess.run(["git", "diff", "--no-color", "--unified=0", revision, "--", "src", "src-tauri"], cwd=repo, text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "git diff failed")
    return completed.stdout

def parse_added_lines(diff_text: str):
    current_path = ""
    current_line = 0
    added = []
    for raw in diff_text.splitlines():
        if raw.startswith("+++ b/"):
            current_path = raw[len("+++ b/"):]
            continue
        if raw.startswith("@@"):
            match = re.search(r"\+(\d+)", raw)
            current_line = int(match.group(1)) if match else 0
            continue
        if raw.startswith("+") and not raw.startswith("+++"):
            added.append((current_path, current_line, raw[1:]))
            current_line += 1
            continue
        if raw.startswith("-") and not raw.startswith("---"):
            continue
        if not raw.startswith("\\"):
            current_line += 1
    return added

def classify(path: str, line_no: int, line: str):
    non_ascii = sorted({ch for ch in line if ord(ch) > 127})
    if not non_ascii:
        return []
    chars = "".join(non_ascii)
    findings = [Finding(path, line_no, "non_ascii", chars, line)]
    cjk_chars = "".join(sorted({ch for ch in non_ascii if CJK_RE.search(ch)}))
    if cjk_chars:
        findings.append(Finding(path, line_no, "cjk", cjk_chars, line))
    return findings

parser = argparse.ArgumentParser(description="Soterion Unicode drift guard")
parser.add_argument("--revision", default="HEAD")
args = parser.parse_args()
repo = Path(os.environ["SCRIPT_DIR"]).resolve().parents[1]
try:
    diff_text = run_diff(repo, args.revision)
except RuntimeError as err:
    print(f"[soterion] error: {err}")
    raise SystemExit(2)
added = parse_added_lines(diff_text)
findings = []
symbol_counter = Counter()
for path, line_no, line in added:
    results = classify(path, line_no, line)
    findings.extend(results)
    for finding in results:
        if finding.kind == "non_ascii":
            for ch in finding.chars:
                symbol_counter[ch] += line.count(ch)
cjk_findings = [f for f in findings if f.kind == "cjk"]
non_ascii_findings = [f for f in findings if f.kind == "non_ascii"]
print("[soterion] unicode drift summary")
print(f"  added lines scanned: {len(added)}")
print(f"  non-ascii findings: {len(non_ascii_findings)}")
print(f"  cjk findings: {len(cjk_findings)}")
if symbol_counter:
    print("  symbol counts:")
    for ch, count in sorted(symbol_counter.items(), key=lambda item: (-item[1], item[0])):
        print(f"    U+{ord(ch):04X} {repr(ch)} x{count}")
if non_ascii_findings:
    print("[soterion] non-ascii details:")
    for finding in non_ascii_findings[:30]:
        print(f"  {finding.path}:{finding.line_no} [{finding.kind}] chars={repr(finding.chars)} line={finding.line}")
if cjk_findings:
    print("[soterion] FAIL: newly added CJK characters detected")
    raise SystemExit(1)
print("[soterion] PASS: no newly added CJK characters")
PY
