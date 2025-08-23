class Mutex {
  private promise = Promise.resolve();

  async acquire(): Promise<() => void> {
    let release: () => void;
    
    const newPromise = new Promise<void>((resolve) => {
      release = resolve;
    });
    
    const currentPromise = this.promise;
    this.promise = newPromise;
    
    await currentPromise;
    
    return release!;
  }
}

export default Mutex;