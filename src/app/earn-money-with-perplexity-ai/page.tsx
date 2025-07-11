import { NextPage, Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Video, Search, ChevronsRight, Home, DollarSign, BarChart2 } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { showcaseVideos } from '@/data/showcase-videos';

export const metadata: Metadata = {
    title: 'How to Earn Money Online with Perplexity AI & Video Generation',
    description: 'A step-by-step guide to using Perplexity AI for market research and creating profitable video content with our AI video generator. Start your online business today!',
    keywords: ['earn money online', 'perplexity ai', 'ai video generator', 'online business', 'passive income', 'content creation monetization', 'youtube automation', 'tiktok monetization'],
};

const EarnMoneyWithPerplexityPage: NextPage = () => {
    const exampleVideo = showcaseVideos.find(v => v.id === 'kinetic-sand-slicing') || showcaseVideos[1];

    return (
        <div className="bg-gradient-to-br from-slate-900 via-green-900/50 to-slate-800 text-white min-h-screen">
            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-4">
                        <Home className="w-4 h-4" />
                        <span>Back to AI Generator</span>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent">
                        Earn Money Online with Perplexity AI
                    </h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-300">
                        Discover how to combine AI-powered research with automated video creation to build a profitable online content business.
                    </p>
                </div>

                {/* Section 1: The Opportunity */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-400" />
                        The New Creator Economy: AI-Driven & Profitable
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        The internet is full of "earn money online" guides, but most require significant time, skill, or financial investment. Today, a new model has emerged: using AI to identify profitable niches and then using another AI to create the content. This guide shows you exactly how to do it.
                    </p>
                </section>

                {/* Section 2: Using Perplexity for Market Research */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <BarChart2 className="w-8 h-8 text-blue-400" />
                        Step 1: Find Your Goldmine with Perplexity
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Your first task is to find a video niche that has high demand but relatively low competition. Perplexity is the perfect tool for this research. Instead of guessing, you can ask it for data-driven insights.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-6 font-semibold">
                        Ask Perplexity questions like these:
                    </p>
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-green-300">"What are some YouTube channels that get millions of views with simple, faceless videos? Analyze their content categories."</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-green-300">"List 5 ASMR sub-niches with high search volume but a low number of dedicated creator channels. Provide keyword search data."</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-green-300">"What type of 'satisfying' or 'oddly satisfying' video content is currently trending on TikTok and Instagram Reels?"</p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Bridge from Research to Production */}
                <section className="mb-16">
                    <div className="text-center my-10">
                        <ChevronsRight className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Video className="w-8 h-8 text-red-400" />
                        Step 2: Automate Content Production
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Research is half the battle. The other half is execution. Creating videos manually is slow and expensive. This is where you leverage our AI video generator to turn your profitable ideas into a scalable content factory.
                    </p>

                    <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-2xl shadow-xl border border-stone-700 p-8">
                        <p className="text-slate-400 mb-2 text-sm">Perplexity's Research Finding:</p>
                        <blockquote className="border-l-4 border-green-400 pl-4 text-slate-300 italic mb-6">
                           "The niche of 'slicing kinetic sand with satisfying crunches' has high engagement and can be produced without showing a face. Viewers are drawn to the sound and visual texture."
                        </blockquote>
                        
                        <p className="text-slate-400 mb-2 text-sm">Our Mass-Production AI Prompt:</p>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 font-mono text-green-300 mb-8">
                            <p>Macro shot of a block of colorful kinetic sand being sliced cleanly by a sharp knife. A professional softbox studio setting. Audio: a deep, satisfying crunching sound, ultra high-fidelity binaural audio.</p>
                        </div>
                        
                        <p className="text-slate-400 mb-2 text-sm">Your Automated Video Asset:</p>
                        <VideoCard 
                            video={exampleVideo} 
                            className="border-2 border-green-500/50 shadow-green-500/20"
                            buttonClassName="border-green-400 text-green-400 hover:bg-green-400/10"
                        />
                         <p className="text-center mt-4 text-sm text-slate-400">You can generate dozens of variations of this video daily, each unique, in just minutes.</p>
                    </div>
                </section>
                
                {/* Section 4: Monetization Strategies */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-400" />
                        Step 3: Monetize Your Content
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Once you have a steady stream of content, you can monetize it in several ways. You don't need millions of followers to start earning.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Monetization Method 1 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="font-semibold text-xl text-white mb-3">YouTube & TikTok Ad Revenue</h3>
                            <p className="text-slate-300 text-sm">Post your videos on YouTube (as Shorts) and TikTok. Once you meet their partner program requirements, you'll earn money from the ads shown on your videos. Consistency is key, and AI generation makes it easy.</p>
                        </div>
                        {/* Monetization Method 2 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="font-semibold text-xl text-white mb-3">Affiliate Marketing</h3>
                            <p className="text-slate-300 text-sm">Find products related to your niche (e.g., ASMR microphones, kinetic sand kits). Sign up for affiliate programs (like Amazon Associates) and place your unique links in your video descriptions or bio. You'll earn a commission on every sale.</p>
                        </div>
                        {/* Monetization Method 3 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="font-semibold text-xl text-white mb-3">Selling Digital Products</h3>
                            <p className="text-slate-300 text-sm">Package your best video prompts or create 'sound packs' from the AI-generated audio. Sell them on platforms like Gumroad or Etsy to other aspiring creators.</p>
                        </div>
                        {/* Monetization Method 4 */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="font-semibold text-xl text-white mb-3">Sponsorships</h3>
                            <p className="text-slate-300 text-sm">As your channel grows, brands may reach out to sponsor your videos. With AI-generated content, you can offer them quick turnarounds and creative video ads.</p>
                        </div>
                    </div>
                </section>

                {/* Section 5: CTA */}
                <section>
                    <div className="bg-gradient-to-r from-green-500/80 to-cyan-600/80 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Start Your AI Content Business Today</h2>
                        <p className="text-slate-200 mb-6 max-w-xl mx-auto">
                           You have the strategy. You have the tools. The only thing left is to start. Begin your journey to financial freedom with AI-powered content creation.
                        </p>
                        <Link href="/#main-generator" className="inline-block bg-white text-green-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            Start Generating Videos Now
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default EarnMoneyWithPerplexityPage; 