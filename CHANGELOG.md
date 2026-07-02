# Change Log

All notable changes to the "vish-live-server" extension will be documented in this file.


## [0.2.2] - 2026-07-02

### Added
- Added Live Preview inside VS Code using WebView.
- Added automatic port detection when the default port is already in use.
- Added shared server support for Browser and Live Preview.

### Changed
- Replaced timeout-based startup with Promise-based server startup synchronization.
- Refactored the extension into reusable utility functions.
- Improved server lifecycle management.
- Improved status bar updates during server start and stop.
- Updated the README with feature documentation and demo sections.

### Improved
- Improved startup reliability.
- Improved server startup error handling.
- Better handling when the Live Server is already running.
- Cleaner startup flow by waiting until the server is fully ready before opening the browser or Live Preview.

### Fixed
- Fixed race conditions during server startup.
- Fixed issues caused by occupied default ports by automatically selecting the next available port.

---

## [0.2.1] - 2026-07-02

### Changed
- Updated documentation.
- Added proper demo GIFs to the README.

---

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
