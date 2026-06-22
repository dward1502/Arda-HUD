#!/usr/bin/env bash
set -euo pipefail

python3 - "$@" <<'PY'
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

NODES = {
    "beelink": {"ip": "100.73.149.104", "user": "citadel", "password": "Pointers619!"},
    "arnor": {"ip": "100.79.194.31", "user": "arnor", "password": "quenya"},
    "numenor": {"ip": "100.110.85.37", "user": "numenor", "password": "quenya"},
}
STATUS = {}

def ssh_cmd(node, cmd):
    result = subprocess.run(["sshpass", "-p", node["password"], "ssh", "-o", "StrictHostKeyChecking=no", f'{node["user"]}@{node["ip"]}', cmd], capture_output=True, text=True, timeout=30)
    return result.stdout, result.returncode

def poll_node(name, node):
    try:
        stdout, _ = ssh_cmd(node, "uptime && free -g && docker ps 2>/dev/null | wc -l")
        lines = stdout.strip().split("\n")
        load = lines[0].split("load average:")[-1].strip().split(",")[0] if "load average" in stdout else "0"
        mem_line = [l for l in lines if "Mem:" in l]
        mem_used = 0
        if mem_line:
            parts = mem_line[0].split()
            if len(parts) >= 2:
                try:
                    mem_used = float(parts[1].rstrip("Gi"))
                except Exception:
                    mem_used = 0
        docker_count = int(lines[-1].strip()) if lines else 0
        return {"id": name, "status": "online", "cpu_load": float(load), "memory_used_gb": mem_used, "containers": docker_count - 1, "last_seen": "now"}
    except Exception as exc:
        return {"id": name, "status": "error", "error": str(exc)}

def poll_all():
    for name, node in NODES.items():
        STATUS[name] = poll_node(name, node)

class StatusHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/status":
            poll_all()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(STATUS).encode())
        elif self.path == "/health":
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()
    def log_message(self, format, *args):
        return

poll_all()
server = HTTPServer(("0.0.0.0", 9090), StatusHandler)
server.serve_forever()
PY
