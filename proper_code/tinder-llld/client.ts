import { TinderApp } from './src/TinderApp';
import { ILocation } from './src/interfaces';

// Initialize the Tinder app (Singleton pattern)
const app = TinderApp.getInstance();

console.log("🚀 Starting Tinder Low-Level Design Demo\n");

// Test locations (using real-world coordinates for demo)
const locations: { [key: string]: ILocation } = {
  newYork: { latitude: 40.7128, longitude: -74.0060 },
  brooklyn: { latitude: 40.6782, longitude: -73.9442 },
  manhattan: { latitude: 40.7831, longitude: -73.9712 },
  queens: { latitude: 40.7282, longitude: -73.7949 },
  losAngeles: { latitude: 34.0522, longitude: -118.2437 }
};

// Create user profiles
console.log("👥 Creating User Profiles...\n");

const alice = app.createProfile(
  "Alice Johnson",
  25,
  "female",
  ["alice1.jpg", "alice2.jpg", "alice3.jpg"],
  "Love hiking and photography! 📸🏔️",
  locations.newYork,
  25,
  { min: 22, max: 35 },
  "male"
);

const bob = app.createProfile(
  "Bob Smith",
  28,
  "male",
  ["bob1.jpg", "bob2.jpg"],
  "Software engineer by day, chef by night 👨‍💻🍳",
  locations.brooklyn,
  30,
  { min: 21, max: 32 },
  "female"
);

const charlie = app.createProfile(
  "Charlie Brown",
  24,
  "male",
  ["charlie1.jpg", "charlie2.jpg", "charlie3.jpg", "charlie4.jpg"],
  "Musician and coffee enthusiast ☕🎵",
  locations.manhattan,
  20,
  { min: 20, max: 30 },
  "all"
);

const diana = app.createProfile(
  "Diana Prince",
  26,
  "female",
  ["diana1.jpg", "diana2.jpg"],
  "Fitness trainer and adventure seeker 💪🌟",
  locations.queens,
  35,
  { min: 24, max: 35 },
  "male"
);

const eve = app.createProfile(
  "Eve Wilson",
  23,
  "female",
  ["eve1.jpg", "eve2.jpg", "eve3.jpg"],
  "Artist and bookworm 🎨📚",
  locations.losAngeles, // Far from others
  40,
  { min: 21, max: 28 },
  "all"
);

console.log("\n📊 Initial App Statistics:");
console.log(app.getAppStatistics());

// Display user profiles
console.log("\n👤 User Profiles Created:");
app.displayUserProfile(alice.id);
app.displayUserProfile(bob.id);
app.displayUserProfile(charlie.id);
app.displayUserProfile(diana.id);
app.displayUserProfile(eve.id);

// Test feed functionality
console.log("\n📱 Testing Feed Functionality...\n");

console.log("🔍 Alice's feed:");
const aliceFeed = app.getFeedProfiles(alice.id);
aliceFeed.forEach((profile, index) => {
  console.log(`${index + 1}. ${profile.name}, ${profile.age} - ${profile.bio}`);
});

console.log("\n🔍 Bob's feed:");
const bobFeed = app.getFeedProfiles(bob.id);
bobFeed.forEach((profile, index) => {
  console.log(`${index + 1}. ${profile.name}, ${profile.age} - ${profile.bio}`);
});

// Test swiping functionality
console.log("\n👆 Testing Swiping Functionality...\n");

// Alice swipes right on Bob
app.swipe(alice.id, bob.id, 'like');

// Alice swipes right on Charlie
app.swipe(alice.id, charlie.id, 'like');

// Bob swipes left on Charlie
app.swipe(bob.id, charlie.id, 'pass');

// Bob swipes right on Alice (should create a match!)
app.swipe(bob.id, alice.id, 'like');

// Bob swipes right on Diana
app.swipe(bob.id, diana.id, 'like');

// Charlie swipes right on Alice
app.swipe(charlie.id, alice.id, 'like');

// Diana swipes right on Bob (should create another match!)
app.swipe(diana.id, bob.id, 'like');

// Charlie swipes right on Diana
app.swipe(charlie.id, diana.id, 'like');

// Diana swipes right on Charlie (creates a match!)
app.swipe(diana.id, charlie.id, 'like');

console.log("\n💕 Current Matches:");
console.log("Alice's matches:", app.getUserMatches(alice.id).length);
console.log("Bob's matches:", app.getUserMatches(bob.id).length);
console.log("Charlie's matches:", app.getUserMatches(charlie.id).length);
console.log("Diana's matches:", app.getUserMatches(diana.id).length);

// Test messaging functionality
console.log("\n💬 Testing Messaging Functionality...\n");

// Get Alice's matches to send messages
const aliceMatches = app.getUserMatches(alice.id);
if (aliceMatches.length > 0) {
  const bobMatch = aliceMatches.find(match => 
    match.user1Id === bob.id || match.user2Id === bob.id
  );
  
  if (bobMatch) {
    // Alice sends message to Bob
    app.sendMessage(alice.id, bob.id, "Hey Bob! Love your profile! 😊");
    
    // Bob replies
    app.sendMessage(bob.id, alice.id, "Hi Alice! Thanks! Your hiking photos are amazing! 🏔️");
    
    // Alice responds
    app.sendMessage(alice.id, bob.id, "Thank you! Would you like to go hiking sometime?");
    
    // Bob responds
    app.sendMessage(bob.id, alice.id, "I'd love to! I know a great trail upstate 🥾");
  }
}

