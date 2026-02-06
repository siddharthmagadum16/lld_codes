import { func } from './index';

describe('func', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a spy on console.log before each test
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore the original console.log after each test
    consoleLogSpy.mockRestore();
  });

  it('should call console.log with "hello"', () => {
    func();
    
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith('hello');
  });

  it('should not throw any errors when called', () => {
    expect(() => func()).not.toThrow();
  });

  it('should be a function', () => {
    expect(typeof func).toBe('function');
  });
});
