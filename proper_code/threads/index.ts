// use htis mutex for locks in interview, its easy and simple. make this class singleton.
// Create multiple lock fields such as driverLock, requestObjLock to lock different resources.

class Mutex {
  private lock = Promise.resolve();

  async acquire() {
    // Wait for the current lock to be released
    await this.lock;
    // Create a new lock and return its release function
    let release: () => void;
    this.lock = new Promise<void>((resolve) => {
      release = resolve;
    });
    
    return release!;
  }
}

async function useCounter(mutex: Mutex) {
  const release = await mutex.acquire();
  try {
    const value = await getCounterValue(); // Simulate async operation
    console.log(`Current value: ${value}`);
    await setCounterValue(value + 1); // Simulate async operation
    console.log(`Updated value: ${value + 1}`);
  } finally {
    release();
  }
}

// Global resource to be protected
let counter = 0;

async function getCounterValue(): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(counter), 10));
}

async function setCounterValue(value: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => {
    counter = value;
    resolve();
  }, 10));
}

// Example usage
const mutex = new Mutex();

async function runExample() {
  console.log('Running concurrent operations without a mutex...');
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(useCounter(mutex));
  }
  await Promise.all(promises);
  console.log(`Final counter value: ${counter}`); // It will be 5 because of the mutex
}

runExample();