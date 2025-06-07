"""
Streaming Support - Enhanced streaming capabilities for Bitebase AI agents.

This module provides utilities for streaming responses from agents to the UI,
with support for different streaming formats and protocols.
"""

import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union, Callable, AsyncGenerator, Generator

logger = logging.getLogger("StreamingSupport")

class StreamingManager:
    """Manager for streaming responses from agents to clients."""

    def __init__(self, buffer_size: int = 5):
        """
        Initialize the streaming manager.

        Args:
            buffer_size: Size of the buffer for batching stream chunks
        """
        self.buffer_size = buffer_size
        self.logger = logging.getLogger("StreamingManager")

    async def stream_response(self, 
                             generator: AsyncGenerator[str, None],
                             callback: Optional[Callable[[str], None]] = None) -> str:
        """
        Stream a response from an async generator.

        Args:
            generator: Async generator that yields response chunks
            callback: Optional callback function to call with each chunk

        Returns:
            The complete response as a string
        """
        buffer = []
        complete_response = []
        
        try:
            async for chunk in generator:
                buffer.append(chunk)
                complete_response.append(chunk)
                
                # Process buffer when it reaches the specified size
                if len(buffer) >= self.buffer_size:
                    batched_chunk = "".join(buffer)
                    if callback:
                        callback(batched_chunk)
                    buffer = []
            
            # Process any remaining chunks in the buffer
            if buffer:
                batched_chunk = "".join(buffer)
                if callback:
                    callback(batched_chunk)
                    
            return "".join(complete_response)
        except Exception as e:
            self.logger.error(f"Error streaming response: {str(e)}")
            if callback:
                callback(f"\n\nError: {str(e)}")
            return "".join(complete_response) + f"\n\nError: {str(e)}"

    def format_for_sse(self, data: str, event: str = "message") -> str:
        """
        Format data for Server-Sent Events (SSE).

        Args:
            data: The data to format
            event: The event type

        Returns:
            Formatted SSE data
        """
        return f"event: {event}\ndata: {json.dumps(data)}\n\n"

    def format_for_websocket(self, data: str, message_type: str = "text") -> str:
        """
        Format data for WebSocket.

        Args:
            data: The data to format
            message_type: The message type

        Returns:
            Formatted WebSocket data
        """
        return json.dumps({
            "type": message_type,
            "data": data
        })

    async def stream_to_client(self, 
                              generator: AsyncGenerator[str, None],
                              format_type: str = "sse",
                              callback: Optional[Callable[[str], None]] = None) -> str:
        """
        Stream a response to a client with the specified format.

        Args:
            generator: Async generator that yields response chunks
            format_type: Format type (sse, websocket, raw)
            callback: Optional callback function to call with each formatted chunk

        Returns:
            The complete response as a string
        """
        buffer = []
        complete_response = []
        
        try:
            async for chunk in generator:
                buffer.append(chunk)
                complete_response.append(chunk)
                
                # Process buffer when it reaches the specified size
                if len(buffer) >= self.buffer_size:
                    batched_chunk = "".join(buffer)
                    
                    # Format the chunk based on the specified format type
                    if format_type == "sse":
                        formatted_chunk = self.format_for_sse(batched_chunk)
                    elif format_type == "websocket":
                        formatted_chunk = self.format_for_websocket(batched_chunk)
                    else:  # raw
                        formatted_chunk = batched_chunk
                    
                    if callback:
                        callback(formatted_chunk)
                    
                    buffer = []
            
            # Process any remaining chunks in the buffer
            if buffer:
                batched_chunk = "".join(buffer)
                
                # Format the chunk based on the specified format type
                if format_type == "sse":
                    formatted_chunk = self.format_for_sse(batched_chunk)
                elif format_type == "websocket":
                    formatted_chunk = self.format_for_websocket(batched_chunk)
                else:  # raw
                    formatted_chunk = batched_chunk
                
                if callback:
                    callback(formatted_chunk)
                    
            return "".join(complete_response)
        except Exception as e:
            self.logger.error(f"Error streaming to client: {str(e)}")
            error_message = f"\n\nError: {str(e)}"
            
            if format_type == "sse":
                error_message = self.format_for_sse(error_message, "error")
            elif format_type == "websocket":
                error_message = self.format_for_websocket(error_message, "error")
                
            if callback:
                callback(error_message)
                
            return "".join(complete_response) + f"\n\nError: {str(e)}"
