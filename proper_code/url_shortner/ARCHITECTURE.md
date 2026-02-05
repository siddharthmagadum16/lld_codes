# URL Shortener - Architecture Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client Layer                          │
│                         (Client.java)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Factory Layer                            │
│                   (UrlShortenerFactory)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Creates instances with dependency injection              │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                            │
│  ┌────────────────────┐          ┌─────────────────────┐       │
│  │UrlShortenerService │◄────────►│  AnalyticsService   │       │
│  │  - shortenUrl()    │          │  - recordAccess()   │       │
│  │  - getLongUrl()    │          │  - getTopUrls()     │       │
│  │  - deleteUrl()     │          │  - getTotalAccess() │       │
│  │  - getUrlStats()   │          └─────────────────────┘       │
│  └────────┬───────────┘                                         │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ├──────────────────┬────────────────────┐
            ▼                  ▼                    ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Repository    │  │    Strategy      │  │     Entities     │
│   Interface     │  │    Interface     │  │                  │
└────────┬────────┘  └────────┬─────────┘  │   UrlMapping     │
         │                    │             │   - longUrl      │
         ▼                    ▼             │   - shortCode    │
┌─────────────────┐  ┌──────────────────┐  │   - expiresAt    │
│InMemoryUrlRepo  │  │ Base62Encoding   │  │   - clickCount   │
│                 │  │ CounterBased     │  │   - status       │
└─────────────────┘  └──────────────────┘  └──────────────────┘
```

## Class Diagram

```
┌─────────────────────────────┐
│   <<interface>>             │
│   EncodingStrategy          │
├─────────────────────────────┤
│ + encode(input): String     │
│ + generateShortCode(): str  │
└──────────▲──────────────────┘
           │
           │ implements
           │
    ┌──────┴────────┐
    │               │
┌───┴────────┐  ┌──┴─────────────────┐
│Base62      │  │CounterBased        │
│Encoding    │  │Encoding            │
│Strategy    │  │Strategy            │
└────────────┘  └────────────────────┘


┌─────────────────────────────┐
│   <<interface>>             │
│   UrlRepository             │
├─────────────────────────────┤
│ + save(UrlMapping)          │
│ + findByShortCode(): Opt    │
│ + findByLongUrl(): Opt      │
│ + existsByShortCode(): bool │
└──────────▲──────────────────┘
           │
           │ implements
           │
    ┌──────┴────────┐
    │               │
┌───┴───────────────┴──┐
│InMemoryUrlRepository │
│                      │
│ - shortCodeMap       │
│ - longUrlMap         │
└──────────────────────┘


┌──────────────────────────────┐
│     UrlShortenerService      │
├──────────────────────────────┤
│ - repository: UrlRepository  │
│ - strategy: EncodingStrategy │
│ - analytics: Analytics       │
├──────────────────────────────┤
│ + shortenUrl(url): String    │
│ + getLongUrl(code): String   │
│ + deleteUrl(code): void      │
│ + getUrlStats(code): Stats   │
└──────────────────────────────┘
           │
           │ uses
           ▼
┌──────────────────────────────┐
│       UrlMapping             │
├──────────────────────────────┤
│ - id: String                 │
│ - longUrl: String            │
│ - shortCode: String          │
│ - createdAt: LocalDateTime   │
│ - expiresAt: LocalDateTime   │
│ - status: UrlStatus          │
│ - clickCount: int            │
└──────────────────────────────┘
```

## Sequence Diagram - URL Shortening Flow

```
Client          Factory         Service         Strategy        Repository
  │                │               │                │               │
  │──createService──>              │                │               │
  │                │──new Service─>│                │               │
  │                │<──service────│                │               │
  │<──service─────│               │                │               │
  │                                │                │               │
  │──shortenUrl("https://...")────>│                │               │
  │                                │──validateUrl() │               │
  │                                │                │               │
  │                                │──findByLongUrl────────────────>│
  │                                │<──Optional.empty()─────────────│
  │                                │                │               │
  │                                │──generateShortCode()───────────>│
  │                                │<──"abc123"──────────────────────│
  │                                │                │               │
  │                                │──existsByShortCode──────────────>│
  │                                │<──false──────────────────────────│
  │                                │                │               │
  │                                │──create UrlMapping              │
  │                                │                │               │
  │                                │──save(mapping)──────────────────>│
  │                                │<──void───────────────────────────│
  │<──"https://short.url/abc123"──│                │               │
