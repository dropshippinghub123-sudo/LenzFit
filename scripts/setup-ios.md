# Setup iOS development environment (commands)

Run these commands in a Terminal (macOS, zsh):

1) Install CocoaPods (if not installed):

```bash
# Using Homebrew-managed Ruby (recommended)
brew install cocoapods
# Or with gem (may require sudo):
sudo gem install cocoapods
```

2) Install project pods:

```bash
cd ios
pod install
cd ..
```

3) Start Metro and run on simulator:

```bash
yarn start
npx react-native run-ios --simulator "iPhone 14"
```

4) Run on a physical device (recommended for camera/Core ML):

```bash
# Plug device into Mac, unlock and trust the computer.
# Open workspace in Xcode and run from the device selector.
cd ios
open LenzFit.xcworkspace
# Then select your device in Xcode and press Run.
```

5) Troubleshooting:

- If `pod install` fails, run `pod repo update` then `pod install`.
- If facing permission errors with CocoaPods, try using a Homebrew-managed Ruby or rbenv.
- Always open `.xcworkspace`, not `.xcodeproj`.
