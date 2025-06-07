"""
Agent Framework - Core architecture for Bitebase AI agents.

This module provides the foundation for building modular, extensible agents
with standardized interfaces, error handling, and monitoring capabilities.
"""

import os
import json
import time
import logging
import traceback
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional, Union, Callable
from datetime import datetime
from pathlib import Path

# Import LLM client (will be imported later to avoid circular imports)
LLMClient = None

# Import AIQToolkit integration
try:
    from .aiq_integration import AIQProfiler, AIQEvaluator, AIQLLMClient
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False
    logging.warning("AIQToolkit not available. Advanced profiling and evaluation will be disabled.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class AgentMetrics:
    """Tracks performance metrics for agents."""

    def __init__(self):
        self.start_time = time.time()
        self.end_time = None
        self.success = False
        self.error = None
        self.steps_executed = 0
        self.data_processed = 0
        self.custom_metrics = {}

    def start(self):
        """Start timing the agent execution."""
        self.start_time = time.time()
        return self

    def stop(self, success: bool = True, error: Optional[str] = None):
        """Stop timing the agent execution."""
        self.end_time = time.time()
        self.success = success
        self.error = error
        return self

    def add_custom_metric(self, name: str, value: Any):
        """Add a custom metric."""
        self.custom_metrics[name] = value
        return self

    def increment_step(self):
        """Increment the steps executed counter."""
        self.steps_executed += 1
        return self

    def add_processed_data(self, count: int):
        """Add to the data processed counter."""
        self.data_processed += count
        return self

    @property
    def execution_time(self) -> float:
        """Get the execution time in seconds."""
        if self.end_time is None:
            return time.time() - self.start_time
        return self.end_time - self.start_time

    def to_dict(self) -> Dict[str, Any]:
        """Convert metrics to a dictionary."""
        return {
            "execution_time": self.execution_time,
            "success": self.success,
            "error": self.error,
            "steps_executed": self.steps_executed,
            "data_processed": self.data_processed,
            "custom_metrics": self.custom_metrics,
            "timestamp": datetime.now().isoformat()
        }


class AgentConfig:
    """Configuration manager for agents."""

    def __init__(self, config_path: Optional[str] = None, defaults: Optional[Dict[str, Any]] = None):
        """
        Initialize configuration with defaults and optional file-based config.

        Args:
            config_path: Path to JSON configuration file
            defaults: Default configuration values
        """
        self.config = defaults or {}

        # Load environment variables
        self._load_from_env()

        # Load from file if provided
        if config_path:
            self._load_from_file(config_path)

    def _load_from_env(self):
        """Load configuration from environment variables."""
        # Look for environment variables with BITEBASE_ prefix
        for key, value in os.environ.items():
            if key.startswith("BITEBASE_"):
                # Convert BITEBASE_API_KEY to api_key
                config_key = key[9:].lower()

                # Handle nested keys like BITEBASE_API_KEYS_GOOGLE
                if "_" in config_key:
                    parts = config_key.split("_")
                    current = self.config
                    for part in parts[:-1]:
                        if part not in current:
                            current[part] = {}
                        current = current[part]
                    current[parts[-1]] = value
                else:
                    self.config[config_key] = value

    def _load_from_file(self, config_path: str):
        """Load configuration from a JSON file."""
        try:
            with open(config_path, 'r') as f:
                file_config = json.load(f)
                # Deep merge with existing config
                self._deep_merge(self.config, file_config)
        except Exception as e:
            logging.error(f"Error loading configuration from {config_path}: {str(e)}")

    def _deep_merge(self, target: Dict, source: Dict):
        """Recursively merge source dict into target dict."""
        for key, value in source.items():
            if key in target and isinstance(target[key], dict) and isinstance(value, dict):
                self._deep_merge(target[key], value)
            else:
                target[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        """Get a configuration value."""
        # Handle nested keys like "api_keys.google"
        if "." in key:
            parts = key.split(".")
            current = self.config
            for part in parts:
                if part not in current:
                    return default
                current = current[part]
            return current
        return self.config.get(key, default)

    def set(self, key: str, value: Any):
        """Set a configuration value."""
        # Handle nested keys
        if "." in key:
            parts = key.split(".")
            current = self.config
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = value
        else:
            self.config[key] = value

    def to_dict(self) -> Dict[str, Any]:
        """Get the full configuration as a dictionary."""
        return self.config


class BaseAgent(ABC):
    """Base class for all agents."""

    def __init__(self, config_path: Optional[str] = None, logger_name: Optional[str] = None):
        """
        Initialize the base agent.

        Args:
            config_path: Path to configuration file
            logger_name: Name for the logger
        """
        # Set up logger
        self.logger = logging.getLogger(logger_name or self.__class__.__name__)

        # Set up configuration
        self.config = AgentConfig(config_path, self._get_default_config())

        # Set up metrics
        self.metrics = AgentMetrics()

        # Initialize cache directory
        cache_dir = self.config.get("cache_dir", "cache")
        os.makedirs(cache_dir, exist_ok=True)

        # Initialize AIQ components if available
        self.use_aiq = self.config.get("use_aiq", AIQ_AVAILABLE)
        if self.use_aiq and AIQ_AVAILABLE:
            self.aiq_profiler = AIQProfiler(
                agent_name=logger_name or self.__class__.__name__,
                config=self.config.get("aiq_profiler", {})
            )
            self.aiq_evaluator = AIQEvaluator(
                config=self.config.get("aiq_evaluator", {})
            )
            self.logger.info("AIQToolkit integration enabled")
        else:
            self.aiq_profiler = None
            self.aiq_evaluator = None
            if self.use_aiq:
                self.logger.warning("AIQToolkit requested but not available. Install with 'pip install aiqtoolkit'")

        # Initialize LLM client
        global LLMClient
        if LLMClient is None:
            # Import here to avoid circular imports
            if self.use_aiq and AIQ_AVAILABLE:
                # Use AIQ LLM client if available
                self.llm = AIQLLMClient({
                    "provider": self.config.get("llm.provider", "openai"),
                    "model": self.config.get("llm.model", "gpt-4-turbo"),
                    "temperature": self.config.get("llm.temperature", 0.0),
                    "max_tokens": self.config.get("llm.max_tokens", 4096),
                    "api_keys": {
                        "openai": self.config.get("api_keys.openai", ""),
                        "nim": self.config.get("api_keys.nim", ""),
                        "deepseek": self.config.get("api_keys.deepseek", "")
                    }
                })
            else:
                # Use default LLM client
                from .llm_client import LLMClient as LLMClientClass
                LLMClient = LLMClientClass
                self.llm = LLMClient({
                    "provider": self.config.get("llm.provider", "openai"),
                    "model": self.config.get("llm.model", "gpt-4-turbo"),
                    "temperature": self.config.get("llm.temperature", 0.0),
                    "max_tokens": self.config.get("llm.max_tokens", 4096),
                    "api_keys": {
                        "openai": self.config.get("api_keys.openai", ""),
                        "deepseek": self.config.get("api_keys.deepseek", "")
                    }
                })

    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration values."""
        return {
            "cache_dir": "cache",
            "cache_duration_hours": 24,
            "log_level": "INFO",
            "timeout": 30,
            "max_retries": 3,
            "retry_delay": 1.0,
            "use_aiq": AIQ_AVAILABLE,
            "aiq_profiler": {
                "enabled": True,
                "save_results": True,
                "results_dir": "metrics/aiq"
            },
            "aiq_evaluator": {
                "enabled": True,
                "criteria": ["accuracy", "relevance", "helpfulness"]
            },
            "api_keys": {
                "google_maps": os.environ.get("GOOGLE_MAPS_API_KEY", ""),
                "foodpanda": os.environ.get("FOODPANDA_API_KEY", ""),
                "deepseek": os.environ.get("DEEPSEEK_API_KEY", ""),
                "openai": os.environ.get("OPENAI_API_KEY", ""),
                "nim": os.environ.get("NIM_API_KEY", "")
            },
            "llm": {
                "provider": os.environ.get("LLM_PROVIDER", "openai"),  # openai, deepseek, nim
                "model": os.environ.get("LLM_MODEL", "gpt-4-turbo"),
                "temperature": float(os.environ.get("LLM_TEMPERATURE", "0.0")),
                "max_tokens": int(os.environ.get("LLM_MAX_TOKENS", "4096"))
            }
        }

    @abstractmethod
    def run(self, *args, **kwargs) -> Any:
        """Run the agent. Must be implemented by subclasses."""
        pass

    def execute(self, *args, **kwargs) -> Any:
        """
        Execute the agent with error handling and metrics.

        This is a wrapper around the run method that adds error handling,
        metrics collection, and logging.
        """
        self.metrics.start()
        
        # Start AIQ profiling if available
        if self.use_aiq and AIQ_AVAILABLE and self.aiq_profiler:
            self.aiq_profiler.start_profiling()
        
        self.logger.info(f"Starting {self.__class__.__name__}")

        try:
            result = self.run(*args, **kwargs)
            
            # Evaluate result if available and applicable
            if self.use_aiq and AIQ_AVAILABLE and self.aiq_evaluator:
                if isinstance(result, dict) and "query" in result and "response" in result:
                    eval_results = self.aiq_evaluator.evaluate_response(
                        query=result["query"],
                        response=result["response"],
                        criteria=self.config.get("aiq_evaluator.criteria")
                    )
                    # Add evaluation results to the result
                    result["evaluation"] = eval_results
                    self.metrics.add_custom_metric("evaluation", eval_results)
            
            self.metrics.stop(success=True)
            
            # End AIQ profiling if available
            if self.use_aiq and AIQ_AVAILABLE and self.aiq_profiler:
                aiq_metrics = self.aiq_profiler.end_profiling()
                self.metrics.add_custom_metric("aiq_profiler", aiq_metrics)
                
                # Save profiling results if configured
                if self.config.get("aiq_profiler.save_results", True):
                    results_dir = self.config.get("aiq_profiler.results_dir", "metrics/aiq")
                    os.makedirs(results_dir, exist_ok=True)
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filepath = os.path.join(results_dir, f"{self.__class__.__name__}_{timestamp}.json")
                    self.aiq_profiler.save_profile_results(filepath)
            
            self.logger.info(f"Completed {self.__class__.__name__} in {self.metrics.execution_time:.2f}s")
            return result
        except Exception as e:
            self.metrics.stop(success=False, error=str(e))
            
            # End AIQ profiling if available
            if self.use_aiq and AIQ_AVAILABLE and self.aiq_profiler:
                aiq_metrics = self.aiq_profiler.end_profiling()
                self.metrics.add_custom_metric("aiq_profiler", aiq_metrics)
            
            self.logger.error(f"Error in {self.__class__.__name__}: {str(e)}")
            self.logger.debug(traceback.format_exc())
            raise
        finally:
            # Log metrics
            self._log_metrics()

    def _log_metrics(self):
        """Log the agent metrics."""
        metrics_dict = self.metrics.to_dict()
        self.logger.info(f"Agent metrics: {json.dumps(metrics_dict)}")

        # Save metrics to file if configured
        metrics_dir = self.config.get("metrics_dir")
        if metrics_dir:
            os.makedirs(metrics_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{self.__class__.__name__}_{timestamp}.json"
            filepath = os.path.join(metrics_dir, filename)

            with open(filepath, 'w') as f:
                json.dump(metrics_dict, f, indent=2)
