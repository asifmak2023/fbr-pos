"""
Seed script to populate FBR scenarios with official data from FBR documentation.
Based on "DI Scenarios JSON for Sandbox Testing.pdf" and official FBR technical documentation.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.fbr_scenario import FBRScenario
import json

# Official FBR scenario data extracted from official documentation
OFFICIAL_SCENARIOS = [
    {
        "scenario_code": "SN001",
        "name": "Sale of Standard Rate Goods to Registered Buyer",
        "description": "Standard 18% sales tax rate to registered buyers who can claim input tax credits",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-05-10",
            "sellerBusinessName": "Company 8",
            "sellerProvince": "Sindh",
            "sellerNTNCNIC": "8885801",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN001",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "test",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 400,
                    "totalValues": 0,
                    "valueSalesExcludingST": 1000,
                    "fixedNotifiedValueOrRetailPrice": 0.0,
                    "salesTaxApplicable": 180,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": "",
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Goods at standard rate (default)",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["buyerNTNCNIC", "buyerRegistrationType"],
        "validation_rules": {
            "buyer_registration_type": "Registered",
            "tax_rate": "18%",
            "scenario_specific": "Standard rate sales to registered buyers"
        }
    },
    {
        "scenario_code": "SN002",
        "name": "Sale of Standard Rate Goods to Unregistered Buyer",
        "description": "Standard 18% sales tax rate to unregistered buyers (B2C sales)",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Unregistered",
        "requires_buyer_ntn": False,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-05-10",
            "sellerBusinessName": "Company 8",
            "sellerProvince": "Sindh",
            "sellerNTNCNIC": "8885801",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "1234567",
            "buyerBusinessName": "Walk-in Customer",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN002",
            "buyerRegistrationType": "Unregistered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "test",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 400,
                    "totalValues": 0,
                    "valueSalesExcludingST": 1000,
                    "fixedNotifiedValueOrRetailPrice": 0.0,
                    "salesTaxApplicable": 180,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": "",
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Goods at standard rate (default)",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["buyerRegistrationType"],
        "validation_rules": {
            "buyer_registration_type": "Unregistered",
            "tax_rate": "18%",
            "scenario_specific": "Standard rate sales to unregistered buyers"
        }
    },
    {
        "scenario_code": "SN005",
        "name": "Reduced Rate Goods (Eighth Schedule)",
        "description": "Goods taxed at reduced rates (lower than standard) as per Eighth Schedule - basic food items, medicines, essential commodities",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Unregistered",
        "requires_buyer_ntn": False,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-06-30",
            "sellerNTNCNIC": "8885801",
            "sellerBusinessName": "Company 8",
            "sellerAddress": "Karachi",
            "sellerProvince": "Sindh",
            "buyerNTNCNIC": "1000000000000",
            "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN005",
            "buyerRegistrationType": "Unregistered",
            "items": [
                {
                    "hsCode": "0102.2930",
                    "productDescription": "product Description41",
                    "rate": "1%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 1.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 1000.00,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 10,
                    "salesTaxWithheldAtSource": 50.23,
                    "extraTax": "",
                    "furtherTax": 120.00,
                    "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
                    "fedPayable": 50.36,
                    "discount": 56.36,
                    "saleType": "Goods at Reduced Rate",
                    "sroItemSerialNo": "82"
                }
            ]
        },
        "required_fields": ["sroScheduleNo", "sroItemSerialNo"],
        "validation_rules": {
            "tax_rate": "1%",
            "sro_schedule": "EIGHTH SCHEDULE",
            "scenario_specific": "Reduced rate goods per Eighth Schedule"
        }
    },
    {
        "scenario_code": "SN006",
        "name": "Exempt Goods (Sixth Schedule)",
        "description": "Goods exempt from sales tax as per Sixth Schedule - agricultural products, medicines, basic necessities",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-07-01",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "SI-20250515-001",
            "scenarioId": "SN006",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0102.2930",
                    "productDescription": "product Description41",
                    "rate": "Exempt",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 1.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 10,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 0,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "SIXTH SCHEDULE",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Exempt Goods",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["sroScheduleNo"],
        "validation_rules": {
            "tax_rate": "Exempt",
            "sro_schedule": "SIXTH SCHEDULE",
            "scenario_specific": "Exempt goods per Sixth Schedule"
        }
    },
    {
        "scenario_code": "SN007",
        "name": "Zero-Rated Goods (Fifth Schedule)",
        "description": "Zero-rated goods as per Fifth Schedule - typically export goods and specific industrial inputs",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-07-02",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN007",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0102.2930",
                    "productDescription": "product Description41",
                    "rate": "0%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 1.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 1000.00,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 0,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "FIFTH SCHEDULE",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Zero-Rated Goods",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["sroScheduleNo"],
        "validation_rules": {
            "tax_rate": "0%",
            "sro_schedule": "FIFTH SCHEDULE",
            "scenario_specific": "Zero-rated goods per Fifth Schedule"
        }
    },
    {
        "scenario_code": "SN015",
        "name": "Sale of Mobile Phones",
        "description": "Specific scenario for mobile phone sales with special tax treatment",
        "business_activity": "Retail",
        "sector": "Telecom",
        "buyer_registration_type": "Unregistered",
        "requires_buyer_ntn": False,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-01",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "1234567",
            "buyerBusinessName": "Mobile Store Customer",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN015",
            "buyerRegistrationType": "Unregistered",
            "items": [
                {
                    "hsCode": "8517.1210",
                    "productDescription": "Mobile Phone",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 1.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 50000.00,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 9000.00,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Mobile Phones",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": [],
        "validation_rules": {
            "tax_rate": "18%",
            "hs_code_prefix": "8517",
            "scenario_specific": "Mobile phone sales"
        }
    },
    {
        "scenario_code": "SN016",
        "name": "Processing / Conversion of Goods",
        "description": "Goods undergoing processing or conversion with specific tax treatment",
        "business_activity": "Manufacturing",
        "sector": "All Sectors",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-02",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "Processing Company",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN016",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "Processed Goods",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 100.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 10000.00,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 1800.00,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Processing/Conversion of Goods",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": [],
        "validation_rules": {
            "tax_rate": "18%",
            "scenario_specific": "Processing/conversion of goods"
        }
    },
    {
        "scenario_code": "SN017",
        "name": "Sale of Goods Where FED Is Charged in ST Mode",
        "description": "Goods where Federal Excise Duty is charged in Sales Tax mode",
        "business_activity": "Manufacturing",
        "sector": "All Sectors",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-03",
            "sellerNTNCNIC": "8885801",
            "sellerBusinessName": "Company 8",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "7000009",
            "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN017",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "product Description41",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 1.0,
                    "totalValues": 0.00,
                    "valueSalesExcludingST": 1000.00,
                    "fixedNotifiedValueOrRetailPrice": 0.00,
                    "salesTaxApplicable": 180.00,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 50.00,
                    "discount": 0,
                    "saleType": "Goods (FED in ST Mode)",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["fedPayable"],
        "validation_rules": {
            "tax_rate": "18%",
            "fed_applicable": True,
            "scenario_specific": "Goods with FED in ST mode"
        }
    },
    {
        "scenario_code": "SN018",
        "name": "Sale of Services Where FED Is Charged in ST Mode",
        "description": "Services where Federal Excise Duty is charged in Sales Tax mode",
        "business_activity": "Services",
        "sector": "Services",
        "buyer_registration_type": "Unregistered",
        "requires_buyer_ntn": False,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-04",
            "sellerNTNCNIC": "8885801",
            "sellerBusinessName": "Company 8",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "1000000000000",
            "buyerBusinessName": "Service Customer",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "SI-20260821-001",
            "scenarioId": "SN018",
            "buyerRegistrationType": "Unregistered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "Consulting Service",
                    "rate": "8%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 20,
                    "totalValues": 0,
                    "valueSalesExcludingST": 1000,
                    "fixedNotifiedValueOrRetailPrice": 0,
                    "salesTaxApplicable": 80,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 50,
                    "discount": 0,
                    "saleType": "Services (FED in ST Mode)",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["fedPayable"],
        "validation_rules": {
            "tax_rate": "8%",
            "fed_applicable": True,
            "scenario_specific": "Services with FED in ST mode"
        }
    },
    {
        "scenario_code": "SN019",
        "name": "Sale of Services (as per ICT Ordinance)",
        "description": "Services rendered in Islamabad Capital Territory as per ICT Ordinance",
        "business_activity": "Services",
        "sector": "Services",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-05",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Islamabad",
            "sellerAddress": "Islamabad",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "ICT Service Client",
            "buyerProvince": "Islamabad",
            "buyerAddress": "Islamabad",
            "invoiceRefNo": "",
            "scenarioId": "SN019",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "ICT Service",
                    "rate": "16%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 10,
                    "totalValues": 0,
                    "valueSalesExcludingST": 5000,
                    "fixedNotifiedValueOrRetailPrice": 0,
                    "salesTaxApplicable": 800,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Services (ICT Ordinance)",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": [],
        "validation_rules": {
            "tax_rate": "16%",
            "province": "Islamabad",
            "scenario_specific": "ICT services per ICT Ordinance"
        }
    },
    {
        "scenario_code": "SN021",
        "name": "Sale of Cement / Concrete Block",
        "description": "Specific scenario for cement and concrete block sales",
        "business_activity": "Manufacturing",
        "sector": "Construction",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-06",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "Construction Company",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN021",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "2523.2900",
                    "productDescription": "Cement",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 100,
                    "totalValues": 0,
                    "valueSalesExcludingST": 25000,
                    "fixedNotifiedValueOrRetailPrice": 0,
                    "salesTaxApplicable": 4500,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Cement / Concrete Block",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": [],
        "validation_rules": {
            "tax_rate": "18%",
            "hs_code_prefix": "2523",
            "scenario_specific": "Cement/concrete block sales"
        }
    },
    {
        "scenario_code": "SN022",
        "name": "Sale of Potassium Chlorate",
        "description": "Specific scenario for potassium chlorate sales with special tax treatment",
        "business_activity": "Chemical",
        "sector": "Chemical",
        "buyer_registration_type": "Registered",
        "requires_buyer_ntn": True,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-08-07",
            "sellerBusinessName": "Company 8",
            "sellerNTNCNIC": "8885801",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "2046004",
            "buyerBusinessName": "Chemical Company",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "invoiceRefNo": "",
            "scenarioId": "SN022",
            "buyerRegistrationType": "Registered",
            "items": [
                {
                    "hsCode": "2833.2100",
                    "productDescription": "Potassium Chlorate",
                    "rate": "18%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 50,
                    "totalValues": 0,
                    "valueSalesExcludingST": 15000,
                    "fixedNotifiedValueOrRetailPrice": 0,
                    "salesTaxApplicable": 2700,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Potassium Chlorate",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": [],
        "validation_rules": {
            "tax_rate": "18%",
            "hs_code_prefix": "2833",
            "scenario_specific": "Potassium chlorate sales"
        }
    },
    {
        "scenario_code": "SN024",
        "name": "Sale of Goods Listed in SRO 297(1)/2023",
        "description": "Goods as per SRO 297(I)/2023 with specific tax treatment",
        "business_activity": "General",
        "sector": "All Sectors",
        "buyer_registration_type": "Unregistered",
        "requires_buyer_ntn": False,
        "requires_reference_invoice": False,
        "sample_invoice_data": {
            "invoiceType": "Sale Invoice",
            "invoiceDate": "2026-04-21",
            "sellerNTNCNIC": "8885801",
            "sellerBusinessName": "Company 8",
            "sellerProvince": "Sindh",
            "sellerAddress": "Karachi",
            "buyerNTNCNIC": "1000000000000",
            "buyerBusinessName": "SRO Buyer",
            "buyerProvince": "Sindh",
            "buyerAddress": "Karachi",
            "buyerRegistrationType": "Unregistered",
            "scenarioId": "SN024",
            "invoiceRefNo": "SI-20260421-001",
            "items": [
                {
                    "hsCode": "0101.2100",
                    "productDescription": "SRO Product",
                    "rate": "25%",
                    "uoM": "Numbers, pieces, units",
                    "quantity": 123,
                    "valueSalesExcludingST": 1000,
                    "fixedNotifiedValueOrRetailPrice": 0,
                    "salesTaxApplicable": 250,
                    "salesTaxWithheldAtSource": 0,
                    "extraTax": 0,
                    "furtherTax": 0,
                    "sroScheduleNo": "297(I)/2023-Table-I",
                    "fedPayable": 0,
                    "discount": 0,
                    "saleType": "Goods as per SRO.297(I)/2023",
                    "sroItemSerialNo": ""
                }
            ]
        },
        "required_fields": ["sroScheduleNo"],
        "validation_rules": {
            "tax_rate": "25%",
            "sro_schedule": "297(I)/2023",
            "scenario_specific": "Goods per SRO 297(I)/2023"
        }
    }
]


def seed_scenarios():
    """Seed the database with official FBR scenarios"""
    db = SessionLocal()
    
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Clear existing scenarios (optional - remove if you want to keep existing data)
        db.query(FBRScenario).delete()
        db.commit()
        
        # Add official scenarios
        for scenario_data in OFFICIAL_SCENARIOS:
            existing = db.query(FBRScenario).filter(
                FBRScenario.scenario_code == scenario_data["scenario_code"]
            ).first()
            
            if existing:
                print(f"Updating existing scenario: {scenario_data['scenario_code']}")
                for key, value in scenario_data.items():
                    setattr(existing, key, value)
            else:
                print(f"Adding new scenario: {scenario_data['scenario_code']}")
                new_scenario = FBRScenario(**scenario_data)
                db.add(new_scenario)
        
        db.commit()
        print(f"Successfully seeded {len(OFFICIAL_SCENARIOS)} FBR scenarios")
        
        # Print summary
        scenarios = db.query(FBRScenario).all()
        print("\nScenario Summary:")
        for scenario in scenarios:
            print(f"  {scenario.scenario_code}: {scenario.name} - {scenario.test_status}")
        
    except Exception as e:
        print(f"Error seeding scenarios: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_scenarios()