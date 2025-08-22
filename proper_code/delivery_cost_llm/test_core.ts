import { DeliveryCostService } from './services/DeliveryCostService';

/**
 * Simple test script to verify the core functionality
 * This demonstrates the exact methods required by the interview question
 */
async function testCoreFunctionality() {
  console.log('🧪 TESTING CORE FUNCTIONALITY');
  console.log('==============================\n');

  const service = DeliveryCostService.getInstance();

  try {
    // Test 1: Add drivers
    console.log('1️⃣ Testing addDriver(driver_id, pay_per_hour)');
    await service.addDriver('test_driver_1', 10.00);  // $10/hour
    await service.addDriver('test_driver_2', 15.00);  // $15/hour
    console.log('✅ Drivers added successfully\n');

    // Test 2: Record deliveries
    console.log('2️⃣ Testing recordDelivery(driver_id, start_time, end_time)');
    
    // Delivery 1: 1 hour = $10.00
    const start1 = new Date('2024-01-20T09:00:00Z');
    const end1 = new Date('2024-01-20T10:00:00Z');
    await service.recordDelivery('test_driver_1', start1, end1);
    
    // Delivery 2: 1.5 hours = $22.50
    const start2 = new Date('2024-01-20T10:00:00Z');
    const end2 = new Date('2024-01-20T11:30:00Z');
    await service.recordDelivery('test_driver_2', start2, end2);
    
    console.log('✅ Deliveries recorded successfully\n');

    // Test 3: Calculate total cost
    console.log('3️⃣ Testing fetchTotalCostIncurredForAllDeliveries()');
    const totalCost = await service.fetchTotalCostIncurredForAllDeliveries();
    
    console.log(`\n📊 RESULTS:`);
    console.log(`   Driver 1: 1 hour × $10.00 = $10.00`);
    console.log(`   Driver 2: 1.5 hours × $15.00 = $22.50`);
    console.log(`   Expected Total: $32.50`);
    console.log(`   Actual Total: $${totalCost.toFixed(2)}`);
    
    if (Math.abs(totalCost - 32.50) < 0.01) {
      console.log('\n🎉 SUCCESS: All core functionality tests passed!');
    } else {
      console.log('\n❌ FAILURE: Total cost calculation is incorrect');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCoreFunctionality().catch(console.error);
