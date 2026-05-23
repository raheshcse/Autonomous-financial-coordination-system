from typing import Any, Dict, List, TypedDict


class FinancialWorkflowState(TypedDict):
    workflow_id: str
    transaction_id: str
    transaction: Dict[str, Any]

    vendor_trust: Dict[str, Any]
    fraud_analysis: Dict[str, Any]
    compliance_result: Dict[str, Any]
    escalation_result: Dict[str, Any]
    executive_decision: Dict[str, Any]

    governance_warnings: List[str]
    confidence_scores: Dict[str, float]
    audit_trail: List[Dict[str, Any]]