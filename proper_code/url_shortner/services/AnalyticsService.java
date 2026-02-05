package proper_code.url_shortner.services;

import proper_code.url_shortner.entities.UrlMapping;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for tracking URL access analytics
 * Follows Single Responsibility Principle
 */
public class AnalyticsService {
    private final Map<String, List<LocalDateTime>> accessLog;
    
    public AnalyticsService() {
        this.accessLog = new ConcurrentHashMap<>();
    }
    
    public void recordAccess(UrlMapping urlMapping) {
        String shortCode = urlMapping.getShortCode();
        accessLog.computeIfAbsent(shortCode, k -> new ArrayList<>())
                 .add(LocalDateTime.now());
    }
    
    public int getTotalAccesses(String shortCode) {
        return accessLog.getOrDefault(shortCode, Collections.emptyList()).size();
    }
    
    public List<LocalDateTime> getAccessHistory(String shortCode) {
        return new ArrayList<>(accessLog.getOrDefault(shortCode, Collections.emptyList()));
    }
    
    public Map<String, Integer> getTopUrls(int limit) {
        Map<String, Integer> urlCounts = new HashMap<>();
        
        for (Map.Entry<String, List<LocalDateTime>> entry : accessLog.entrySet()) {
            urlCounts.put(entry.getKey(), entry.getValue().size());
        }
        
        return urlCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .collect(HashMap::new, 
                        (map, entry) -> map.put(entry.getKey(), entry.getValue()), 
                        HashMap::putAll);
    }
    
    public void clearAnalytics(String shortCode) {
        accessLog.remove(shortCode);
    }
}
