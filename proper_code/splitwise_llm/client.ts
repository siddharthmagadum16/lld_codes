import { ExpenseManager } from "./services/ExpenseManager";
import { User } from "./models/User";
import { Split } from "./models/Split";
import { SplitType } from "./models/ExpenseType";

// Create expense manager instance
const expenseManager = new ExpenseManager();

// Create users
const user1 = new User("u1", "User1", "user1@example.com");
const user2 = new User("u2", "User2", "user2@example.com");
const user3 = new User("u3", "User3", "user3@example.com");
const user4 = new User("u4", "User4", "user4@example.com");

// Add users to expense manager
expenseManager.addUser(user1);
expenseManager.addUser(user2);
expenseManager.addUser(user3);
expenseManager.addUser(user4);

// Example 1: Equal expense
console.log("Adding equal expense...");
expenseManager.addExpense(
  "Dinner",
  1000,
  user1,
  [
    new Split(user2, 250, SplitType.OWES),
    new Split(user3, 250, SplitType.OWES),
    new Split(user4, 250, SplitType.OWES)
  ]
);

// Show balances
console.log("\nBalances after first expense:");
expenseManager.showBalances();

// Example 2: Exact expense
console.log("\nAdding exact expense...");
expenseManager.addExpense(
  "Cab ride",
  1250,
  user2,
  [
    new Split(user1, 370, SplitType.OWES),
    new Split(user3, 880, SplitType.OWES)
  ]
);

// Show final balances
console.log("\nFinal balances:");
expenseManager.showBalances();
