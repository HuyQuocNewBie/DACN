
```
DACN
├─ backend
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ decks.php
│  │  │  ├─ users.php
│  │  │  └─ user_status.php
│  │  ├─ auth
│  │  │  ├─ login.php
│  │  │  └─ register.php
│  │  ├─ cards
│  │  │  ├─ create.php
│  │  │  ├─ delete.php
│  │  │  ├─ read.php
│  │  │  └─ update.php
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
│  │  └─ user
│  │     ├─ profile.php
│  │     ├─ statistics.php
│  │     └─ update_profile.php
│  ├─ config
│  │  ├─ jwt_helper.php
│  │  └─ test.php
│  └─ models
│     ├─ Card.php
│     ├─ Deck.php
│     └─ User.php
├─ frontend
│  ├─ .prettierrc
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
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
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  └─ Sidebar.jsx
│  │  │  └─ review
│  │  │     └─ Flashcard.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
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
│  │  │  ├─ LandingPage.jsx
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
│  │     ├─ sm2.js
│  │     └─ validate.js
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```