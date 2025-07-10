import Link from 'next/link'

export default function GuidesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How to Create an ASMR Video<br />
          <span className="text-slate-300">with Veo3 AI</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Generate a relaxing ASMR video in just three simple steps with our<br />
          AI-powered Veo3 platform:
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {steps.map((step) => (
          <div key={step.id} className={`bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-sm border border-slate-700/50 hover:shadow-md hover:border-cyan-400/30 transition-all duration-300`}>
            <div className={`w-12 h-12 ${step.bg} text-${step.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>{step.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
            Create AI Video Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </Link>
      </div>
    </section>
  )
}

const steps = [
  {
    id: 1,
    title: 'Choose ASMR Scene',
    desc: 'Select from pre-built templates or create your own custom ASMR concept',
    bg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-400/10',
    color: 'cyan-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /><circle cx="8" cy="8" r="2" fill="currentColor" /></svg>
    ),
  },
  {
    id: 2,
    title: 'Customize Your Prompt',
    desc: 'Describe your ideal ASMR scene with specific details about sounds, visuals, and mood',
    bg: 'bg-gradient-to-br from-blue-500/20 to-blue-400/10',
    color: 'blue-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    ),
  },
  {
    id: 3,
    title: 'Generate & Share',
    desc: 'AI creates your video in 3-5 minutes. Download and share on YouTube, TikTok, or any platform',
    bg: 'bg-gradient-to-br from-purple-500/20 to-purple-400/10',
    color: 'purple-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3l-6 18M9 9l10.5-3M20 6l-18 6" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l1-1M18 18l1 1M6 18l-1 1M18 6l1-1" /></svg>
    ),
  },
] 