import os
import asyncio

# Prevent OpenTelemetry from generating logs/traces locally
os.environ["OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED"] = "false"
os.environ["OTEL_PYTHON_LOG_LEVEL"] = "error"
os.environ["OTEL_TRACES_EXPORTER"] = "none"
os.environ["OTEL_METRICS_EXPORTER"] = "none"

from main import get_agent

async def main():
    print("\n🚀 Initializing Agent...")
    try:
        # We'll use Haiku locally since it's the easiest model to get access to
        # Make sure you requested model access to Claude 3 Haiku in us-east-1!
        os.environ["BEDROCK_MODEL_ID"] = "amazon.nova-lite-v1:0"
        
        agent = get_agent()
        
        prompt = "Analyze failed payment case CASE-1001 in mock mode."
        print(f"\n🗣️  Prompt: {prompt}\n")
        print("-" * 50)
        
        # We will stream the response back so you can see it working in real-time!
        async for chunk in agent.stream_async(prompt):
            if "content" in chunk and chunk["content"]:
                print(chunk["content"], end="", flush=True)
                
        print("\n" + "-" * 50)
        print("\n✅ Execution complete!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Make sure you:")
        print("1. Ran 'aws configure' with your new IAM User access keys")
        print("2. Set your region to 'us-east-1'")
        print("3. Requested 'Model Access' for Claude 3 Haiku in the AWS Bedrock Console")

if __name__ == "__main__":
    asyncio.run(main())
