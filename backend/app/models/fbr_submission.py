from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class FBRSubmission(Base):
    __tablename__ = "fbr_submissions"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=True)  # Nullable for scenario tests
    
    # Scenario information
    scenario_id = Column(String(20), nullable=True)
    
    # Request/Response data
    request_payload = Column(JSON, nullable=True)
    response_payload = Column(JSON, nullable=True)
    
    # Submission tracking
    submission_status = Column(String(20), default="Pending")  # Pending, Success, Failed
    http_status = Column(Integer, nullable=True)
    
    # FBR response data
    fbr_invoice_number = Column(String(50), nullable=True)
    fbr_reference_number = Column(String(50), nullable=True)
    fbr_status_code = Column(String(10), nullable=True)
    fbr_error_code = Column(String(10), nullable=True)
    fbr_error_message = Column(Text, nullable=True)
    
    # Retry tracking
    attempt_count = Column(Integer, default=1)
    
    # Timestamps
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<FBRSubmission {self.id}: Scenario {self.scenario_id} - {self.submission_status}>"