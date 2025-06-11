"""
Subscription model for BiteBase FastAPI Backend
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    TRIAL = "trial"
    PAST_DUE = "past_due"

class PlanType(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.uid"), nullable=False)
    plan_id = Column(String(100), nullable=False)
    plan_type = Column(Enum(PlanType), default=PlanType.FREE)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    stripe_subscription_id = Column(String(255), unique=True)
    stripe_customer_id = Column(String(255))
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    trial_end = Column(DateTime(timezone=True))
    cancel_at_period_end = Column(Boolean, default=False)
    
    # Pricing
    amount = Column(Float)  # in cents
    currency = Column(String(10), default="USD")
    
    # Usage tracking
    api_calls_used = Column(Integer, default=0)
    api_calls_limit = Column(Integer, default=1000)
    analyses_used = Column(Integer, default=0)
    analyses_limit = Column(Integer, default=10)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")

class PaymentHistory(Base):
    __tablename__ = "payment_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.uid"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    stripe_payment_intent_id = Column(String(255), unique=True)
    amount = Column(Float, nullable=False)  # in cents
    currency = Column(String(10), default="USD")
    status = Column(String(50))  # succeeded, failed, pending, etc.
    description = Column(String(255))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    subscription = relationship("Subscription")