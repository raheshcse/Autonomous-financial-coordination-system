import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MOCK_DATA_DIR = BASE_DIR / "mock-data"


def load_financial_transactions():
    file_path = MOCK_DATA_DIR / "financial-transactions.json"

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)