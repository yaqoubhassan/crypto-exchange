import { Head } from '@inertiajs/react';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import HeroSection from '@/Components/Landing/HeroSection';
import ScrollingTickerBar from '@/Components/Landing/ScrollingTickerBar';
import FeaturesSection from '@/Components/Landing/FeaturesSection';
import StatsSection from '@/Components/Landing/StatsSection';
import HowItWorksSection from '@/Components/Landing/HowItWorksSection';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection';
import PricingSection from '@/Components/Landing/PricingSection';
import AboutSection from '@/Components/Landing/AboutSection';
import SupportSection from '@/Components/Landing/SupportSection';
import CTASection from '@/Components/Landing/CTASection';
import LandingFooter from '@/Components/Landing/LandingFooter';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="CryptoExchange - Trade Cryptocurrency with Confidence" />

            {/* Navigation */}
            <LandingNavbar auth={auth} />

            {/* Real-Time Crypto Ticker */}
            <ScrollingTickerBar />

            {/* Hero Section */}
            <HeroSection auth={auth} />

            {/* Live Market Prices - #markets */}
            <section id="markets" className="scroll-mt-20">
                <StatsSection />
            </section>

            {/* Features Section - #features */}
            <section id="features" className="scroll-mt-20">
                <FeaturesSection />
            </section>

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* About Section - #about */}
            <section id="about" className="scroll-mt-20">
                <AboutSection />
            </section>

            {/* Pricing Section - #pricing */}
            <section id="pricing" className="scroll-mt-20">
                <PricingSection />
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Support Section - #support */}
            <section id="support" className="scroll-mt-20">
                <SupportSection />
            </section>

            {/* CTA Section */}
            <CTASection auth={auth} />

            {/* Footer */}
            <LandingFooter />
        </>
    );
}