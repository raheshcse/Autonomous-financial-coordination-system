from sqlalchemy import Boolean, Column, Float, Integer, String

from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)

    vendor_id = Column(String, index=True)
    amount = Column(Float)
    currency = Column(String)

    department = Column(String, index=True)
    category = Column(String)
    country = Column(String)
    payment_method = Column(String)

    risk_level = Column(String, index=True)
    approval_status = Column(String, index=True)

    submitted_by = Column(String)
    submitted_at = Column(String)

    fraud_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    governance_warning_count = Column(Integer, default=0)
    escalation_required = Column(Boolean, default=False)