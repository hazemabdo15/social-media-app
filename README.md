# 🚀 Social App - React Native & Firebase

A modern, real-time social media application built with React Native, Expo, and Firebase. Features a sleek UI with real-time posts, comments, likes, and comprehensive user authentication.

## ✨ Features

### 📱 Core Functionality
- **Real-time Posts** - Create, view, edit, and delete posts with live updates
- **Interactive Comments** - Add and delete comments with real-time synchronization  
- **Like System** - Animated like/unlike functionality with instant feedback
- **User Authentication** - Complete auth flow with login, signup, and logout
- **Post Management** - Edit your own posts, delete your own content

### 🎨 UI/UX Highlights
- **Modern Design** - Clean, card-based interface with consistent styling
- **Smooth Animations** - Engaging micro-interactions and loading states
- **Pull-to-Refresh** - Swipe down to refresh your feed
- **Dynamic Avatars** - Color-coded user avatars based on usernames
- **Responsive Layout** - Optimized for all screen sizes

### 🔥 Real-time Features
- Live post updates across all devices
- Instant comment synchronization
- Optimistic UI updates with error handling
- Real-time like count updates

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Authentication)
- **Navigation**: React Navigation (Drawer & Stack)
- **State Management**: React Context API
- **Styling**: StyleSheet API with modular styles

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase project with Firestore and Authentication enabled

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hazemabdo15/social-media-app.git
   cd social-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password) and Firestore Database
   - Copy your Firebase config to `firebaseConfig.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📁 Project Structure

```
social-app/
├── components/           # Reusable UI components
│   ├── addNewPost.jsx   # Post creation component
│   ├── post.jsx         # Individual post display
│   ├── CommentsModal.jsx # Comments interface
│   └── EditPostModal.jsx # Post editing modal
├── contexts/            # React Context providers
│   └── AuthContext.js   # Authentication state management
├── hooks/               # Custom React hooks
│   └── useRealTimePosts.js # Real-time post fetching
├── navigation/          # Navigation configuration
│   └── dynamicDrawer.js # Drawer navigation setup
├── screens/             # Main app screens
│   ├── Home.jsx         # Main feed screen
│   ├── Login.jsx        # User login
│   ├── SignUp.jsx       # User registration
│   └── Loading.jsx      # Loading screen
├── utils/               # Utility functions
│   └── firestoreOperations.js # Database operations
└── firebaseConfig.js    # Firebase configuration
```

## 🔧 Key Components

### Post Component
- **Interactive Actions**: Like, comment, share buttons
- **Owner Controls**: Edit/delete options for post authors
- **Real-time Updates**: Automatic refresh when data changes
- **Animated Feedback**: Smooth animations for user interactions

### Comments System
- **Modal Interface**: Full-screen comments view
- **Real-time Sync**: Live comment updates
- **Owner Management**: Delete your own comments
- **Character Limits**: Input validation and counters

### Authentication Flow
- **Context-based State**: Global auth state management
- **Secure Operations**: All actions require authentication
- **Error Handling**: User-friendly error messages
- **Persistent Sessions**: Automatic login on app restart

## 📊 Database Schema

### Posts Collection
```javascript
{
  id: "auto-generated",
  authorName: "User Name",
  content: "Post content...",
  uid: "user-uid",
  likes: ["uid1", "uid2"],
  likesCount: 2,
  comments: [
    {
      id: "comment-id",
      userId: "user-uid", 
      userName: "User Name",
      text: "Comment text...",
      createdAt: Timestamp
    }
  ],
  commentsCount: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🎯 Key Features Implementation

- **Optimistic Updates**: UI updates immediately, syncs with server
- **Error Recovery**: Automatic rollback on failed operations
- **Real-time Listeners**: Firestore onSnapshot for live data
- **Security Rules**: User can only edit/delete their own content
- **Performance**: Efficient FlatList rendering for large feeds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Environment Setup

Make sure to create a `firebaseConfig.js` file with your Firebase credentials:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

**Built with ❤️ using React Native and Firebase**
