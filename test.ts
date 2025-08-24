


const mapDemo = () => {
  const mp:Map<number, number> = new Map();
  // map keys(), are printed in the order of when the key was first created. Modifying the value doesnt make the key recent
  mp.set(1,1);
  mp.set(2,1);
  mp.set(3,1);
  
  // mp.delete(2);
  mp.set(2,2);
  
  console.log(mp.entries().toArray());
  // console.log(mp.entries().toArray().map(([key, val]) => ({ key, val})));
}

// mapDemo()


const setDemo = () => {
  const st:Set<number> = new Set();

  st.add(3);
  st.add(1);
  st.add(2);

  st.delete(1);
  console.log('st: ' ,st.values().toArray())
  st.add(1);
  console.log('st: ' ,st.entries().toArray())
}
// setDemo()

const arrayDemo = () => {
  const originalArray = ['a', 'b', 'c', 'd', 'e', 'f'];

  const subarray = originalArray.slice(2, 5);
  originalArray[2]='cc';
  console.log(subarray, originalArray);

  // Output: ['c', 'd', 'e']

  // const deepCopy = JSON.parse(JSON.stringify(originalArray)); -- for deep copy
}

// arrayDemo();
