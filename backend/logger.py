from datetime import datetime, timezone


def add_audit_event(state, agent_name, decision, confidence, notes):
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent": agent_name,
        "decision": decision,
        "confidence": confidence,
        "notes": notes,
    }

    state["audit_trail"].append(event)
    return state