import json
import threading
import uuid
from pathlib import Path

_lock = threading.Lock()


def _read(path: Path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return default


def _write(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_list(path: Path):
    with _lock:
        data = _read(path, [])
        return data if isinstance(data, list) else []


def save_list(path: Path, items):
    with _lock:
        _write(path, items)


def load_dict(path: Path):
    with _lock:
        data = _read(path, {})
        return data if isinstance(data, dict) else {}


def save_dict(path: Path, data):
    with _lock:
        _write(path, data)


def new_id():
    return str(uuid.uuid4())
