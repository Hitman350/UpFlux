"use client"
import { useEffect, useRef } from 'react';
import { CheckCircle, Activity, Shield, Zap, Clock, Globe, ArrowRight, BarChart3, Bell, Layers, Eye, TrendingUp, Github, Twitter, Linkedin } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ── Scroll-reveal hook ── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const children = el.querySelectorAll('.fade-up');
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Animated Dashboard Mockup ── */
function DashboardMockup() {
  const barHeights = [65, 45, 80, 55, 70, 40, 75];
  return (
    <div className="glass-card p-5 w-full max-w-md shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-green" />
          <span className="text-xs font-semibold text-white/80">Live Monitoring</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
          <div className="text-[10px] text-white/40 mb-1">Uptime</div>
          <div className="text-base font-bold text-emerald-400">99.98%</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
          <div className="text-[10px] text-white/40 mb-1">Latency</div>
          <div className="text-base font-bold text-cyan-400">42ms</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
          <div className="text-[10px] text-white/40 mb-1">Checks</div>
          <div className="text-base font-bold text-purple-400">1.2M</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg bg-white/[0.03] p-3 border border-white/5 mb-3">
        <div className="text-[10px] text-white/40 mb-2">Response Time (7d)</div>
        <div className="flex items-end gap-1.5 h-16">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="mock-bar flex-1 rounded-sm bg-gradient-to-t from-emerald-500/80 to-cyan-500/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-1.5">
        {[
          { status: 'up', name: 'api.example.com', time: '2s ago' },
          { status: 'up', name: 'app.example.com', time: '5s ago' },
          { status: 'down', name: 'cdn.example.com', time: '12s ago' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-[11px] text-white/70">{item.name}</span>
            </div>
            <span className="text-[10px] text-white/30">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
function App() {
  const router = useRouter();
  const featuresRef = useScrollReveal();
  const pricingRef = useScrollReveal();
  const socialRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="min-h-screen page-bg text-white overflow-hidden">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-24 pb-24 px-6">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg" />

        {/* Gradient orbs */}
        <div className="orb orb-emerald w-[500px] h-[500px] -top-40 -left-40" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-20 right-0" />
        <div className="orb orb-purple w-[350px] h-[350px] -bottom-20 left-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full badge-glow bg-emerald-500/10 border border-emerald-500/20">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">99.99% Uptime Guaranteed</span>
              </div>

              <h1
                className="font-extrabold mb-6 leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
              >
                Monitor Your{' '}
                <span className="gradient-text-shimmer">Infrastructure</span>
                {' '}With Confidence
              </h1>

              <p className="text-lg md:text-xl text-[#A1A1AA] mb-8 leading-relaxed max-w-lg">
                Real-time uptime monitoring for your websites, APIs, and services. Get instant alerts when something goes wrong and keep your business running smoothly.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-gradient px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 text-base"
                >
                  Start Monitoring
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="glass-card px-8 py-4 !rounded-xl font-semibold text-white hover:!bg-white/10 transition-all text-base flex items-center gap-2"
                >
                  View Demo
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#A1A1AA]">
                {[
                  { icon: <Globe className="w-4 h-4 text-emerald-400" />, text: 'Multi-region checks' },
                  { icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, text: 'Real-time analytics' },
                  { icon: <Shield className="w-4 h-4 text-purple-400" />, text: 'SSL monitoring' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Animated Dashboard */}
            <div className="hidden lg:flex justify-end relative">
              <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-purple-500/10 blur-3xl rounded-full" />
              <DashboardMockup />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {[
              { value: '10M+', label: 'Checks Daily' },
              { value: '5,000+', label: 'Happy Customers' },
              { value: '99.99%', label: 'SLA Uptime' },
              { value: '<50ms', label: 'Avg Response' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-[#A1A1AA] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="relative py-24 px-6" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Modern Teams</span>
            </h2>
            <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto">
              Everything you need to monitor your infrastructure and keep your services running at peak performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Real-Time Monitoring',
                description: 'Monitor your services every 30 seconds with instant notifications when downtime is detected.',
                color: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Global Monitoring',
                description: 'Check your services from 15+ locations worldwide to ensure global availability.',
                color: 'from-cyan-500 to-cyan-700',
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: 'Smart Alerts',
                description: 'Get notified via email, SMS, Slack, or webhook. Custom escalation policies included.',
                color: 'from-purple-500 to-purple-700',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Advanced Analytics',
                description: 'Detailed performance metrics, uptime reports, and historical data to track trends.',
                color: 'from-emerald-500 to-cyan-500',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'SSL Monitoring',
                description: 'Automatic SSL certificate monitoring with expiration alerts to prevent issues.',
                color: 'from-cyan-500 to-purple-500',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Fast Response',
                description: 'Sub-second response times powered by our optimized infrastructure and edge network.',
                color: 'from-purple-500 to-emerald-500',
              },
            ].map((feature, i) => (
              <div key={i} className={`fade-up stagger-${i + 1} glass-card-gradient p-7 group cursor-default`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="relative py-24 px-6" ref={pricingRef}>
        {/* Subtle background orb */}
        <div className="orb orb-cyan w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-[#A1A1AA]">Choose the plan that fits your needs. All plans include a 14-day free trial.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '29',
                description: 'Perfect for small projects',
                features: ['10 Monitors', '5-minute checks', '3 Team members', 'Email alerts', 'Basic analytics'],
              },
              {
                name: 'Professional',
                price: '79',
                description: 'For growing businesses',
                features: ['50 Monitors', '1-minute checks', '10 Team members', 'All alert channels', 'Advanced analytics', 'API access'],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '199',
                description: 'For large organizations',
                features: ['Unlimited Monitors', '30-second checks', 'Unlimited team members', 'Priority support', 'Custom integrations', 'SLA guarantee'],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`fade-up stagger-${i + 1} glass-card p-8 relative ${plan.popular ? 'gradient-border lg:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="btn-gradient px-4 py-1.5 rounded-full text-xs font-semibold text-white whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-[#A1A1AA] mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold gradient-text">${plan.price}</span>
                  <span className="text-[#A1A1AA] text-sm">/month</span>
                </div>

                <button
                  onClick={() => router.push('/dashboard')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all text-sm ${plan.popular
                      ? 'btn-gradient text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                    }`}
                >
                  Start Free Trial
                </button>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-[#A1A1AA]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="py-20 px-6" ref={socialRef}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Modern Teams</span>
            </h2>
            <p className="text-lg text-[#A1A1AA]">Teams around the world rely on UpFlux to keep their services running.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up stagger-1">
            {[
              { value: '15+', label: 'Monitoring Regions' },
              { value: '99.99%', label: 'Platform Uptime' },
              { value: '500K+', label: 'Incidents Detected' },
              { value: '<30s', label: 'Alert Delivery' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-[#A1A1AA] mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-24 px-6" ref={ctaRef}>
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="orb orb-emerald w-[600px] h-[600px] top-1/2 left-1/4 -translate-y-1/2 opacity-20" />
          <div className="orb orb-cyan w-[500px] h-[500px] top-1/2 right-1/4 -translate-y-1/2 opacity-15" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center fade-up">
          <div className="glass-card p-10 md:p-14" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-[#A1A1AA] mb-8 max-w-xl mx-auto">
              Join thousands of companies monitoring their infrastructure with UpFlux. Start your free trial today.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-gradient px-10 py-4 rounded-xl font-semibold text-white text-lg flex items-center gap-2 mx-auto"
            >
              Start Monitoring
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-[#71717A] mt-5">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative border-t border-white/5 pt-14 pb-8 px-6">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-bold">Up<span className="text-emerald-400">Flux</span></span>
              </div>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Real-time infrastructure monitoring for modern teams.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-[#71717A]">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-[#71717A]">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-[#71717A]">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#52525B]">
              © 2025 UpFlux. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#52525B] hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-[#52525B] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-[#52525B] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
