from typing import Dict, Any
from strands import tool

# Mock Database to track state during testing without affecting production.
MOCK_DB: Dict[str, Dict[str, Any]] = {
    "case_123": {
        "amount": 1023.60,
        "currency": "INR",
        "customer_phone_masked": "+91 98*** 9900",
        "failure_code": "bank_downtime",
        "has_been_looked_up": False,
        "has_been_diagnosed": False,
        "contact_checked": False,
        "call_started": False,
        "outcome_recorded": False,
    },
    "case_456": {
        "amount": 500.00,
        "currency": "INR",
        "customer_phone_masked": "+91 99*** 1122",
        "failure_code": "insufficient_funds",
        "has_been_looked_up": False,
        "has_been_diagnosed": False,
        "contact_checked": False,
        "call_started": False,
        "outcome_recorded": False,
    },
    "CASE-1001": {
        "amount": 2500.00,
        "currency": "INR",
        "customer_phone_masked": "+91 90*** 3344",
        "failure_code": "insufficient_funds",
        "has_been_looked_up": False,
        "has_been_diagnosed": False,
        "contact_checked": False,
        "call_started": False,
        "outcome_recorded": False,
    }
}

@tool
def lookup_payment_case(case_id: str) -> Dict[str, Any]:
    """
    Looks up a payment case by case_id.
    Must be called before diagnosing or starting a recovery call.
    """
    if case_id not in MOCK_DB:
        return {"error": f"Case {case_id} not found."}
    
    case = MOCK_DB[case_id]
    case["has_been_looked_up"] = True
    
    return {
        "case_id": case_id,
        "amount": case["amount"],
        "currency": case["currency"],
        "customer_phone_masked": case["customer_phone_masked"]
    }

@tool
def diagnose_payment_failure(case_id: str) -> Dict[str, Any]:
    """
    Diagnoses the reason for the payment failure.
    Requires lookup_payment_case to be called first.
    """
    if case_id not in MOCK_DB:
        return {"error": f"Case {case_id} not found."}
    
    case = MOCK_DB[case_id]
    if not case["has_been_looked_up"]:
        return {"error": "Case must be looked up first using lookup_payment_case."}
    
    case["has_been_diagnosed"] = True
    reason = case["failure_code"]
    
    recommendation = "Contact customer"
    if reason == "bank_downtime":
        recommendation = "Wait for downtime resolution before contacting."
        
    return {
        "case_id": case_id,
        "failure_reason": reason,
        "recommended_action": recommendation
    }

@tool
def check_customer_contact_status(case_id: str) -> Dict[str, Any]:
    """
    Verifies whether the customer is eligible to be contacted.
    Requires diagnose_payment_failure to be called first.
    """
    if case_id not in MOCK_DB:
        return {"error": f"Case {case_id} not found."}
        
    case = MOCK_DB[case_id]
    if not case["has_been_diagnosed"]:
        return {"error": "Case must be diagnosed first using diagnose_payment_failure."}
        
    case["contact_checked"] = True
    
    is_eligible = True
    if case["failure_code"] == "bank_downtime":
        is_eligible = False
        
    return {
        "case_id": case_id,
        "eligible_for_contact": is_eligible,
        "reason": "Bank downtime active" if not is_eligible else "Eligible"
    }

@tool
def start_recovery_call(case_id: str) -> Dict[str, Any]:
    """
    Initiates a recovery call to the customer.
    Requires lookup, diagnosis, and contact status check to be completed.
    Blocks duplicate calls.
    """
    if case_id not in MOCK_DB:
        return {"error": f"Case {case_id} not found."}
        
    case = MOCK_DB[case_id]
    if not case["has_been_looked_up"]:
        return {"error": "Cannot start call: Case must be looked up first."}
    if not case["has_been_diagnosed"]:
        return {"error": "Cannot start call: Case must be diagnosed first."}
    if not case["contact_checked"]:
        return {"error": "Cannot start call: Contact status must be checked first."}
        
    if case["call_started"]:
        return {"error": "A recovery call has already been initiated for this case."}
        
    case["call_started"] = True
    return {
        "case_id": case_id,
        "call_status": "started",
        "mock_call_id": f"mock_call_{case_id}_999"
    }

@tool
def record_recovery_outcome(case_id: str, outcome: str) -> Dict[str, Any]:
    """
    Records the outcome of the recovery process.
    """
    if case_id not in MOCK_DB:
        return {"error": f"Case {case_id} not found."}
        
    case = MOCK_DB[case_id]
    case["outcome_recorded"] = True
    
    return {
        "case_id": case_id,
        "recorded_outcome": outcome,
        "status": "success"
    }
