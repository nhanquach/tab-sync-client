import Logo from "components/Logo";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-6 overflow-auto w-full lg:w-4xl min-h-screen">
      <div className="flex w-full items-center justify-between flex-col md:flex-row">
        <h1 className="text-3xl font-bold mb-2 tracking-tighter flex gap-2 items-center text-left w-full">
          <Logo className="bg-primary" />
          Dashboard
        </h1>
        <div className="loading loading-ring loading-xl"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-center mt-4">
        <div className="loading loading-dots loading-xl mr-2"></div>Getting tabs...
        </div>
      </div>
    </div>
  );
}
