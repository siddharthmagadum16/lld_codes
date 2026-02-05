package proper_code.url_shortner;

import proper_code.url_shortner.entities.UrlMapping;
import proper_code.url_shortner.services.UrlShortenerFactory;
import proper_code.url_shortner.services.UrlShortenerService;

import java.util.List;

/**
 * Client class to demonstrate the URL Shortener system
 * 
 * Design Patterns Used:
 * 1. Strategy Pattern - Different encoding strategies (Base62, Counter-based)
 * 2. Repository Pattern - Abstract data access layer
 * 3. Factory Pattern - Create service instances
 * 4. Dependency Injection - Services depend on interfaces, not implementations
 * 
 * SOLID Principles:
 * 1. Single Responsibility - Each class has one reason to change
 * 2. Open/Closed - Open for extension (new strategies), closed for modification
 * 3. Liskov Substitution - Any EncodingStrategy implementation can be used
 * 4. Interface Segregation - Small, focused interfaces
 * 5. Dependency Inversion - Depend on abstractions (interfaces), not concrete classes
 */
public class Client {
    
    public static void main(String[] args) {
        System.out.println("=== URL Shortener System Demo ===\n");
        
        // Demo 1: Basic URL Shortening
        demonstrateBasicShortening();
        
        // Demo 2: URL Retrieval and Analytics
        demonstrateUrlRetrieval();
        
        // Demo 3: Different Encoding Strategies
        demonstrateEncodingStrategies();
        
        // Demo 4: URL Management
        demonstrateUrlManagement();
        
        // Demo 5: Error Handling
        demonstrateErrorHandling();
    }
    
    private static void demonstrateBasicShortening() {
        System.out.println("--- Demo 1: Basic URL Shortening ---");
        
        UrlShortenerService service = UrlShortenerFactory.createDefaultUrlShortener();
        
        String longUrl1 = "https://www.example.com/very/long/url/with/many/parameters?id=12345&session=abcdef";
        String longUrl2 = "https://github.com/username/repository/issues/42";
        String longUrl3 = "https://stackoverflow.com/questions/123456/how-to-implement-url-shortener";
        
        String shortUrl1 = service.shortenUrl(longUrl1);
        String shortUrl2 = service.shortenUrl(longUrl2, 30); // 30 days expiry
        String shortUrl3 = service.shortenUrl(longUrl3, 365); // 1 year expiry
        
        System.out.println("Long URL: " + longUrl1);
        System.out.println("Short URL: " + shortUrl1);
        System.out.println();
        
        System.out.println("Long URL: " + longUrl2);
        System.out.println("Short URL: " + shortUrl2 + " (expires in 30 days)");
        System.out.println();
        
        System.out.println("Long URL: " + longUrl3);
        System.out.println("Short URL: " + shortUrl3 + " (expires in 365 days)");
        System.out.println();
    }
    
    private static void demonstrateUrlRetrieval() {
        System.out.println("--- Demo 2: URL Retrieval and Analytics ---");
        
        UrlShortenerService service = UrlShortenerFactory.createDefaultUrlShortener();
        
        String longUrl = "https://www.amazon.com/products/electronics";
        String shortUrl = service.shortenUrl(longUrl);
        String shortCode = extractShortCode(shortUrl);
        
        System.out.println("Created short URL: " + shortUrl);
        System.out.println();
        
        // Simulate multiple accesses
        for (int i = 1; i <= 5; i++) {
            String retrievedUrl = service.getLongUrl(shortCode);
            System.out.println("Access " + i + ": Retrieved - " + retrievedUrl);
        }
        
        // Get statistics
        UrlMapping stats = service.getUrlStats(shortCode);
        System.out.println("\nURL Statistics:");
        System.out.println("  Short Code: " + stats.getShortCode());
        System.out.println("  Click Count: " + stats.getClickCount());
        System.out.println("  Created At: " + stats.getCreatedAt());
        System.out.println("  Last Accessed: " + stats.getLastAccessedAt());
        System.out.println("  Status: " + stats.getStatus());
        System.out.println();
    }
    
