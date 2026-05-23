from integrations import load_financial_transactions
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import uuid4
from workflow import financial_workflow
from database import Base, engine, get_db
from models import Transaction
from schemas import TransactionCreate, TransactionResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Autonomous Financial Coordination System",
    description="Full-stack AI multi-agent financial coordination and governance platform.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
@app.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()


@app.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


@app.post("/transactions", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


@app.patch("/transactions/{transaction_id}/status", response_model=TransactionResponse)
def update_transaction_status(
    transaction_id: str,
    approval_status: str,
    db: Session = Depends(get_db)
):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.approval_status = approval_status
    db.commit()         
    db.refresh(transaction)

    return transaction

@app.get("/")
def root():
    return {
        "message": "Autonomous Financial Coordination System API is running",
        "docs": "https://autonomous-financial-coordination-backend.onrender.com",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Autonomous Financial Coordination System",
    }

@app.get("/transactions")
def get_transactions():
    transactions = load_financial_transactions()

    return {
        "total_transactions": len(transactions),
        "transactions": transactions
    }
@app.get("/analytics/risk-summary")
def risk_summary(db: Session = Depends(get_db)):
    results = (
        db.query(Transaction.risk_level, func.count(Transaction.id))
        .group_by(Transaction.risk_level)
        .all()
    )

    return [
        {"risk_level": risk_level, "count": count}
        for risk_level, count in results
    ]


@app.get("/analytics/department-spend")
def department_spend(db: Session = Depends(get_db)):
    results = (
        db.query(Transaction.department, func.sum(Transaction.amount))
        .group_by(Transaction.department)
        .all()
    )

    return [
        {"department": department, "total_spend": total_spend}
        for department, total_spend in results
    ]


@app.get("/analytics/status-summary")
def status_summary(db: Session = Depends(get_db)):
    results = (
        db.query(Transaction.approval_status, func.count(Transaction.id))
        .group_by(Transaction.approval_status)
        .all()
    )

    return [
        {"approval_status": status, "count": count}
        for status, count in results
    ]
@app.post("/run-financial-coordination/{transaction_id}")
def run_financial_coordination(
    transaction_id: str,
    db: Session = Depends(get_db),
):
    transaction = (
        db.query(Transaction)
        .filter(Transaction.transaction_id == transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction_data = {
        "transaction_id": transaction.transaction_id,
        "vendor_id": transaction.vendor_id,
        "amount": transaction.amount,
        "currency": transaction.currency,
        "department": transaction.department,
        "category": transaction.category,
        "country": transaction.country,
        "payment_method": transaction.payment_method,
        "risk_level": transaction.risk_level,
        "approval_status": transaction.approval_status,
        "submitted_by": transaction.submitted_by,
        "submitted_at": transaction.submitted_at,
    }

    initial_state = {
        "workflow_id": f"wf-{uuid4()}",
        "transaction_id": transaction_id,
        "transaction": transaction_data,
        "vendor_trust": {},
        "fraud_analysis": {},
        "compliance_result": {},
        "escalation_result": {},
        "executive_decision": {},
        "governance_warnings": [],
        "confidence_scores": {},
        "audit_trail": [],
    }

    final_state = financial_workflow.invoke(initial_state)

    transaction.fraud_score = final_state["fraud_analysis"]["fraud_score"]
    transaction.risk_score = 1 - final_state["vendor_trust"]["trust_score"]
    transaction.governance_warning_count = len(final_state["governance_warnings"])
    transaction.escalation_required = (
        final_state["escalation_result"]["result"] == "escalated"
    )
    transaction.approval_status = final_state["executive_decision"]["decision"]

    db.commit()
    db.refresh(transaction)

    return {
        "workflow_id": final_state["workflow_id"],
        "transaction_id": transaction_id,
        "vendor_trust": final_state["vendor_trust"],
        "fraud_analysis": final_state["fraud_analysis"],
        "compliance_result": final_state["compliance_result"],
        "escalation_result": final_state["escalation_result"],
        "executive_decision": final_state["executive_decision"],
        "governance_warnings": final_state["governance_warnings"],
        "confidence_scores": final_state["confidence_scores"],
        "audit_trail": final_state["audit_trail"],
    }