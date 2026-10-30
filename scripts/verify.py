from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
root = Path(__file__).resolve().parents[1]
report = {'checked_at': datetime.now(timezone.utc).isoformat(),
          'scope': 'Controlled production-entrypoint harness, linter/schema, client helpers and build. Not deployed GenVM, real model consensus, actual money transfer or browser-wallet signing.',
          'source_sha256': hashlib.sha256((root/'contracts/spec_basket.py').read_bytes()).hexdigest(),
          'commands': []}
manifest = json.loads((root/'samples/resources.json').read_text())
for item in manifest['resources']:
    data = (root/f'samples/sources/erc-{item["erc"]}.md').read_bytes()
    assert hashlib.sha256(data).hexdigest() == item['sha256'] and len(data) == item['bytes']
commands = [
    [sys.executable, '-m', 'pytest', '-q', '--tb=short', '-p', 'no:cacheprovider', 'tests'],
    [sys.executable, '-X', 'utf8', '-m', 'genvm_linter.cli', 'check', 'contracts/spec_basket.py'],
    [sys.executable, '-X', 'utf8', '-m', 'genvm_linter.cli', 'schema', 'contracts/spec_basket.py', '-o', 'docs/schema.json'],
    ['node','--check','scripts/live.mjs'],
    ['node','--test','tests/client.test.mjs'],
    ['npm.cmd' if sys.platform=='win32' else 'npm','run','build'],
]
for command in commands:
    print('$', ' '.join(command), flush=True)
    p = subprocess.run(command, cwd=root, capture_output=True, text=True, encoding='utf-8', errors='replace')
    print(p.stdout, end='');print(p.stderr,end='',file=sys.stderr)
    report['commands'].append({'command':command,'exit_code':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
    (root/'docs/local-verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    if p.returncode: raise SystemExit(p.returncode)
