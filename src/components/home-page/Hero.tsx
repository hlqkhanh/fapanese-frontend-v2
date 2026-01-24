import { Button } from '../ui/button';
import { ArrowRight, Mic } from 'lucide-react';
import heroDesktop from '@/assets/hero.jpg';
import heroMobile from '@/assets/hero-mobile.png';
import { Link } from 'react-router';

export function Hero() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Responsive Background Image */}
            <picture>
                {/* Mobile */}
                <source
                    srcSet={heroMobile}
                    media="(max-width: 625px)"
                />

                {/* Tablet */}
                <source
                    srcSet={heroDesktop}
                    media="(max-width: 1024px)"
                />

                {/* Desktop fallback */}
                <img
                    src={heroDesktop}
                    alt="Hero background"
                    className="w-full h-auto"
                />
            </picture>

            {/* Content */}
            <div className="absolute inset-0 flex items-end pb-8 sm:pb-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-row sm:flex-row gap-2 sm:gap-10 justify-center items-center">
                        <Link to="/ai-interview">
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 text-base bg-white/10 shadow-lg border-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                <Mic className="h-5 w-5" />
                                AI Interview
                            </Button>
                        </Link>

                        {/* Nút 2: Chuyển đến trang Khóa học */}
                        <Link to="/courses">
                            <Button
                                size="lg"
                                className="gap-2 text-base shadow-lg hover:bg-warning"
                            >
                                Bắt đầu học ngay
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
