// Type-safe deep updates
// The original object is returned if the deep field's new value is equal to its current value per Object.is.
// These are use-once; don't make two separate updates using part of the same chain.
// Example usage:
// const o = { a: { b: 0, c: 1 }, d: 2 };
// update(o)('a')('c').map(c => c + 2); // Evaluates to { a: { b: 0, c: 3 }, d: 2 }
export const updateIfChanged = <T>(t: T) => {
  const reduce = <U>(u: U, update: (u: U) => T) => {
    const set = (newU: U) => Object.is(u, newU) ? t : update(newU);
    type Key = U extends ReadonlyArray<any> ? number | keyof U : keyof U;
    type Value<K extends Key> = K extends keyof U ? U[K] : U extends ReadonlyArray<infer V> ? V : never;
    return Object.assign(
      <K extends Key>(key: K) =>
        reduce<Value<K>>(u[key as keyof U] as Value<K>, (v: Value<K>) => {
          return update(Object.assign(Array.isArray(u) ? [] : { }, u, { [key]: v }));
        }),
        { map: (updater: (u: U) => U) => set(updater(u)), set });
  };
  return reduce<T>(t, (t: T) => t);
};
