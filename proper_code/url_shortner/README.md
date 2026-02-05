# URL Shortener System

A production-ready URL shortener implementation in Java demonstrating SOLID principles and design patterns.

## Features

- **URL Shortening**: Convert long URLs to short, memorable links
- **Custom Expiry**: Set custom expiration times for URLs
- **Analytics**: Track click counts and access patterns
- **Multiple Strategies**: Support for different encoding algorithms
- **Thread-Safe**: Concurrent access support using ConcurrentHashMap
- **URL Management**: Update, delete, and retrieve URL statistics

## Architecture

### Directory Structure
```
url_shortner/
├── constants/          # Application constants
├── entities/           # Domain models
├── enums/             # Enumerations
├── interfaces/        # Abstractions/contracts
├── repository/        # Data access layer
├── services/          # Business logic
├── strategies/        # Encoding strategies
└── Client.java        # Demo application
```

## Design Patterns Used

### 1. Strategy Pattern
- **Purpose**: Allow different encoding algorithms to be swapped at runtime
- **Implementation**: `EncodingStrategy` interface with multiple implementations
  - `Base62EncodingStrategy`: Hash-based encoding using MD5
  - `CounterBasedEncodingStrategy`: Sequential counter-based encoding

### 2. Repository Pattern
- **Purpose**: Abstract data access layer
- **Implementation**: `UrlRepository` interface with `InMemoryUrlRepository`
- **Benefits**: Easy to swap storage (database, cache, etc.)

### 3. Factory Pattern
- **Purpose**: Centralize object creation logic
- **Implementation**: `UrlShortenerFactory` class
- **Benefits**: Simplified service instantiation with different configurations

### 4. Dependency Injection
- **Purpose**: Loose coupling and testability
- **Implementation**: Services depend on interfaces, not concrete classes
- **Benefits**: Easy to mock and test

## SOLID Principles

### Single Responsibility Principle (SRP)
- Each class has one reason to change
- `UrlShortenerService`: URL shortening logic
- `AnalyticsService`: Analytics tracking
- `UrlRepository`: Data access

### Open/Closed Principle (OCP)
- Open for extension, closed for modification
- New encoding strategies can be added without modifying existing code
- New repository implementations can be added via interface

### Liskov Substitution Principle (LSP)
- Any `EncodingStrategy` implementation can replace another
- Any `UrlRepository` implementation is interchangeable

### Interface Segregation Principle (ISP)
- Small, focused interfaces
- `EncodingStrategy`: Only encoding operations
- `UrlRepository`: Only data access operations

### Dependency Inversion Principle (DIP)
- Depend on abstractions, not concrete classes
- Services depend on `UrlRepository` interface, not `InMemoryUrlRepository`
- Services depend on `EncodingStrategy` interface, not specific implementations

## Key Components

### Entities
- **UrlMapping**: Represents a URL mapping with metadata (expiry, clicks, status)

### Enums
- **UrlStatus**: URL states (ACTIVE, EXPIRED, DELETED, INACTIVE)

### Services
- **UrlShortenerService**: Core service for URL operations
- **AnalyticsService**: Tracks and reports URL usage statistics
- **UrlShortenerFactory**: Creates service instances

### Strategies
- **Base62EncodingStrategy**: Hash-based short code generation
- **CounterBasedEncodingStrategy**: Counter-based short code generation

### Repository
- **InMemoryUrlRepository**: Thread-safe in-memory storage

## How to Run

### Compile
```bash
javac proper_code/url_shortner/Client.java
```

### Run
```bash
java proper_code.url_shortner.Client
```

## API Usage Examples

### Basic URL Shortening
```java
UrlShortenerService service = UrlShortenerFactory.createDefaultUrlShortener();
String shortUrl = service.shortenUrl("https://www.example.com/long/url");
System.out.println("Short URL: " + shortUrl);
```

### URL Shortening with Custom Expiry
```java
// Expires in 30 days
String shortUrl = service.shortenUrl("https://www.example.com", 30);
```

### Retrieve Original URL
```java
String longUrl = service.getLongUrl("abc123");
```

### Get URL Statistics
```java
UrlMapping stats = service.getUrlStats("abc123");
System.out.println("Clicks: " + stats.getClickCount());
System.out.println("Created: " + stats.getCreatedAt());
```

### Delete URL
```java
service.deleteUrl("abc123");
```

### Different Encoding Strategies
```java
// Counter-based strategy
UrlShortenerService service = UrlShortenerFactory.createUrlShortener(
    UrlShortenerFactory.StrategyType.COUNTER_BASED
);

// Base62 strategy (default)
UrlShortenerService service = UrlShortenerFactory.createUrlShortener(
    UrlShortenerFactory.StrategyType.BASE62
);
```

## Thread Safety

The system is designed to be thread-safe:
- Uses `ConcurrentHashMap` for storage
- `AtomicLong` for counter-based strategy
- Immutable entities where possible

## Error Handling

The system handles various error scenarios:
- Invalid URLs (missing protocol, empty, too long)
- Non-existent short codes
- Expired URLs
- Deleted URLs
- Duplicate URL detection

## Extensibility

### Adding a New Encoding Strategy
1. Implement `EncodingStrategy` interface
2. Add strategy to `UrlShortenerFactory`
3. No changes needed in existing code

### Adding Database Support
1. Implement `UrlRepository` interface with DB logic
2. Inject into `UrlShortenerService`
3. No changes needed in service logic

### Adding Custom Analytics
1. Extend `AnalyticsService` or create new service
2. Inject into existing services
3. Follow Single Responsibility Principle

## System Design Considerations

### Scalability
- Counter-based approach: Distributed counter service (Zookeeper, Redis)
- Hash-based approach: Consistent hashing for distributed systems
- Database sharding by short code prefix

### Performance
- In-memory caching layer (Redis)
- Read replicas for high read throughput
- Async analytics processing

### Reliability
- Retry mechanism for short code generation
- URL validation before shortening
- Expiry checking on every access

## Interview Discussion Points

1. **How would you scale this to millions of users?**
   - Distributed ID generation (Snowflake)
   - Caching layer (Redis)
   - Database sharding
   - Load balancing

2. **How do you prevent collisions?**
   - Retry mechanism with MAX_RETRIES
   - Longer short codes (7 characters = 62^7 = 3.5 trillion combinations)
   - Check-and-set operations

3. **How would you handle rate limiting?**
   - Token bucket algorithm
   - Per-user/IP rate limits
   - API gateway integration

4. **How would you implement custom URLs?**
   - Add optional custom alias parameter
   - Validate uniqueness and availability
   - Reserve common words

5. **How would you handle analytics at scale?**
   - Async event processing (Kafka)
   - Time-series database (InfluxDB)
   - Batch processing for reports

## Testing Strategy

1. **Unit Tests**: Test each component in isolation
2. **Integration Tests**: Test component interactions
3. **Concurrent Tests**: Test thread safety
4. **Load Tests**: Test performance under load

## Future Enhancements

- [ ] Custom URL aliases
- [ ] User authentication and ownership
- [ ] URL categories and tagging
- [ ] QR code generation
- [ ] Bulk URL shortening
- [ ] API rate limiting
- [ ] URL preview before redirect
- [ ] Geographic analytics
- [ ] A/B testing support
- [ ] URL deduplication strategies
