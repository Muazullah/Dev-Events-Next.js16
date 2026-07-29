'use client';

const ExploreBtn = () => {
  const handleClick = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      id="explore-btn"
      onClick={handleClick}
      className="group relative overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        Explore Events
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ExploreBtn;