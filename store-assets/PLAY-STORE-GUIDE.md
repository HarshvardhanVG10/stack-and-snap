# Play Store submission guide — Stack & Snap

You already have a Play developer account, so this is the full path from here.

## A. Generate the Android app (PWABuilder, ~15 min, free)

1. Go to https://www.pwabuilder.com and enter:
   `https://harshvardhanvg10.github.io/stack-and-snap/`
2. It will score the PWA (manifest + service worker are already in place).
   Click **Package for stores → Android → Generate**.
3. Settings in the dialog:
   - **Package ID:** `com.harshvardhangaikwad.stackandsnap`
     ⚠ PERMANENT — cannot ever be changed after first upload. Double-check spelling.
   - **App name:** Stack & Snap · **Short name:** Stack&Snap
   - **Signing key:** choose "Create new" and **download + back up the signing
     key files it gives you** (losing them means you can never update the app).
   - Leave everything else default (TWA, portrait).
4. Download the ZIP. Inside you'll find:
   - `*.aab` — the app bundle you upload to Play
   - `assetlinks.json` — domain verification (step C)
   - signing key info (SHA-256 fingerprint)

## B. Create the app in Play Console

1. https://play.google.com/console → **Create app**
   - Name: Stack & Snap · Default language: English (US or UK)
   - App type: **Game** · Free
2. Complete the **Set up your app** checklist (Dashboard walks you through it):
   - **Privacy policy URL:** `https://harshvardhanvg10.github.io/stack-and-snap/privacy.html`
   - **App access:** all functionality available without special access
     (Google sign-in is optional — say so)
   - **Ads:** No ads
   - **Content rating questionnaire:** category Game → answer everything "No"
     (no violence, no user communication, etc.) → should rate Everyone / 3+
   - **Target audience:** up to you — simplest is "13+" to avoid the extra
     Families-policy review; the game is still playable by everyone.
     (Choosing "including children" triggers stricter review requirements.)
   - **Data safety form:** declare —
     - Data collected: *Personal info → Name*, *Photos (profile photo URL)*,
       *User IDs (email + account ID)* — collected only when the user signs in,
       optional, used for App functionality (leaderboard), shared with no one,
       encrypted in transit, deletable on request (privacy policy email).
     - If asked about account creation: "Users can optionally sign in with Google."
3. **Store listing:**
   - Short description (max 80 chars):
     `Balance the plank! Stack cute Snaplings, chain combos, don't let them fall.`
   - Full description: use `store-assets/description.txt`
   - App icon: upload `img/icon-512.png`
   - Feature graphic: `store-assets/feature-graphic-1024x500.png`
   - Phone screenshots: the three `screen-*.png` files (1080×1920)

## C. Verify the domain (required for TWA — removes the browser bar)

The `assetlinks.json` from PWABuilder must be served at:
`https://harshvardhanvg10.github.io/.well-known/assetlinks.json`

⚠ Note: that's the ROOT of harshvardhanvg10.github.io — NOT inside
/stack-and-snap/. This means creating one more GitHub repo named exactly
`HarshvardhanVG10.github.io` containing `.well-known/assetlinks.json`.
Hand the file to Claude and this repo gets set up in two minutes.

## D. Release

1. Play Console → **Testing → Internal testing** → create release → upload the
   `.aab` → add your own email as tester → roll out.
2. Install via the internal-testing link on your phone. Play with it.
3. Newer personal accounts must run a **closed test with 12 testers for 14
   days** before production access. Check: Dashboard → "Apply for production".
   If your account is older/exempt, skip straight ahead.
4. **Production** → create release → same .aab → submit for review
   (first review typically 1–7 days).

## After launch

Game updates ship by pushing to GitHub (the TWA loads the live site). The .aab
only needs re-uploading if the manifest/package itself changes.
