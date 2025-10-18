import { Head } from '@inertiajs/react';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import HeroSection from '@/Components/Landing/HeroSection';
import ScrollingTickerBar from '@/Components/Landing/ScrollingTickerBar';
import FeaturesSection from '@/Components/Landing/FeaturesSection';
import StatsSection from '@/Components/Landing/StatsSection';
import HowItWorksSection from '@/Components/Landing/HowItWorksSection';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection';
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

            {/* Stats Section */}
            <StatsSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section */}
            <CTASection auth={auth} />

            {/* Footer */}
            <LandingFooter />
        </>
    );
}