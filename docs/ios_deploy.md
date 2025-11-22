# iOS Deployment & Apple Developer Guide — LenzFit

This guide helps you get the app onto Apple Developer / App Store Connect, and explains how to make the preview/simulator work while supporting on-device ML testing. Follow the numbered sections in order.

**Short recommendation summary**
- Use Xcode automatic signing for first uploads (simpler). Switch to Fastlane + `match` for team-wide CI/CD later.
- Test UI and flows in simulator (stubs used for ML). Test camera + Core ML on a physical iOS device — ML inference and live camera feedback require a real device.
- Use TestFlight for beta distribution and internal testers before submitting to App Store.

---

## 1) Apple Developer enrollment

1. If you don't already have one, enroll in the Apple Developer Program: https://developer.apple.com/programs/
   - Cost: $99/year
   - You'll need Apple ID and company/individual info.

2. After enrollment, open App Store Connect: https://appstoreconnect.apple.com/ and sign in.

---

## 2) Prepare your Xcode project (bundle id, team, automatic signing)

1. Open the iOS workspace in Xcode (important: open `.xcworkspace`):

```bash
cd ios
open LenzFit.xcworkspace
```

2. In Xcode, select the project (top-level `LenzFit`) → Targets → `LenzFit` (your app target) → **General** tab.
   - Set **Bundle Identifier** to a unique reverse-DNS id (e.g. `com.yourcompany.lenzfit`).
   - Under **Signing & Capabilities** set the **Team** to your Apple Developer Team.
   - Enable **Automatically manage signing** for easiest setup.

3. Xcode will create an App ID and provisioning profile for you (if using automatic signing).

---

## 3) Add required capabilities & entitlements

Depending on features, add capabilities (select the `Signing & Capabilities` tab in your target):

- **Camera**: add `Privacy - Camera Usage Description` to `Info.plist` (see section 4).
- **HealthKit**: if you integrate with HealthKit, add the `HealthKit` capability in Xcode and configure permissions in App Store Connect.
- **In-App Purchases**: enable if you plan to sell subscriptions.

If you use push notifications, background modes, or other services, enable them here as well.

---

## 4) Update `Info.plist` with privacy usage strings (required)

Add human-readable explanations for any sensitive permissions the app requests. Without these, iOS will crash the app when it attempts to use the API.

Common keys to add (open `ios/LenzFit/Info.plist` in Xcode or an editor):

- `NSCameraUsageDescription` — e.g. "LenzFit needs camera access to provide live pose detection for exercise form feedback." 
- `NSPhotoLibraryUsageDescription` — if saving or picking videos/images
- `NSMicrophoneUsageDescription` — if you record audio in workouts
- `NSMotionUsageDescription` — if you access motion sensors
- `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` — if using HealthKit

Example `Info.plist` entries (Xcode editing recommended):

```xml
<key>NSCameraUsageDescription</key>
<string>LenzFit needs camera access to provide live pose detection for exercise form feedback.</string>
```

---

## 5) Install CocoaPods and native dependencies

If you add native dependencies (e.g. `react-native-vision-camera`, `react-native-permissions`, or any Core ML model files), run:

```bash
cd ios
pod install
cd ..
```

If you get Pod or Ruby environment issues on macOS, ensure CocoaPods is installed (`sudo gem install cocoapods`) or use Homebrew-managed Ruby.

---

## 6) Running in Simulator vs Device — practical notes

- Simulator: good for UI flows, navigation, and general layout. Camera in the iOS Simulator is limited — the LenzFit demo screen uses stubbed results when native ML isn't present.
- Device: required for live camera + Core ML inference and accurate performance testing. Real devices provide hardware acceleration and real camera frames.

How to run in simulator (Metro + app):

```bash
yarn start      # or npm run start
npx react-native run-ios --simulator "iPhone 14"   # pick a simulator name
```

How to run on a connected physical device (recommended for ML):

1. Plug in your iPhone via USB and trust the computer.
2. In Xcode open `LenzFit.xcworkspace`, select your device as the run target, set the signing team in the project target, then click Run.

Or run from CLI (device name):

```bash
npx react-native run-ios --device "Your iPhone Name"
```

Note: the simulator may not provide camera frames suitable for pose detection — use the device to verify the `FormRating` live camera flow.

---

## 7) Archive, upload and TestFlight

1. In Xcode set the build scheme to `Any iOS Device (arm64)` and increment the **Build** and **Version** numbers in target General.
2. Product → Archive. After archiving, Xcode Organizer appears.
3. Upload the archive to App Store Connect from the Organizer. Resolve any warnings.
4. In App Store Connect create an app record (if you haven't): My Apps → + → New App. Fill in app info, bundle id, SKU, etc.
5. After a build processes, enable TestFlight internal/external testing to invite testers.

---

## 8) App Store submission checklist (high level)

- App name, description, keywords, support URL, marketing URL
- Privacy policy URL (hosted online)
- Screenshots for required device sizes (iPhone 6.7", 6.5", etc.)
- App icon and launch images
- Fill out the App Privacy details and export compliance
- Make sure all required entitlements are configured (HealthKit, In-App Purchase, etc.)

---

## 9) Recommended workflow & automation

- Use automatic signing in Xcode for first builds.
- When you need reproducible CI builds, use `fastlane` with `match` (certificate management) to manage code signing and align with your CI provider.
- Add a CI job to run tests and build archive periodically.

Quick start with Fastlane (optional, only when ready):

```bash
# install fastlane (gem or bundle)
brew install fastlane
cd ios
fastlane init
# configure match and lanes for beta/release
```

---

## 10) Specific ML & camera testing notes for LenzFit

- The form-rating pipeline (Core ML + Vision) will only run correctly on a device. Use the `FormRatingDemo` screen to exercise the JS UI with stubbed data in simulator.
- To test real pose inference:
  - Add your Core ML model to `ios/Models` and ensure it's included in the Xcode target.
  - Implement the Swift native module to open an `AVCaptureSession` and run `VNCoreMLRequest` on frames.
  - Test on a device and iterate on model performance and frame resolution.

---

## Troubleshooting & common gotchas

- If Xcode can't find signing identities, try toggling Automatic signing off/on or sign in to the correct Apple ID in Xcode → Settings.
- If `pod install` fails, run `pod repo update` then `pod install`.
- If you see permission crashes, double-check `Info.plist` keys and strings.
- Always open `.xcworkspace` not `.xcodeproj` when using CocoaPods.

---

If you'd like, I can:
- (A) Add the `NSCameraUsageDescription` and other recommended Info.plist keys directly in the project for you.
- (B) Add a `README` script with the exact `pod install` / `run-ios` commands to `scripts/setup-ios.md`.
- (C) Implement automatic signing defaults in the Xcode project file (I can prepare changes but you must review sensitive signing/team selections).

Tell me which of the three you'd like me to do next (A/B/C) or if you want me to proceed with automating archive + TestFlight upload via `fastlane`.
