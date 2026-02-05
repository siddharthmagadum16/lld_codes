package proper_code.url_shortner.repository;

import proper_code.url_shortner.entities.UrlMapping;
import proper_code.url_shortner.interfaces.UrlRepository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of UrlRepository
 * Thread-safe using ConcurrentHashMap
 */
public class InMemoryUrlRepository implements UrlRepository {
    private final Map<String, UrlMapping> shortCodeMap;
    private final Map<String, UrlMapping> longUrlMap;
    
    public InMemoryUrlRepository() {
        this.shortCodeMap = new ConcurrentHashMap<>();
        this.longUrlMap = new ConcurrentHashMap<>();
    }
    
    @Override
    public void save(UrlMapping urlMapping) {
        shortCodeMap.put(urlMapping.getShortCode(), urlMapping);
        longUrlMap.put(urlMapping.getLongUrl(), urlMapping);
    }
    
    @Override
    public Optional<UrlMapping> findByShortCode(String shortCode) {
        return Optional.ofNullable(shortCodeMap.get(shortCode));
    }
    
    @Override
    public Optional<UrlMapping> findByLongUrl(String longUrl) {
        return Optional.ofNullable(longUrlMap.get(longUrl));
    }
    
    @Override
    public boolean existsByShortCode(String shortCode) {
        return shortCodeMap.containsKey(shortCode);
    }
    
    @Override
    public List<UrlMapping> findAll() {
        return new ArrayList<>(shortCodeMap.values());
    }
    
    @Override
    public void delete(String shortCode) {
        UrlMapping mapping = shortCodeMap.remove(shortCode);
        if (mapping != null) {
            longUrlMap.remove(mapping.getLongUrl());
        }
    }
    
    @Override
    public void update(UrlMapping urlMapping) {
        shortCodeMap.put(urlMapping.getShortCode(), urlMapping);
        longUrlMap.put(urlMapping.getLongUrl(), urlMapping);
    }
}
