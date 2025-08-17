

class KVStore {

  private static readonly instance = new KVStore();
  private static store = new Map();

  private constructor() {}

  public static getInstance = () => KVStore.instance;


  public set = (key: string, value: any): void => {
    if (typeof key != 'string') throw new Error('invalid key');
    KVStore.store.set(key, value);
  }

  public get = (key: string): any => {
    if (KVStore.store.has(key)) {
      return KVStore.store.get(key);
    }
    return null;
  }

  public delete = (key: string): void => {
    KVStore.store.delete(key);
  }
};

const client = () => {

  const storeInstance = KVStore.getInstance();
  console.log(storeInstance.get('abc'));
  storeInstance.set('abc', 2332);
  storeInstance.set('def', 932);
  console.log(storeInstance.get('abc'));
  storeInstance.delete('abc');
  console.log(storeInstance.get('def'));

}

client();

// export default KVStore;
