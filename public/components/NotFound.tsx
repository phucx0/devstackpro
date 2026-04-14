import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="text-lg text-gray-600 mt-3">
                The page you’re looking for doesn’t exist.
            </p>

            <Link href="/" className="text-white mt-2 px-4 py-2 rounded-full font-bold bg-black">Go Back Home</Link>
        </div>
    );
}