```

## Sequence Diagram - URL Retrieval Flow

```
Client          Service         Repository      Analytics       UrlMapping
  │                │                │               │               │
  │──getLongUrl("abc123")─>        │               │               │
  │                │──findByShortCode("abc123")────>│               │
  │                │<──Optional<UrlMapping>─────────│               │
  │                │                │               │               │
  │                │──isExpired()───────────────────────────────────>│
  │                │<──false─────────────────────────────────────────│
  │                │                │               │               │
  │                │──isActive()────────────────────────────────────>│
  │                │<──true──────────────────────────────────────────│
  │                │                │               │               │
  │                │──incrementClickCount()─────────────────────────>│
  │                │                │               │               │
  │                │──update(mapping)──────────────>│               │
  │                │                │               │               │
  │                │──recordAccess(mapping)─────────>│               │
  │                │                │               │               │
  │<──"https://www.example.com"────│               │               │
```

## Design Pattern Application

### 1. Strategy Pattern (Encoding Algorithms)

**Problem**: Need different URL encoding algorithms
**Solution**: Define EncodingStrategy interface

```
Interface: EncodingStrategy
   ├── Base62EncodingStrategy (hash-based)
   └── CounterBasedEncodingStrategy (sequential)
```

**Benefits**:
- Easy to add new encoding algorithms
- Can switch strategies at runtime
- Each strategy encapsulates its algorithm

### 2. Repository Pattern (Data Access)

**Problem**: Abstract data storage mechanism
**Solution**: Define UrlRepository interface

```
Interface: UrlRepository
   └── InMemoryUrlRepository
   └── (Future) DatabaseUrlRepository
   └── (Future) RedisUrlRepository
```

**Benefits**:
- Decouples business logic from data access
- Easy to swap storage implementations
- Simplifies testing with mock repositories

### 3. Factory Pattern (Object Creation)

**Problem**: Complex service initialization
**Solution**: UrlShortenerFactory

```
UrlShortenerFactory
   ├── createDefaultUrlShortener()
   ├── createUrlShortener(StrategyType)
   └── createCustomUrlShortener(deps...)
```

**Benefits**:
- Centralized object creation
- Hides complexity of dependency wiring
- Easy to create different configurations

### 4. Dependency Injection

**Problem**: Tight coupling between components
**Solution**: Constructor injection of interfaces

```
UrlShortenerService(
   UrlRepository repository,      // Interface, not concrete class
   EncodingStrategy strategy,     // Interface, not concrete class
   AnalyticsService analytics     // Service dependency
)
```

**Benefits**:
- Loose coupling
- Easy to test (mock dependencies)
- Flexible configuration

## SOLID Principles Application

### Single Responsibility Principle (SRP)
Each class has ONE reason to change:

| Class | Single Responsibility |
|-------|----------------------|
| UrlShortenerService | URL shortening operations |
| AnalyticsService | Analytics tracking |
| InMemoryUrlRepository | Data storage |
| Base62EncodingStrategy | Base62 encoding algorithm |
| UrlMapping | URL data representation |

### Open/Closed Principle (OCP)
Open for extension, closed for modification:

```
// Adding new encoding strategy - NO modification needed
class CustomEncodingStrategy implements EncodingStrategy {
    // New implementation
}

// Using new strategy
UrlShortenerService service = new UrlShortenerService(
    repository,
    new CustomEncodingStrategy(),  // New strategy
    analytics
);
```

### Liskov Substitution Principle (LSP)
Any implementation can substitute interface:

```
// Any EncodingStrategy works
EncodingStrategy strategy1 = new Base62EncodingStrategy();
EncodingStrategy strategy2 = new CounterBasedEncodingStrategy();

