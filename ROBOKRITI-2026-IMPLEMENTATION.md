# RoboKriti 2026 implementation

This package uses the existing **Registration Firebase** (`aps-robotics-championship`) as the single Firebase project for registration, Help Centre, and Author/administration.

## Important
- Existing `/registrations` data is preserved.
- Help Centre now points to the Registration Firebase instead of the legacy Help Firebase.
- EmailJS has been removed from the registration flow.
- Robo Saucer has been replaced with Robo Soccer.
- Registration fields have been moved toward the finalized RoboKriti specification.
- Author access remains protected by Firebase Authentication and `/admins/{uid}: true` or `ADMIN_UID`.
- The old second Firebase project configuration is not used by the new public Help Centre.

## Author access
The public homepage has a discreet five-click footer trigger that opens `admin-login.html`. This is only a discovery mechanism; Firebase Authentication/database rules must provide the actual security.
