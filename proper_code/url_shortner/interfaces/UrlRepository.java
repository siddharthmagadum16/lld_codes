package proper_code.url_shortner.interfaces;

import proper_code.url_shortner.entities.UrlMapping;
import java.util.Optional;
import java.util.List;

/**
 * Repository Pattern: Interface for data access abstraction
 */
public interface UrlRepository {
    void save(UrlMapping urlMapping);
    Optional<UrlMapping> findByShortCode(String shortCode);
    Optional<UrlMapping> findByLongUrl(String longUrl);
    boolean existsByShortCode(String shortCode);
    List<UrlMapping> findAll();
    void delete(String shortCode);
    void update(UrlMapping urlMapping);
}
