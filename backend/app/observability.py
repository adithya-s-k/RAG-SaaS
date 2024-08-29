import os
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from opentelemetry import trace as trace_api
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk import trace as trace_sdk
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from dotenv import load_dotenv

load_dotenv()


def init_observability():
    ARIZE_PHOENIX_ENDPOINT = os.getenv("ARIZE_PHOENIX_ENDPOINT")
    if ARIZE_PHOENIX_ENDPOINT:
        try:
            if ARIZE_PHOENIX_ENDPOINT and "/v1/traces" in ARIZE_PHOENIX_ENDPOINT:
                PHOENIX_ENDPOINT_TRACE_ENDPOINT = ARIZE_PHOENIX_ENDPOINT
            else:
                PHOENIX_ENDPOINT_TRACE_ENDPOINT = f"{ARIZE_PHOENIX_ENDPOINT}/v1/traces"
            resource = Resource(attributes={})
            tracer_provider = trace_sdk.TracerProvider(resource=resource)
            span_exporter = OTLPSpanExporter(endpoint=PHOENIX_ENDPOINT_TRACE_ENDPOINT)
            span_processor = SimpleSpanProcessor(span_exporter=span_exporter)
            tracer_provider.add_span_processor(span_processor=span_processor)
            trace_api.set_tracer_provider(tracer_provider=tracer_provider)
            LlamaIndexInstrumentor().instrument()
            print("🔭 ARIZE PHOENIX - Set up complete")
        except Exception as e:
            print("Wasnt able to set up Arize Phoenix", e)
    else:
        print("Arize Phoenix API Endpoint Not provided")
