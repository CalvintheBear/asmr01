import { NextPage, Metadata } from 'next';
import Link from 'next/link';
import { Home, DollarSign, BarChart2, Video, Sparkles } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { showcaseVideos } from '@/data/showcase-videos';

export const metadata: Metadata = {
    title: 'How to Make Money with AI Video (The Ultimate Guide)',
    description:
        'A comprehensive guide to making money with AI video generation. Learn strategies for passive income, content creation, and building a business with AI tools.',
    keywords: [
        'make money with ai',
        'ai video generation',
        'passive income',
        'ai business',
        'content creation',
        'asmr video monetization',
        'ai prompt engineering for profit',
        'creative ai business ideas',
        'ai tools for video creators',
        'monetize ai content',
        'earn money with ai',
        'ai side hustles 2025',
    ],
    openGraph: {
        title: 'How to Make Money with AI Video in 2025 | KIE AI',
        description:
            'A comprehensive guide to making money with AI video generation. Learn strategies for passive income, content creation, and building a business with AI tools.',
        images: [
            {
                url: 'https://www.kie.ai/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'How to Make Money with AI Video in 2025 | KIE AI',
            },
        ],
    },
};

const MakeMoneyWithAIPillarPage: NextPage = () => {
    const iceCuttingVideo = showcaseVideos.find(v => v.id === 'ice-cutting-asmr-1');
    const yetiVlogVideo = showcaseVideos.find(v => v.id === 'yeti-bigfoot-chase-vlog-1');

    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-800 text-white min-h-screen">
            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Content will be added in the next step */}
                 <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4">
                        <Home className="w-4 h-4" />
                        <span>Back to AI Generator</span>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                        The Ultimate Guide to Making Money with AI Video
                    </h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-300">
                        Your complete roadmap from zero to a profitable AI-driven content business.
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-16 prose prose-invert prose-lg max-w-none">
                    <p>The dream of earning a passive income online is more achievable than ever, thanks to Artificial Intelligence. This guide will walk you through a proven, step-by-step strategy to build a profitable, automated content business using AI tools for both research and creation. Forget spending weeks on a single video; we're talking about creating a content factory.</p>
                </section>

                {/* Step 1: Market Research with AI */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b-2 border-purple-500 pb-3">
                        <BarChart2 className="w-8 h-8 text-purple-400" />
                        Step 1: Uncover Profitable Niches with AI Research
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>The foundation of any successful content business is choosing the right niche. You need to find topics with high viewer demand but manageable competition. Using an AI research assistant like Perplexity AI is the most efficient way to do this.</p>
                        <p>Your goal is to ask strategic questions to uncover "digital gold." Here’s how:</p>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 my-6">
                            <h4 className="font-bold text-xl text-white mb-3">Example Prompts for Perplexity AI:</h4>
                            <ul className="list-disc pl-5 space-y-2 text-purple-300">
                                <li>"Analyze the top 10 YouTube channels that feature 'faceless' videos and have over 1 million subscribers. What are their most common content categories and video styles?"</li>
                                <li>"Identify 5 sub-niches within the 'oddly satisfying' video genre that have high search volume on TikTok but are not yet saturated with creators."</li>
                                <li>"List 10 types of ASMR video content that are popular but don't require expensive equipment to produce."</li>
                            </ul>
                        </div>
                        <p className="font-semibold">For a deeper dive into this research process, check out our detailed <Link href="/perplexity-for-creators" className="text-pink-400 hover:text-pink-300">Perplexity for Creators Guide</Link>.</p>
                    </div>
                </section>

                {/* Step 2: Content Production with Our AI */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b-2 border-pink-500 pb-3">
                        <Video className="w-8 h-8 text-pink-400" />
                        Step 2: Automate Your Video Production at Scale
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>Once you've identified a profitable niche, the next step is content creation. This is traditionally the most time-consuming part, but with our AI video generator, you can automate it.</p>
                        <p>Let's say your research identified "ASMR soap cutting" as a great niche. Instead of buying soap and cameras, you create a powerful, reusable prompt.</p>
                         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 my-6 font-mono text-pink-300">
                            <p><strong>Master Prompt Example:</strong> "Macro shot of a [COLOR] bar of soap with [TEXTURE/INGREDIENT] being sliced by a [TOOL]. [LIGHTING_STYLE] lighting. Audio: crisp [SOUND_TYPE] sounds, ultra high-fidelity binaural audio."</p>
                        </div>
                        <p>By simply changing the bracketed variables, you can generate hundreds of unique videos from a single master prompt, allowing you to dominate your chosen niche with a constant stream of fresh content. Here are a couple of examples of what you can create:</p>
                        
                        {/* Video Showcase Section */}
                        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                            {iceCuttingVideo && (
                                <VideoCard 
                                    video={iceCuttingVideo} 
                                    className="bg-slate-800/50 border border-slate-700" 
                                    buttonClassName="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                                />
                            )}
                            {yetiVlogVideo && (
                                <VideoCard 
                                    video={yetiVlogVideo} 
                                    className="bg-slate-800/50 border border-slate-700" 
                                    buttonClassName="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                                />
                            )}
                        </div>

                        <p className="font-semibold">See a detailed example of this in action in our <Link href="/make-money-with-ai-asmr" className="text-purple-400 hover:text-purple-300">AI ASMR Monetization Case Study</Link>.</p>
                    </div>
                </section>

                {/* Step 3: Monetization */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b-2 border-green-500 pb-3">
                        <DollarSign className="w-8 h-8 text-green-400" />
                        Step 3: Turn Your AI Content into Cash Flow
                    </h2>
                     <div className="prose prose-invert prose-lg max-w-none">
                        <p>With a scalable content engine, you can now focus on monetization. Here are the most effective strategies:</p>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong>YouTube & TikTok Ad Revenue:</strong> Build a channel in your niche and earn money from ads. AI-driven consistency helps you meet partner program requirements faster.</li>
                            <li><strong>Affiliate Marketing:</strong> Promote products related to your niche (e.g., the actual soap or knives from your videos) with affiliate links in your descriptions.</li>
                            <li><strong>Digital Products:</strong> Sell "prompt packs" or "ASMR sound libraries" that you've developed to other creators on platforms like Gumroad.</li>
                            <li><strong>Sponsorships:</strong> As your channel grows, brands will pay you to feature their products in your AI-generated videos.</li>
                        </ul>
                    </div>
                </section>

                {/* Final CTA */}
                <section>
                    <div className="bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-orange-500/80 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">You Have the Blueprint. Time to Build.</h2>
                        <p className="text-slate-200 mb-6 max-w-xl mx-auto">
                           The barrier to entry for a profitable content business has never been lower. Stop trading time for money and start building an automated income stream with AI.
                        </p>
                        <Link href="/#main-generator" className="inline-block bg-white text-purple-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            Start Building Your AI Business Now
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default MakeMoneyWithAIPillarPage; 