#!/usr/bin/env python3
"""
Generate fake data for housing dashboard prototype.
Creates realistic but anonymized data matching the Excel structure.
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# Seed for reproducibility
random.seed(42)

def random_date(start_year=2023, end_year=2025):
    """Generate random date within range."""
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    random_days = random.randint(0, delta.days)
    return (start + timedelta(days=random_days)).strftime('%Y-%m-%d')

def random_phone():
    """Generate fake phone number."""
    return f"({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}"

# Fake names
first_names = ["James", "Mary", "Robert", "Patricia", "Michael", "Jennifer", "William", "Linda",
               "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
              "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson"]

def random_name():
    """Generate random full name."""
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Seattle area addresses
addresses = [
    "1234 Pine Street, Seattle, WA 98101",
    "5678 Broadway Ave, Seattle, WA 98102",
    "910 Madison St, Seattle, WA 98104",
    "2345 Summit Ave, Seattle, WA 98122"
]

payment_types = ["Private Pay", "Voucher", "ERD", "Family Support"]
bed_statuses = ["Available", "Occupied", "Pending", "Hold"]

def generate_houses():
    """Generate fake house data."""
    houses = []
    for i, address in enumerate(addresses, 1):
        houses.append({
            "house_id": f"house_{i}",
            "address": address,
            "total_beds": random.randint(8, 15),
            "notes": "" if random.random() > 0.3 else "Recently renovated" if i == 1 else ""
        })
    return houses

def generate_beds(houses):
    """Generate fake bed data for all houses."""
    beds = []
    bed_counter = 1

    for house in houses:
        num_beds = house["total_beds"]
        for bed_num in range(1, num_beds + 1):
            room_num = f"Room {((bed_num - 1) // 2) + 1}{chr(65 + (bed_num - 1) % 2)}"  # Room 1A, 1B, 2A, 2B, etc.

            # 70% occupied, 20% available, 10% pending/hold
            rand = random.random()
            if rand < 0.7:
                status = "Occupied"
            elif rand < 0.9:
                status = "Available"
            else:
                status = random.choice(["Pending", "Hold"])

            beds.append({
                "bed_id": f"bed_{bed_counter:03d}",
                "house_id": house["house_id"],
                "room_number": room_num,
                "status": status,
                "tenant_id": None,  # Will be filled when creating tenants
                "notes": ""
            })
            bed_counter += 1

    return beds

def generate_tenants(beds):
    """Generate fake tenant data for occupied beds."""
    tenants = []
    tenant_counter = 1

    # Get only occupied or pending beds
    occupied_beds = [b for b in beds if b["status"] in ["Occupied", "Pending"]]

    used_names = set()

    for bed in occupied_beds:
        # Generate unique name
        name = random_name()
        while name in used_names:
            name = random_name()
        used_names.add(name)

        # Random entry date in past 2 years
        entry_date = random_date(2023, 2024)

        # 20% have exited
        exit_date = None
        if random.random() < 0.2:
            # Exited sometime after entry
            exit_date = random_date(2024, 2025)
            bed["status"] = "Available"  # Update bed status
            bed["tenant_id"] = None
        else:
            bed["tenant_id"] = f"tenant_{tenant_counter:03d}"

        # Payment details
        payment_type = random.choice(payment_types)

        # Voucher dates if payment is voucher
        voucher_start = entry_date if payment_type == "Voucher" else None
        voucher_end = None
        if payment_type == "Voucher":
            # Voucher ends 6-12 months after start
            start_dt = datetime.strptime(entry_date, '%Y-%m-%d')
            end_dt = start_dt + timedelta(days=random.randint(180, 365))
            voucher_end = end_dt.strftime('%Y-%m-%d')

        # Rent amounts
        rent_due = random.choice([650, 700, 750, 800]) if payment_type in ["Private Pay", "Family Support"] else 0
        rent_paid = rent_due - random.choice([0, 0, 0, 50, 100, 150]) if rent_due > 0 else 0  # 60% fully paid

        tenant = {
            "tenant_id": f"tenant_{tenant_counter:03d}",
            "full_name": name,
            "dob": random_date(1960, 2000),  # Age 25-65
            "phone": random_phone(),
            "entry_date": entry_date,
            "exit_date": exit_date,
            "doc_number": f"DOC{random.randint(100000, 999999)}",
            "payment_type": payment_type,
            "voucher_start": voucher_start,
            "voucher_end": voucher_end,
            "rent_due": rent_due,
            "rent_paid": rent_paid,
            "notes": "" if random.random() > 0.2 else random.choice([
                "Requires medication management",
                "Weekly check-ins with CCO",
                "Good standing, no issues",
                "Behind on rent - follow up needed"
            ]),
            "bed_id": bed["bed_id"] if bed["tenant_id"] else None
        }

        tenants.append(tenant)
        tenant_counter += 1

    return tenants

def generate_all_data():
    """Generate complete fake dataset."""
    print("Generating fake data...")

    houses = generate_houses()
    print(f"  Generated {len(houses)} houses")

    beds = generate_beds(houses)
    print(f"  Generated {len(beds)} beds")

    tenants = generate_tenants(beds)
    print(f"  Generated {len(tenants)} tenants")

    # Calculate metrics
    occupied_count = sum(1 for b in beds if b["status"] == "Occupied")
    available_count = sum(1 for b in beds if b["status"] == "Available")
    pending_count = sum(1 for b in beds if b["status"] == "Pending")
    hold_count = sum(1 for b in beds if b["status"] == "Hold")

    current_tenants = [t for t in tenants if not t["exit_date"]]
    exited_tenants = [t for t in tenants if t["exit_date"]]

    data = {
        "houses": houses,
        "beds": beds,
        "tenants": tenants,
        "metrics": {
            "total_beds": len(beds),
            "occupied_beds": occupied_count,
            "available_beds": available_count,
            "pending_beds": pending_count,
            "hold_beds": hold_count,
            "occupancy_rate": round((occupied_count / len(beds)) * 100, 1),
            "total_tenants": len(current_tenants),
            "exited_tenants": len(exited_tenants)
        }
    }

    return data

if __name__ == "__main__":
    data = generate_all_data()

    # Save to JSON files
    output_dir = Path("prototype_data")
    output_dir.mkdir(exist_ok=True)

    # Save all data
    with open(output_dir / "all_data.json", 'w') as f:
        json.dump(data, f, indent=2)

    # Save individual entity files
    with open(output_dir / "houses.json", 'w') as f:
        json.dump(data["houses"], f, indent=2)

    with open(output_dir / "beds.json", 'w') as f:
        json.dump(data["beds"], f, indent=2)

    with open(output_dir / "tenants.json", 'w') as f:
        json.dump(data["tenants"], f, indent=2)

    with open(output_dir / "metrics.json", 'w') as f:
        json.dump(data["metrics"], f, indent=2)

    print("\nData generation complete!")
    print(f"  Files saved to: {output_dir}/")
    print(f"\nSummary:")
    print(f"  Houses: {len(data['houses'])}")
    print(f"  Beds: {len(data['beds'])}")
    print(f"  Tenants: {len(data['tenants'])} ({data['metrics']['total_tenants']} current, {data['metrics']['exited_tenants']} exited)")
    print(f"  Occupancy Rate: {data['metrics']['occupancy_rate']}%")
