# Project Rules & Standards

## Android Development
- Use Kotlin for new activities or plugins if possible (though this project currently uses Java for MainActivity).
- Follow Material Design 3 guidelines for any native UI components.
- Ensure all strings are externalized in `strings.xml`.
- Keep `minSdkVersion` at 24 as per Capacitor requirements and project settings.

## Security
- Always use HTTPS for the WebView.
- Do not enable `allowUniversalAccessFromFileURLs` or `allowFileAccessFromFileURLs` unless absolutely necessary.
- Use `network_security_config.xml` for domain-specific security policies.

## Build & Release
- Versioning: Increment `versionCode` for every release. `versionName` should follow SemVer.
- Always test release builds with `minifyEnabled true` to ensure no critical code is stripped.
- Use Android App Bundle (.aab) for Play Store distribution.
