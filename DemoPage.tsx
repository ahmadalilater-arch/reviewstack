import { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, ExternalLink, RotateCcw, Hotel } from "lucide-react";

type DemoStep = "message" | "positive" | "negative" | "feedback-sent";

export function DemoPage() {
  const [step, setStep] = useState<DemoStep>("message");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const business = {
    name: "The Grand Palms Hotel",
    icon: <Hotel className="w-5 h-5" />,
    googleMapsUrl: "https://maps.google.com",
  };

  const reset = () => {
    setStep("message");
    setFeedbackText("");
    setSubmitted(false);
    setRating(0);
    setHoverRating(0);
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Live Demo</h1>
          <p className="text-slate-500 text-sm">Experience ReviewFlow from your customer's perspective.</p>
        </div>

        {/* Phone mockup */}
        <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl mx-auto max-w-sm">
          <div className="bg-white rounded-[2rem] overflow-hidden">

            {/* Phone header */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-600 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {business.icon}
                </div>
                <div>
                  <div className="font-bold text-sm">{business.name}</div>
                  <div className="text-xs text-white/70">via ReviewFlow · just now</div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">

              {/* Step 1: Message */}
              {step === "message" && (
                <>
                  <div className="bg-sky-50 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-700 leading-relaxed shadow-sm">
                    Hi Maria! 👋 Thank you for staying with us at <span className="font-semibold">The Grand Palms Hotel</span>. We hope your stay was wonderful. How would you rate your overall experience with us?
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-3">How was your experience?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setStep("positive")}
                        className="flex flex-col items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl py-4 font-semibold text-sm transition-all hover:scale-105 shadow-md"
                      >
                        <ThumbsUp className="w-6 h-6" />
                        Loved it! 😍
                      </button>
                      <button
                        onClick={() => setStep("negative")}
                        className="flex flex-col items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-semibold text-sm transition-all hover:scale-105 shadow-md"
                      >
                        <ThumbsDown className="w-6 h-6" />
                        Had issues 😕
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2a: Positive → Google Maps */}
              {step === "positive" && (
                <>
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="font-bold text-sky-800 mb-1">That's amazing to hear!</div>
                    <p className="text-xs text-sky-700">We're so glad you enjoyed your stay at The Grand Palms Hotel. Would you mind sharing your experience on Google? It really helps us!</p>
                  </div>

                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-7 h-7 cursor-pointer transition-all ${s <= (hoverRating || rating) ? "text-red-400 fill-red-400 scale-110" : "text-slate-300"}`}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>

                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-xl py-3 font-bold text-sm shadow-lg hover:scale-105 transition-all"
                  >
                    ⭐ Leave a Google Review
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 text-center">
                    You'll be taken to The Grand Palms Hotel on Google Maps to share your review.
                  </div>

                  <button onClick={reset} className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Try the demo again
                  </button>
                </>
              )}

              {/* Step 2b: Negative → Private feedback */}
              {step === "negative" && !submitted && (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="text-2xl mb-1 text-center">😔</div>
                    <div className="font-bold text-red-800 text-sm text-center mb-1">We're sorry to hear that!</div>
                    <p className="text-xs text-red-700 text-center">Your experience matters to us. Please share what went wrong — our manager will personally follow up.</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">What could we have done better?</p>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please describe your experience..."
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none text-slate-700 bg-slate-50"
                    />
                  </div>

                  <button
                    onClick={() => { if (feedbackText.trim()) { setSubmitted(true); setStep("feedback-sent"); } }}
                    disabled={!feedbackText.trim()}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-1.5" />
                    Submit Private Feedback
                  </button>

                  <button onClick={reset} className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Try the demo again
                  </button>
                </>
              )}

              {/* Step 3: Feedback submitted */}
              {step === "feedback-sent" && (
                <>
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-center">
                    <div className="text-3xl mb-3">✅</div>
                    <div className="font-bold text-sky-900 mb-1">Thank you for your feedback!</div>
                    <p className="text-xs text-sky-700 leading-relaxed">Your response has been privately sent to The Grand Palms Hotel. A manager will reach out to you personally to make it right.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">What happens next?</span> The business receives your feedback on their ReviewFlow dashboard — NOT on Google or any public platform.
                  </div>

                  <button
                    onClick={reset}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold text-sm transition-all shadow"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="bg-white rounded-xl border border-sky-200 p-3 text-center">
            <ThumbsUp className="w-4 h-4 text-sky-500 mx-auto mb-1" />
            <strong className="text-sky-700">Happy customers</strong>
            <p className="text-slate-400 mt-0.5">→ Directed to Google Maps review page</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-3 text-center">
            <ThumbsDown className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <strong className="text-red-600">Unhappy customers</strong>
            <p className="text-slate-400 mt-0.5">→ Private feedback sent to you only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
