import Link from "next/link";
import { Metadata } from "next";
import { Sparkles, Target, TrendingUp, Zap, ChevronRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Signal AI - Job Fit Analysis Powered by AI",
  description: "Analyze job postings against your profile with AI. Get personalized insights, skill gap analysis, and actionable recommendations.",
  keywords: ["job analysis", "career insights", "AI", "job matching", "skill gap"],
  openGraph: {
    title: "Signal AI - Job Fit Analysis Powered by AI",
    description: "Analyze job postings against your profile with AI.",
    type: "website",
  },
};

const features = [
  {
    icon: Target,
    title: "Smart Job Matching",
    description: "AI analyzes job requirements against your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description: "Identify missing skills and get recommendations to bridge the gap.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Get detailed fit scores and actionable feedback in seconds.",
  },
];

const benefits = [
  "AI-powered fit scoring",
  "Resume optimization tips",
  "Interview preparation angles",
  "Risk assessment",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Sparkles className="w-6 h-6 text-indigo-600" aria-hidden="true" />
            <span>Signal AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Know Your Fit{" "}
              <span className="text-indigo-600">Before You Apply</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered job analysis that compares opportunities against your profile. 
              Get personalized insights, skill gaps, and actionable recommendations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Start Free Analysis
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold px-8 py-4 rounded-full text-lg transition-colors border border-slate-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
                Three simple steps to understand your job fit
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-indigo-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {index + 1}. {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Everything you need to make informed decisions
                  </h2>
                  <p className="mt-4 text-indigo-100 text-lg">
                    Stop guessing. Start knowing.
                  </p>
                </div>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-lg">
                      <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ready to find your perfect fit?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Join thousands of job seekers making smarter career decisions.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-indigo-500/20 mt-8"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            <span>Signal AI</span>
          </div>
          <p className="text-sm">© 2026 Signal AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
