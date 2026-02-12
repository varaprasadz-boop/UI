# BizHR - Attendance System

Modern, mobile-first HR attendance UI built with plain HTML, CSS, and JavaScript.

## Included mobile screens

1. **Home / Entry Screen**
   - Centered title: `BizHR - Attendance System`
   - Large touch-friendly action buttons: Check In, Check Out, Break
   - Check-In now opens a `Current Shift` selection step before scan
2. **ID Scanning Interface**
   - Scanner viewfinder with dashed corners and animated scan line
   - QR/Barcode positioning guidance text
   - Cancel action button
3. **Verification & Photo Prompt**
   - Elevated secure profile card with identity details
   - Selected shift is displayed for confirmation
   - Full-width `Capture Live Photo` primary action
4. **Check-In Confirmation**
   - Animated success checkmark
   - Confirmation summary card with circular employee photo
   - Shift name included in confirmation details
   - `Back to Home` action and auto-redirect countdown

## Design system highlights

- Primary Navy: `#0B1F3A`
- Primary Green: `#1DB954`
- Rounded corners (12-16px)
- Soft enterprise card shadows
- Center-focused layout
- Minimum 48px touch targets
- Lucide icon integration

## Run locally

Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.