from logger import add_audit_event


def vendor_trust_agent(state):
    transaction = state["transaction"]

    risk_level = transaction.get("risk_level", "low")

    if risk_level == "critical":
        trust_score = 0.25
        trust_status = "low_trust"
        warning = "DC-S7 risk: downstream agents may over-trust a high-risk vendor."
    elif risk_level == "high":
        trust_score = 0.45
        trust_status = "watchlist"
        warning = "Vendor trust requires review before approval."
    else:
        trust_score = 0.82
        trust_status = "trusted"
        warning = None

    state["vendor_trust"] = {
        "trust_score": trust_score,
        "trust_status": trust_status,
    }

    state["confidence_scores"]["VendorTrustAgent"] = trust_score

    if warning:
        state["governance_warnings"].append(warning)

    return add_audit_event(
        state,
        "VendorTrustAgent",
        trust_status,
        trust_score,
        f"Vendor trust evaluated from risk level: {risk_level}",
    )


def financial_fraud_agent(state):
    transaction = state["transaction"]
    amount = transaction.get("amount", 0)
    payment_method = transaction.get("payment_method", "")

    fraud_score = 0.15

    if amount > 500000:
        fraud_score += 0.45

    if payment_method in ["SWIFT", "Wire Transfer"]:
        fraud_score += 0.2

    fraud_score = min(fraud_score, 1.0)

    if fraud_score >= 0.7:
        fraud_status = "high_fraud_risk"
        state["governance_warnings"].append(
            "DC-I3 risk: fraud score may influence downstream approval without validation."
        )
    elif fraud_score >= 0.4:
        fraud_status = "medium_fraud_risk"
    else:
        fraud_status = "low_fraud_risk"

    state["fraud_analysis"] = {
        "fraud_score": fraud_score,
        "fraud_status": fraud_status,
    }

    state["confidence_scores"]["FinancialFraudAgent"] = round(1 - fraud_score, 2)

    return add_audit_event(
        state,
        "FinancialFraudAgent",
        fraud_status,
        round(1 - fraud_score, 2),
        f"Fraud score calculated from amount {amount} and payment method {payment_method}",
    )


def compliance_agent(state):
    transaction = state["transaction"]
    country = transaction.get("country", "")

    high_risk_countries = ["United Arab Emirates"]

    if country in high_risk_countries:
        compliance_status = "requires_manual_review"
        confidence = 0.56
        state["governance_warnings"].append(
            "DC-T1 risk: transaction requires external compliance validation."
        )
    else:
        compliance_status = "compliant"
        confidence = 0.88

    state["compliance_result"] = {
        "country": country,
        "status": compliance_status,
    }

    state["confidence_scores"]["ComplianceAgent"] = confidence

    return add_audit_event(
        state,
        "ComplianceAgent",
        compliance_status,
        confidence,
        f"Compliance checked for country: {country}",
    )


def risk_escalation_agent(state):
    fraud_score = state["fraud_analysis"]["fraud_score"]
    trust_score = state["vendor_trust"]["trust_score"]
    compliance_status = state["compliance_result"]["status"]

    escalate = (
        fraud_score >= 0.7
        or trust_score <= 0.4
        or compliance_status == "requires_manual_review"
    )

    if escalate:
        result = "escalated"
        assigned_to = "Financial Risk Committee"
        confidence = 0.84
        state["governance_warnings"].append(
            "DC-S4 risk: escalation path may diverge if agents repeatedly trigger review."
        )
    else:
        result = "not_escalated"
        assigned_to = None
        confidence = 0.9

    state["escalation_result"] = {
        "result": result,
        "assigned_to": assigned_to,
    }

    state["confidence_scores"]["RiskEscalationAgent"] = confidence

    return add_audit_event(
        state,
        "RiskEscalationAgent",
        result,
        confidence,
        "Escalation decision based on fraud, trust, and compliance signals.",
    )


def executive_decision_agent(state):
    escalation_result = state["escalation_result"]["result"]
    fraud_score = state["fraud_analysis"]["fraud_score"]
    trust_score = state["vendor_trust"]["trust_score"]

    if escalation_result == "escalated":
        decision = "manual_review_required"
        confidence = 0.76
    elif fraud_score < 0.4 and trust_score > 0.7:
        decision = "approved"
        confidence = 0.91
    else:
        decision = "rejected"
        confidence = 0.68

    state["executive_decision"] = {
        "decision": decision,
        "reason": "Final decision generated after multi-agent coordination.",
    }

    state["confidence_scores"]["ExecutiveDecisionAgent"] = confidence

    return add_audit_event(
        state,
        "ExecutiveDecisionAgent",
        decision,
        confidence,
        "Final decision produced from combined agent outputs.",
    )