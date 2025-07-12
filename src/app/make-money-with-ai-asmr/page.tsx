import Link from 'next/link';
import { Star, ArrowLeft, Zap, DollarSign, Youtube, Twitch, UserPlus, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { showcaseVideos } from '@/data/showcase-videos';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'How to Make Money with AI ASMR Videos | CuttingASMR.org & Veo3',
  description: 'Learn how to create and monetize ASMR videos using the power of Veo3 AI on CuttingASMR.org. A step-by-step guide to earning income from YouTube, TikTok, and sponsorships.',
  keywords: [
    'make money with asmr',
    'earn money with ai video',
    'monetize asmr videos',
    'veo3 ai monetization',
    'asmr creator income',
    'youtube revenue asmr',
    'tiktok asmr creator',
    'ai video for money',
    'how to create asmr videos',
    'cuttingasmr.org guide',
  ],
  alternates: {
    canonical: 'https://cuttingasmr.org/make-money-with-ai-asmr'
  },
};

const successStories = [
  {
    name: 'Luna Chen',
    role: 'ASMR YouTuber',
    income: '$45K/month',
    quote: "From zero to 500K subscribers in 2 months! The Veo3 AI creates content that's impossible to distinguish from real ASMR artists.",
  },
  {
    name: 'Marcus Williams',
    role: 'TikTok ASMR Creator',
    income: '$62K/month',
    quote: "My AI-generated soap cutting videos get 10M+ views each. The quality is so realistic, nobody believes it's AI!",
  },
  {
    name: 'Sophie Anderson',
    role: 'Multi-Platform Creator',
    income: '$78K/month',
    quote: "I produce 50 ASMR videos daily across all platforms. The 3D audio quality is better than my $5K microphone setup!",
  },
];

export default function MakeMoneyPage() {
  const glassFruitVideo = showcaseVideos.find(v => v.id === 'glass-fruit-cutting-1');
  const breadSpreadVideo = showcaseVideos.find(v => v.id === 'bread-golden-sauce-1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* --- Success Stories Section --- */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm font-medium mb-4 text-cyan-300">
            <Star className="w-4 h-4 text-yellow-400" />
            Success Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            ASMR Creators Earning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">$50K+/Month</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
            Discover how creators are building lucrative careers using our Veo3-powered AI platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.name} className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col justify-between text-left border border-slate-700/50">
                <div>
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <blockquote className="text-slate-200 mb-4 italic">"{story.quote}"</blockquote>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="font-bold text-white text-lg">{story.name}</p>
                    <p className="text-slate-400 text-sm">{story.role}</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-bold">
                    {story.income}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Main Guide Section --- */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">How to Create & Monetize ASMR Videos with Veo3 AI on CuttingASMR.org</h2>
          
          <div className="space-y-8">
            <p className="text-lg text-slate-300 leading-relaxed">
              Autonomous Sensory Meridian Response (ASMR) has exploded in popularity, creating a massive opportunity for content creators. But producing high-quality ASMR content traditionally requires expensive equipment, a silent studio, and hours of work. This guide will show you how to bypass these hurdles using the power of Veo3 AI on our platform to create professional-grade ASMR videos and turn your passion into a profitable venture.
            </p>

            {/* The Veo3 AI Advantage Section */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-cyan-300"><Zap className="text-yellow-400"/>The Veo3 AI Advantage on Our Platform</h3>
              <p className="mb-4 text-slate-300">
                Instead of spending weeks learning and thousands on gear, our platform gives you an unfair advantage:
              </p>
              <ul className="space-y-3 list-inside">
                {['Zero Equipment Cost: Forget $5,000 microphones. Our AI generates crystal-clear, 3D spatial audio that listeners love.', 'Incredible Speed: Create a complete, high-quality video in minutes, not hours. This allows you to scale your content production exponentially.', 'Unmatched Quality & Consistency: The Veo3 AI produces flawless 4K HDR video and perfect audio every single time. No background noise, no performance anxiety.', 'Limitless Creativity: With over 50 templates and the ability to write custom prompts, your creative potential is infinite. From soap cutting to fantasy vlogs, anything is possible.'].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0"/>
                    <span><strong>{item.split(':')[0]}:</strong>{item.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3-Step Guide Section */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">Your 3-Step Guide to Creating a Viral ASMR Video</h3>
              <ol className="space-y-4">
                {[
                  { title: 'Choose Your Scene', description: 'Start by selecting one of our proven, high-engagement ASMR templates or write your own custom prompt. This is your script and creative direction.', link: '/#main-generator' },
                  { title: 'Customize the Prompt', description: 'Fine-tune the prompt to match your vision. Describe the lighting, camera angles, specific sounds, and textures. The more detail, the better the result.' },
                  { title: 'Generate & Download', description: 'Click the "Generate" button. Our AI gets to work, and in a few minutes, your professional-grade ASMR video is ready to download and share with the world.' }
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg">{index + 1}</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{step.title}</h4>
                      <p className="text-slate-300">{step.description} {step.link && <Link href={step.link} className="text-cyan-400 hover:text-cyan-300 font-semibold">Try it now!</Link>}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Video Showcase Section */}
              <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {glassFruitVideo && (
                      <VideoCard 
                          video={glassFruitVideo} 
                          className="bg-slate-800/50 border border-slate-700" 
                          buttonClassName="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                      />
                  )}
                  {breadSpreadVideo && (
                      <VideoCard 
                          video={breadSpreadVideo} 
                          className="bg-slate-800/50 border border-slate-700" 
                          buttonClassName="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                      />
                  )}
              </div>
            </div>

            <div className="my-8 text-center">
                <Link href="/video-showcase" className="inline-flex items-center gap-2 justify-center px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors font-semibold">
                    <Youtube className="w-5 h-5" />
                    More AI Prompts & Videos
                </Link>
            </div>

            {/* Monetization Section */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-cyan-300"><DollarSign className="text-green-400"/>How to Monetize Your AI-Generated ASMR Videos</h3>
                <p className="mb-6 text-slate-300">
                  High-quality, consistent content is the key to monetization. Here’s how our successful creators are earning income:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-600/80">
                        <div className="flex items-center gap-3 mb-3">
                            <Youtube className="w-8 h-8 text-red-500"/>
                            <h4 className="text-xl font-bold text-white">Ad Revenue</h4>
                        </div>
                        <p className="text-slate-300">Publish your videos on platforms like YouTube. With the ability to produce dozens of videos daily, you can quickly meet monetization requirements and scale your ad income.</p>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-600/80">
                        <div className="flex items-center gap-3 mb-3">
                            <Twitch className="w-7 h-7 text-purple-500"/>
                            <h4 className="text-xl font-bold text-white">Sponsorships</h4>
                        </div>
                        <p className="text-slate-300">As your channels grow, brands will approach you for sponsorship deals. Your high-quality, AI-generated content makes your channel an attractive partner for promotions.</p>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-600/80">
                        <div className="flex items-center gap-3 mb-3">
                            <UserPlus className="w-7 h-7 text-blue-500"/>
                            <h4 className="text-xl font-bold text-white">Memberships</h4>
                        </div>
                        <p className="text-slate-300">Use platforms like Patreon or YouTube Memberships to offer exclusive content, early access, or personalized videos to your most dedicated fans for a recurring monthly income.</p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
              <Link href="/pricing" className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Sparkles className="w-6 h-6" />
                Start Your Creator Journey Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 