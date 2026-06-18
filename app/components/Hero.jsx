import {Link} from 'react-router';

export function Hero() {
  return (
    <div className="-mx-4 relative h-[80vh] min-h-130 overflow-hidden">
      <img
        src="/mads-schmidt-rasmussen-tSp5_w9h5TQ-unsplash.jpg"
        alt="Snowboarder carving down a pristine mountain slope"
        className="absolute inset-0 w-full h-full object-cover rounded-none"
      />
      <div className="absolute inset-0 bg-linear-to-l from-black/50 via-transparent to-transparent" />
      <div className="relative h-full flex flex-col justify-between items-end px-6 pb-16 min-[45em]:px-12">
        <div />
        <div className="w-full min-[45em]:w-1/2">
          <h1 className="text-white text-5xl min-[45em]:text-7xl font-bold leading-tight mt-0 mb-4">
            Ride the Mountain
            <br />
            Your Way
          </h1>
          <p className="font-sans text-white/85 text-base min-[45em]:text-xl mb-8 leading-relaxed">
            Premium snowboards and gear built for every descent. From first runs
            to steep lines&nbsp;&mdash; find your setup.
          </p>
          <Link
            to="/collections/all"
            prefetch="intent"
            className="inline-block bg-white text-black font-heading font-semibold text-sm px-8 py-3 rounded-sm hover:bg-white/90 transition-colors tracking-wide"
          >
            Shop Now
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-6 min-[45em]:left-12 text-xs text-black bg-white/50 px-3 py-2 rounded">
        Photo by{' '}
        <a
          href="https://unsplash.com/@mvds?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          className="underline hover:text-black/70"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mads Schmidt Rasmussen
        </a>{' '}
        on{' '}
        <a
          href="https://unsplash.com/photos/man-in-white-jacket-and-black-pants-standing-on-brown-rock-formation-during-daytime-tSp5_w9h5TQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          className="underline hover:text-black/70"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
