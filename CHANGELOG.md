# Change Log

All notable changes to the "vish-live-server" extension will be documented in this file.

## [0.2.0] - 2026-07-01

### Added
- Added Live Preview inside VS Code using WebView.
- Added shared server support for Browser and Preview.

### Changed
- Replaced timeout-based startup with Promise-based server startup synchronization.
- Refactored extension code into reusable utility functions.
- Improved status bar updates and server lifecycle handling.

### Fixed
- Improved startup reliability.
- Better handling when the Live Server is already running.
