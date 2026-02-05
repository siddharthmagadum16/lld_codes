package proper_code.url_shortner.services;

import proper_code.url_shortner.interfaces.EncodingStrategy;
import proper_code.url_shortner.interfaces.UrlRepository;
import proper_code.url_shortner.repository.InMemoryUrlRepository;
import proper_code.url_shortner.strategies.Base62EncodingStrategy;
import proper_code.url_shortner.strategies.CounterBasedEncodingStrategy;

/**
 * Factory Pattern: Creates UrlShortenerService instances with different configurations
 */
public class UrlShortenerFactory {
    
    public enum StrategyType {
        BASE62,
        COUNTER_BASED
    }
    
    /**
     * Creates a URL shortener service with specified strategy
     */
    public static UrlShortenerService createUrlShortener(StrategyType strategyType) {
        UrlRepository repository = new InMemoryUrlRepository();
        AnalyticsService analyticsService = new AnalyticsService();
        EncodingStrategy strategy;
        
        switch (strategyType) {
            case COUNTER_BASED:
                strategy = new CounterBasedEncodingStrategy();
                break;
            case BASE62:
            default:
                strategy = new Base62EncodingStrategy();
                break;
        }
        
        return new UrlShortenerService(repository, strategy, analyticsService);
    }
    
    /**
     * Creates a URL shortener with default configuration (Base62)
     */
    public static UrlShortenerService createDefaultUrlShortener() {
        return createUrlShortener(StrategyType.BASE62);
    }
    
    /**
     * Creates a URL shortener with custom components (Dependency Injection)
     */
    public static UrlShortenerService createCustomUrlShortener(
            UrlRepository repository,
            EncodingStrategy strategy,
            AnalyticsService analyticsService) {
        return new UrlShortenerService(repository, strategy, analyticsService);
    }
}
