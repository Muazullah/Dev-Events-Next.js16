export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            </div>
            <p className="text-light-200/50 text-sm animate-pulse">Loading...</p>
        </div>
    );
}