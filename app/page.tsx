import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className='h-screen bg-gradient-to-b from-blue-900 via-indigo-700 to-purple-600 flex flex-col items-center justify-center text-white text-center'>
        <div className='mb-6'>
          {/* SVG Logo */}
          <Image
            src='/android-chrome-512x512.png'
            alt='Logo'
            width={100}
            height={100}
          />
        </div>

        <h1 className='text-4xl font-extrabold'>Coming Soon!</h1>
        <p className='mt-4 text-lg max-w-lg mx-auto'>
          CashIQ.in helps Indians manage finances, optimize taxes, and build
          wealth with easy-to-use tools and expert insights. Take control of
          your financial future, make smarter decisions, and achieve your wealth
          goals with secure, reliable solutions tailored to your needs.
        </p>

        <div className='mt-8 text-lg'>
          <p>Stay tuned! We&apos;re working on something amazing.</p>
        </div>
      </div>
    </>
  );
}
