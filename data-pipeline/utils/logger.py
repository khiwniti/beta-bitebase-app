"""
Logging utilities for the data pipeline
"""
import sys
from pathlib import Path
from loguru import logger
from config.settings import settings

def setup_logger(name: str = "data_pipeline") -> logger:
    """
    Setup logger with file and console handlers
    """
    # Remove default handler
    logger.remove()
    
    # Console handler
    if settings.logging.log_to_console:
        logger.add(
            sys.stdout,
            format=settings.logging.format,
            level=settings.logging.level,
            colorize=True
        )
    
    # File handler
    if settings.logging.log_to_file:
        log_file = settings.logs_dir / f"{name}.log"
        logger.add(
            log_file,
            format=settings.logging.format,
            level=settings.logging.level,
            rotation=settings.logging.rotation,
            retention=settings.logging.retention,
            compression="zip"
        )
    
    return logger

def get_logger(name: str) -> logger:
    """Get logger instance for a specific module"""
    return setup_logger(name)