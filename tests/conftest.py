import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

# Tests never call the real API, so fall back to the template when config.py is absent.
if not (ROOT / "config.py").exists():
    spec = importlib.util.spec_from_file_location("config", ROOT / "config.example.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    sys.modules["config"] = module
