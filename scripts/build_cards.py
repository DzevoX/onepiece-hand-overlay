#!/usr/bin/env python3
"""Build data/cards.json and data/meta.json from a punk-records checkout.

Usage: python scripts/build_cards.py <punk-records-dir> <output-dir> [language]
Skips Leaders and alternate-art versions (ids ending in _p1, _r1, ...).
Only rewrites files when the card data actually changed.
"""
import hashlib
import json
import pathlib
import re
import sys
import time

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])
lang = sys.argv[3] if len(sys.argv) > 3 else "english"
skip = re.compile(r"_[a-z]+\d+$", re.I)

cards, seen = [], set()
for f in sorted((src / lang / "cards").rglob("*.json")):
    if skip.search(f.stem):
        continue
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        print(f"skipping {f}: {e}", file=sys.stderr)
        continue
    for c in data if isinstance(data, list) else [data]:
        if not isinstance(c, dict) or not c.get("id"):
            continue
        if c.get("category") == "Leader" or skip.search(c["id"]) or c["id"] in seen:
            continue
        seen.add(c["id"])
        cards.append({
            "id": c["id"],
            "name": c.get("name", ""),
            "type": c.get("category"),
            "colors": c.get("colors") or [],
            "cost": c.get("cost"),
            "power": c.get("power"),
            "counter": c.get("counter"),
        })

if not cards:
    sys.exit("No cards found - check the punk-records path")

cards.sort(key=lambda c: c["id"])
payload = json.dumps(cards, separators=(",", ":"), ensure_ascii=False)
digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()

out.mkdir(parents=True, exist_ok=True)
meta_path = out / "meta.json"
if meta_path.exists():
    try:
        if json.loads(meta_path.read_text())["sha256"] == digest:
            print(f"No changes ({len(cards)} cards)")
            sys.exit(0)
    except (ValueError, KeyError):
        pass

(out / "cards.json").write_text(payload, encoding="utf-8")
meta_path.write_text(json.dumps({
    "generated_at": int(time.time()),
    "count": len(cards),
    "sha256": digest,
    "language": lang,
    "source": "https://github.com/buhbbl/punk-records",
}, indent=2))
print(f"Wrote {len(cards)} cards")
