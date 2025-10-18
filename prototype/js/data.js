// Housing Dashboard Prototype Data
// This file contains fake data for demonstration purposes

const dashboardData = {
  "houses": [
    {
      "house_id": "house_1",
      "address": "1234 Pine Street, Seattle, WA 98101",
      "total_beds": 8,
      "notes": "Recently renovated"
    },
    {
      "house_id": "house_2",
      "address": "5678 Broadway Ave, Seattle, WA 98102",
      "total_beds": 11,
      "notes": ""
    },
    {
      "house_id": "house_3",
      "address": "910 Madison St, Seattle, WA 98104",
      "total_beds": 11,
      "notes": ""
    },
    {
      "house_id": "house_4",
      "address": "2345 Summit Ave, Seattle, WA 98122",
      "total_beds": 10,
      "notes": ""
    }
  ],
  "beds": [
    {"bed_id": "bed_001", "house_id": "house_1", "room_number": "Room 1A", "status": "Occupied", "tenant_id": "tenant_001", "notes": ""},
    {"bed_id": "bed_002", "house_id": "house_1", "room_number": "Room 1B", "status": "Pending", "tenant_id": "tenant_002", "notes": ""},
    {"bed_id": "bed_003", "house_id": "house_1", "room_number": "Room 2A", "status": "Occupied", "tenant_id": "tenant_003", "notes": ""},
    {"bed_id": "bed_004", "house_id": "house_1", "room_number": "Room 2B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_005", "house_id": "house_1", "room_number": "Room 3A", "status": "Occupied", "tenant_id": "tenant_004", "notes": ""},
    {"bed_id": "bed_006", "house_id": "house_1", "room_number": "Room 3B", "status": "Occupied", "tenant_id": "tenant_005", "notes": ""},
    {"bed_id": "bed_007", "house_id": "house_1", "room_number": "Room 4A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_008", "house_id": "house_1", "room_number": "Room 4B", "status": "Occupied", "tenant_id": "tenant_006", "notes": ""},
    {"bed_id": "bed_009", "house_id": "house_2", "room_number": "Room 1A", "status": "Occupied", "tenant_id": "tenant_007", "notes": ""},
    {"bed_id": "bed_010", "house_id": "house_2", "room_number": "Room 1B", "status": "Occupied", "tenant_id": "tenant_008", "notes": ""},
    {"bed_id": "bed_011", "house_id": "house_2", "room_number": "Room 2A", "status": "Occupied", "tenant_id": "tenant_009", "notes": ""},
    {"bed_id": "bed_012", "house_id": "house_2", "room_number": "Room 2B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_013", "house_id": "house_2", "room_number": "Room 3A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_014", "house_id": "house_2", "room_number": "Room 3B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_015", "house_id": "house_2", "room_number": "Room 4A", "status": "Occupied", "tenant_id": "tenant_010", "notes": ""},
    {"bed_id": "bed_016", "house_id": "house_2", "room_number": "Room 4B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_017", "house_id": "house_2", "room_number": "Room 5A", "status": "Occupied", "tenant_id": "tenant_011", "notes": ""},
    {"bed_id": "bed_018", "house_id": "house_2", "room_number": "Room 5B", "status": "Occupied", "tenant_id": "tenant_012", "notes": ""},
    {"bed_id": "bed_019", "house_id": "house_2", "room_number": "Room 6A", "status": "Occupied", "tenant_id": "tenant_013", "notes": ""},
    {"bed_id": "bed_020", "house_id": "house_2", "room_number": "Room 6B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_021", "house_id": "house_3", "room_number": "Room 1A", "status": "Pending", "tenant_id": "tenant_014", "notes": ""},
    {"bed_id": "bed_022", "house_id": "house_3", "room_number": "Room 1B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_023", "house_id": "house_3", "room_number": "Room 2A", "status": "Occupied", "tenant_id": "tenant_015", "notes": ""},
    {"bed_id": "bed_024", "house_id": "house_3", "room_number": "Room 2B", "status": "Occupied", "tenant_id": "tenant_016", "notes": ""},
    {"bed_id": "bed_025", "house_id": "house_3", "room_number": "Room 3A", "status": "Occupied", "tenant_id": "tenant_017", "notes": ""},
    {"bed_id": "bed_026", "house_id": "house_3", "room_number": "Room 3B", "status": "Occupied", "tenant_id": "tenant_018", "notes": ""},
    {"bed_id": "bed_027", "house_id": "house_3", "room_number": "Room 4A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_028", "house_id": "house_3", "room_number": "Room 4B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_029", "house_id": "house_3", "room_number": "Room 5A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_030", "house_id": "house_3", "room_number": "Room 5B", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_031", "house_id": "house_3", "room_number": "Room 6A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_032", "house_id": "house_4", "room_number": "Room 1A", "status": "Occupied", "tenant_id": "tenant_019", "notes": ""},
    {"bed_id": "bed_033", "house_id": "house_4", "room_number": "Room 1B", "status": "Occupied", "tenant_id": "tenant_020", "notes": ""},
    {"bed_id": "bed_034", "house_id": "house_4", "room_number": "Room 2A", "status": "Occupied", "tenant_id": "tenant_021", "notes": ""},
    {"bed_id": "bed_035", "house_id": "house_4", "room_number": "Room 2B", "status": "Occupied", "tenant_id": "tenant_022", "notes": ""},
    {"bed_id": "bed_036", "house_id": "house_4", "room_number": "Room 3A", "status": "Available", "tenant_id": null, "notes": ""},
    {"bed_id": "bed_037", "house_id": "house_4", "room_number": "Room 3B", "status": "Occupied", "tenant_id": "tenant_023", "notes": ""},
    {"bed_id": "bed_038", "house_id": "house_4", "room_number": "Room 4A", "status": "Occupied", "tenant_id": "tenant_024", "notes": ""},
    {"bed_id": "bed_039", "house_id": "house_4", "room_number": "Room 4B", "status": "Occupied", "tenant_id": "tenant_025", "notes": ""},
    {"bed_id": "bed_040", "house_id": "house_4", "room_number": "Room 5A", "status": "Available", "tenant_id": null, "notes": ""}
  ],
  "tenants": [
    {"tenant_id": "tenant_001", "full_name": "James Smith", "dob": "1975-03-15", "phone": "(206) 555-0101", "entry_date": "2024-01-15", "exit_date": null, "doc_number": "DOC345678", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "Good standing, no issues", "bed_id": "bed_001"},
    {"tenant_id": "tenant_002", "full_name": "Mary Johnson", "dob": "1982-07-22", "phone": "(206) 555-0102", "entry_date": "2024-10-25", "exit_date": null, "doc_number": "DOC456789", "payment_type": "Voucher", "voucher_start": "2024-10-25", "voucher_end": "2025-04-25", "rent_due": 0, "rent_paid": 0, "notes": "", "bed_id": "bed_002"},
    {"tenant_id": "tenant_003", "full_name": "Robert Williams", "dob": "1968-11-30", "phone": "(206) 555-0103", "entry_date": "2023-06-10", "exit_date": null, "doc_number": "DOC567890", "payment_type": "Voucher", "voucher_start": "2023-06-10", "voucher_end": "2025-11-15", "rent_due": 0, "rent_paid": 0, "notes": "Requires medication management", "bed_id": "bed_003"},
    {"tenant_id": "tenant_004", "full_name": "Patricia Brown", "dob": "1990-02-14", "phone": "(206) 555-0104", "entry_date": "2024-03-20", "exit_date": null, "doc_number": "DOC678901", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 750, "rent_paid": 600, "notes": "Behind on rent - follow up needed", "bed_id": "bed_005"},
    {"tenant_id": "tenant_005", "full_name": "Michael Jones", "dob": "1985-09-05", "phone": "(206) 555-0105", "entry_date": "2023-12-01", "exit_date": null, "doc_number": "DOC789012", "payment_type": "Family Support", "voucher_start": null, "voucher_end": null, "rent_due": 650, "rent_paid": 650, "notes": "", "bed_id": "bed_006"},
    {"tenant_id": "tenant_006", "full_name": "Jennifer Garcia", "dob": "1978-04-18", "phone": "(206) 555-0106", "entry_date": "2024-08-10", "exit_date": null, "doc_number": "DOC890123", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "", "bed_id": "bed_008"},
    {"tenant_id": "tenant_007", "full_name": "William Miller", "dob": "1972-12-25", "phone": "(206) 555-0107", "entry_date": "2023-09-15", "exit_date": null, "doc_number": "DOC901234", "payment_type": "Voucher", "voucher_start": "2023-09-15", "voucher_end": "2025-10-28", "rent_due": 0, "rent_paid": 0, "notes": "Weekly check-ins with CCO", "bed_id": "bed_009"},
    {"tenant_id": "tenant_008", "full_name": "Linda Davis", "dob": "1995-06-08", "phone": "(206) 555-0108", "entry_date": "2024-02-28", "exit_date": null, "doc_number": "DOC012345", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 800, "rent_paid": 650, "notes": "", "bed_id": "bed_010"},
    {"tenant_id": "tenant_009", "full_name": "David Rodriguez", "dob": "1988-01-12", "phone": "(206) 555-0109", "entry_date": "2023-11-05", "exit_date": null, "doc_number": "DOC123456", "payment_type": "Voucher", "voucher_start": "2023-11-05", "voucher_end": "2025-11-02", "rent_due": 0, "rent_paid": 0, "notes": "", "bed_id": "bed_011"},
    {"tenant_id": "tenant_010", "full_name": "Barbara Martinez", "dob": "1970-08-30", "phone": "(206) 555-0110", "entry_date": "2024-07-14", "exit_date": null, "doc_number": "DOC234567", "payment_type": "Family Support", "voucher_start": null, "voucher_end": null, "rent_due": 650, "rent_paid": 650, "notes": "Good standing, no issues", "bed_id": "bed_015"},
    {"tenant_id": "tenant_011", "full_name": "Richard Hernandez", "dob": "1992-03-03", "phone": "(206) 555-0111", "entry_date": "2023-10-20", "exit_date": null, "doc_number": "DOC345679", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "", "bed_id": "bed_017"},
    {"tenant_id": "tenant_012", "full_name": "Susan Lopez", "dob": "1984-11-16", "phone": "(206) 555-0112", "entry_date": "2024-01-08", "exit_date": null, "doc_number": "DOC456780", "payment_type": "Voucher", "voucher_start": "2024-01-08", "voucher_end": "2025-11-20", "rent_due": 0, "rent_paid": 0, "notes": "Requires medication management", "bed_id": "bed_018"},
    {"tenant_id": "tenant_013", "full_name": "Joseph Wilson", "dob": "1976-05-27", "phone": "(206) 555-0113", "entry_date": "2023-08-12", "exit_date": null, "doc_number": "DOC567891", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 750, "rent_paid": 750, "notes": "", "bed_id": "bed_019"},
    {"tenant_id": "tenant_014", "full_name": "Jessica Anderson", "dob": "1989-09-09", "phone": "(206) 555-0114", "entry_date": "2024-10-22", "exit_date": null, "doc_number": "DOC678902", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "", "bed_id": "bed_021"},
    {"tenant_id": "tenant_015", "full_name": "Thomas Brown", "dob": "1981-02-19", "phone": "(206) 555-0115", "entry_date": "2024-05-30", "exit_date": null, "doc_number": "DOC789013", "payment_type": "Family Support", "voucher_start": null, "voucher_end": null, "rent_due": 650, "rent_paid": 650, "notes": "Good standing, no issues", "bed_id": "bed_023"},
    {"tenant_id": "tenant_016", "full_name": "Sarah Jones", "dob": "1993-07-14", "phone": "(206) 555-0116", "entry_date": "2023-12-18", "exit_date": null, "doc_number": "DOC890124", "payment_type": "Voucher", "voucher_start": "2023-12-18", "voucher_end": "2025-11-08", "rent_due": 0, "rent_paid": 0, "notes": "Weekly check-ins with CCO", "bed_id": "bed_024"},
    {"tenant_id": "tenant_017", "full_name": "William Smith", "dob": "1987-10-07", "phone": "(206) 555-0117", "entry_date": "2024-06-25", "exit_date": null, "doc_number": "DOC901235", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 800, "rent_paid": 650, "notes": "", "bed_id": "bed_025"},
    {"tenant_id": "tenant_018", "full_name": "Mary Williams", "dob": "1974-04-02", "phone": "(206) 555-0118", "entry_date": "2023-07-11", "exit_date": null, "doc_number": "DOC012346", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "", "bed_id": "bed_026"},
    {"tenant_id": "tenant_019", "full_name": "Robert Garcia", "dob": "1991-12-28", "phone": "(206) 555-0119", "entry_date": "2024-04-15", "exit_date": null, "doc_number": "DOC123457", "payment_type": "Voucher", "voucher_start": "2024-04-15", "voucher_end": "2025-10-15", "rent_due": 0, "rent_paid": 0, "notes": "Requires medication management", "bed_id": "bed_032"},
    {"tenant_id": "tenant_020", "full_name": "Patricia Miller", "dob": "1986-06-21", "phone": "(206) 555-0120", "entry_date": "2023-11-30", "exit_date": null, "doc_number": "DOC234568", "payment_type": "Family Support", "voucher_start": null, "voucher_end": null, "rent_due": 650, "rent_paid": 650, "notes": "", "bed_id": "bed_033"},
    {"tenant_id": "tenant_021", "full_name": "Michael Davis", "dob": "1979-01-24", "phone": "(206) 555-0121", "entry_date": "2024-09-05", "exit_date": null, "doc_number": "DOC345680", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 750, "rent_paid": 750, "notes": "Good standing, no issues", "bed_id": "bed_034"},
    {"tenant_id": "tenant_022", "full_name": "Jennifer Rodriguez", "dob": "1983-08-11", "phone": "(206) 555-0122", "entry_date": "2023-10-08", "exit_date": null, "doc_number": "DOC456781", "payment_type": "Voucher", "voucher_start": "2023-10-08", "voucher_end": "2025-11-27", "rent_due": 0, "rent_paid": 0, "notes": "", "bed_id": "bed_035"},
    {"tenant_id": "tenant_023", "full_name": "William Hernandez", "dob": "1996-03-17", "phone": "(206) 555-0123", "entry_date": "2024-02-12", "exit_date": null, "doc_number": "DOC567892", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 700, "rent_paid": 700, "notes": "Behind on rent - follow up needed", "bed_id": "bed_037"},
    {"tenant_id": "tenant_024", "full_name": "Linda Lopez", "dob": "1971-11-04", "phone": "(206) 555-0124", "entry_date": "2023-09-27", "exit_date": null, "doc_number": "DOC678903", "payment_type": "Private Pay", "voucher_start": null, "voucher_end": null, "rent_due": 800, "rent_paid": 800, "notes": "", "bed_id": "bed_038"},
    {"tenant_id": "tenant_025", "full_name": "David Wilson", "dob": "1994-05-29", "phone": "(206) 555-0125", "entry_date": "2024-07-03", "exit_date": null, "doc_number": "DOC789014", "payment_type": "Family Support", "voucher_start": null, "voucher_end": null, "rent_due": 650, "rent_paid": 650, "notes": "Weekly check-ins with CCO", "bed_id": "bed_039"}
  ],
  "metrics": {
    "total_beds": 40,
    "occupied_beds": 24,
    "available_beds": 14,
    "pending_beds": 2,
    "hold_beds": 0,
    "occupancy_rate": 60.0,
    "total_tenants": 25,
    "exited_tenants": 0
  }
};
