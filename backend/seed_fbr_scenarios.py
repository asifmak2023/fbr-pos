"""Seed remaining FBR sandbox scenarios from PRAL DI Scenarios JSON v1.11 (2025)."""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import Base, SessionLocal, engine
from app.models.fbr_scenario import FBRScenario


def invoice(code, date, item_data, *, seller="Company 8", buyer="1000000000000", ref="SI-20250421-001", extra=None):
    data = {"invoiceType": "Sale Invoice", "invoiceDate": date, "sellerNTNCNIC": "8885801", "sellerBusinessName": seller, "sellerProvince": "Sindh", "sellerAddress": "Karachi", "buyerNTNCNIC": buyer, "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW", "buyerProvince": "Sindh", "buyerAddress": "Karachi", "invoiceRefNo": ref, "scenarioId": code, "buyerRegistrationType": "Unregistered", "items": [item_data]}
    if extra:
        data.update(extra)
    return data


def item(hs, description, rate, quantity, value, tax, sale_type, sro="", serial="", **extra):
    data = {"hsCode": hs, "productDescription": description, "rate": rate, "uoM": "Numbers, pieces, units", "quantity": quantity, "totalValues": 0, "valueSalesExcludingST": value, "fixedNotifiedValueOrRetailPrice": 0, "salesTaxApplicable": tax, "salesTaxWithheldAtSource": 0, "extraTax": 0, "furtherTax": 0, "sroScheduleNo": sro, "fedPayable": 0, "discount": 0, "saleType": sale_type, "sroItemSerialNo": serial}
    data.update(extra)
    return data


OFFICIAL_SCENARIOS = [
 {"scenario_code":"SN005","name":"Sales of Reduced Rate Goods (Eighth Schedule)","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":False,"sample_invoice_data":invoice("SN005","2025-06-30",item("0102.2930","product Description41","1%",1.0,1000.0,10,"Goods at Reduced Rate","EIGHTH SCHEDULE Table 1","82",salesTaxWithheldAtSource=50.23,extraTax="",furtherTax=120.0,fedPayable=50.36,discount=56.36),seller="B2",ref=""),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"1%","saleType":"Goods at Reduced Rate"}},
 {"scenario_code":"SN006","name":"Sale of Exempt Goods (Sixth Schedule)","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Registered","requires_buyer_ntn":True,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN006","2025-07-01",item("0102.2930","product Description41","Exempt",1.0,10,0,"Exempt goods","6th Schd Table I","100",salesTaxWithheldAtSource=50.23,extraTax="",furtherTax=120.0,fedPayable=50.36,discount=56.36),buyer="2046004",ref="SI-20250515-001",extra={"buyerRegistrationType":"Registered"}),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"Exempt","saleType":"Exempt goods"}},
 {"scenario_code":"SN007","name":"Sale of Zero-Rated Goods (Fifth Schedule)","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN007","2025-04-21",item("0101.2100","test","0%",100,100,0,"Goods at zero-rate","327(I)/2008","1"),seller="Company 7",buyer="3710505701479",ref="0"),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"0%","saleType":"Goods at zero-rate"}},
 {"scenario_code":"SN015","name":"Sale of Mobile Phones","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN015","2025-05-15",item("0101.2100","TEST","18%",123,1234,222.12,"Mobile Phones","NINTH SCHEDULE","11(A)"),extra={"additional1":"","additional2":"","additional3":""}),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"18%","saleType":"Mobile Phones"}},
 {"scenario_code":"SN016","name":"Processing / Conversion of Goods","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":False,"sample_invoice_data":invoice("SN016","2025-05-16",item("0101.2100","test","5%",1,100,5,"Processing/Conversion of Goods"),buyer="1000000000078",ref=""),"required_fields":[],"validation_rules":{"rate":"5%","saleType":"Processing/Conversion of Goods"}},
 {"scenario_code":"SN017","name":"Sale of Goods Where FED Is Charged in ST Mode","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":False,"sample_invoice_data":invoice("SN017","2025-05-10",item("0101.2100","TEST","8%",1,100,8,"Goods (FED in ST Mode)"),buyer="7000009",ref=""),"required_fields":[],"validation_rules":{"rate":"8%","saleType":"Goods (FED in ST Mode)"}},
 {"scenario_code":"SN018","name":"Sale of Services Where FED Is Charged in ST Mode","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN018","2025-06-14",item("0101.2100","TEST","8%",20,1000,80,"Services (FED in ST Mode)"),buyer="1000000000056"),"required_fields":[],"validation_rules":{"rate":"8%","saleType":"Services (FED in ST Mode)"}},
 {"scenario_code":"SN019","name":"Sale of Services (as per ICT Ordinance)","description":"PRAL sandbox test data","business_activity":"Service Provider","sector":"Services","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN019","2025-04-21",item("0101.2900","TEST","5%",1,100,5,"Services","ICTO TABLE I","11(ii)(ii)(a)")),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"5%","saleType":"Services"}},
 {"scenario_code":"SN021","name":"Sale of Cement /Concrete Block","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN021","2025-04-21",item("0101.2100","TEST","Rs.3",12,123,36,"Cement /Concrete Block")),"required_fields":[],"validation_rules":{"rate":"Rs.3","saleType":"Cement /Concrete Block"}},
 {"scenario_code":"SN022","name":"Sale of Potassium Chlorate","description":"PRAL sandbox test data","business_activity":"Importer","sector":"All Other Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN022","2025-04-21",item("3104.2000","TEST","18% along with rupees 60 per kilogram",1,100,78,"Potassium Chlorate","EIGHTH SCHEDULE Table 1","56",uoM="KG")),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"18% along with rupees 60 per kilogram","saleType":"Potassium Chlorate"}},
 {"scenario_code":"SN024","name":"Sale of Goods Listed in SRO 297(I)/2023","description":"PRAL sandbox test data","business_activity":"All Other Sectors","sector":"All Sectors","buyer_registration_type":"Unregistered","requires_buyer_ntn":False,"requires_reference_invoice":True,"sample_invoice_data":invoice("SN024","2025-04-21",item("0101.2100","TEST","25%",123,1000,250,"Goods as per SRO.297(|)/2023","297(I)/2023-Table-I","12")),"required_fields":["sroScheduleNo","sroItemSerialNo"],"validation_rules":{"rate":"25%","saleType":"Goods as per SRO.297(|)/2023"}},
]


def seed_scenarios():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in OFFICIAL_SCENARIOS:
            existing = db.query(FBRScenario).filter_by(scenario_code=data["scenario_code"]).first()
            if existing:
                previous_status = existing.test_status
                for key, value in data.items():
                    setattr(existing, key, value)
                existing.test_status = previous_status
            else:
                db.add(FBRScenario(**data))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_scenarios()