    private static void demonstrateEncodingStrategies() {
        System.out.println("--- Demo 3: Different Encoding Strategies ---");
        
        // Base62 Strategy
        System.out.println("Using Base62 Encoding Strategy:");
        UrlShortenerService base62Service = UrlShortenerFactory.createUrlShortener(
            UrlShortenerFactory.StrategyType.BASE62
        );
        
        String url1 = "https://www.google.com/search?q=url+shortener";
        String short1 = base62Service.shortenUrl(url1);
        System.out.println("  Long URL: " + url1);
        System.out.println("  Short URL: " + short1);
        System.out.println();
        
        // Counter-based Strategy
        System.out.println("Using Counter-Based Encoding Strategy:");
        UrlShortenerService counterService = UrlShortenerFactory.createUrlShortener(
            UrlShortenerFactory.StrategyType.COUNTER_BASED
        );
        
        String url2 = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        String url3 = "https://www.linkedin.com/in/johndoe";
        String url4 = "https://www.twitter.com/handle/status/123456789";
        
        String short2 = counterService.shortenUrl(url2);
        String short3 = counterService.shortenUrl(url3);
        String short4 = counterService.shortenUrl(url4);
        
        System.out.println("  Short URL 1: " + short2);
        System.out.println("  Short URL 2: " + short3);
        System.out.println("  Short URL 3: " + short4);
        System.out.println("  (Notice sequential pattern in counter-based approach)");
        System.out.println();
    }
    
    private static void demonstrateUrlManagement() {
        System.out.println("--- Demo 4: URL Management ---");
        
        UrlShortenerService service = UrlShortenerFactory.createDefaultUrlShortener();
        
        // Create multiple URLs
        String shortUrl1 = service.shortenUrl("https://www.example1.com");
        String shortUrl2 = service.shortenUrl("https://www.example2.com");
        String shortUrl3 = service.shortenUrl("https://www.example3.com");
        
        System.out.println("Created 3 short URLs");
        
        // List all URLs
        List<UrlMapping> allUrls = service.getAllUrls();
        System.out.println("\nTotal URLs in system: " + allUrls.size());
        System.out.println("Active URLs:");
        for (UrlMapping mapping : allUrls) {
            if (mapping.isActive()) {
                System.out.println("  - " + mapping.getShortCode() + " -> " + 
                    mapping.getLongUrl().substring(0, Math.min(50, mapping.getLongUrl().length())) + 
                    (mapping.getLongUrl().length() > 50 ? "..." : ""));
            }
        }
        
        // Update expiry
        String shortCode1 = extractShortCode(shortUrl1);
        service.updateExpiry(shortCode1, 7);
        System.out.println("\nUpdated expiry for " + shortCode1 + " to 7 days");
        
        // Delete URL
        String shortCode2 = extractShortCode(shortUrl2);
        service.deleteUrl(shortCode2);
        System.out.println("Deleted URL: " + shortCode2);
        
        UrlMapping deletedMapping = service.getUrlStats(shortCode2);
        System.out.println("Status after deletion: " + deletedMapping.getStatus());
        System.out.println();
    }
    
    private static void demonstrateErrorHandling() {
        System.out.println("--- Demo 5: Error Handling ---");
        
        UrlShortenerService service = UrlShortenerFactory.createDefaultUrlShortener();
        
        // Test 1: Invalid URL
        System.out.println("Test 1: Invalid URL (no protocol)");
        try {
            service.shortenUrl("www.example.com");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught error: " + e.getMessage());
        }
        
        // Test 2: Empty URL
        System.out.println("\nTest 2: Empty URL");
        try {
            service.shortenUrl("");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught error: " + e.getMessage());
        }
        
        // Test 3: Non-existent short code
        System.out.println("\nTest 3: Non-existent short code");
        try {
            service.getLongUrl("INVALID");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught error: " + e.getMessage());
        }
        
        // Test 4: Accessing deleted URL
        System.out.println("\nTest 4: Accessing deleted URL");
        try {
            String shortUrl = service.shortenUrl("https://www.test.com");
            String shortCode = extractShortCode(shortUrl);
            service.deleteUrl(shortCode);
            service.getLongUrl(shortCode);
        } catch (IllegalStateException e) {
            System.out.println("  ✓ Caught error: " + e.getMessage());
        }
        
        // Test 5: Duplicate URL returns same short code
        System.out.println("\nTest 5: Duplicate URL handling");
        String url = "https://www.duplicate-test.com";
        String short1 = service.shortenUrl(url);
        String short2 = service.shortenUrl(url);
        System.out.println("  First attempt: " + short1);
        System.out.println("  Second attempt: " + short2);
        System.out.println("  ✓ Same URL returns: " + (short1.equals(short2) ? "Same short URL" : "Different short URL"));
        System.out.println();
    }
    
    private static String extractShortCode(String shortUrl) {
        return shortUrl.substring(shortUrl.lastIndexOf('/') + 1);
    }
}
