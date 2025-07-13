import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-base text-slate-300 hover:text-white">Pricing</Link></li>
              <li><Link href="/video-showcase" className="text-base text-slate-300 hover:text-white">Examples</Link></li>
              <li><Link href="/asmr-types" className="text-base text-slate-300 hover:text-white">ASMR Types</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/perplexity-for-creators" className="text-base text-slate-300 hover:text-white">Perplexity Guide</Link></li>
              <li><Link href="/earn-money-with-perplexity-ai" className="text-base text-slate-300 hover:text-white">Earn with Perplexity</Link></li>
              <li><Link href="/make-money-with-ai" className="text-base text-slate-300 hover:text-white">AI Money Guide</Link></li>
              <li><Link href="/help" className="text-base text-slate-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/kimik2vsgrok4" className="text-base text-slate-300 hover:text-white">Kimi vs Grok Review</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-base text-slate-300 hover:text-white">About</Link></li>
              <li><Link href="/privacy" className="text-base text-slate-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-base text-slate-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Contact</h3>
            <ul className="space-y-3">
              <li><Link href="mailto:support@cuttingasmr.org" className="text-base text-slate-300 hover:text-white">Email Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-8 text-center">
          <p className="text-base text-slate-400">&copy; {new Date().getFullYear()} CuttingASMR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 