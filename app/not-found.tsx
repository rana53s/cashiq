import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='h-screen bg-gradient-to-b from-red-900 via-red-700 to-red-600 flex flex-col items-center justify-center text-white text-center'>
      <div className='mb-6'>
        {/* You can reuse the same logo or use a different one for the 404 page */}
        <Image
          src='/android-chrome-512x512.png'
          alt='Logo'
          width={100}
          height={100}
        />
      </div>

      <h1 className='text-4xl font-extrabold'>404 - Page Not Found</h1>
      <p className='mt-4 text-lg max-w-lg mx-auto'>
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <div className='mt-8 text-lg'>
        <p>Let&apos;s get you back to safety!</p>
        <Link
          href='/'
          className='mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-700 transition-colors'
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
