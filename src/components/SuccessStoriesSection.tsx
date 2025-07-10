import { Star } from 'lucide-react'

export default function SuccessStoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
          <Star className="w-4 h-4" />
          Success Stories
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          ASMR Creators Earning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">$50K+/Month</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((s) => (
          <article key={s.id} className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl border border-stone-700">
            <div className="flex items-center mb-6">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg italic mb-6 leading-relaxed">{s.quote}</blockquote>
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <h4 className="font-semibold text-xl">{s.name}</h4>
                <p className="text-stone-300">{s.role}</p>
              </div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg">{s.earn}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const stories = [
  {
    id: 1,
    quote: 'From zero to 500K subscribers in 2 months! The Veo3 AI creates content that\'s impossible to distinguish from real ASMR artists.',
    name: 'Luna Chen',
    role: 'ASMR YouTuber',
    earn: '$45K/month',
  },
  {
    id: 2,
    quote: 'My AI-generated soap cutting videos get 10M+ views each. The quality is so realistic, nobody believes it\'s AI!',
    name: 'Marcus Williams',
    role: 'TikTok ASMR Creator',
    earn: '$62K/month',
  },
  {
    id: 3,
    quote: 'I produce 50 ASMR videos daily across all platforms. The 3D audio quality is better than my $5K microphone setup!',
    name: 'Sophie Anderson',
    role: 'Multi-Platform Creator',
    earn: '$78K/month',
  },
] 