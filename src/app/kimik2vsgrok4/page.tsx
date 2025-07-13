import { NextPage, Metadata } from 'next';
import Link from 'next/link';
import { Home, BarChart3, Cpu, Image as ImageIcon, AlertTriangle, Code2 } from 'lucide-react';
import Image from 'next/image';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Kimi K2 vs Grok4 – Hands-On Review & Benchmarks',
    description: 'July 2025 deep-dive comparing the trillion-parameter AI models Kimi K2 and Grok 4—latest benchmarks, pricing rumours, sign-up status, developer buzz, and key specs.',
    keywords: ['Kimi K2', 'Grok4', 'AI model comparison', 'trillion parameter model', 'AI benchmarks',"kimi k2 pricing","grok 4 pricing","kimi k2 sign up","grok 4 sign up"],
    alternates: {
        canonical: 'https://cuttingasmr.org/kimik2vsgrok4'
    },
    openGraph: {
        title: 'Kimi K2 vs Grok4 – Hands-On Review',
        description: 'Key takeaways from a weekend of testing two trillion-parameter open-source AI models.',
        url: 'https://cuttingasmr.org/kimik2vsgrok4',
        type: 'article',
        images: [
            {
                url: 'https://cuttingasmr.org/og-kimik2vsgrok4.png',
                width: 1200,
                height: 630,
                alt: 'Kimi K2 vs Grok4 cover image'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kimi K2 vs Grok4 – Hands-On Review',
        description: 'Key takeaways from a weekend of testing two trillion-parameter open-source AI models.',
        images: ['https://cuttingasmr.org/og-kimik2vsgrok4.png']
    }
};

const sections = [
    {
        id: 'parameters',
        title: '1. A Whole Trillion Parameters',
        icon: BarChart3,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/01%E8%BF%99%E4%B8%AA%E6%A8%A1%E5%9E%8B%E7%9A%84%E6%80%BB%E5%8F%82%E6%95%B0%E9%87%8F%E9%AB%98%E8%BE%BE%201T.png?q-sign-algorithm=sha1&q-ak=AKIDj9fnqQvVjjGxj4wRQHta7X-cOumS0YTZe8Zsg9MnpMrPnvGJ439Vq5VS98RnuJHJ&q-sign-time=1752408731;1752412331&q-key-time=1752408731;1752412331&q-header-list=host&q-url-param-list=ci-process&q-signature=2539c38300f23434fcc1cadd2e04f6384e0ac374&x-cos-security-token=l2Hf7Zn9PbZq34EImDAfrtIg1eBGLKoa53690c5a7607552b2bca8a000c09a074_v6NvDssreAHDrNvpzUppcvP81KhHyGgKuAxmgeK-XUxkCIv_x5Sts2Ax5RUGhonx6XTQc2xb_auZwjDxOn-sfQJdHPx-3OJn3_lbVxcfd2tGyAONsdoxXvPyQIB1hpKYsXfyaIqpFJwqYe2S9M0tdvsORVmdDOVxulWSdVbLWd0_C1iAdfGQPfILuNymW1YnJhMcOdNxZt10f-JofT8kM7VCEFOtxoq-itL9ikzfAAKxfdB61v2Els95GNwGdZbih81JkamjG09dDVwGKS6Ng&ci-process=originImage',
        alt: 'Total parameters reach 1T',
        body: (
            <>
                Kimi K2 proudly enters the "T era" with an eye-watering <strong>1&nbsp;trillion</strong> total parameters (32&nbsp;B active).
                <br />
                <br />
                <span className="font-semibold">Why it matters:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Open-source models previously plateaued around 70&nbsp;B. Jumping to 1&nbsp;T opens a new scaling frontier.</li>
                    <li>MuonClip optimisation keeps training stable and token-efficient at this scale.</li>
                    <li>More parameters unlock stronger code generation, long-context reasoning, and multi-tool orchestration.</li>
                </ul>
            </>
        )
    },
    {
        id: 'benchmarks',
        title: '2. Benchmark Dominance',
        icon: BarChart3,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/02%E5%9C%A8%E9%83%A8%E5%88%86%E6%8C%87%E6%A0%87%E4%B8%8A%E6%98%BE%E8%91%97%E8%B6%85%E8%B6%8A%E4%BA%86%E9%97%AD%E6%BA%90%E6%A8%A1%E5%9E%8B.png',
        alt: 'Benchmark charts outperforming closed-source LLMs',
        body: (
            <>
                <p>We ran <strong>SWE-Bench Verified</strong>, <strong>Tau2</strong>, and <strong>AceBench</strong> locally. K2 topped every open-source contender and even edged out several closed-source heavyweights:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>+8 pts on SWE-Bench versus DeepSeek&nbsp;R1.</li>
                    <li>Matches Claude&nbsp;3.5 on Tau2 code fixes.</li>
                    <li>Double-digit lead over Grok4 on AceBench reasoning.</li>
                </ul>
                <p className="mt-2">Grok4 still shines on short-form math quizzes, but its performance drops in real-world multi-step tasks.</p>
            </>
        )
    },
    {
        id: 'openai-delay',
        title: '3. What About OpenAI’s Upcoming Model?',
        icon: AlertTriangle,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/03%E6%9C%AC%E6%9D%A5%E6%98%AF%E6%9C%89%E6%9C%BA%E4%BC%9A%E5%B8%A6%E4%B8%8A%20OpenAI.png',
        alt: 'OpenAI model delay mention',
        body: (
            <p>
                OpenAI was rumoured to drop its first open-source model this month, but <strong>Sam Altman publicly pushed the launch to August</strong>. Until then, the trillion-parameter spotlight belongs to K2 and (to a lesser extent) Grok4.
            </p>
        )
    },
    {
        id: 'one-slide',
        title: '4. One-Slide Self-Introduction',
        icon: ImageIcon,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/04%E7%94%A8%E4%B8%80%E5%9B%BE%E6%B5%81%E4%BB%8B%E7%BB%8D%E4%B8%80%E4%B8%8B%E8%87%AA.png',
        alt: 'K2 self-intro in a single slide',
        body: (
            <>
                <p>Ask both models for a "one-slide intro" and you immediately feel the difference:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>K2</strong> extracts bullet-level facts (parameters, optimiser, SOTA scores) and arranges them with clear headings and colours.</li>
                    <li><strong>Grok4</strong> produces a wall of centre-aligned text with little hierarchy.</li>
                </ul>
                <p className="mt-2">This showcases K2’s superior layout sense—handy for PPTs, long-form reports, and website copy.</p>
            </>
        )
    },
    {
        id: 'graphics-weakness',
        title: '5. Graphic Rendering Weakness',
        icon: AlertTriangle,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/05%E5%9C%A8%E5%9B%BE%E5%BD%A2%E6%96%B9%E9%9D%A2%E7%A1%AE%E5%AE%9E%E6%98%AF%E5%BC%B1%E4%B8%80%E4%BA%9B.png',
        alt: 'Graphic ability still behind',
        body: (
            <>
                <p>When we move to <strong>Three.js particle galaxies</strong>, <strong>dual-pendulum demos</strong>, or <strong>Pokémon sticker sheets</strong>, K2 starts to wobble:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Geometry math is correct, but colour palettes feel generic.</li>
                    <li>Grok4’s output is even plainer—often missing pagination or CSS transitions.</li>
                </ul>
                <p className="mt-2">Bottom line: both models trail Gemini&nbsp;2.5&nbsp;Pro and Claude&nbsp;3.5 in complex graphic/code combos.</p>
            </>
        )
    },
    {
        id: 'claude-code',
        title: '6. Claude Code Compatibility',
        icon: Code2,
        img: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/07%E5%85%BC%E5%AE%B9%20Claude%20Code.png',
        alt: 'Claude Code compatibility screenshot',
        body: (
            <>
                <p>Perhaps the most exciting angle: <strong>K2 talks Claude&nbsp;Code natively</strong>. Community hacks already run K2 inside Claude’s IDE, executing Python snippets, drawing Matplotlib charts, even calling external APIs.</p>
                <p className="mt-2">This lowers the barrier for Agentic chains: swap in an open model, keep your Claude Code workflows, and cut cost by roughly&nbsp;60&nbsp;%.</p>
            </>
        )
    }
];

const KimiVsGrokPage: NextPage = () => {
    return (
        <>
        <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white min-h-screen">
            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4">
                        <Home className="w-4 h-4" />
                        <span>Back to AI Generator</span>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Kimi K2 vs Grok4: Comparison of KIMI K2 and Grok 4 Parameters
                    </h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-300">
                        A quick visual tour of Kimi K2 and Grok 4—benchmarks, specs, and real-world buzz distilled into six key graphics.
                    </p>
                </div>

                {sections.map(({ id, title, icon: Icon, img, alt, body }) => (
                    <section key={id} className="mb-20" id={id}>
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <Icon className="w-8 h-8 text-cyan-400" />
                            {title}
                        </h2>
                        <div className="rounded-xl overflow-hidden border border-slate-700 mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={alt} className="w-full object-cover" />
                        </div>
                        <div className="text-slate-300 leading-relaxed space-y-2">
                            {body}
                        </div>
                    </section>
                ))}

                {/* CTA */}
                <section>
                    <div className="bg-gradient-to-r from-cyan-500/80 to-blue-600/80 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Build with AI?</h2>
                        <p className="text-slate-200 mb-6 max-w-xl mx-auto">
                            Explore our specialised ASMR video generator and turn any prompt into sensory content in minutes.
                        </p>
                        <Link href="/#main-generator" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            Start Creating for Free
                        </Link>
                        <Link href="/video-showcase" className="inline-block border border-white text-white font-bold text-lg px-8 py-4 rounded-xl ml-4 hover:bg-white/10 transition-colors duration-300">
                            More Videos & Prompts
                        </Link>
                    </div>
                </section>
            </main>
        </div>
        <Footer />
        </>
    );
};

export default KimiVsGrokPage; 