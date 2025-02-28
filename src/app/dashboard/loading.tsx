export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
      <span className="loading loading-ring w-32 h-32"></span>
      <span className="animate-pulse text-neutral-300">Working...</span>
    </div>
  );
}
