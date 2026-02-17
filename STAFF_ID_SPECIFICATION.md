# Staff ID System Specification

## Overview
Staff IDs are **automatically generated** based on a meaningful format: `0[YY]1FT[Sequential]`

## Format
```
0[YY]1FT[Sequential]
```

Where:
- `0` - Fixed prefix (consistency marker)
- `YY` - 2-digit year of joining (e.g., 25 for 2025, 26 for 2026)
- `1` - Fixed digit (consistency marker)
- `FT` - Fixed for all staff (Faculty/Teaching staff, not variable)
- `Sequential` - 3-digit sequence number (001, 002, 003, etc.)

## Examples
- `0251ft001` - Staff joining 2025, faculty, sequence 001
- `0251ft002` - Staff joining 2025, faculty, sequence 002
- `0261ft001` - Staff joining 2026, faculty, sequence 001

## Auto-Generation Logic
The system automatically generates the staff_id when creating a staff member if:
1. Joining year is provided (to extract YY)
2. No custom staff_id is provided

The system:
- Queries existing staff IDs with the same year prefix (`0YY1ft`)
- Finds the highest sequential number
- Increments and generates next sequential ID
- Displays format as `0YY1ft###` in preview (### = auto-incremented)

## Custom Staff ID (Override)
For bulk imports or legacy records, you can:
1. Leave the custom field empty → Use auto-generated ID
2. Enter a custom value → Override the generation and use that exact ID

Custom IDs are case-insensitive in the form but stored in lowercase.

## Function Implementation

### Backend (`staffController.js`)
```javascript
// Get next sequential staff ID for a year
await getNextSequentialStaffId(2025) // Returns: '0251ft001' (or next available)

// Example logic:
// 1. Build prefix: 0YY1ft
// 2. Query all staff_ids with this prefix
// 3. Extract sequential numbers from last 3 digits
// 4. Find max, increment, pad with zeros
// 5. Return: 0251ft002 (if 001 exists)
```

### Frontend (`Staff.tsx`)
- Shows preview of auto-generated ID pattern: `0[joining_year]1ft###`
- Displays format guidance: "Format: 0[YY]1FT[Sequential], e.g., 0251ft002"
- Allows custom override for imports/legacy records
- Joining year is required input for auto-generation

## Database
- Table: `staff`
- Column: `staff_id` (VARCHAR, PRIMARY KEY)
- No auto-increment sequence (user-provided or generated via logic)

## Cascading Behavior
When a staff member is deleted, all related records are automatically removed:
1. Entries from `teacher_subject_map` deleted
2. Entries from `staff_dept_map` deleted
3. Entries from `staff_role_map` deleted
4. Entry from `auth_credentials` deleted
5. Entry from `staff` deleted

## Notes
- Joining year is **required** for auto-generation
- PIN is auto-generated (6-digit numeric, shown once after creation)
- PIN is bcrypt hashed and stored separately
- If multiple staff added in same year, sequential auto-increments (001, 002, 003...)
- Custom IDs bypass the generation logic entirely (useful for legacy migrations)
