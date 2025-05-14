
# PollenPedia Explorer - Offline Version

This is a standalone HTML version of the PollenPedia Explorer application. It works completely offline and stores all data in your browser's local storage.

## How to Use

1. Simply open the `index-standalone.html` file in your web browser.
2. All data you enter will be saved locally in your browser.
3. You can add, edit, and delete pollen records.
4. Upload images for each pollen record.
5. All data persists between sessions - even if you close your browser or turn off your computer.

## Features

- Complete offline functionality
- Data persistence using browser's localStorage
- Responsive design for all device sizes
- Image upload and storage
- Search and filtering capabilities
- Sorting by different criteria

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No internet connection required after initial load

## Technical Details

This application uses:
- HTML5
- CSS (with Tailwind CSS)
- Vanilla JavaScript
- Browser localStorage for data persistence
- Data URL encoding for image storage

## Important Notes

1. The database is stored in your browser's localStorage, which has a size limit (typically 5-10MB).
2. Clearing your browser data/cache will delete all stored information.
3. Your data stays on your device - nothing is sent to any server.

