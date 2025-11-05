"use client";

import React from "react";

export default function OverlaySpinner({ visible = false }) {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* semi-transparent backdrop with blur */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" aria-hidden="true" />

			{/* spinner - layered, animated and more engaging */}
			<div className="relative flex flex-col items-center justify-center">
				<div className="relative w-24 h-24">
					{/* colorful rotating ring */}
					<div className="absolute inset-0 rounded-full spin-slow pulse-glow" />

					{/* thin counter-rotating ring */}
					<div className="absolute inset-2 rounded-full border-4 border-transparent border-t-white/30 border-b-white/10 spin-reverse" />

					{/* center core */}
					<div className="absolute inset-6 rounded-full bg-gray-900 flex items-center justify-center text-xs text-white/90 font-semibold">
						WA
					</div>
				</div>

				{/* animated label with dots */}
				<div className="mt-4 text-white/90 text-sm flex items-center gap-2">
					<span>Loading developer dashboard</span>
					<span className="inline-flex items-center" aria-hidden>
						<span className="dot" />
						<span className="dot delay" />
						<span className="dot delay2" />
					</span>
				</div>

				<span className="sr-only">Loading developer dashboard</span>

				{/* inline styles for spinner animations */}
				<style>{`
					.spin-slow{
						background: conic-gradient(from 0deg, #34d399, #3b82f6, #8b5cf6, #34d399);
						animation: spin 2.5s linear infinite, float 3.5s ease-in-out infinite;
						box-shadow: 0 8px 30px rgba(56,189,248,0.12);
					}

					.spin-reverse{
						border-top-color: rgba(255,255,255,0.16);
						border-bottom-color: rgba(255,255,255,0.06);
						animation: spin-rev 1.6s linear infinite;
					}

					.pulse-glow{
						box-shadow: 0 0 0 0 rgba(59,130,246,0.35);
						animation: pulse 2s infinite;
					}

					.dot{
						width:6px;height:6px;border-radius:9999px;background:rgba(255,255,255,0.9);display:inline-block;margin-left:4px;opacity:0;animation: dot 1.2s infinite;
					}
					.dot.delay{animation-delay:0.15s}
					.dot.delay2{animation-delay:0.3s}

					@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
					@keyframes spin-rev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
					@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(59,130,246,0.35)}70%{box-shadow:0 0 30px 12px rgba(59,130,246,0.03)}100%{box-shadow:0 0 0 0 rgba(59,130,246,0.0)}}
					@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
					@keyframes dot{0%{opacity:0;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}60%{opacity:0.6;transform:translateY(0)}100%{opacity:0}}
				`}</style>
			</div>
		</div>
	);
}
