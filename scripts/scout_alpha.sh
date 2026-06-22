#!/usr/bin/env bash
set -euo pipefail

python3 - "$@" <<'PY'
import subprocess
from datetime import datetime
from pathlib import Path

AGENT_NAME = "Scout-Alpha"
AGENT_VERSION = "0.1.0"
HOME = Path.home()
REPORT_DIR = HOME / "CITADEL_RUNTIME" / "reports"

def log(msg: str):
    print(f'[{datetime.now().strftime("%H:%M:%S")}] {msg}', flush=True)

def scan_repo(repo_path: str) -> dict:
    repo = Path(repo_path)
    if not repo.exists():
        return {"error": f"Repo not found: {repo_path}"}
    result = {"repo": str(repo), "scanned_at": datetime.now().isoformat(), "files": []}
    ext_counts = {}
    try:
        for f in repo.rglob("*"):
            if f.is_file():
                ext = f.suffix or "no_ext"
                ext_counts[ext] = ext_counts.get(ext, 0) + 1
    except Exception as exc:
        result["scan_error"] = str(exc)
    result["file_counts"] = ext_counts
    if (repo / ".git").exists():
        result["git"] = True
        try:
            rev = subprocess.run(["git", "rev-parse", "HEAD"], cwd=repo, capture_output=True, text=True)
            result["commit"] = rev.stdout.strip()[:8]
        except Exception:
            pass
    return result

def generate_report(repo_path: str) -> str:
    data = scan_repo(repo_path)
    report = f"# Scout-Alpha Report: {data.get('repo', 'Unknown')}\n\n**Scanned:** {data.get('scanned_at', 'N/A')}  \n**Agent:** {AGENT_NAME} v{AGENT_VERSION}\n\n## File Summary\n\n| Extension | Count |\n|-----------|-------|\n"
    for ext, count in data.get("file_counts", {}).items():
        report += f"| {ext} | {count} |\n"
    if "commit" in data:
        report += f"\n**Latest Commit:** `{data['commit']}`\n"
    if "error" in data:
        report += f"\n**Error:** {data['error']}\n"
    return report

log(f"Scout-Alpha v{AGENT_VERSION} starting...")
repos_to_scan = ["/home/numenor/Eregion/CITADEL"]
REPORT_DIR.mkdir(parents=True, exist_ok=True)
for repo in repos_to_scan:
    log(f"Scanning: {repo}")
    report = generate_report(repo)
    filename = f"scout-{Path(repo).name}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    output = REPORT_DIR / filename
    output.write_text(report)
    log(f"Report: {output}")
log("Scout-Alpha scan complete")
PY
