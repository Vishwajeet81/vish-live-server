# Change Log

All notable changes to the "vish-live-server" extension will be documented in this file.

---


## [0.2.3] - 2026-07-02

### Changed
- Updated the CHANGELOG.md documentation.

---

## [0.2.2] - 2026-07-02

### Added
- Added automatic port detection when the default port is already in use.

### Changed
- Replaced timeout-based startup with Promise-based server startup synchronization.
- Improved server lifecycle management.
- Improved status bar updates during server start and stop.
- Updated the README with new documentation and demo GIFs.

### Improved
- Improved startup reliability.
- Improved server startup error handling.
- Improved handling when the Live Server is already running.
- Added automatic recovery by selecting the next available port when the default port is occupied.

### Fixed
- Fixed race conditions during server startup.
- Fixed startup failures caused by occupied default ports.

---

## [0.2.1] - 2026-07-02

### Changed
- Updated project documentation.
- Added demo GIFs to the README.

---

## [0.2.0] - 2026-07-01

### Added
- Added Live Preview inside VS Code using WebView.
- Added shared server support for Browser and Live Preview.

### Changed
- Replaced timeout-based startup with Promise-based server startup synchronization.
- Refactored the extension into reusable utility functions.
- Improved status bar updates and server lifecycle handling.

### Improved
- Improved startup reliability.
- Better handling when the Live Server is already running.