"""
AIQToolkit Integration - Integration with NVIDIA's AIQToolkit for agent evaluation and profiling.

This module provides integration with NVIDIA's AIQToolkit to enhance the agent framework
with advanced evaluation, profiling, and LLM capabilities.
"""

import os
import logging
from typing import Dict, List, Any, Optional, Union, Callable, AsyncGenerator
import time
from datetime import datetime

logger = logging.getLogger("AIQIntegration")

# Flag to track if AIQToolkit is available
AIQ_AVAILABLE = False

# Try to import AIQToolkit components
try:
    from aiq.profiler.profile_runner import ProfilerRunner
    from aiq.profiler.callbacks.langchain_callback_handler import LangchainProfilerHandler
    # Add other imports as needed
    AIQ_AVAILABLE = True
    logger.info("AIQToolkit is available")
except ImportError as e:
    logger.warning(f"AIQToolkit not available or has incompatible API: {str(e)}")
    logger.warning("Advanced profiling and evaluation will be disabled")

class AIQProfiler:
    """
    Profiler for agent execution using AIQToolkit.
    
    This class provides advanced profiling capabilities for agent execution,
    including performance metrics, token usage, and execution time analysis.
    """
    
    def __init__(self, agent_name: str, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the AIQ Profiler.
        
        Args:
            agent_name: Name of the agent being profiled
            config: Configuration for the profiler
        """
        self.agent_name = agent_name
        self.config = config or {}
        self.metrics = {}
        self.start_time = None
        self.end_time = None
        
        # Initialize AIQToolkit components if available
        if AIQ_AVAILABLE:
            try:
                self.profile_runner = ProfilerRunner()
                self.callback_handler = LangchainProfilerHandler()
                logger.debug(f"AIQProfiler initialized for agent: {agent_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize AIQProfiler components: {str(e)}")
        
    def start_profiling(self):
        """Start profiling the agent execution."""
        self.start_time = time.time()
        
        if AIQ_AVAILABLE:
            try:
                self.profile_runner.start_profiling()
                logger.info(f"Started AIQ profiling for agent: {self.agent_name}")
            except Exception as e:
                logger.warning(f"Failed to start AIQ profiling: {str(e)}")
        
        return self
        
    def end_profiling(self):
        """End profiling and collect metrics."""
        self.end_time = time.time()
        execution_time = self.end_time - self.start_time
        
        # Default metrics
        self.metrics = {
            "execution_time": execution_time,
            "timestamp": datetime.now().isoformat()
        }
        
        if AIQ_AVAILABLE:
            try:
                profile_results = self.profile_runner.end_profiling()
                
                # Extract key metrics
                self.metrics.update({
                    "token_usage": profile_results.get("token_usage", {}),
                    "calls_count": profile_results.get("llm_calls_count", 0),
                    "average_latency": profile_results.get("average_latency_ms", 0)
                })
                
                logger.info(f"Ended AIQ profiling for agent: {self.agent_name}")
            except Exception as e:
                logger.warning(f"Failed to end AIQ profiling: {str(e)}")
        
        logger.debug(f"Profiling metrics: {self.metrics}")
        return self.metrics
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get the collected profiling metrics."""
        return self.metrics
    
    def save_profile_results(self, filepath: str):
        """
        Save profiling results to a file.
        
        Args:
            filepath: Path to save the results
        """
        import json
        
        try:
            with open(filepath, 'w') as f:
                json.dump(self.metrics, f, indent=2)
            logger.info(f"Saved profiling results to {filepath}")
        except Exception as e:
            logger.error(f"Error saving profiling results: {str(e)}")


class AIQEvaluator:
    """
    Evaluator for agent outputs using AIQToolkit.
    
    This class provides evaluation capabilities for agent outputs,
    including accuracy, relevance, and helpfulness metrics.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the AIQ Evaluator.
        
        Args:
            config: Configuration for the evaluator
        """
        self.config = config or {}
        self.evaluation_results = {}
        
        # Initialize AIQToolkit components if available
        if AIQ_AVAILABLE:
            try:
                from aiq.eval.evaluator import Evaluator
                self.evaluator = Evaluator()
                logger.debug("AIQEvaluator initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize AIQEvaluator: {str(e)}")
        
    def evaluate_response(self, 
                         query: str, 
                         response: str, 
                         criteria: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Evaluate an agent response against a query.
        
        Args:
            query: The original query
            response: The agent's response
            criteria: List of evaluation criteria (default: accuracy, relevance, helpfulness)
            
        Returns:
            Evaluation results
        """
        criteria = criteria or ["accuracy", "relevance", "helpfulness"]
        
        # Default results if AIQToolkit is not available
        results = {criterion: 0.5 for criterion in criteria}
        results["overall"] = 0.5
        
        if AIQ_AVAILABLE and hasattr(self, 'evaluator'):
            try:
                for criterion in criteria:
                    score = self.evaluator.evaluate(
                        criterion=criterion,
                        query=query,
                        response=response
                    )
                    results[criterion] = score
                
                # Calculate overall score
                results["overall"] = sum(results.values()) / len(results)
                logger.debug(f"AIQ evaluation results: {results}")
            except Exception as e:
                logger.warning(f"Error during AIQ evaluation: {str(e)}")
            
        self.evaluation_results = results
        return results
    
    def get_evaluation_results(self) -> Dict[str, Any]:
        """Get the evaluation results."""
        return self.evaluation_results


class AIQLLMClient:
    """
    Enhanced LLM client using AIQToolkit's LLM implementations.
    
    This class provides an enhanced LLM client with better performance,
    optimization, and metrics collection.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the AIQ LLM Client.
        
        Args:
            config: Configuration for the LLM client
        """
        self.config = config or {}
        self.provider = self.config.get("provider", "openai")
        self.llm = None
        
        # Initialize the appropriate LLM if AIQToolkit is available
        if AIQ_AVAILABLE:
            try:
                if self.provider == "openai":
                    from aiq.llm.openai_llm import OpenAILLM
                    self.llm = OpenAILLM(
                        model=self.config.get("model", "gpt-4-turbo"),
                        api_key=self.config.get("api_keys", {}).get("openai", os.environ.get("OPENAI_API_KEY", ""))
                    )
                elif self.provider == "nim":
                    from aiq.llm.nim_llm import NimLLM
                    self.llm = NimLLM(
                        model=self.config.get("model", "meta-llama-3-70b-instruct"),
                        api_key=self.config.get("api_keys", {}).get("nim", os.environ.get("NIM_API_KEY", ""))
                    )
                else:
                    logger.warning(f"Unsupported LLM provider: {self.provider}")
                    
                logger.info(f"Initialized AIQ LLM Client with provider: {self.provider}")
            except Exception as e:
                logger.warning(f"Failed to initialize AIQLLMClient: {str(e)}")
    
    def chat_completion(self, 
                       messages: List[Dict[str, str]], 
                       temperature: Optional[float] = None,
                       max_tokens: Optional[int] = None) -> Dict[str, Any]:
        """
        Get a chat completion from the LLM.
        
        Args:
            messages: List of chat messages
            temperature: Temperature for generation
            max_tokens: Maximum tokens to generate
            
        Returns:
            Chat completion response
        """
        if not AIQ_AVAILABLE or not self.llm:
            raise ValueError("AIQToolkit LLM not available. Use regular LLM client instead.")
            
        # Override config with provided parameters if specified
        params = {
            "temperature": temperature if temperature is not None else self.config.get("temperature", 0.0),
            "max_tokens": max_tokens if max_tokens is not None else self.config.get("max_tokens", 4096)
        }
        
        try:
            response = self.llm.chat_completion(
                messages=messages,
                **params
            )
            return response
        except Exception as e:
            logger.error(f"Error in chat completion: {str(e)}")
            raise
    
    async def stream_chat_completion(self, 
                                   messages: List[Dict[str, str]],
                                   temperature: Optional[float] = None,
                                   max_tokens: Optional[int] = None) -> AsyncGenerator[str, None]:
        """
        Stream a chat completion from the LLM.
        
        Args:
            messages: List of chat messages
            temperature: Temperature for generation
            max_tokens: Maximum tokens to generate
            
        Yields:
            Chat completion chunks
        """
        if not AIQ_AVAILABLE or not self.llm:
            raise ValueError("AIQToolkit LLM not available. Use regular LLM client instead.")
            
        # Override config with provided parameters if specified
        params = {
            "temperature": temperature if temperature is not None else self.config.get("temperature", 0.0),
            "max_tokens": max_tokens if max_tokens is not None else self.config.get("max_tokens", 4096)
        }
        
        try:
            async for chunk in self.llm.stream_chat_completion(
                messages=messages,
                **params
            ):
                yield chunk
        except Exception as e:
            logger.error(f"Error in streaming chat completion: {str(e)}")
            raise 