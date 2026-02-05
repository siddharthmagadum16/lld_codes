package proper_code.url_shortner.strategies;

import proper_code.url_shortner.interfaces.EncodingStrategy;
import proper_code.url_shortner.constants.AppConstants;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Counter-based encoding strategy for sequential URL generation
 */
public class CounterBasedEncodingStrategy implements EncodingStrategy {
    private final AtomicLong counter;
    
    public CounterBasedEncodingStrategy() {
        this.counter = new AtomicLong(1000000); // Start from a large number
    }
    
    public CounterBasedEncodingStrategy(long initialValue) {
        this.counter = new AtomicLong(initialValue);
    }
    
    @Override
    public String encode(String input) {
        long value = counter.incrementAndGet();
        return toBase62(value);
    }
    
    @Override
    public String generateShortCode() {
        return encode("");
    }
    
    private String toBase62(long num) {
        StringBuilder result = new StringBuilder();
        
        while (num > 0) {
            int remainder = (int) (num % 62);
            result.append(AppConstants.BASE62_CHARS.charAt(remainder));
            num /= 62;
        }
        
        // Pad to minimum length
        while (result.length() < AppConstants.SHORT_URL_LENGTH) {
            result.append(AppConstants.BASE62_CHARS.charAt(0));
        }
        
        return result.reverse().toString();
    }
}
