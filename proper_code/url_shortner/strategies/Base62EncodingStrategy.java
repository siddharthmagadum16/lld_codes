package proper_code.url_shortner.strategies;

import proper_code.url_shortner.interfaces.EncodingStrategy;
import proper_code.url_shortner.constants.AppConstants;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

/**
 * Base62 encoding strategy using MD5 hash
 */
public class Base62EncodingStrategy implements EncodingStrategy {
    private static final Random random = new Random();
    
    @Override
    public String encode(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(input.getBytes());
            return convertToBase62(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }
    
    @Override
    public String generateShortCode() {
        StringBuilder shortCode = new StringBuilder();
        for (int i = 0; i < AppConstants.SHORT_URL_LENGTH; i++) {
            int index = random.nextInt(AppConstants.BASE62_CHARS.length());
            shortCode.append(AppConstants.BASE62_CHARS.charAt(index));
        }
        return shortCode.toString();
    }
    
    private String convertToBase62(byte[] hash) {
        StringBuilder result = new StringBuilder();
        long num = 0;
        
        // Convert first 8 bytes to long
        for (int i = 0; i < 8 && i < hash.length; i++) {
            num = (num << 8) | (hash[i] & 0xFF);
        }
        
        // Make sure it's positive
        num = Math.abs(num);
        
        // Convert to base62
        while (num > 0 && result.length() < AppConstants.SHORT_URL_LENGTH) {
            int remainder = (int) (num % 62);
            result.append(AppConstants.BASE62_CHARS.charAt(remainder));
            num /= 62;
        }
        
        // Pad if necessary
        while (result.length() < AppConstants.SHORT_URL_LENGTH) {
            result.append(AppConstants.BASE62_CHARS.charAt(0));
        }
        
        return result.reverse().toString();
    }
}
