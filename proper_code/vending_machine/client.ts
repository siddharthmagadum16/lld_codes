/* NOTE: This is AI generated LLD */

import { VendingMachine } from "./core/VendingMachine";
import { Product } from "./core/Product";
import { CashPayment } from "./payment/CashPayment";
import { CreditCardPayment } from "./payment/CreditCardPayment";
import { MobilePayment } from "./payment/MobilePayment";

console.log("╔════════════════════════════════════════╗");
console.log("║   VENDING MACHINE SIMULATION DEMO     ║");
console.log("╚════════════════════════════════════════╝\n");

// Initialize vending machine (Singleton)
const machine = VendingMachine.getInstance();

// Setup inventory
console.log("🔧 Setting up inventory...\n");
machine.getInventory().addProduct(new Product("A1", "Coca Cola", 1.25), 5);
machine.getInventory().addProduct(new Product("A2", "Pepsi", 1.25), 3);
machine.getInventory().addProduct(new Product("B1", "Chips", 1.50), 4);
machine.getInventory().addProduct(new Product("B2", "Chocolate Bar", 2.00), 2);
machine.getInventory().addProduct(new Product("C1", "Water", 1.00), 10);

machine.displayProducts();

// ============================================
// Scenario 1: Successful purchase with cash (with change)
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 1: Cash Purchase with Change");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("A1");
console.log(`Current State: ${machine.getCurrentStateName()}`);

const cashPayment = new CashPayment();
machine.insertPayment(cashPayment, 2.00); // Paying $2.00 for $1.25 item
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 2: Credit card purchase
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 2: Credit Card Purchase");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("B1");
console.log(`Current State: ${machine.getCurrentStateName()}`);

const creditCardPayment = new CreditCardPayment();
machine.insertPayment(creditCardPayment, 1.50);
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 3: Mobile payment
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 3: Mobile Payment");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("B2");
console.log(`Current State: ${machine.getCurrentStateName()}`);

const mobilePayment = new MobilePayment();
machine.insertPayment(mobilePayment, 2.00);
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 4: Insufficient payment
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 4: Insufficient Payment");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("A2");
console.log(`Current State: ${machine.getCurrentStateName()}`);

machine.insertPayment(new CashPayment(), 1.00); // Trying to pay $1.00 for $1.25 item
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 5: Cancel transaction
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 5: Cancel Transaction");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("C1");
console.log(`Current State: ${machine.getCurrentStateName()}`);
machine.cancel();
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 6: Out of stock
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 6: Out of Stock Item");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("B2"); // Already sold in Scenario 3, checking if stock depleted
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 7: Maintenance mode
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 7: Maintenance Mode");
console.log("═".repeat(50));

machine.enterMaintenance();
console.log(`Current State: ${machine.getCurrentStateName()}`);
machine.selectItem("A1"); // Should be blocked

// Restock in maintenance
console.log("\n📦 Restocking items during maintenance...");
machine.getInventory().addProduct(new Product("B2", "Chocolate Bar", 2.00), 5);

machine.exitMaintenance();
console.log(`Current State: ${machine.getCurrentStateName()}`);

// ============================================
// Scenario 8: Cash payment with exact change
// ============================================
console.log("\n" + "═".repeat(50));
console.log("SCENARIO 8: Exact Cash Payment (No Change)");
console.log("═".repeat(50));

console.log(`\nCurrent State: ${machine.getCurrentStateName()}`);
machine.selectItem("C1");
console.log(`Current State: ${machine.getCurrentStateName()}`);
machine.insertPayment(new CashPayment(), 1.00); // Exact amount
console.log(`Current State: ${machine.getCurrentStateName()}`);

// Final inventory
machine.displayProducts();

console.log("\n╔════════════════════════════════════════╗");
console.log("║          DEMO COMPLETED! ✅            ║");
console.log("╚════════════════════════════════════════╝\n");
