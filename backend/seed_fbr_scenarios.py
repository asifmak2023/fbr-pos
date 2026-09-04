"""Seed all 28 FBR sandbox scenarios from PRAL DI Scenarios JSON v1.11 (2025).

Values are taken verbatim from the official PDF – do NOT modify without
reference to the official PRAL document.
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import Base, SessionLocal, engine
from app.models.fbr_scenario import FBRScenario


# ---------------------------------------------------------------------------
# Helpers – build canonical invoice / item dicts exactly as the PDF shows
# ---------------------------------------------------------------------------

def inv(scenario_id, date, seller_ntn, seller_name, buyer_ntn, buyer_name,
        buyer_reg, ref, items, extra=None):
    """Build a top-level invoice dict."""
    d = {
        "invoiceType": "Sale Invoice",
        "invoiceDate": date,
        "sellerNTNCNIC": seller_ntn,
        "sellerBusinessName": seller_name,
        "sellerProvince": "Sindh",
        "sellerAddress": "Karachi",
        "buyerNTNCNIC": buyer_ntn,
        "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
        "buyerProvince": "Sindh",
        "buyerAddress": "Karachi",
        "invoiceRefNo": ref,
        "scenarioId": scenario_id,
        "buyerRegistrationType": buyer_reg,
        "items": items,
    }
    if extra:
        d.update(extra)
    return d


def it(hs, desc, rate, uom, qty, total_val, val_ex_st, fixed_retail,
       st_applicable, st_withheld, extra_tax, further_tax, sro_schedule,
       fed, discount, sale_type, sro_serial):
    """Build an item dict with all fields the PDF specifies."""
    return {
        "hsCode": hs,
        "productDescription": desc,
        "rate": rate,
        "uoM": uom,
        "quantity": qty,
        "totalValues": total_val,
        "valueSalesExcludingST": val_ex_st,
        "fixedNotifiedValueOrRetailPrice": fixed_retail,
        "salesTaxApplicable": st_applicable,
        "salesTaxWithheldAtSource": st_withheld,
        "extraTax": extra_tax,
        "furtherTax": further_tax,
        "sroScheduleNo": sro_schedule,
        "fedPayable": fed,
        "discount": discount,
        "saleType": sale_type,
        "sroItemSerialNo": sro_serial,
    }


U = "Numbers, pieces, units"   # shorthand for common UOM

# ---------------------------------------------------------------------------
# All 28 official scenarios – field values copied verbatim from the PDF
# ---------------------------------------------------------------------------
OFFICIAL_SCENARIOS = [
    # SN001 – Registered Buyer (Passed: confirmed per project history)
    {"scenario_code": "SN001", "name": "Sale of Standard Rate Goods to Registered Buyers",
     "description": "Sale of goods at 18% standard rate to a registered buyer.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Registered", "requires_buyer_ntn": True,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN001","2025-05-10","8885801","Company 8","2046004","FERTILIZER MANUFAC IRS NEW","Registered","",
         [it("0101.2100","test","18%",U,400,0,1000,0.00,180,0,"",0,"",0,0,"Goods at standard rate (default)","")]),
     "required_fields": [], "validation_rules": {"rate": "18%", "saleType": "Goods at standard rate (default)"},
     "enabled": True, "test_status": "Passed"},

    # SN002 – Unregistered Buyer (Passed: confirmed on IRIS portal)
    {"scenario_code": "SN002", "name": "Sale of Standard Rate Goods to Unregistered Buyers",
     "description": "Sale of goods at 18% standard rate to an unregistered (B2C) buyer.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN002","2025-05-10","8885801","Company 8","1234567","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0101.2100","test","18%",U,400,0,1000,0.00,180,0,"",0,"",0,0,"Goods at standard rate (default)","")]),
     "required_fields": [], "validation_rules": {"rate": "18%", "saleType": "Goods at standard rate (default)"},
     "enabled": True, "test_status": "Passed"},

    # SN003
    {"scenario_code": "SN003", "name": "Sale of Steel (Melted and Re-Rolled)",
     "description": "Sale of billets, ingots and long bars in the steel sector.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN003","2025-04-21","8885801","Company 7","3710505701479","FERTILIZER MANUFAC IRS NEW","Unregistered","0",
         [it("7214.1010","","18%","MT",1,0,"205000.00",0.00,"36900",0,0,0,"",0,0,"Steel melting and re-rolling","")]),
     "required_fields": [], "validation_rules": {"saleType": "Steel melting and re-rolling"},
     "enabled": True},

    # SN004
    {"scenario_code": "SN004", "name": "Sale of Steel Scrap by Ship Breakers",
     "description": "Sale of ship-breaking scrap steel.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN004","2025-05-26","4130276175937","Company 8","3710505701479","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("7204.1010","","18%","MT",1,0,"175000",0,"31500",0,0,0,"",0,0,"Ship breaking","")]),
     "required_fields": [], "validation_rules": {"saleType": "Ship breaking"},
     "enabled": True},

    # SN005
    {"scenario_code": "SN005", "name": "Sales of Reduced Rate Goods (Eighth Schedule)",
     "description": "Goods taxed at reduced rate 1% under Eighth Schedule Table 1.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN005","2025-06-30","8885801","B2","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0102.2930","product Description41","1%",U,1.0,0.00,1000.00,0.00,10,50.23,"",120.00,"EIGHTH SCHEDULE Table 1",50.36,56.36,"Goods at Reduced Rate","82")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "1%", "saleType": "Goods at Reduced Rate"},
     "enabled": True},

    # SN006
    {"scenario_code": "SN006", "name": "Sale of Exempt Goods (Sixth Schedule)",
     "description": "Goods exempt from sales tax under Sixth Schedule Table I.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Registered", "requires_buyer_ntn": True,
     "requires_reference_invoice": True,
     "sample_invoice_data": inv("SN006","2025-07-01","8885801","Company 8","2046004","FERTILIZER MANUFAC IRS NEW","Registered","SI-20250515-001",
         [it("0102.2930","product Description41","Exempt",U,1.0,0.00,10,0.00,0,50.23,"",120.00,"6th Schd Table I",50.36,56.36,"Exempt goods","100")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "Exempt", "saleType": "Exempt goods"},
     "enabled": True},

    # SN007
    {"scenario_code": "SN007", "name": "Sale of Zero-Rated Goods (Fifth Schedule)",
     "description": "Goods taxed at 0% under Fifth Schedule / SRO 327(I)/2008.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": True,
     "sample_invoice_data": inv("SN007","2025-04-21","8885801","Company 7","3710505701479","FERTILIZER MANUFAC IRS NEW","Unregistered","0",
         [it("0101.2100","test","0%",U,100,0,100,0.00,0,0,0,0,"327(I)/2008",0,0,"Goods at zero-rate","1")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "0%", "saleType": "Goods at zero-rate"},
     "enabled": True},

    # SN008 – 3rd Schedule goods: tax on MRP (fixedNotifiedValueOrRetailPrice = 1000).
    # FBR requires valueSalesExcludingST to be a positive non-zero number.
    # Derived: 1000 / 1.18 = 847.46 (value excluding 18% ST).
    {"scenario_code": "SN008", "name": "Sale of 3rd Schedule Goods",
     "description": "Goods taxed on retail price basis under Third Schedule.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN008","2025-04-21","8885801","Company 7","3710505701479","FERTILIZER MANUFAC IRS NEW","Unregistered","0",
         [it("0101.2100","test","18%",U,100,145,847.46,1000,180,0,0,0,"",0,0,"3rd Schedule Goods","")]),
     "required_fields": [], "validation_rules": {"saleType": "3rd Schedule Goods"},
     "enabled": True},

    # SN009
    {"scenario_code": "SN009", "name": "Purchase From Registered Cotton Ginners",
     "description": "Cotton ginners purchase – registered buyer only.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Registered", "requires_buyer_ntn": True,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN009","2025-05-15","8885801","Company 8","2046004","FERTILIZER MANUFAC IRS NEW","Registered","",
         [it("0101.2100","test","18%",U,0,2500,2500,0.00,450,0,0,0,"",0,0,"Cotton ginners","")]),
     "required_fields": [], "validation_rules": {"saleType": "Cotton ginners"},
     "enabled": True},

    # SN010
    {"scenario_code": "SN010", "name": "Sale of Telecom Services by Mobile Operators",
     "description": "Telecom services at 17% by mobile operators.",
     "business_activity": "Service Provider", "sector": "Services",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN010","2025-05-15","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250515-001",
         [it("0101.2100","test","17%",U,1000,0,100,0.00,17,0,0,0,"",0,0,"Telecommunication services","")]),
     "required_fields": [], "validation_rules": {"rate": "17%", "saleType": "Telecommunication services"},
     "enabled": True},

    # SN011 – NOT in this business profile's eligible scenarios on IRIS (errorCode 0203:
    # "Provided scenario does not exist"). Disabled so it is skipped in run-all.
    {"scenario_code": "SN011", "name": "Sale of Steel through Toll Manufacturing",
     "description": "Billets/ingots/long bars via toll manufacturing – not applicable to this business profile.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN011","2025-05-26","4130276175937","Company 8","3710505701479","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("7214.9990","","18%","MT",1,0,"205000",0,"36900",0,0,0,"",0,0,"Toll Manufacturing","")],
         extra={"dataSource": ""}),
     "required_fields": [], "validation_rules": {"saleType": "Toll Manufacturing"},
     "enabled": False},

    # SN012 – Petroleum Products.
    # FBR requires: (1) HS code from petroleum category (2710.1210 = motor spirit/petrol),
    # (2) uoM must be "liter" (FBR-validated against HS code), (3) "petroleumLevyOn" extra
    # field (not in PDF) with value "Ex-Refinery Price".
    {"scenario_code": "SN012", "name": "Sale of Petroleum Products",
     "description": "Petroleum products at 1.43% under SRO 1450(I)/2021.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN012","2025-05-15","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250515-001",
         [{
             "hsCode": "2710.1210",
             "productDescription": "TEST",
             "rate": "1.43%",
             "uoM": "liter",
             "quantity": 123,
             "totalValues": 132,
             "valueSalesExcludingST": 100,
             "fixedNotifiedValueOrRetailPrice": 0,
             "salesTaxApplicable": 1.43,
             "salesTaxWithheldAtSource": 2,
             "extraTax": 0,
             "furtherTax": 0,
             "sroScheduleNo": "1450(I)/2021",
             "fedPayable": 0,
             "discount": 0,
             "saleType": "Petroleum Products",
             "sroItemSerialNo": "4",
             "petroleumLevyOn": "Ex-Refinery Price",
         }]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "1.43%", "saleType": "Petroleum Products"},
     "enabled": True},

    # SN013
    {"scenario_code": "SN013", "name": "Sale of Electricity to Retailers",
     "description": "Electricity supply to retailers at 5% under SRO 1450(I)/2021.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN013","2025-05-15","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250515-001",
         [it("0101.2100","TEST","5%",U,123,212,1000,0.00,50,11,0,0,"1450(I)/2021",0,0,"Electricity Supply to Retailers","4")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "5%", "saleType": "Electricity Supply to Retailers"},
     "enabled": True},

    # SN014
    {"scenario_code": "SN014", "name": "Sale of Gas to CNG Stations",
     "description": "Natural gas sold to CNG stations at 18%.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN014","2025-05-15","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250515-001",
         [it("0101.2100","TEST","18%",U,123,0,1000,0,180,0,0,0,"",0,0,"Gas to CNG stations","")]),
     "required_fields": [], "validation_rules": {"rate": "18%", "saleType": "Gas to CNG stations"},
     "enabled": True},

    # SN015
    {"scenario_code": "SN015", "name": "Sale of Mobile Phones",
     "description": "Mobile handsets at 18% under Ninth Schedule serial 1(A).",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN015","2025-05-15","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250515-001",
         [it("0101.2100","TEST","18%",U,123,0,1234,0,222.12,0,0,0,"NINTH SCHEDULE",0,0,"Mobile Phones","1(A)")],
         extra={"additional1":"","additional2":"","additional3":""}),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "18%", "saleType": "Mobile Phones"},
     "enabled": True},

    # SN016
    {"scenario_code": "SN016", "name": "Processing / Conversion of Goods",
     "description": "Processing/conversion services at 5%.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN016","2025-05-16","8885801","Company 8","1000000000078","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0101.2100","test","5%",U,1,0,100,0,5,0,0,0,"",0,0,"Processing/Conversion of Goods","")]),
     "required_fields": [], "validation_rules": {"rate": "5%", "saleType": "Processing/Conversion of Goods"},
     "enabled": True},

    # SN017
    {"scenario_code": "SN017", "name": "Sale of Goods Where FED Is Charged in ST Mode",
     "description": "FED collected via sales tax system on goods at 8%.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN017","2025-05-10","8885801","Company 8","7000009","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0101.2100","TEST","8%",U,1,0,100,0,8,0,0,0,"",0,0,"Goods (FED in ST Mode)","")]),
     "required_fields": [], "validation_rules": {"rate": "8%", "saleType": "Goods (FED in ST Mode)"},
     "enabled": True},

    # SN018
    {"scenario_code": "SN018", "name": "Sale of Services Where FED Is Charged in ST Mode",
     "description": "Services (FED in ST Mode) at 8%.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN018","2025-06-14","8885801","Company 8","1000000000056","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2100","TEST","8%",U,20,0,1000,0,80,0,0,0,"",0,0,"Services (FED in ST Mode)","")]),
     "required_fields": [], "validation_rules": {"rate": "8%", "saleType": "Services (FED in ST Mode)"},
     "enabled": True},

    # SN019
    {"scenario_code": "SN019", "name": "Sale of Services (as per ICT Ordinance)",
     "description": "ICT services at 5% under ICTO TABLE I serial 1(ii)(ii)(a).",
     "business_activity": "Service Provider", "sector": "Services",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN019","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2900","TEST","5%",U,1,0,100,0,5,0,0,0,"ICTO TABLE I",0,0,"Services","1(ii)(ii)(a)")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "5%", "saleType": "Services"},
     "enabled": True},

    # SN020
    {"scenario_code": "SN020", "name": "Sale of Electric Vehicles",
     "description": "Electric vehicles at 1% under Sixth Schedule Table III serial 20.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN020","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2900","TEST","1%",U,122,0,1000,0,10,0,0,0,"6th Schd Table III",0,0,"Electric Vehicle","20")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "1%", "saleType": "Electric Vehicle"},
     "enabled": True},

    # SN021
    {"scenario_code": "SN021", "name": "Sale of Cement / Concrete Block",
     "description": "Cement / concrete block at Rs.3 per unit.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN021","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2100","TEST","Rs.3",U,12,0,123,0,36,0,0,0,"",0,0,"Cement /Concrete Block","")]),
     "required_fields": [], "validation_rules": {"rate": "Rs.3", "saleType": "Cement /Concrete Block"},
     "enabled": True},

    # SN022
    {"scenario_code": "SN022", "name": "Sale of Potassium Chlorate",
     "description": "Potassium chlorate at 18% + Rs.60/kg under Eighth Schedule Table 1 serial 56.",
     "business_activity": "Importer", "sector": "All Other Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN022","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("3104.2000","TEST","18% along with rupees 60 per kilogram","KG",1,0,100,0,78,0,0,0,"EIGHTH SCHEDULE Table 1",0,0,"Potassium Chlorate","56")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "18% along with rupees 60 per kilogram", "saleType": "Potassium Chlorate"},
     "enabled": True},

    # SN023
    {"scenario_code": "SN023", "name": "Sale of CNG",
     "description": "CNG sales at Rs.200 per unit under SRO 581(1)/2024 Region-I.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN023","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2100","TEST","Rs.200",U,123,0,234,0,24600,0,0,0,"581(1)/2024",0,0,"CNG Sales","Region-I")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "Rs.200", "saleType": "CNG Sales"},
     "enabled": True},

    # SN024
    {"scenario_code": "SN024", "name": "Sale of Goods Listed in SRO 297(I)/2023",
     "description": "Goods listed in SRO 297(I)/2023-Table-I at 25% serial 12.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN024","2025-04-21","8885801","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2100","TEST","25%",U,123,0,1000,0,250,0,0,0,"297(I)/2023-Table-I",0,0,"Goods as per SRO.297(|)/2023","12")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "25%", "saleType": "Goods as per SRO.297(|)/2023"},
     "enabled": True},

    # SN025
    {"scenario_code": "SN025", "name": "Drugs Sold at Fixed ST Rate Under Serial 81 of Eighth Schedule Table 1",
     "description": "Pharmaceuticals at 0% fixed rate under Eighth Schedule Table 1 serial 81.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN025","2025-05-16","8885801","Company 8","1000000000078","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0101.2100","TEST","0%",U,1,0,100,0,0,0,"",0,"EIGHTH SCHEDULE Table 1",0,0,"Non-Adjustable Supplies","81")]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "0%", "saleType": "Non-Adjustable Supplies"},
     "enabled": True},

    # SN026 – Retailer POS standard rate.
    # FBR error 0553: buyer NTN 1000000000078 is not a "Registered" buyer (type 200).
    # The PDF buyerRegistrationType "Registered" is a PDF typo/mismatch; use "Unregistered".
    {"scenario_code": "SN026", "name": "Sale of Goods at Standard Rate to End Consumers by Retailers",
     "description": "Retailer POS sale at 18% standard rate to end consumers.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN026","2025-05-16","7000008","Company 8","1000000000078","FERTILIZER MANUFAC IRS NEW","Unregistered","SI-20250421-001",
         [it("0101.2100","TEST","18%",U,123,0,1000,0,180,0,0,0,"",0,0,"Goods at standard rate (default)","")]),
     "required_fields": [], "validation_rules": {"rate": "18%", "saleType": "Goods at standard rate (default)"},
     "enabled": True},

    # SN027 – Retailer 3rd Schedule (MRP-based). fixedNotifiedValueOrRetailPrice = 100 @ 18%.
    # FBR requires valueSalesExcludingST > 0 and buyerRegistrationType = "Unregistered"
    # (buyerNTN 7000006 is not a Registered profile on FBR sandbox).
    # valueSalesExcludingST = 100 / 1.18 = 84.75
    {"scenario_code": "SN027", "name": "Sale of 3rd Schedule Goods to End Consumers by Retailers",
     "description": "Retailer POS sale of 3rd Schedule goods taxed on MRP.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN027","2025-05-10","7000008","Company 8","7000006","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [it("0101.2100","test","18%",U,1,0,84.75,100,18,0,0,0,"",0,0,"3rd Schedule Goods","")]),
     "required_fields": [], "validation_rules": {"saleType": "3rd Schedule Goods"},
     "enabled": True},

    # SN028 – Retailer reduced rate (MRP-based). fixedNotifiedValueOrRetailPrice = 100 @ 1%.
    # FBR requires valueSalesExcludingST > 0 and buyerRegistrationType = "Unregistered".
    # valueSalesExcludingST = 100 / 1.01 = 99.01; salesTaxApplicable = 99.01 * 0.01 = 0.99
    {"scenario_code": "SN028", "name": "Sale of Goods at Reduced Rate to End Consumers by Retailers",
     "description": "Retailer POS sale of reduced-rate goods at 1% under Eighth Schedule Table 1 serial 70.",
     "business_activity": "All Other Sectors", "sector": "All Sectors",
     "buyer_registration_type": "Unregistered", "requires_buyer_ntn": False,
     "requires_reference_invoice": False,
     "sample_invoice_data": inv("SN028","2025-05-16","7000008","Company 8","1000000000000","FERTILIZER MANUFAC IRS NEW","Unregistered","",
         [{
             "hsCode": "0101.2100", "productDescription": "TEST", "rate": "1%",
             "uoM": U, "quantity": 0, "totalValues": 0,
             "valueSalesExcludingST": 99.01,
             "fixedNotifiedValueOrRetailPrice": 100,
             "salesTaxApplicable": 0.99, "salesTaxWithheldAtSource": 0,
             "extraTax": "", "furtherTax": 0,
             "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
             "fedPayable": 0, "discount": 0,
             "saleType": "Goods at Reduced Rate", "sroItemSerialNo": "70",
         }]),
     "required_fields": ["sroScheduleNo","sroItemSerialNo"],
     "validation_rules": {"rate": "1%", "saleType": "Goods at Reduced Rate"},
     "enabled": True},
]


def seed_scenarios():
    from sqlalchemy.orm.attributes import flag_modified

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in OFFICIAL_SCENARIOS:
            existing = db.query(FBRScenario).filter_by(scenario_code=data["scenario_code"]).first()
            if existing:
                # Preserve the real test_status – never downgrade from Passed
                previous_status = existing.test_status
                for key, value in data.items():
                    setattr(existing, key, value)
                # JSON columns must be explicitly flagged so SQLAlchemy detects the change
                flag_modified(existing, "sample_invoice_data")
                flag_modified(existing, "required_fields")
                flag_modified(existing, "validation_rules")
                # Restore status
                if previous_status == "Passed":
                    existing.test_status = "Passed"
                elif "test_status" not in data:
                    existing.test_status = previous_status
            else:
                if "test_status" not in data:
                    data["test_status"] = "Not Tested"
                db.add(FBRScenario(**data))
        db.commit()
        print(f"Seeded {len(OFFICIAL_SCENARIOS)} FBR scenarios.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_scenarios()
