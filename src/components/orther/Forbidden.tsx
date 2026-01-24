import { Button } from '../ui/button';
import { Home } from 'lucide-react';
import forbiddentImg from '@/assets/forbiddent.jpg';
import forbiddentMobileImg from '@/assets/forbiddentMobile.jpg';
import { Link } from 'react-router-dom'; // Thường là 'react-router-dom' thay vì 'react-router'

export function Forbidden() {
    return (
        // 1. Thêm 'h-screen' để chiều cao bằng đúng màn hình
        <section className="relative w-full h-screen overflow-hidden">
            
            {/* Responsive Background Image */}
            <picture>
                {/* Mobile */}
                <source
                    srcSet={forbiddentMobileImg}
                    media="(max-width: 625px)"
                />

                {/* Tablet */}
                <source
                    srcSet={forbiddentImg}
                    media="(max-width: 1024px)"
                />

                {/* Desktop fallback */}
                <img
                    src={forbiddentImg}
                    alt="Forbidden background"
                    // 2. Thêm 'h-full', 'object-cover', 'absolute', 'inset-0'
                    // Để ảnh chiếm toàn bộ không gian và tự cắt (crop) nếu tỷ lệ không khớp
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </picture>

            {/* Content */}
            {/* z-10 để đảm bảo nút bấm nằm đè lên trên ảnh */}
            <div className="absolute inset-0 z-10 flex items-end pb-12 sm:pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-row sm:flex-row gap-2 sm:gap-10 justify-center items-center">
                        <Link to="/">
                            <Button
                                size="lg"
                                className="gap-2 text-base shadow-lg hover:bg-warning"
                            >
                                <Home className="h-5 w-5" />
                                Quay về trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}