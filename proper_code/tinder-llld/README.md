# Tinder Low-Level Design Implementation

A comprehensive TypeScript implementation of Tinder's core features following software engineering best practices and design patterns.

## 🚀 Features Implemented

### Core Features
- **Profile Creation**: Users can create profiles with photos, bio, location, and preferences
- **Swiping Mechanism**: Support for left swipe (pass) and right swipe (like)
- **Matching System**: Automatic matching when two users like each other
- **Messaging**: Chat functionality between matched users only
- **Real-time Notifications**: Instant notifications for matches, likes, and messages
- **Location-based Matching**: Users see profiles within their preferred radius
- **Feed Generation**: Personalized feed based on user preferences and location

### Additional Features
- **Search Functionality**: Search users by name or bio
- **Profile Updates**: Update bio, photos, location, and preferences
- **Conversation Management**: View all conversations with unread counts
- **User Statistics**: App-wide statistics (total users, matches, messages)
- **Edge Case Handling**: Robust error handling and validation

## 🏗️ Architecture & Design Patterns

### Design Patterns Used

1. **Singleton Pattern**
   - `TinderApp` class ensures single instance of the application
   - Provides global access point to all services

2. **Observer Pattern**
   - `NotificationService` implements observer pattern for real-time notifications
   - Users automatically receive notifications for matches, likes, and messages

3. **Strategy Pattern**
   - `MatchingService` uses strategy pattern for different matching algorithms
   - `LocationBasedMatchingStrategy` implements location-based matching

4. **Factory Pattern**
   - `ProfileService` acts as factory for creating user profiles
   - Encapsulates object creation logic

### Directory Structure

```
tinder-llld/
├── src/
│   ├── interfaces/
│   │   └── index.ts                 # All interface definitions
│   ├── models/
│   │   ├── User.ts                  # User profile model
│   │   ├── Match.ts                 # Match model
│   │   ├── Message.ts               # Message model
│   │   └── Notification.ts          # Notification model
│   ├── services/
│   │   ├── ProfileService.ts        # Profile management
│   │   ├── MatchingService.ts       # Swiping and matching logic
│   │   ├── MessagingService.ts      # Chat functionality
│   │   └── NotificationService.ts   # Notification system
│   ├── utils/
│   │   └── LocationUtils.ts         # Location calculations
│   └── TinderApp.ts                 # Main application class
├── client.ts                        # Demo client showcasing all features
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🔧 Technical Implementation

### Core Components

#### 1. User Profile Management
- `User` class with comprehensive profile data
- Location-based preference matching
- Profile updates and validation

#### 2. Matching System
- Swipe action recording
- Mutual like detection
- Automatic match creation
- Match history tracking

#### 3. Messaging System
- Match-based messaging authorization
- Message threading by match
- Read/unread status tracking
- Conversation management

#### 4. Notification System
- Real-time observer pattern implementation
- Multiple notification types (match, message, like)
- Notification history and read status

#### 5. Location Services
- Haversine formula for distance calculation
- Radius-based profile filtering
- Location update functionality

## 🚦 Installation & Usage

### Prerequisites
- Node.js (v14 or higher)
- TypeScript
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tinder-llld
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Run the demo client with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript

## 📊 Demo Output

The client application demonstrates:

1. **Profile Creation**: Creates 5 sample users with different preferences
2. **Feed Generation**: Shows personalized feeds based on location and preferences
3. **Swiping Simulation**: Demonstrates left/right swipe actions
4. **Matching Logic**: Shows automatic match creation on mutual likes
5. **Messaging**: Demonstrates chat functionality between matched users
6. **Notifications**: Real-time notifications for all user actions
7. **Search & Discovery**: Profile search and location-based features
8. **Edge Cases**: Proper error handling and validation

## 🔍 Key Technical Decisions

### 1. Location-Based Matching
- Uses Haversine formula for accurate distance calculation
- Filters profiles based on user's preferred radius
- Considers both location and preference compatibility

### 2. Notification System
- Observer pattern ensures real-time updates
- Separate notification types for different events
- Persistent notification history

### 3. Message Authorization
- Only matched users can exchange messages
- Match validation before message sending
- Conversation threading by match ID

### 4. Data Storage
- In-memory storage using Maps for fast lookups
- Easily extensible to database implementations
- Proper data encapsulation and access control

## 🧪 Testing

The application includes comprehensive testing through the client file:

- **Unit Testing**: Each service is tested independently
- **Integration Testing**: End-to-end workflow testing
- **Edge Case Testing**: Invalid inputs and error conditions
- **Performance Testing**: Efficient lookups and operations

## 🔒 Security Considerations

- **Authorization**: Users can only access their own data and matched users' data
- **Validation**: Input validation for all user data
- **Privacy**: Users only see profiles matching their criteria
- **Message Security**: Messaging restricted to matched users only

## 🚀 Future Enhancements

### Potential Improvements
1. **Database Integration**: Replace in-memory storage with persistent database
2. **Real-time WebSocket**: Implement WebSocket for live notifications
3. **Photo Upload**: Add actual photo upload and storage
4. **Advanced Matching**: ML-based matching algorithms
5. **Geolocation APIs**: Integration with real geolocation services
6. **Block/Report Features**: User safety features
7. **Premium Features**: Super likes, boost functionality
8. **Video Chat**: In-app video calling

### Scalability Considerations
- **Microservices**: Split services into separate microservices
- **Caching**: Redis for session and frequently accessed data
- **Load Balancing**: Distribute load across multiple instances
- **CDN**: Content delivery network for photos and media
- **Sharding**: Database sharding for large user bases

## 📝 Requirements Fulfilled

✅ **Profile Creation**: Users can create comprehensive profiles  
✅ **Swiping**: Left (reject) and right (match) swipe functionality  
✅ **Messaging**: Chat system for matched users  
✅ **Feed Generation**: Personalized profile recommendations  
✅ **Notifications**: Real-time match and message notifications  
✅ **Location-based**: Radius-based profile filtering  
✅ **Design Patterns**: Singleton, Observer, Strategy, Factory patterns  
✅ **Error-free Execution**: Comprehensive error handling  
✅ **Class-based**: Object-oriented implementation  
✅ **TypeScript**: Strongly typed implementation  
✅ **Directory Structure**: Well-organized codebase  

## 🏆 Conclusion

This implementation demonstrates a scalable, maintainable, and feature-complete low-level design of Tinder. The code follows SOLID principles, implements appropriate design patterns, and provides a robust foundation for a dating application.

The architecture is designed to be easily extensible, with clear separation of concerns and proper abstraction layers. The comprehensive demo showcases all implemented features and validates the system's functionality. 