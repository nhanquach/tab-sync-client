import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl">Page Not Found</p>
      <p className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Go back to home
        </Link>
      </p>
    </div>
  );
}
