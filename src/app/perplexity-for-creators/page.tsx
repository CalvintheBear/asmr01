import { NextPage, Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Video, Search, ChevronsRight, Home } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import VideoCard from '@/components/VideoCard';
import { showcaseVideos } from '@/data/showcase-videos';

export const metadata: Metadata = {
    title: 'Creative Guide: Perplexity AI for Viral Video Ideas',
    description: 'A content creator\'s guide to using Perplexity AI for generating unlimited viral video ideas for TikTok and YouTube. Turn AI search results into stunning videos with our text-to-video generator.',
    keywords: ['perplexity for creators', 'ai video ideas', 'creative content guide', 'youtube video ideas', 'tiktok trends discovery', 'asmr video prompts', 'overcome creative block'],
    openGraph: {
        title: 'Creative Guide: Perplexity AI for Viral Video Ideas',
        description: 'A complete guide on using Perplexity AI to find and create viral video content.',
        url: 'https://cuttingasmr.org/perplexity-for-creators',
        type: 'article',
        images: [
            {
                url: 'https://cuttingasmr.org/og-image-perplexity-guide.png', // 需要创建一个对应的预览图
                width: 1200,
                height: 630,
                alt: 'Guide to using Perplexity AI for Video Content Creation',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Creative Guide: Perplexity AI for Viral Video Ideas',
        description: 'From AI search to AI video in minutes. Learn how to leverage Perplexity for endless content ideas.',
        images: ['https://cuttingasmr.org/twitter-image-perplexity-guide.png'], // 需要创建一个对应的预览图
    },
};

const PerplexityForCreatorsPage: NextPage = () => {
    // 为VideoCard寻找一个合适的示例视频
    const exampleVideo = showcaseVideos.find(v => v.id === 'glass-fruit-cutting-1') || showcaseVideos[0];

    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white min-h-screen">
            {/* 占位符：SEO元数据将通过导出 metadata 对象实现 */}
            
            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4">
                        <Home className="w-4 h-4" />
                        <span>Back to AI Generator</span>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Perplexity AI for Video Creators
                    </h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-300">
                        A complete guide on how to leverage the power of AI search to fuel your video content creation pipeline.
                    </p>
                </div>

                {/* Section 1: Introduction */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        From Creative Block to Viral Hit
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Ever stared at a blank screen, wondering what your next viral video will be? Content creation is tough, and coming up with fresh, engaging ideas consistently is one of the biggest challenges for any creator. This is where AI research tools like Perplexity AI can become your secret weapon.
                    </p>
                </section>

                {/* Section 2: What is Perplexity AI? */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Search className="w-8 h-8 text-blue-400" />
                        What is Perplexity AI?
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        Think of Perplexity AI as your personal research assistant that's connected to the entire internet in real-time. Unlike traditional search engines that just give you a list of links, Perplexity reads, understands, and summarizes the information for you, providing direct answers with cited sources.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        For creators, this means you can quickly research trending topics, discover niche interests, and brainstorm unique concepts for your next video without drowning in countless articles and forum threads.
                    </p>
                </section>

                {/* Section 3: How to use it for ASMR ideas */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Video className="w-8 h-8 text-red-400" />
                        Finding ASMR Video Ideas with Perplexity
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        The key is to ask specific, creative questions. Instead of just searching for "ASMR ideas," you can ask Perplexity to act as a creative partner. Here are some examples of powerful prompts you can use:
                    </p>
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-cyan-300">"What are the top 10 trending ASMR triggers on TikTok and YouTube Shorts this month? Provide a list."</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-cyan-300">"Give me 5 creative ideas for kinetic sand cutting videos that combine visual and auditory satisfaction."</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                            <p className="font-mono text-cyan-300">"Describe a visually satisfying scene involving soap carving with a hot knife, and list some specific audio keywords for the ASMR sounds."</p>
                        </div>
                    </div>
                </section>
                
                {/* Section 4: Bridge from Idea to Reality */}
                <section className="mb-16">
                    <div className="text-center my-10">
                        <ChevronsRight className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        From Idea to Reality: One Click Away
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        An AI research assistant gives you the "what". A specialized AI video generator gives you the "how". Let's take one of the ideas from above and see how our tool can turn it into a finished video in minutes.
                    </p>

                    <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-2xl shadow-xl border border-stone-700 p-8">
                        <p className="text-slate-400 mb-2 text-sm">Perplexity's Idea:</p>
                        <blockquote className="border-l-4 border-blue-400 pl-4 text-slate-300 italic mb-6">
                            "A scene featuring a bar of soap with cucumber slices embedded in it, being sliced with a sharp knife in a professional softbox studio setting. The audio should be a crisp, satisfying slicing sound."
                        </blockquote>
                        
                        <p className="text-slate-400 mb-2 text-sm">Our AI Video Prompt:</p>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 font-mono text-cyan-300 mb-8">
                            <p>A professional softbox studio setting, neutral background, perfect lighting. A bar of soap with cucumber slices embedded is being sliced with a sharp knife. Audio: crisp, satisfying slicing sounds. ultra high-fidelity binaural audio. a tight close-up shot.</p>
                        </div>
                        
                        <p className="text-slate-400 mb-2 text-sm">Generated Video Result:</p>
                        <VideoCard 
                            video={exampleVideo} 
                            className="border-2 border-cyan-500/50 shadow-cyan-500/20"
                            buttonClassName="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                        />
                    </div>
                </section>

                {/* Section 5: Why a Specialized Tool? */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6">Why Not Just Use Perplexity's Answer?</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>While Perplexity is fantastic for research and ideas, creating a high-quality video requires a specialized tool. A generic text description is not a video prompt.</p>
                        <p>Our AI Video Generator is specifically fine-tuned for the visual and auditory nuances of ASMR content. It understands concepts like:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><span className="font-semibold text-cyan-400">Audio-Visual Sync:</span> Ensuring the "crunch" sound perfectly matches the visual of a knife cutting.</li>
                            <li><span className="font-semibold text-cyan-400">Physics & Texture:</span> Simulating the realistic texture of kinetic sand or the way light reflects off glass.</li>
                            <li><span className="font-semibold text-cyan-400">Cinematic Styles:</span> Applying specific camera angles (like macro shots) and lighting (like softbox studio) for a professional look.</li>
                        </ul>
                    </div>
                </section>

                {/* Section 6: CTA */}
                <section>
                    <div className="bg-gradient-to-r from-cyan-500/80 to-blue-600/80 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Turn Your Ideas into Reality?</h2>
                        <p className="text-slate-200 mb-6 max-w-xl mx-auto">
                            Stop chasing trends and start setting them. Use our AI generator to bring your most creative ASMR concepts to life in minutes.
                        </p>
                        <Link href="/#main-generator" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            Start Creating for Free
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PerplexityForCreatorsPage; 