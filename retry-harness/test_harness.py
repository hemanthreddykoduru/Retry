import unittest
import sys
import os

from payment_tools import (
    lookup_payment_case,
    diagnose_payment_failure,
    check_customer_contact_status,
    start_recovery_call,
    record_recovery_outcome,
    MOCK_DB
)
from steering_handlers import RateLimiterHook, WorkflowEnforcementHook
from strands.types.tools import ToolUse

class TestPaymentTools(unittest.TestCase):
    def setUp(self):
        # Reset state
        MOCK_DB["case_123"]["has_been_looked_up"] = False
        MOCK_DB["case_123"]["has_been_diagnosed"] = False
        MOCK_DB["case_123"]["contact_checked"] = False
        MOCK_DB["case_123"]["call_started"] = False
        MOCK_DB["case_123"]["outcome_recorded"] = False
        
        MOCK_DB["case_456"]["has_been_looked_up"] = False
        MOCK_DB["case_456"]["has_been_diagnosed"] = False
        MOCK_DB["case_456"]["contact_checked"] = False
        MOCK_DB["case_456"]["call_started"] = False
        MOCK_DB["case_456"]["outcome_recorded"] = False

    def test_workflow(self):
        # 1. Normal lookup
        res1 = lookup_payment_case("case_123")
        self.assertIn("amount", res1)
        self.assertNotIn("error", res1)
        
        # 2. Diagnosis works
        res2 = diagnose_payment_failure("case_123")
        self.assertIn("failure_reason", res2)
        
        # 3. Blocked before contact check
        res3 = start_recovery_call("case_123")
        self.assertIn("error", res3)
        self.assertEqual(res3["error"], "Cannot start call: Contact status must be checked first.")
        
        # 4. Check contact status
        res4 = check_customer_contact_status("case_123")
        self.assertIn("eligible_for_contact", res4)
        
        # 5. Recovery call succeeds in mock mode
        res5 = start_recovery_call("case_123")
        self.assertIn("mock_call_id", res5)
        
        # 6. Duplicate recovery blocked
        res6 = start_recovery_call("case_123")
        self.assertIn("error", res6)
        
    def test_blocks_out_of_order(self):
        # Attempt call before anything
        res = start_recovery_call("case_456")
        self.assertIn("error", res)
        self.assertEqual(res["error"], "Cannot start call: Case must be looked up first.")
        
        lookup_payment_case("case_456")
        res = start_recovery_call("case_456")
        self.assertIn("error", res)
        self.assertEqual(res["error"], "Cannot start call: Case must be diagnosed first.")

class TestHooks(unittest.TestCase):
    def test_rate_limiter(self):
        hook = RateLimiterHook(max_calls_per_tool=2)
        tool_use = {"id": "call_1", "name": "lookup_payment_case", "input": {"case_id": "case_123"}}
        
        class MockEvent:
            def __init__(self, tool_use):
                self.tool_use = tool_use
                self.cancel_tool = False
                
        event1 = MockEvent(tool_use)
        hook.before_tool_use(event1)
        self.assertFalse(event1.cancel_tool)
        
        event2 = MockEvent(tool_use)
        hook.before_tool_use(event2)
        self.assertFalse(event2.cancel_tool)
        
        event3 = MockEvent(tool_use)
        hook.before_tool_use(event3)
        self.assertTrue(bool(event3.cancel_tool))
        self.assertIn("Rate limit exceeded", str(event3.cancel_tool))

    def test_workflow_enforcement(self):
        hook = WorkflowEnforcementHook()
        
        class MockEvent:
            def __init__(self, name):
                self.tool_use = {"id": "test", "name": name, "input": {}}
                self.cancel_tool = False
        
        # Out of order: diagnose first
        event_diag = MockEvent("diagnose_payment_failure")
        hook.before_tool_use(event_diag)
        self.assertTrue(bool(event_diag.cancel_tool))
        self.assertIn("Must call lookup_payment_case", str(event_diag.cancel_tool))
        
        # Proper order
        event_lookup = MockEvent("lookup_payment_case")
        hook.before_tool_use(event_lookup)
        self.assertFalse(event_lookup.cancel_tool)
        
        event_diag2 = MockEvent("diagnose_payment_failure")
        hook.before_tool_use(event_diag2)
        self.assertFalse(event_diag2.cancel_tool)
        
        event_check = MockEvent("check_customer_contact_status")
        hook.before_tool_use(event_check)
        self.assertFalse(event_check.cancel_tool)
        
        event_call = MockEvent("start_recovery_call")
        hook.before_tool_use(event_call)
        self.assertFalse(event_call.cancel_tool)
        
        event_call2 = MockEvent("start_recovery_call")
        hook.before_tool_use(event_call2)
        self.assertTrue(bool(event_call2.cancel_tool))
        self.assertIn("Duplicate recovery calls", str(event_call2.cancel_tool))

if __name__ == "__main__":
    unittest.main()
