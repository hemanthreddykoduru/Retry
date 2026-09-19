from typing import Any, Dict, List
from strands.hooks import HookProvider, HookRegistry, BeforeToolCallEvent

class RateLimiterHook(HookProvider):
    def __init__(self, max_calls_per_tool: int = 3):
        self.max_calls_per_tool = max_calls_per_tool
        self.tool_calls: Dict[str, int] = {}
        
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeToolCallEvent, self.before_tool_use)
        
    def before_tool_use(self, event: BeforeToolCallEvent) -> Any:
        tool_name = event.tool_use["name"]
        
        self.tool_calls[tool_name] = self.tool_calls.get(tool_name, 0) + 1
        
        if self.tool_calls[tool_name] > self.max_calls_per_tool:
            event.cancel_tool = f"Rate limit exceeded: Tool '{tool_name}' has been called more than {self.max_calls_per_tool} times. Stop calling this tool."

class WorkflowEnforcementHook(HookProvider):
    """
    Enforces the deterministic execution order:
    lookup_payment_case -> diagnose_payment_failure -> check_customer_contact_status -> start_recovery_call -> record_recovery_outcome
    """
    def __init__(self):
        self.called_tools: List[str] = []

    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeToolCallEvent, self.before_tool_use)

    def before_tool_use(self, event: BeforeToolCallEvent) -> Any:
        tool_name = event.tool_use["name"]
        
        if tool_name == "diagnose_payment_failure":
            if "lookup_payment_case" not in self.called_tools:
                event.cancel_tool = "Workflow error: Must call lookup_payment_case before diagnose_payment_failure."
                
        elif tool_name == "check_customer_contact_status":
            if "diagnose_payment_failure" not in self.called_tools:
                event.cancel_tool = "Workflow error: Must call diagnose_payment_failure before check_customer_contact_status."
                
        elif tool_name == "start_recovery_call":
            if "check_customer_contact_status" not in self.called_tools:
                event.cancel_tool = "Workflow error: Must call check_customer_contact_status before start_recovery_call."
            elif "start_recovery_call" in self.called_tools:
                event.cancel_tool = "Workflow error: Duplicate recovery calls are blocked."
                
        elif tool_name == "record_recovery_outcome":
            # outcome can potentially be recorded if call was started or contact was ineligible
            pass
            
        self.called_tools.append(tool_name)
