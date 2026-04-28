export default function ProgressBar({ current, max }: { current: number, max: number }) {
    // 1. Calculate the percentage (and cap it at 100% just in case!)
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));

    return (
        <div style={{ width: "100%", fontFamily: "sans-serif" }}>

            {/* 2. The Label (e.g., "37 / 1500") */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                <span>Progress</span>
                <span style={{ fontWeight: "bold" }}>
                    {current} / {max}
                </span>
            </div>

            {/* 3. The Outer Track (The gray background) */}
            <div
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={max}
                style={{
                    height: "20px",
                    width: "100%",
                    backgroundColor: "#e0e0e0", // Light gray track
                    borderRadius: "10px",
                    overflow: "hidden" // Keeps the inner bar inside the rounded corners!
                }}
            >
                {/* 4. The Inner Fill (The colored bar) */}
                <div
                    style={{
                        height: "100%",
                        width: `${percentage}%`, // This dynamically grows the bar!
                        backgroundColor: "#3b82f6", // Nice blue color
                        borderRadius: "10px",
                        transition: "width 0.5s ease-in-out" // Smooth animation when the number changes
                    }}
                />
            </div>

            {/* Optional: Show the exact percentage below */}
            <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "0.25rem", textAlign: "right" }}>
                {percentage.toFixed(1)}%
            </p>

        </div>
    );
}