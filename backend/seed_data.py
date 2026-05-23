import json
from pathlib import Path

from database import Base, SessionLocal, engine
from models import Transaction


BASE_DIR = Path(__file__).resolve().parent.parent
MOCK_DATA_PATH = BASE_DIR / "mock-data" / "financial-transactions.json"


def seed_transactions():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_count = db.query(Transaction).count()

        if existing_count > 0:
            print("Database already seeded.")
            return

        with open(MOCK_DATA_PATH, "r", encoding="utf-8") as file:
            transactions = json.load(file)

        for item in transactions:
            transaction = Transaction(
                transaction_id=item["transaction_id"],
                vendor_id=item["vendor_id"],
                amount=item["amount"],
                currency=item["currency"],
                department=item["department"],
                category=item["category"],
                country=item["country"],
                payment_method=item["payment_method"],
                risk_level=item["risk_level"],
                approval_status=item["approval_status"],
                submitted_by=item["submitted_by"],
                submitted_at=item["submitted_at"],
                fraud_score=item.get("fraud_score", 0.0),
                risk_score=item.get("risk_score", 0.0),
                governance_warning_count=item.get("governance_warning_count", 0),
                escalation_required=item.get("escalation_required", False),
            )

            db.add(transaction)

        db.commit()
        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_transactions()