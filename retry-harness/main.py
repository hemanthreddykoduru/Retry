import os
import json
from typing import Dict, Any

# 1. Keep module-level imports lightweight.
from bedrock_agentcore import BedrockAgentCoreApp

# Ensure the BedrockAgentCoreApp object and @app.entrypoint are defined correctly.
app = BedrockAgentCoreApp()

SYSTEM_PROMPT = """
You are a specialized AI assistant for the Retry payment recovery platform.
You are responsible for safely recovering failed payments by analyzing cases, diagnosing issues, and taking authorized actions.

Core Principles:
1. Safety First: You are dealing with financial events. Be extremely careful.
2. Confidentiality: Never request sensitive information like OTPs, CVVs, UPI PINs, passwords, or bank credentials. Never output unmasked financial data.
3. Workflow Compliance: You must follow this strict sequence:
   Step 1: Look up the payment case.
   Step 2: Diagnose the payment failure.
   Step 3: Check the customer contact status.
   Step 4: Start the recovery call (only if eligible and approved).
   Step 5: Record the recovery outcome.
4. Transparency: Be explicit about uncertainty. You cannot promise successful payment recovery, only that you will attempt contact.

Rules:
- You must use tools to perform these actions.
- Do not make assumptions about case data.
- If a tool returns an error (e.g., call blocked), explain the reason to the user and ask how to proceed or recommend corrective action.
"""

def get_agent():
    # 4. Construct the Strands Agent lazily inside get_agent()
    from strands import Agent
    from strands.models.bedrock import BedrockModel
    
    from payment_tools import (
        lookup_payment_case,
        diagnose_payment_failure,
        check_customer_contact_status,
        start_recovery_call,
        record_recovery_outcome
    )
    from steering_handlers import RateLimiterHook, WorkflowEnforcementHook

    # We use Claude 3 Haiku or Sonnet through Bedrock
    model_id = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")
    model = BedrockModel(model_id=model_id)
    
    rate_limiter = RateLimiterHook(max_calls_per_tool=3)
    workflow_enforcer = WorkflowEnforcementHook()
    
    agent = Agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=[
            lookup_payment_case,
            diagnose_payment_failure,
            check_customer_contact_status,
            start_recovery_call,
            record_recovery_outcome
        ],
        hooks=[rate_limiter, workflow_enforcer]
    )
    return agent

@app.entrypoint
def handle_invoke(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    # Lazy import to avoid loading it globally
    from payment_tools import MOCK_DB
    
    prompt = event.get("prompt")
    if not prompt:
        return {"error": "Missing 'prompt' in payload."}
        
    case_id = event.get("case_id")
    
    # Prepend case_id to prompt if provided
    full_prompt = f"Case ID: {case_id}\n\n{prompt}" if case_id else prompt
    
    agent = get_agent()
    response = agent.invoke(full_prompt)
    
    return {
        "response": response.content,
        "mock_db_state": MOCK_DB.get(case_id) if case_id else None
    }

if __name__ == "__main__":
    from payment_tools import MOCK_DB
    
    # Local execution testing
    print("Initializing local agent test...")
    agent = get_agent()
    test_prompt = "Can you process case_123 for me? Please follow the full workflow."
    print(f"User: {test_prompt}")
    
    try:
        response = agent.invoke(test_prompt)
        print(f"Agent: {response.content}")
        print("\nFinal Mock DB State for case_123:", json.dumps(MOCK_DB["case_123"], indent=2))
    except Exception as e:
        print(f"Error during local execution: {e}")
