package proper_code.url_shortner.entities;

import proper_code.url_shortner.enums.UrlStatus;
import java.time.LocalDateTime;

public class UrlMapping {
    private final String id;
    private final String longUrl;
    private final String shortCode;
    private final LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private UrlStatus status;
    private int clickCount;
    private LocalDateTime lastAccessedAt;
    
    public UrlMapping(String id, String longUrl, String shortCode, LocalDateTime expiresAt) {
        this.id = id;
        this.longUrl = longUrl;
        this.shortCode = shortCode;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = expiresAt;
        this.status = UrlStatus.ACTIVE;
        this.clickCount = 0;
        this.lastAccessedAt = null;
    }
    
    public String getId() {
        return id;
    }
    
    public String getLongUrl() {
        return longUrl;
    }
    
    public String getShortCode() {
        return shortCode;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public UrlStatus getStatus() {
        return status;
    }
    
    public void setStatus(UrlStatus status) {
        this.status = status;
    }
    
    public int getClickCount() {
        return clickCount;
    }
    
    public void incrementClickCount() {
        this.clickCount++;
        this.lastAccessedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }
    
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isActive() {
        return status == UrlStatus.ACTIVE && !isExpired();
    }
    
    @Override
    public String toString() {
        return "UrlMapping{" +
                "id='" + id + '\'' +
                ", longUrl='" + longUrl + '\'' +
                ", shortCode='" + shortCode + '\'' +
                ", createdAt=" + createdAt +
                ", expiresAt=" + expiresAt +
                ", status=" + status +
                ", clickCount=" + clickCount +
                ", lastAccessedAt=" + lastAccessedAt +
                '}';
    }
}
