# Switch on Google sign-in + the online leaderboard (one-time, ~5 minutes, free)

The homepage and game are already fully wired for Firebase. They stay in
"coming soon" mode until you paste your project config. Steps:

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. **Add project** → name it `stack-and-snap` → Google Analytics can stay OFF → Create.

## 2. Register the web app and get the config
1. In the project overview, click the **`</>` (Web)** icon → nickname `web` → **Register app**.
2. It shows a `firebaseConfig = { ... }` block. Copy the values into
   [`firebase-config.js`](firebase-config.js) in this repo (replace the PASTE_ placeholders).

## 3. Enable Google sign-in
1. Left menu: **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Google** → Enable → pick your support email → Save.
3. Still in Authentication: **Settings → Authorized domains → Add domain** →
   add `harshvardhanvg10.github.io`.

## 4. Create the leaderboard database
1. Left menu: **Build → Firestore Database → Create database** →
   **Start in production mode** → pick any region → Enable.
2. Open the **Rules** tab and replace everything with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{uid} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.uid == uid
        && request.resource.data.score is number
        && request.resource.data.score >= 0
        && request.resource.data.score < 100000
        && request.resource.data.name is string
        && request.resource.data.name.size() < 60;
    }
  }
}
```

3. **Publish**.

## 5. Push the config
Commit and push the edited `firebase-config.js` (these keys are public by
design — the security lives in the rules above):

```
git add firebase-config.js
git commit -m "Connect Firebase"
git push
```

Two minutes later: Google sign-in works on the homepage, every signed-in
player's best score uploads automatically after each game, and the top-10
leaderboard is live for everyone.

Note: like any client-side game, a determined cheater could post a fake score
(the rules cap it at 99,999). Fine for a fun leaderboard; a tamper-proof one
would need server-side validation later.
