# iOS Matomo Widget for Scriptable

This repository contains a script for the iOS app "Scriptable" that generates a widget displaying visitor statistics from a Matomo analytics server.

## Features

- Displays today's visitor count.
- Displays yesterday's visitor count.
- Displays the current week's visitor count.
- Displays the previous week's visitor count.

## Requirements

- iOS device with Scriptable app installed.
- Access to a Matomo analytics server.

## Setup

1. Clone or download this repository to your device.
2. Open the Scriptable app on your iOS device.
3. Create a new script and copy the contents of the `matomo_widget.js` file into the script editor.
4. Replace the placeholder values in the script with your actual Matomo URL, site ID, site name, and API token.
    - `const matomoUrl = "https://your-matomo-url.com";`
    - `const siteId = "your-site-id";`
    - `const siteName = "your-site-name";`
    - `const tokenAuth = "your-matomo-api-token";`
5. Run the script to verify it works correctly.

## Usage

To add the widget to your home screen:

1. Long press on your home screen and enter the "jiggle" mode.
2. Tap the "+" button in the upper-left corner.
3. Scroll down and select Scriptable.
4. Choose the size of the widget you want to add.
5. Tap "Add Widget".
6. Long press the newly created widget and select "Edit Widget".
7. Choose the script you've created for the Matomo widget.
8. Exit the "jiggle" mode.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
