# NexusAI — Complete Setup Guide
## Expo React Native App (Gemini Chatbot)

---

## STEP 1 — Node.js Install Karo

1. Browser mein jao: https://nodejs.org
2. **LTS version** download karo (green button)
3. Install karo — Next Next Next → Finish
4. Verify: Command Prompt kholo aur likho:
   ```
   node --version
   ```
   Agar `v20.x.x` jaisa kuch aaye toh sahi hai ✅

---

## STEP 2 — Project Files Setup

1. Desktop pe ek folder banao: `NexusAI`
2. Is ZIP ke andar jo files hain woh sab us folder mein rakho:
   ```
   NexusAI/
   ├── App.js
   ├── app.json
   ├── package.json
   ├── babel.config.js
   ├── components/
   │   └── theme.js
   └── screens/
       ├── ApiKeyScreen.js
       ├── LoginScreen.js
       └── ChatScreen.js
   ```

---

## STEP 3 — Dependencies Install Karo

1. Command Prompt ya Terminal kholo
2. NexusAI folder mein jao:
   ```
   cd Desktop/NexusAI
   ```
3. Install command chalao:
   ```
   npm install
   ```
   (2-3 minute lagenge, internet chahiye)

---

## STEP 4 — Phone pe Test Karo (Expo Go)

### Phone Setup:
1. Play Store se **"Expo Go"** app install karo

### PC pe:
```
npx expo start
```

Ek QR code aayega terminal mein.

### Phone pe:
- Expo Go app kholo
- **"Scan QR Code"** press karo
- QR scan karo
- App chal jayegi! 🎉

---

## STEP 5 — App ke Andar API Key Set Karo

1. App open hogi → **"Setup API Key"** screen aayegi
2. `aistudio.google.com` jao
3. Login karo → **"Get API Key"** → **"Create API Key"**
4. Key copy karo (`AIzaSy...` se shuru hogi)
5. App mein paste karo → **"VERIFY & SAVE KEY"** press karo
6. Key verify hogi — phir Login screen aayegi
7. **Username:** `admin` | **Password:** `1234`

---

## STEP 6 — APK Build Karo (Real Android File)

### EAS (Expo Application Services) setup:

```bash
# EAS CLI install
npm install -g eas-cli

# Login (free account banana hoga expo.dev pe)
eas login

# Project initialize
eas build:configure

# APK build karo (free)
eas build -p android --profile preview
```

- Build 5-10 minute mein complete ho jaegi **online**
- Aapko ek download link milega
- APK download karo → phone pe install karo

### Phone pe APK Install:
1. Settings → Security → **Unknown Sources** ON karo
2. APK file tap karo → Install
3. Done! ✅

---

## TROUBLESHOOTING

**"npm not found" error:**
→ Node.js dobara install karo, restart karo PC

**"expo: command not found":**
```
npx expo start
```
(expo ki jagah npx expo likho)

**API Key error:**
→ aistudio.google.com pe jao, nai key banao

**Build fail:**
→ `eas.json` mein profile check karo

---

## CREDENTIALS (Change karne ke liye)

`screens/LoginScreen.js` file kholo:
```javascript
const CORRECT_USERNAME = 'admin';   // yahan badlo
const CORRECT_PASSWORD = '1234';    // yahan badlo
```

---

## APP FLOW

```
App Open
    ↓
API Key set hai? 
    NO → API Key Screen → Enter & Verify Key
    YES ↓
Login Screen → admin/1234
    ↓
Chat Screen → Gemini se baat karo!
```
