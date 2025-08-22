# Delivery Cost Tracking System

A comprehensive, enterprise-grade delivery cost tracking system built with TypeScript, following SOLID principles and modern design patterns.

## 🎯 Problem Statement

Food delivery companies employ tens of thousands of delivery drivers who each submit hundreds of deliveries per week. Delivery details are automatically sent to the system immediately after the delivery. Drivers have different hourly payment rates based on performance and can handle multiple deliveries simultaneously.

## 🚀 Core Features

### Required Methods (Interview Question)
1. **`addDriver(driver_id, pay_per_hour)`** - Add a new driver with hourly rate
2. **`recordDelivery(driver_id, start_time, end_time)`** - Record a delivery
3. **`fetchTotalCostIncurredForAllDeliveries()`** - Calculate total cost for all drivers

### Additional Features
- Driver management (update rates, deactivate/activate)
- Delivery status tracking (active, completed, cancelled)
- Cost calculations by driver, date range, and status
- System statistics and reporting
- Thread-safe concurrent operations
- Comprehensive error handling and validation

## 🏗️ Architecture

### Design Patterns Used
- **Singleton Pattern**: For service instances and data store
- **Strategy Pattern**: For cost calculation strategies
- **Repository Pattern**: For data access abstraction
- **Factory Pattern**: For entity creation

### SOLID Principles Implementation
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Interfaces can be substituted with implementations
- **Interface Segregation**: Clients only depend on methods they use
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### Directory Structure
```
delivery_cost/
├── entities/           # Domain entities (Driver, Delivery)
├── interfaces/         # Contract definitions
├── services/          # Business logic implementation
├── utils/             # Utility classes and helpers
├── client.ts          # Demo client
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## 🛠️ Technical Implementation

### Concurrency Handling
- Thread-safe in-memory data store
- Mutex-like locking mechanism for concurrent access
- Queue-based operation processing

### Data Validation
- Input sanitization and validation
- Business rule enforcement
- Comprehensive error messages

### Performance Features
- Efficient data structures (Map-based storage)
- Minimal memory footprint
- Fast cost calculations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- TypeScript compiler

### Running the Demo
```bash
# Compile TypeScript
tsc

# Run the demo
node dist/client.js

# Or run directly with tsx
npx tsx client.ts
```

### Example Usage
```typescript
import { DeliveryCostService } from './services/DeliveryCostService';

const service = DeliveryCostService.getInstance();

// Add drivers
await service.addDriver('driver_001', 15.00);
await service.addDriver('driver_002', 20.00);

// Record deliveries
const startTime = new Date('2024-01-15T10:00:00Z');
const endTime = new Date('2024-01-15T11:30:00Z');
await service.recordDelivery('driver_001', startTime, endTime);

// Calculate total cost
const totalCost = await service.fetchTotalCostIncurredForAllDeliveries();
console.log(`Total cost: $${totalCost}`);
```

## 📊 System Capabilities

### Driver Management
- Add/remove drivers
- Update hourly rates
- Activate/deactivate drivers
- Performance tracking

### Delivery Tracking
- Record delivery start/end times
- Calculate delivery costs automatically
- Track delivery status
- Handle overlapping deliveries

### Cost Calculations
- Per-delivery cost calculation
- Driver-specific cost aggregation
- Date range cost analysis
- Total system cost tracking

### Reporting & Analytics
- System statistics
- Driver performance metrics
- Cost breakdowns
- Historical data analysis

## 🔒 Thread Safety

The system handles concurrent access through:
- **Mutex-like locking**: Only one operation executes at a time
- **Operation queuing**: Pending operations wait in FIFO order
- **Atomic operations**: Data consistency guaranteed
- **Error isolation**: Failed operations don't affect others

## 🧪 Testing Scenarios

The demo client covers:
1. **Basic Functionality**: Core methods required by the question
2. **Advanced Features**: Edge cases and additional functionality
3. **Error Handling**: Validation and error scenarios
4. **Concurrent Access**: Performance and thread safety

## 🎨 Code Quality Features

- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management
- **Documentation**: Inline code documentation
- **Clean Code**: Readable and maintainable codebase
- **Extensibility**: Easy to add new features

## 🚀 Future Enhancements

- Database persistence layer
- REST API endpoints
- Real-time notifications
- Advanced analytics dashboard
- Multi-tenant support
- Performance monitoring
- Automated testing suite

## 📝 License

This project is created for educational and interview preparation purposes.
