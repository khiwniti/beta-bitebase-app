"""
API Client - Unified client for making API requests with rate limiting, retries, and caching.

This module provides a standardized way to interact with external APIs,
handling common concerns like rate limiting, retries, error handling, and caching.
"""

import os
import json
import time
import logging
import hashlib
import requests
from typing import Dict, List, Any, Optional, Union, Callable
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger("APIClient")

class RateLimiter:
    """Rate limiter for API requests."""
    
    def __init__(self, requests_per_minute: int = 60):
        """
        Initialize the rate limiter.
        
        Args:
            requests_per_minute: Maximum number of requests per minute
        """
        self.requests_per_minute = requests_per_minute
        self.interval = 60.0 / requests_per_minute
        self.last_request_time = 0
    
    def wait(self):
        """Wait if necessary to comply with rate limits."""
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        if time_since_last_request < self.interval:
            sleep_time = self.interval - time_since_last_request
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()


class APICache:
    """Cache for API responses."""
    
    def __init__(self, cache_dir: str = "cache", duration_hours: int = 24):
        """
        Initialize the cache.
        
        Args:
            cache_dir: Directory to store cache files
            duration_hours: Cache duration in hours
        """
        self.cache_dir = cache_dir
        self.duration_hours = duration_hours
        os.makedirs(cache_dir, exist_ok=True)
    
    def _get_cache_key(self, url: str, params: Dict = None, headers: Dict = None) -> str:
        """Generate a cache key from the request details."""
        # Create a string representation of the request
        request_str = f"{url}"
        if params:
            request_str += f"?{json.dumps(params, sort_keys=True)}"
        
        # Hash the request string to create a cache key
        return hashlib.md5(request_str.encode()).hexdigest()
    
    def _get_cache_path(self, cache_key: str) -> str:
        """Get the file path for a cache key."""
        return os.path.join(self.cache_dir, f"{cache_key}.json")
    
    def get(self, url: str, params: Dict = None, headers: Dict = None) -> Optional[Dict]:
        """
        Get cached response if available and not expired.
        
        Args:
            url: Request URL
            params: Request parameters
            headers: Request headers
            
        Returns:
            Cached response or None if not available
        """
        cache_key = self._get_cache_key(url, params, headers)
        cache_path = self._get_cache_path(cache_key)
        
        if not os.path.exists(cache_path):
            return None
        
        try:
            with open(cache_path, 'r') as f:
                cached_data = json.load(f)
            
            # Check if cache is expired
            cached_time = datetime.fromisoformat(cached_data.get("timestamp", "2000-01-01T00:00:00"))
            expiration_time = cached_time + timedelta(hours=self.duration_hours)
            
            if datetime.now() > expiration_time:
                logger.debug(f"Cache expired for {url}")
                return None
            
            logger.debug(f"Cache hit for {url}")
            return cached_data.get("data")
        except Exception as e:
            logger.warning(f"Error reading cache for {url}: {str(e)}")
            return None
    
    def set(self, url: str, params: Dict = None, headers: Dict = None, data: Any = None):
        """
        Cache a response.
        
        Args:
            url: Request URL
            params: Request parameters
            headers: Request headers
            data: Response data to cache
        """
        if data is None:
            return
        
        cache_key = self._get_cache_key(url, params, headers)
        cache_path = self._get_cache_path(cache_key)
        
        try:
            cache_data = {
                "timestamp": datetime.now().isoformat(),
                "url": url,
                "params": params,
                "data": data
            }
            
            with open(cache_path, 'w') as f:
                json.dump(cache_data, f, indent=2)
            
            logger.debug(f"Cached response for {url}")
        except Exception as e:
            logger.warning(f"Error caching response for {url}: {str(e)}")


