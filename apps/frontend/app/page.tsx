"use client"
import { CheckCircle, Activity, Shield, Zap, Clock, Globe, ArrowRight, BarChart3, Bell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">UpFlux</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-all hover:scale-105">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-emerald-400 text-sm font-medium">99.99% Uptime Guaranteed</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Monitor Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Infrastructure</span> With Confidence
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Real-time uptime monitoring for your websites, APIs, and services. Get instant alerts when something goes wrong and keep your business running smoothly.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => router.push("/dashboard")} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all border border-gray-700">
                  View Demo
                </button>
              </div>
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">10M+</div>
                  <div className="text-sm text-gray-400">Checks Daily</div>
                </div>
                <div className="h-12 w-px bg-gray-800"></div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">5,000+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="h-12 w-px bg-gray-800"></div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">99.99%</div>
                  <div className="text-sm text-gray-400">SLA Uptime</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-3xl opacity-20"></div>
              <div className="relative rounded-2xl border border-gray-800 overflow-hidden shadow-2xl h-96">
                <Image
                  src="/hero-monitoring.png"
                  alt="Infrastructure monitoring"
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for <span className="text-emerald-400">Modern Teams</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to monitor your infrastructure and keep your services running at peak performance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Real-Time Monitoring',
                description: 'Monitor your services every 30 seconds with instant notifications when downtime is detected.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Monitoring',
                description: 'Check your services from 15+ locations worldwide to ensure global availability.'
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: 'Smart Alerts',
                description: 'Get notified via email, SMS, Slack, or webhook when issues arise. Custom escalation policies included.'
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Advanced Analytics',
                description: 'Detailed performance metrics, uptime reports, and historical data to track trends over time.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'SSL Monitoring',
                description: 'Automatic SSL certificate monitoring with expiration alerts to prevent security issues.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Fast Response',
                description: 'Sub-second response times with our optimized infrastructure and edge network.'
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105 group">
                <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, <span className="text-emerald-400">Transparent Pricing</span></h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs. All plans include a 14-day free trial.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '29',
                description: 'Perfect for small projects',
                features: ['10 Monitors', '5-minute checks', '3 Team members', 'Email alerts', 'Basic analytics']
              },
              {
                name: 'Professional',
                price: '79',
                description: 'For growing businesses',
                features: ['50 Monitors', '1-minute checks', '10 Team members', 'All alert channels', 'Advanced analytics', 'API access'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '199',
                description: 'For large organizations',
                features: ['Unlimited Monitors', '30-second checks', 'Unlimited team members', 'Priority support', 'Custom integrations', 'SLA guarantee']
              },
            ].map((plan, i) => (
              <div key={i} className={`bg-gray-900 border ${plan.popular ? 'border-emerald-500 scale-105' : 'border-gray-800'} rounded-xl p-8 relative hover:border-emerald-500/50 transition-all`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  Start Free Trial
                </button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of companies monitoring their infrastructure with UpFlux. Start your free trial today.</p>
          <button className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 mx-auto">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold">UpFlux</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            © 2025 UpFlux. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
