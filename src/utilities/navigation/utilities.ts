export function hideNavOnClose(e: React.AnimationEvent<HTMLElement>) {
  const classNames = e.currentTarget.classList;
  if (classNames.contains("animate-slide-out-left")) {
    classNames.add("hidden");
  }
}
