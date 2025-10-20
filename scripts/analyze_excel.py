#!/usr/bin/env python3
"""
Analyze Excel file structure without exposing sensitive data.
This script extracts column names, data types, and sample patterns.
"""

import pandas as pd
import json
from pathlib import Path

def analyze_excel(filepath):
    """Analyze Excel file and extract structure information."""

    # Read Excel file
    xls = pd.ExcelFile(filepath)

    analysis = {
        "sheet_names": xls.sheet_names,
        "sheets": {}
    }

    print(f"Found {len(xls.sheet_names)} sheets in workbook")
    print(f"Sheet names: {xls.sheet_names}\n")

    # Analyze each sheet
    for sheet_name in xls.sheet_names:
        print(f"Analyzing sheet: {sheet_name}")
        df = pd.read_excel(filepath, sheet_name=sheet_name)

        sheet_info = {
            "row_count": len(df),
            "column_count": len(df.columns),
            "columns": {}
        }

        print(f"  Rows: {len(df)}")
        print(f"  Columns: {len(df.columns)}")
        print(f"  Column names:")

        # Analyze each column
        for col in df.columns:
            non_null_count = df[col].notna().sum()
            null_count = df[col].isna().sum()
            dtype = str(df[col].dtype)

            # Get sample values (anonymized)
            sample_values = []
            for val in df[col].dropna().head(3):
                if pd.api.types.is_numeric_dtype(type(val)):
                    sample_values.append(f"<number>")
                elif pd.api.types.is_datetime64_any_dtype(type(val)):
                    sample_values.append(f"<date>")
                elif isinstance(val, str):
                    # Show length and type, not actual value
                    sample_values.append(f"<string, len={len(val)}>")
                else:
                    sample_values.append(f"<{type(val).__name__}>")

            col_info = {
                "data_type": dtype,
                "non_null_count": int(non_null_count),
                "null_count": int(null_count),
                "sample_pattern": sample_values
            }

            sheet_info["columns"][col] = col_info

            print(f"    - {col}: {dtype} (non-null: {non_null_count}, null: {null_count})")

        analysis["sheets"][sheet_name] = sheet_info
        print()

    return analysis

if __name__ == "__main__":
    excel_file = "2024 Current Client Housing Participants.xlsx"

    print(f"Analyzing: {excel_file}\n")
    print("="*60)

    analysis = analyze_excel(excel_file)

    # Save analysis to JSON file
    output_file = "excel_structure_analysis.json"
    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=2)

    print("="*60)
    print(f"\nAnalysis saved to: {output_file}")
