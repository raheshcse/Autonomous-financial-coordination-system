from pydantic import BaseModel
from typing import Optional


class TransactionBase(BaseModel):
    transaction_id: str
    vendor_id: str
    amount: float
    currency: str

    department: str
    category: str
    country: str
    payment_method: str

    risk_level: str
    approval_status: str

    submitted_by: str
    submitted_at: str

    fraud_score: Optional[float] = 0.0
    risk_score: Optional[float] = 0.0
    governance_warning_count: Optional[int] = 0
    escalation_required: Optional[bool] = False


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int

    class Config:
        from_attributes = True