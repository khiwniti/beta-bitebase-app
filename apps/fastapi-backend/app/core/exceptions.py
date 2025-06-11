"""
Exception handlers for BiteBase FastAPI Backend
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog

logger = structlog.get_logger()

class BiteBaseException(Exception):
    """Base exception for BiteBase application"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class AuthenticationError(BiteBaseException):
    """Authentication related errors"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401)

class AuthorizationError(BiteBaseException):
    """Authorization related errors"""
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, 403)

class NotFoundError(BiteBaseException):
    """Resource not found errors"""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404)

class ValidationError(BiteBaseException):
    """Validation related errors"""
    def __init__(self, message: str = "Validation failed"):
        super().__init__(message, 422)

class ExternalServiceError(BiteBaseException):
    """External service related errors"""
    def __init__(self, message: str = "External service error"):
        super().__init__(message, 502)

def setup_exception_handlers(app: FastAPI):
    """Setup exception handlers for the FastAPI app"""
    
    @app.exception_handler(BiteBaseException)
    async def bitebase_exception_handler(request: Request, exc: BiteBaseException):
        logger.error(
            "BiteBase exception occurred",
            error=exc.message,
            status_code=exc.status_code,
            path=request.url.path
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.message,
                "status_code": exc.status_code,
                "path": request.url.path
            }
        )
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(
            "HTTP exception occurred",
            status_code=exc.status_code,
            detail=exc.detail,
            path=request.url.path
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "status_code": exc.status_code,
                "path": request.url.path
            }
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(
            "Validation error occurred",
            errors=exc.errors(),
            path=request.url.path
        )
        return JSONResponse(
            status_code=422,
            content={
                "error": "Validation failed",
                "details": exc.errors(),
                "status_code": 422,
                "path": request.url.path
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(
            "Unexpected error occurred",
            error=str(exc),
            error_type=type(exc).__name__,
            path=request.url.path,
            exc_info=True
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "status_code": 500,
                "path": request.url.path
            }
        )