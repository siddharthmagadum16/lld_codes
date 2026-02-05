package proper_code.url_shortner.interfaces;

/**
 * Strategy Pattern: Interface for different encoding strategies
 */
public interface EncodingStrategy {
    String encode(String input);
    String generateShortCode();
}
