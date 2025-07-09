import { Zap, Settings, Video, Sparkles, Check } from 'lucide-react';

export default function CollapsibleTechSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="p-12 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 text-center">
              Advanced ASMR Video Generation Technology with Veo3
            </h2>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Powered by Google Veo3, our ASMR video generator creates professional therapeutic ASMR videos 
            automatically. The best video generator technology analyzes your prompts and transforms them into high-quality ASMR content with precision - perfect for content creators and stress relief ASMR videos.
          </p>
        </div>

        {/* Content */}
        <div className="px-12 pb-12 border-t border-slate-600/50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white mb-3">Google Veo3 Video Engine</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Advanced Google technology that transforms prompts into professional ASMR videos with sleep-inducing effects</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-3">Smart Video Creator Tools</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Intelligent algorithms adapt to your ASMR content ideas and create personalized experiences for content creators</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-3">Best Video Maker for YouTube & TikTok</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Video production optimized for YouTube Shorts and TikTok Shorts - creates viral-ready ASMR content in minutes</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-slate-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="font-semibold text-white mb-3">Advanced ASMR Content Ideas Generator</h3>
              <p className="text-sm text-slate-300 leading-relaxed">Veo3 understands glass cutting, fruit slicing, lava effects, and knife sounds - automatically creates meditation and stress relief experiences</p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 mt-8 border border-slate-600/50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Best Video Technology Powered by Google Veo3</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our ASMR generator utilizes cutting-edge Google Veo3 technology to transform prompts into therapeutic content automatically. 
                  Perfect for content creators - the system analyzes your ASMR video ideas and generates professional stress relief videos, sleep ASMR content, and meditation videos for wellness purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 