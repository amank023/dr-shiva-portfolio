# 🩺 Dr. Shiva Singh — Pure React Native Android Admin App

A pure, production-ready **React Native (Community CLI)** Android mobile application with native **Kotlin** and **Java** architecture for Dr. Shiva Singh to manage all clinical administrative operations directly from his Android smartphone.

> **Zero Expo**: Built entirely using pure React Native, native Android Gradle, Kotlin activities, and Java native bridge modules.

---

## 🏛️ Native Android Architecture (Kotlin & Java)

```
mobile/android/
├── app/
│   ├── build.gradle                              # Application-level Gradle configuration (Hermes, Autolinking)
│   ├── proguard-rules.pro                        # Release minification rules
│   └── src/main/
│       ├── AndroidManifest.xml                   # Android manifest (INTERNET, CALL_PHONE permissions)
│       ├── java/com/drshivaadmin/
│       │   ├── MainActivity.kt                   # [KOTLIN] Main ReactActivity entry point
│       │   ├── MainApplication.kt                # [KOTLIN] ReactApplication with ReactHost & Autolinking
│       │   ├── ClinicalNativeModule.java         # [JAVA] Native device diagnostics, dialer & toast
│       │   └── ClinicalNativePackage.java        # [JAVA] ReactPackage registering custom Java modules
│       └── res/                                  # Native drawables, launch mipmaps, strings, styles
├── build.gradle                                  # Project-level Gradle (Kotlin 2.2, RN Gradle Plugin)
├── gradle/wrapper/                               # Gradle Wrapper binaries & properties (Gradle 9.4)
├── gradle.properties                             # Build flags (Hermes enabled, AndroidX, JVM memory)
├── gradlew & gradlew.bat                         # Native Android Gradle build runners
├── local.properties                              # Android SDK location
└── settings.gradle                               # Gradle subproject inclusions
```

### Native Code Highlights
- **Kotlin (`MainActivity.kt` & `MainApplication.kt`)**: Manages the native Android application lifecycle, ReactActivity delegates, and ReactHost initialization.
- **Java (`ClinicalNativeModule.java` & `ClinicalNativePackage.java`)**: Pure Java native module exposing device diagnostics (model, manufacturer, Android SDK level) and hardware-accelerated direct calling intents (`ACTION_DIAL`) to the JavaScript runtime.

---

## 🌟 Admin Capabilities Included

1. **🔐 Authentication & Master Access**
   - Secure token-based session with persistent offline storage via `@react-native-async-storage/async-storage`.
   - Emergency offline unlock fallback key.
   - Master password management in Settings.

2. **📊 Live KPI Clinical Overview**
   - Real-time metrics: Total Consultations, Pending Appointments, Unread Messages, Average Patient Rating, and Chatbot Transcripts.
   - Real-time Database Engine indicator: **🔥 Firebase Cloud Firestore** or **📁 LowDB**.
   - Quick Action buttons: Instant Patient Booking, Direct WhatsApp Launch, and Google Meet Video Consultation Room.

3. **📅 Patient Appointments Management**
   - Filter by status tabs: `All`, `Pending`, `Confirmed`, `Completed`, `Cancelled` with live badges.
   - Search by patient name, phone number, consultation service, or notes.
   - Direct patient action buttons on each card:
     - 📞 **Call**: One-tap phone dialer launch (`tel:<phone>`).
     - 💬 **WhatsApp**: Instant WhatsApp chat (`https://wa.me/<phone>`).
     - 💻 **Meet**: Launches Dr. Shiva's Google Meet room.
     - ⚙️ **Status**: Modal picker to update status with instant backend sync.
     - 🗑️ **Delete**: Confirmed deletion.
   - **+ Add Patient Modal**: Complete consultation scheduling form.

4. **✉️ Contact Inquiries & Patient Messages**
   - Segregation by `All`, `Unread`, and `Read`.
   - Search inquiries by sender name, email, or message contents.
   - Mark Read / Mark Unread toggle.
   - Direct ✉️ **Reply Email** (`mailto:`) and 📞 **Call** buttons.

5. **⭐ Patient Reviews & Testimonials Moderation**
   - Live rating metrics: Average rating, Total reviews, Verified count.
   - Filter by `All`, `Verified`, `Unverified`.
   - One-tap toggle to publish / hide reviews from the live website.
   - Full **Add Review** and **Edit Review** modals with 1–5 star selectors.
   - "↺ Reset to Defaults" option.

6. **🤖 24/7 Virtual Assistant Chat Transcripts**
   - Inspect full dialogue logs between patients and the virtual medical assistant.
   - Intent tags and timestamp tracking.
   - Search queries and responses.
   - "Clear All Logs" button.

7. **📝 Website Content CMS Editor**
   - Modify live doctor identity: Full Name, Specialty, Tagline, Reg. No., Degrees.
   - Update Clinic Contact & OPD Timings: Primary Phone, Email, Location, Address, OPD Hours, Google Meet Consultation Link.
   - Edit Clinical Biographies: Hero intro summary and comprehensive clinical bio.
   - "Save All Changes" directly synced to Firestore Cloud.
   - "Restore Defaults" button.

8. **⚙️ Settings & Server Diagnostics**
   - Live Server Health Ping diagnostics (latency in ms, DB engine status).
   - Preset API Base URL Switcher:
     - **Wi-Fi LAN IP**: `http://10.161.141.191:5000/api` (for physical Android phone)
     - **Android Emulator**: `http://10.0.2.2:5000/api` (for Android Studio emulator)
     - **Cloud Netlify**: `https://dr-shiva-portfolio.netlify.app/api`
     - **Custom URL**: Configurable custom endpoint.
   - Medical Theme Switcher: Clean Clinical Light vs. Dark Medical Slate.

---

## 🚀 Running & Building the App

### 1. Start Metro Bundler
```bash
npm run mobile
# or
cd mobile && npx react-native start
```

### 2. Run on Android Device / Emulator
```bash
npm run mobile:android
# or
cd mobile && npx react-native run-android
```

### 3. Build APK with Native Gradle
To generate the debug APK directly with Gradle:
```bash
cd mobile/android
./gradlew assembleDebug
```
The generated APK will be at:
`mobile/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 Project Structure

```
mobile/
├── App.js                     # Root component (SafeArea, ThemeProvider, AuthProvider)
├── app.json                   # Pure React Native app definition
├── package.json               # Pure React Native 0.88 & React 19 dependencies
├── metro.config.js            # Metro bundler configuration
├── babel.config.js            # Babel preset for React Native
├── index.js                   # AppRegistry entry point
├── android/                   # Native Android Project (Kotlin & Java)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/drshivaadmin/
│   │       │   ├── MainActivity.kt           # Kotlin ReactActivity
│   │       │   ├── MainApplication.kt        # Kotlin ReactApplication
│   │       │   ├── ClinicalNativeModule.java # Java Native Bridge Module
│   │       │   └── ClinicalNativePackage.java# Java Package
│   │       └── res/                          # Android Resources
│   ├── build.gradle
│   ├── gradlew
│   └── settings.gradle
└── src/                       # Pure React Native Application Logic
    ├── components/            # Clinical Header, KPI StatCards, StatusBadges
    ├── config/apiConfig.js    # Presets: Wi-Fi, Emulator, Netlify Cloud
    ├── context/               # AuthContext & ThemeContext
    ├── screens/               # 8 Admin Screens (Visits, Messages, Reviews, CMS, etc.)
    └── services/              # API Client & Native Device Bridge
```
