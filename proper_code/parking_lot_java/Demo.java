
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.lang.Integer;
import java.util.concurrent.atomic.AtomicInteger;

public class Demo {

    private static  void func (AtomicInteger n) {
        System.out.println("N: " + n.addAndGet(1));
    }

    public static void main() {

        AtomicInteger num = new AtomicInteger(0);
        try (ExecutorService executor = Executors.newFixedThreadPool(3)) {
            for (int i = 0; i < 3; ++ i) {
                executor.submit(() -> func(num));
            }
        }
        System.out.println("num m " + num);
    }
}
