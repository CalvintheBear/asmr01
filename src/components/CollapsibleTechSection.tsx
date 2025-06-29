import { Zap, Settings, Video, Sparkles, Check } from 'lucide-react';

export default function CollapsibleTechSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="p-12 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 text-center">
              Advanced AI Video Generation Technology with Veo3
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powered by Google Veo3 AI, our ASMR generator creates professional therapeutic videos 
            automatically. The best AI video generator technology analyzes your prompts and transforms them into high-quality ASMR content with precision - perfect for content creators and stress relief videos.
          </p>
        </div>

        {/* Content */}
        <div className="px-12 pb-12 border-t border-gray-100">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Google Veo3 AI Video Engine</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Advanced Google AI technology that transforms prompts into professional ASMR videos with sleep-inducing effects</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Smart AI Video Creator Tools</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Intelligent AI algorithms adapt to your ASMR content ideas and create personalized experiences for content creators</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Best AI Video Maker for YouTube & TikTok</h3>
              <p className="text-sm text-gray-600 leading-relaxed">AI video production optimized for YouTube Shorts and TikTok Shorts - creates viral-ready ASMR content in minutes</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Advanced ASMR Content Ideas Generator</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Veo3 AI understands glass cutting, fruit slicing, lava effects, and knife sounds - automatically creates meditation and stress relief experiences</p>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-xl p-6 mt-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best AI Video Technology Powered by Google Veo3</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our ASMR generator utilizes cutting-edge Google Veo3 AI technology to transform prompts into therapeutic content automatically. 
                  Perfect for content creators - the AI analyzes your ASMR video ideas and generates professional stress relief videos, sleep ASMR content, and meditation videos for wellness purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 