class APIClient:
    """Unified client for making API requests."""
    
    def __init__(self, 
                 base_url: str = "", 
                 headers: Dict = None, 
                 cache_dir: str = "cache",
                 cache_duration_hours: int = 24,
                 requests_per_minute: int = 60,
                 timeout: int = 30,
                 max_retries: int = 3,
                 retry_delay: float = 1.0):
        """
        Initialize the API client.
        
        Args:
            base_url: Base URL for all requests
            headers: Default headers for all requests
            cache_dir: Directory to store cache files
            cache_duration_hours: Cache duration in hours
            requests_per_minute: Maximum number of requests per minute
            timeout: Request timeout in seconds
            max_retries: Maximum number of retries for failed requests
            retry_delay: Delay between retries in seconds
        """
        self.base_url = base_url
        self.headers = headers or {}
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        
        # Initialize rate limiter and cache
        self.rate_limiter = RateLimiter(requests_per_minute)
        self.cache = APICache(cache_dir, cache_duration_hours)
        
        # Session for connection pooling
        self.session = requests.Session()
    
    def get(self, 
            endpoint: str, 
            params: Dict = None, 
            headers: Dict = None, 
            use_cache: bool = True,
            cache_only: bool = False) -> Dict:
        """
        Make a GET request.
        
        Args:
            endpoint: API endpoint (will be appended to base_url)
            params: Query parameters
            headers: Request headers (will be merged with default headers)
            use_cache: Whether to use cache
            cache_only: Whether to only use cache (no API request)
            
        Returns:
            Response data as dictionary
        """
        url = f"{self.base_url}{endpoint}" if self.base_url else endpoint
        merged_headers = {**self.headers, **(headers or {})}
        
        # Check cache first if enabled
        if use_cache:
            cached_data = self.cache.get(url, params, merged_headers)
            if cached_data:
                return cached_data
            
            if cache_only:
                logger.warning(f"Cache miss for {url} and cache_only=True")
                return {}
        
        # Wait for rate limiting
        self.rate_limiter.wait()
        
        # Make the request with retries
        retries = 0
        while retries <= self.max_retries:
            try:
                response = self.session.get(
                    url, 
                    params=params, 
                    headers=merged_headers,
                    timeout=self.timeout
                )
                
                # Raise for status
                response.raise_for_status()
                
                # Parse JSON response
                data = response.json()
                
                # Cache the response if enabled
                if use_cache:
                    self.cache.set(url, params, merged_headers, data)
                
                return data
            except requests.exceptions.RequestException as e:
                retries += 1
                if retries > self.max_retries:
                    logger.error(f"Failed request to {url} after {self.max_retries} retries: {str(e)}")
                    raise
                
                logger.warning(f"Retry {retries}/{self.max_retries} for {url}: {str(e)}")
                time.sleep(self.retry_delay * retries)  # Exponential backoff
    
    def post(self, 
             endpoint: str, 
             data: Dict = None, 
             json_data: Dict = None,
             params: Dict = None, 
             headers: Dict = None) -> Dict:
        """
        Make a POST request.
        
        Args:
            endpoint: API endpoint (will be appended to base_url)
            data: Form data
            json_data: JSON data
            params: Query parameters
            headers: Request headers (will be merged with default headers)
            
        Returns:
            Response data as dictionary
        """
        url = f"{self.base_url}{endpoint}" if self.base_url else endpoint
        merged_headers = {**self.headers, **(headers or {})}
        
        # Wait for rate limiting
        self.rate_limiter.wait()
        
        # Make the request with retries
        retries = 0
        while retries <= self.max_retries:
            try:
                response = self.session.post(
                    url, 
                    data=data,
                    json=json_data,
                    params=params, 
                    headers=merged_headers,
                    timeout=self.timeout
                )
                
                # Raise for status
                response.raise_for_status()
                
                # Parse JSON response
                return response.json()
            except requests.exceptions.RequestException as e:
                retries += 1
                if retries > self.max_retries:
                    logger.error(f"Failed request to {url} after {self.max_retries} retries: {str(e)}")
                    raise
                
                logger.warning(f"Retry {retries}/{self.max_retries} for {url}: {str(e)}")
                time.sleep(self.retry_delay * retries)  # Exponential backoff
