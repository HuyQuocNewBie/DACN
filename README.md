
```
DACN
├─ backend
│  ├─ .htaccess
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ decks.php
│  │  │  ├─ logs.php
│  │  │  ├─ stats.php
│  │  │  ├─ users.php
│  │  │  └─ user_status.php
│  │  ├─ auth
│  │  │  ├─ google_login.php
│  │  │  ├─ login.php
│  │  │  └─ register.php
│  │  ├─ cards
│  │  │  ├─ create.php
│  │  │  ├─ delete.php
│  │  │  ├─ read.php
│  │  │  └─ update.php
│  │  ├─ cron
│  │  │  ├─ send_reminder_emails.php
│  │  │  └─ test_send_reminder.php
│  │  ├─ decks
│  │  │  ├─ clone.php
│  │  │  ├─ create.php
│  │  │  ├─ delete.php
│  │  │  ├─ read.php
│  │  │  ├─ read_public.php
│  │  │  ├─ read_single.php
│  │  │  └─ update.php
│  │  ├─ review
│  │  │  ├─ get_due_cards.php
│  │  │  └─ update_progress.php
│  │  ├─ test_db.php
│  │  └─ user
│  │     ├─ profile.php
│  │     ├─ statistics.php
│  │     ├─ update_profile.php
│  │     └─ upload_avatar.php
│  ├─ config
│  │  ├─ database.php
│  │  ├─ email_config.php
│  │  ├─ jwt_helper.php
│  │  └─ test.php
│  ├─ Dockerfile
│  ├─ models
│  │  ├─ Card.php
│  │  ├─ Deck.php
│  │  ├─ ReviewLog.php
│  │  └─ User.php
│  └─ uploads
├─ database
│  ├─ database.sql
│  └─ spaced_repetition_db.sql
├─ frontend
│  ├─ .prettierrc
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.png
│  │  └─ icons
│  │     └─ Logo.png
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ admin.api.js
│  │  │  ├─ auth.api.js
│  │  │  ├─ axiosClient.js
│  │  │  ├─ card.api.js
│  │  │  ├─ deck.api.js
│  │  │  ├─ explore.api.js
│  │  │  ├─ review.api.js
│  │  │  └─ user.api.js
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ card
│  │  │  │  ├─ CardForm.jsx
│  │  │  │  └─ CardItem.jsx
│  │  │  ├─ common
│  │  │  │  ├─ Button.jsx
│  │  │  │  ├─ EmptyState.jsx
│  │  │  │  ├─ Input.jsx
│  │  │  │  ├─ Loading.jsx
│  │  │  │  └─ Modal.jsx
│  │  │  ├─ deck
│  │  │  │  ├─ DeckDetail.jsx
│  │  │  │  └─ DeckItem.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ Footer.jsx
│  │  │  │  │  ├─ Header.jsx
│  │  │  │  │  └─ Sidebar.jsx
│  │  │  │  └─ user
│  │  │  │     ├─ Footer.jsx
│  │  │  │     ├─ Header.jsx
│  │  │  │     └─ Sidebar.jsx
│  │  │  └─ review
│  │  │     └─ Flashcard.jsx
│  │  ├─ context
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ThemeContext.jsx
│  │  ├─ hooks
│  │  │  └─ useAuth.js
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  └─ MainLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Admin
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ ManageDecks.jsx
│  │  │  │  └─ ManageUsers.jsx
│  │  │  ├─ Auth
│  │  │  │  ├─ Login.jsx
│  │  │  │  └─ Register.jsx
│  │  │  ├─ Dashboard
│  │  │  │  └─ Dashboard.jsx
│  │  │  ├─ Deck
│  │  │  │  ├─ DeckDetail.jsx
│  │  │  │  └─ DeckList.jsx
│  │  │  ├─ Explore
│  │  │  │  └─ ExplorePage.jsx
│  │  │  ├─ LandingPage
│  │  │  │  └─ LandingPage.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ Profile
│  │  │  │  └─ Profile.jsx
│  │  │  └─ Review
│  │  │     └─ ReviewPage.jsx
│  │  ├─ routes
│  │  │  ├─ index.jsx
│  │  │  └─ PrivateRoute.jsx
│  │  └─ utils
│  │     ├─ constants.js
│  │     ├─ errorHandler.js
│  │     ├─ formatDate.js
│  │     └─ validate.js
│  ├─ tailwind.config.js
│  ├─ vercel.json
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```