// Both work identically in the service
service = new UrlShortenerService(repo, strategy1, analytics);
service = new UrlShortenerService(repo, strategy2, analytics);
```

### Interface Segregation Principle (ISP)
Small, focused interfaces:

```
EncodingStrategy interface:
   - encode()
   - generateShortCode()
   (Only 2 methods, highly focused)

UrlRepository interface:
   - save(), find(), exists(), delete()
   (Only data access methods)
```

### Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions:

```
// Service depends on INTERFACE, not concrete class
class UrlShortenerService {
    private final UrlRepository repository;      // Interface ✓
    private final EncodingStrategy strategy;     // Interface ✓
    
    // NOT: private final InMemoryUrlRepository repo;  ✗
}
```

## Scalability Considerations

### Current Design (Single Machine)
```
Client → Service → InMemory Repository
                 → Encoding Strategy
                 → Analytics Service
```

### Production Design (Distributed)
```
                    ┌───────────────┐
                    │  Load Balancer│
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    ┌────────┐         ┌────────┐         ┌────────┐
    │ API    │         │ API    │         │ API    │
    │ Server │         │ Server │         │ Server │
    └───┬────┘         └───┬────┘         └───┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌─────────┐
    │ Redis  │        │Database│        │  Kafka  │
    │ Cache  │        │(Write) │        │(Events) │
    └────────┘        └────────┘        └─────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
              ┌──────────┐  ┌──────────┐
              │ Database │  │ Database │
              │(Read Rep)│  │(Read Rep)│
              └──────────┘  └──────────┘
```

## Key Metrics & Performance

### Time Complexity
| Operation | Time Complexity |
|-----------|----------------|
| shortenUrl() | O(1) average, O(n) worst case (collision retry) |
| getLongUrl() | O(1) |
| deleteUrl() | O(1) |
| getAllUrls() | O(n) |

### Space Complexity
- Storage: O(n) where n = number of URLs
- Each URL mapping: ~200 bytes
- 1M URLs = ~200 MB memory

### URL Space
- Base62 with 7 characters: 62^7 = 3.5 trillion combinations
- At 1000 URLs/sec: ~111 years to exhaust

## Testing Strategy

```
Unit Tests
├── EncodingStrategy Tests
│   ├── Base62 encoding correctness
│   └── Counter-based uniqueness
├── Repository Tests
│   ├── CRUD operations
│   └── Concurrent access
└── Service Tests
    ├── URL validation
    ├── Expiry handling
    └── Analytics tracking

Integration Tests
├── End-to-end flow
├── Multiple strategies
└── Error scenarios

Performance Tests
├── Concurrent URL creation
├── High-volume retrieval
└── Memory usage
```

## Error Handling Strategy

```
Input Validation
├── URL format validation
├── Length checks
└── Protocol verification

Business Logic Errors
├── Expired URL handling
├── Deleted URL handling
└── Non-existent URL handling

System Errors
├── Collision retry mechanism
├── Storage failures
└── Encoding failures
```

## Future Enhancements

1. **Custom Aliases**: Allow users to specify custom short codes
2. **User Accounts**: Multi-tenant support with user ownership
3. **Analytics Dashboard**: Real-time charts and insights
4. **Geographic Tracking**: IP-based location analytics
5. **A/B Testing**: Support for multiple versions
6. **Rate Limiting**: Prevent abuse
7. **URL Preview**: Show preview before redirecting
8. **QR Code Generation**: Generate QR codes for URLs
9. **Bulk Operations**: Import/export URLs in batch
10. **API Keys**: Authentication and authorization

## Interview Discussion Points

### Design Questions
1. **How would you handle 1 billion URLs?**
   - Database sharding
   - Distributed caching
   - Read replicas

2. **How to prevent collision?**
   - Longer short codes
   - Retry mechanism
   - Pre-generated pool of codes

3. **How to scale globally?**
   - CDN for redirects
   - Geographic distribution
   - Multi-region deployment

4. **How to handle hot URLs?**
   - Caching layer (Redis)
   - Read replicas
   - CDN edge caching

### Code Quality
- ✅ SOLID principles applied
- ✅ Design patterns used appropriately
- ✅ Clean, readable code
- ✅ Comprehensive error handling
- ✅ Thread-safe implementation
- ✅ Extensible architecture
