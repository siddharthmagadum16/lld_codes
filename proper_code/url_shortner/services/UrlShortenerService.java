package proper_code.url_shortner.services;

import proper_code.url_shortner.entities.UrlMapping;
import proper_code.url_shortner.enums.UrlStatus;
import proper_code.url_shortner.interfaces.EncodingStrategy;
import proper_code.url_shortner.interfaces.UrlRepository;
import proper_code.url_shortner.constants.AppConstants;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class following Single Responsibility Principle
 * Handles URL shortening business logic
 */
public class UrlShortenerService {
    private final UrlRepository urlRepository;
    private final EncodingStrategy encodingStrategy;
    private final AnalyticsService analyticsService;
    
    public UrlShortenerService(UrlRepository urlRepository, 
                              EncodingStrategy encodingStrategy,
                              AnalyticsService analyticsService) {
        this.urlRepository = urlRepository;
        this.encodingStrategy = encodingStrategy;
        this.analyticsService = analyticsService;
    }
    
    /**
     * Shortens a long URL with default expiry
     */
    public String shortenUrl(String longUrl) {
        return shortenUrl(longUrl, AppConstants.DEFAULT_EXPIRY_DAYS);
    }
    
    /**
     * Shortens a long URL with custom expiry in days
     */
    public String shortenUrl(String longUrl, long expiryDays) {
        validateUrl(longUrl);
        
        // Check if URL already exists
        Optional<UrlMapping> existing = urlRepository.findByLongUrl(longUrl);
        if (existing.isPresent() && existing.get().isActive()) {
            return AppConstants.BASE_URL + existing.get().getShortCode();
        }
        
        // Generate unique short code
        String shortCode = generateUniqueShortCode();
        LocalDateTime expiresAt = expiryDays > 0 ? 
            LocalDateTime.now().plusDays(expiryDays) : null;
        
        // Create and save URL mapping
        UrlMapping urlMapping = new UrlMapping(
            UUID.randomUUID().toString(),
            longUrl,
            shortCode,
            expiresAt
        );
        
        urlRepository.save(urlMapping);
        return AppConstants.BASE_URL + shortCode;
    }
    
    /**
     * Retrieves original URL from short code
     */
    public String getLongUrl(String shortCode) {
        Optional<UrlMapping> mapping = urlRepository.findByShortCode(shortCode);
        
        if (mapping.isEmpty()) {
            throw new IllegalArgumentException("Short URL not found: " + shortCode);
        }
        
        UrlMapping urlMapping = mapping.get();
        
        // Check if expired
        if (urlMapping.isExpired()) {
            urlMapping.setStatus(UrlStatus.EXPIRED);
            urlRepository.update(urlMapping);
            throw new IllegalStateException("Short URL has expired: " + shortCode);
        }
        
        // Check if active
        if (urlMapping.getStatus() != UrlStatus.ACTIVE) {
            throw new IllegalStateException("Short URL is not active: " + shortCode);
        }
        
        // Update analytics
        urlMapping.incrementClickCount();
        urlRepository.update(urlMapping);
        analyticsService.recordAccess(urlMapping);
        
        return urlMapping.getLongUrl();
    }
    
    /**
     * Deletes a short URL
     */
    public void deleteUrl(String shortCode) {
        Optional<UrlMapping> mapping = urlRepository.findByShortCode(shortCode);
        if (mapping.isPresent()) {
            UrlMapping urlMapping = mapping.get();
            urlMapping.setStatus(UrlStatus.DELETED);
            urlRepository.update(urlMapping);
        } else {
            throw new IllegalArgumentException("Short URL not found: " + shortCode);
        }
    }
    
    /**
     * Gets statistics for a short URL
     */
    public UrlMapping getUrlStats(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
            .orElseThrow(() -> new IllegalArgumentException("Short URL not found: " + shortCode));
    }
    
    /**
     * Lists all URLs
     */
    public List<UrlMapping> getAllUrls() {
        return urlRepository.findAll();
    }
    
    /**
     * Updates expiry of a URL
     */
    public void updateExpiry(String shortCode, long expiryDays) {
        Optional<UrlMapping> mapping = urlRepository.findByShortCode(shortCode);
        if (mapping.isPresent()) {
            UrlMapping urlMapping = mapping.get();
            urlMapping.setExpiresAt(LocalDateTime.now().plusDays(expiryDays));
            urlRepository.update(urlMapping);
        } else {
            throw new IllegalArgumentException("Short URL not found: " + shortCode);
        }
    }
    
    private String generateUniqueShortCode() {
        int retries = 0;
        String shortCode;
        
        do {
            shortCode = encodingStrategy.generateShortCode();
            retries++;
            
            if (retries > AppConstants.MAX_RETRIES) {
                throw new RuntimeException("Failed to generate unique short code after " + 
                    AppConstants.MAX_RETRIES + " retries");
            }
        } while (urlRepository.existsByShortCode(shortCode));
        
        return shortCode;
    }
    
    private void validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            throw new IllegalArgumentException("URL must start with http:// or https://");
        }
        
        if (url.length() > 2048) {
            throw new IllegalArgumentException("URL is too long (max 2048 characters)");
        }
    }
}
