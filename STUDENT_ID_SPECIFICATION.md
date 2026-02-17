# Student ID System Specification

## Overview
Student IDs are automatically generated based on a meaningful format that encodes information about the student's academic profile.

## Format
```
0[YY]1[CourseCode][RollNumber]
```

Where:
- `0` - Fixed prefix (significance unknown, preserved for consistency)
- `YY` - 2-digit year of joining (e.g., 25 for 2025, 26 for 2026)
- `1` - Fixed digit (significance unknown, preserved for consistency)
- `CourseCode` - First word of course name in lowercase (e.g., "bca", "cs", "it")
- `RollNumber` - Sequential/numeric identifier within the course for that year

## Examples
- `0251bca116` - Student joining 2025, BCA course, roll number 116
- `0261cs001` - Student joining 2026, CS course, roll number 001
- `0261it042` - Student joining 2026, IT course, roll number 042

## Auto-Generation Logic
The system automatically generates the student_id when creating a student if:
1. Class is selected (to extract course code)
2. Admission year is provided (to extract YY)
3. Roll number is entered

The generated ID is displayed as a preview in the form before submission.

## Custom Student ID (Override)
For bulk imports or legacy records, you can:
1. Leave the custom field empty → Use auto-generated ID
2. Enter a custom value → Override the generation and use that exact ID

Custom IDs are case-insensitive in the form but stored normalizedto uppercase.

## Function Implementation

### Backend (`studentController.js`)
```javascript
// Extract course code from course name
extractCourseCode('BCA Computer Science') // Returns: 'bca'

// Generate student ID
generateStudentId(2025, 'bca', '116') // Returns: '0251bca116'
```

### Frontend (`Students.tsx`)
- Shows preview of auto-generated ID in real-time
- Displays format guidance: "0[YY]1[CourseCode][RollNumber]"
- Allows custom override for imports/legacy records

## Database
- Table: `students`
- Column: `student_id` (VARCHAR, PRIMARY KEY)
- No auto-increment sequence (user-provided or generated)

## Notes
- Roll number is kept separate in `roll_number` column for flexibility
- Batch field still available (e.g., "2025-2029")
- Email and phone number remain for contact purposes
