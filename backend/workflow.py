from langgraph.graph import END, START, StateGraph

from agents import (
    compliance_agent,
    executive_decision_agent,
    financial_fraud_agent,
    risk_escalation_agent,
    vendor_trust_agent,
)
from state import FinancialWorkflowState


def build_financial_workflow():
    graph = StateGraph(FinancialWorkflowState)

    graph.add_node("VendorTrustAgent", vendor_trust_agent)
    graph.add_node("FinancialFraudAgent", financial_fraud_agent)
    graph.add_node("ComplianceAgent", compliance_agent)
    graph.add_node("RiskEscalationAgent", risk_escalation_agent)
    graph.add_node("ExecutiveDecisionAgent", executive_decision_agent)

    graph.add_edge(START, "VendorTrustAgent")
    graph.add_edge("VendorTrustAgent", "FinancialFraudAgent")
    graph.add_edge("FinancialFraudAgent", "ComplianceAgent")
    graph.add_edge("ComplianceAgent", "RiskEscalationAgent")
    graph.add_edge("RiskEscalationAgent", "ExecutiveDecisionAgent")
    graph.add_edge("ExecutiveDecisionAgent", END)

    return graph.compile()


financial_workflow = build_financial_workflow()