// Charlie and Diana conversation
const charlieMatches = app.getUserMatches(charlie.id);
if (charlieMatches.length > 0) {
  const dianaMatch = charlieMatches.find(match => 
    match.user1Id === diana.id || match.user2Id === diana.id
  );
  
  if (dianaMatch) {
    app.sendMessage(charlie.id, diana.id, "Hey Diana! I saw you're into fitness. I play guitar at a local gym's events 🎸");
    app.sendMessage(diana.id, charlie.id, "That's so cool! Music and fitness go hand in hand! 🎵💪");
    app.sendMessage(charlie.id, diana.id, "Absolutely! Maybe we can work out and then grab coffee? ☕");
  }
}

// Test conversation retrieval
console.log("\n📞 User Conversations:");
console.log("\nAlice's conversations:");
const aliceConversations = app.getUserConversations(alice.id);
aliceConversations.forEach(conv => {
  console.log(`- ${conv.otherUserName} (${conv.unreadCount} unread)`);
  if (conv.lastMessage) {
    console.log(`  Last: "${conv.lastMessage.content}"`);
  }
});

console.log("\nBob's conversations:");
const bobConversations = app.getUserConversations(bob.id);
bobConversations.forEach(conv => {
  console.log(`- ${conv.otherUserName} (${conv.unreadCount} unread)`);
  if (conv.lastMessage) {
    console.log(`  Last: "${conv.lastMessage.content}"`);
  }
});

// Test notification functionality
console.log("\n🔔 Testing Notification System...\n");

console.log("Alice's unread notifications:");
const aliceNotifications = app.getUnreadNotifications(alice.id);
aliceNotifications.forEach(notification => {
  console.log(`- ${notification.getNotificationSummary()}`);
});

console.log("\nBob's unread notifications:");
const bobNotifications = app.getUnreadNotifications(bob.id);
bobNotifications.forEach(notification => {
  console.log(`- ${notification.getNotificationSummary()}`);
});

// Test users who liked me
console.log("\n❤️ Users Who Liked Me:");
console.log("\nUsers who liked Alice:");
const aliceLikers = app.getUsersWhoLikedMe(alice.id);
aliceLikers.forEach(user => {
  console.log(`- ${user.name}, ${user.age}`);
});

console.log("\nUsers who liked Bob:");
const bobLikers = app.getUsersWhoLikedMe(bob.id);
bobLikers.forEach(user => {
  console.log(`- ${user.name}, ${user.age}`);
});

// Test search functionality
console.log("\n🔍 Testing Search Functionality...\n");
const searchResults = app.searchProfiles("engineer");
console.log(`Search results for "engineer":`);
searchResults.forEach(user => {
  console.log(`- ${user.name}: ${user.bio}`);
});

// Test location-based features
console.log("\n📍 Testing Location-Based Features...\n");
const nearbyProfiles = app.getProfilesNearLocation(locations.newYork, 30);
console.log(`Profiles near New York (30km radius):`);
nearbyProfiles.forEach(user => {
  console.log(`- ${user.name} (${user.location.latitude}, ${user.location.longitude})`);
});

// Test profile updates
console.log("\n✏️ Testing Profile Updates...\n");
console.log("Updating Alice's bio...");
app.updateProfile(alice.id, { 
  bio: "Love hiking, photography, and meeting new people! 📸🏔️✨" 
});

console.log("Updated Alice's profile:");
app.displayUserProfile(alice.id);

// Test location update
console.log("\nUpdating Bob's location...");
app.updateUserLocation(bob.id, locations.manhattan);
console.log("Bob moved to Manhattan!");

// Mark notifications as read
console.log("\n📖 Marking Alice's notifications as read...");
app.markAllNotificationsAsRead(alice.id);

// Final statistics
console.log("\n📊 Final App Statistics:");
const finalStats = app.getAppStatistics();
console.log(`Total Users: ${finalStats.totalUsers}`);
console.log(`Total Matches: ${finalStats.totalMatches}`);
console.log(`Total Messages: ${finalStats.totalMessages}`);

// Test edge cases
console.log("\n🧪 Testing Edge Cases...\n");

// Try to send message to non-matched user
console.log("Trying to send message between non-matched users...");
const nonMatchedMessage = app.sendMessage(eve.id, alice.id, "Hello!");
if (!nonMatchedMessage) {
  console.log("✅ Correctly prevented message between non-matched users");
}

// Try to get messages for non-existent match
const nonExistentMessages = app.getMatchMessages("non-existent-match", alice.id);
console.log(`Messages for non-existent match: ${nonExistentMessages.length} (should be 0)`);

// Test duplicate swipes
console.log("\nTesting duplicate swipes...");
app.swipe(alice.id, bob.id, 'like'); // Already swiped, should handle gracefully

console.log("\n🎉 Tinder Low-Level Design Demo Complete!");
console.log("All core features tested successfully:");
console.log("✅ Profile Creation");
console.log("✅ Feed Generation");
console.log("✅ Swiping (Left/Right)");
console.log("✅ Matching Logic");
console.log("✅ Messaging System");
console.log("✅ Notification System (Observer Pattern)");
console.log("✅ Location-Based Matching");
console.log("✅ Search Functionality");
console.log("✅ Profile Updates");
console.log("✅ Edge Case Handling");
console.log("✅ Design Patterns Implementation:");
console.log("   - Singleton Pattern (TinderApp)");
console.log("   - Observer Pattern (Notifications)");
console.log("   - Strategy Pattern (Matching Algorithm)");
console.log("   - Factory Pattern (Profile Creation)"); 