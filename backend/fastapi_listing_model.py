from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import re

app = FastAPI()

# --- Models / Schemas ---

class User(BaseModel):
    id: str
    name: str = "Rahul Sharma"
    email: str = "rahul@example.com"
    # Phone number stored with country code (e.g., +919000000000)
    phone: str = Field(..., example="+919876543210")

    @validator("phone")
    def validate_phone(cls, v):
        # Basic regex for Indian phone numbers (10 digits, optional +91 or 91 prefix)
        pattern = re.compile(r"^(\+91|91)?[6-9]\d{9}$")
        if not pattern.match(v):
            raise ValueError("Invalid Indian phone number format. Must be 10 digits.")
        
        # Clean non-digit characters
        clean_v = re.sub(r"\D", "", v)
        
        # Ensure it has the '91' prefix for WhatsApp link compatibility
        if len(clean_v) == 10:
            return "91" + clean_v
        return clean_v

class Listing(BaseModel):
    id: str
    title: str
    description: str
    rent: float
    location: str
    moveInDate: str
    flatType: str
    userId: User  # The owner of the listing

# --- Example Listing Object ---

example_owner = User(
    id="owner_001",
    name="John Doe",
    email="john@example.com",
    phone="9876543210" # This will be automatically converted to 919876543210
)

example_listing = Listing(
    id="listing_101",
    title="Cozy 1BHK in Koramangala",
    description="Fully furnished, close to tech parks, available immediately.",
    rent=18000.0,
    location="Koramangala, Bangalore",
    moveInDate="2024-05-01",
    flatType="1BHK",
    userId=example_owner
)

# --- API Endpoints ---

@app.get("/api/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    # In a real app, this would fetch from a database
    if listing_id == example_listing.id:
        return example_listing
    raise HTTPException(status_code=404, detail="Listing not found")

# To run the server:
# 1. pip install fastapi uvicorn
# 2. uvicorn fastapi_listing_model:app --reload
