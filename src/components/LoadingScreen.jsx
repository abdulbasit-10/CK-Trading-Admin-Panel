

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-slate-300/20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Modern spinner */}
        <div className="relative h-16 w-16">
          {/* Outer ring - subtle background */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-200/50"></div>
          
          {/* Animated gradient ring */}
          <svg
            className="absolute inset-0 h-16 w-16 -rotate-90 animate-spin"
            style={{ animationDuration: "2.4s" }}
            viewBox="0 0 64 64"
          >
            <defs>
              <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="url(#spinner-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="44 88"
              opacity="1"
            />
          </svg>

          {/* Inner accent dot */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 to-slate-100 shadow-inner"></div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-slate-700">Checking authentication</p>
          <p className="text-xs text-slate-500">Please wait while we verify your access</p>
        </div>

        {/* Optional: subtle animated dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-400"
              style={{
                animation: `pulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}