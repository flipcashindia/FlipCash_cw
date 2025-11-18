// src/components/CategorySlider.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Category } from '../../api/types/catalog.types';

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

const CategorySlider: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = (await catalogService.getCategories()) as Category[] | PaginatedResponse<Category>;
            const categoriesArray = Array.isArray(data) ? data : data.results || [];
            setCategories(categoriesArray.filter(cat => cat.icon_url)); 
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        navigate('/select-brand', { state: { categoryId } });
    };

    if (loading) {
        return (
            <section className="block md:hidden py-8 sm:py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Sell Your Device</h2>
                    <div className="flex gap-3 sm:gap-4 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-36 sm:w-44">
                                <div className="bg-gray-200 rounded-xl animate-pulse h-32 sm:h-36"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    const scrollbarHideStyle = `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;

    return (
        <>
            <style>{scrollbarHideStyle}</style>
            {/* 
                Visibility Breakpoints:
                - Shows on: Mobile (< 640px), Small tablets (640px - 1023px)
                - Hidden on: Large screens (≥ 1024px)
            */}
            <section className="block md:hidden py-8 sm:py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-3 sm:px-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#1C1C1B]">
                        Sell Your Device
                    </h2>

                    <div className="relative">
                        {/* Responsive slider container */}
                        <div 
                            ref={scrollContainerRef} 
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide gap-3 sm:gap-4 py-4"
                        >
                            {categories.map((category) => (
                                <CategoryCard 
                                    key={category.id} 
                                    category={category} 
                                    onClick={() => handleCategoryClick(category.id)} 
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons - Hidden on mobile, visible on tablets */}
                        <button 
                            onClick={handlePrev} 
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition hover:bg-gray-100 disabled:opacity-30 hidden sm:block"
                            aria-label="Previous categories"
                        >
                            <ChevronLeft size={24} className="text-[#1C1C1B]" />
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition hover:bg-gray-100 disabled:opacity-30 hidden sm:block"
                            aria-label="Next categories"
                        >
                            <ChevronRight size={24} className="text-[#1C1C1B]" />
                        </button>
                    </div>

                    {/* Mobile Scroll Indicator */}
                    <div className="flex sm:hidden justify-center mt-4 gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>←</span>
                            <span>Swipe to browse</span>
                            <span>→</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const CategoryCard: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => {
    const imageUrl = useImageCache(category.icon_url);

    return (
        <div 
            onClick={onClick} 
            className="
                flex-shrink-0 snap-start
                flex flex-col items-center justify-center
                w-32 sm:w-40 md:w-44
                p-3 sm:p-4 bg-white rounded-xl shadow-md
                hover:shadow-xl active:scale-95 transition-all cursor-pointer
                h-32 sm:h-36 md:h-40
                border-2 border-transparent hover:border-[#FEC925]
            "
        >
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={category.title} 
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mx-auto mb-2" 
                />
            ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                </div>
            )}
            <h3 className="text-center font-semibold text-xs sm:text-sm md:text-base text-[#1C1C1B] line-clamp-2">
                {category.title}
            </h3>
        </div>
    );
};

export default CategorySlider;