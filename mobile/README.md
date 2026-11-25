# 🩺 Dr. Shiva Singh — Mobile Admin Android App

A complete, production-ready React Native (Expo SDK 52) mobile application for Dr. Shiva Singh to manage all clinical administrative operations directly from his Android smartphone.

---

## 🌟 Key Features

1. **🔐 Authentication & Master Access**
   - Secure token-based session with persistent offline storage via `@react-native-async-storage/async-storage`.
   - Emergency offline unlock fallback key.
   - Change Admin Password directly within the app (`SettingsScreen`).

2. **📊 Live KPI Clinical Overview**
   - Live metrics: Total Consultations, Pending Appointments, Unread Messages, Average Patient Rating, and Chatbot Transcripts.
   - Real-time Database Engine indicator: **🔥 Firebase Cloud Firestore** or **📁 LowDB**.
   - Quick Action buttons: Instant Patient Booking, Direct WhatsApp Launch, and Google Meet Video Consultation Room.

3. **📅 Patient Appointments Management**
   - Filter by status tabs: `All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`.
   - Live search by patient name, phone number, consultation service, or notes.
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

## 🚀 Running the App

### 1. Start the Mobile Expo Development Server
```bash
cd mobile
npm start
```
Or:
```bash
npx expo start
```

### 2. Run on Your Android Device
- **Physical Android Phone**:
  1. Install **Expo Go** from Google Play Store on your phone.
  2. Ensure your phone and development computer are connected to the same Wi-Fi network.
  3. Scan the QR code displayed in your terminal using Expo Go.
  4. In the app login screen or settings, ensure the API URL is set to your computer's LAN IP: `http://10.161.141.191:5000/api`.

- **Android Studio Emulator**:
  1. Start your Android Emulator.
  2. Press `a` in the Expo terminal.
  3. Set the API URL to: `http://10.0.2.2:5000/api`.

- **Web Preview**:
  1. Press `w` in the Expo terminal.
  2. Set the API URL to: `http://localhost:5000/api`.

---

## 📁 Project Structure

```
mobile/
├── App.js                     # Root component (SafeArea, ThemeProvider, AuthProvider)
├── app.json                   # Expo configuration (bundle ID com.drshiva.admin, permissions)
├── package.json               # Expo SDK 52 & React Native dependencies
├── src/
│   ├── components/
│   │   ├── Header.js          # Clinical header, DB engine indicator, dark mode toggle
│   │   ├── StatCard.js        # KPI overview card
│   │   └── StatusBadge.js     # Status badges (pending, confirmed, completed, cancelled)
│   ├── config/
│   │   └── apiConfig.js       # Preset API URLs (Wi-Fi, Emulator, Localhost, Netlify)
│   ├── context/
│   │   ├── AuthContext.js     # Auth session, token storage, login/logout
│   │   └── ThemeContext.js    # Medical Light/Dark themes
│   ├── screens/
│   │   ├── LoginScreen.js         # Master login screen & quick server config modal
│   │   ├── MainNavigator.js       # Persistent bottom navigation tabs & badge counters
│   │   ├── OverviewScreen.js      # Dashboard KPI overview & quick actions
│   │   ├── AppointmentsScreen.js  # Patient appointment scheduling & management
│   │   ├── MessagesScreen.js      # Patient contact inbox & replies
│   │   ├── ReviewsScreen.js       # Testimonials moderation & CMS
│   │   ├── ChatLogsScreen.js      # AI bot transcripts & session logs
│   │   ├── ContentScreen.js       # Website CMS profile & OPD editor
│   │   └── SettingsScreen.js      # Security, diagnostics & backend switcher
│   └── services/
│       ├── api.js             # Full API client with token headers & error handling
│       └── storage.js         # AsyncStorage wrapper for token & API URL
```
