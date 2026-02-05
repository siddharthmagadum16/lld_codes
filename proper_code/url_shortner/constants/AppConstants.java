package proper_code.url_shortner.constants;

public class AppConstants {
    public static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public static final int SHORT_URL_LENGTH = 7;
    public static final String BASE_URL = "https://short.url/";
    public static final int MAX_RETRIES = 5;
    public static final long DEFAULT_EXPIRY_DAYS = 365;
    
    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}
