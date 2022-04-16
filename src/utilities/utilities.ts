export function throttle(callback: () => void, delay = 250) {
  const timer = [] as NodeJS.Timeout[];

  function foo() {
    const id = setTimeout(callback, delay);
    if (timer[0]) {
      const previousId = timer.shift() as NodeJS.Timeout;
      clearTimeout(previousId);
    }
    timer.push(id);
    return () => clearTimeout(id);
  }
  return foo;
}
