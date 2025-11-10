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
    // We use a ref to control the scrolling container
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
    try {
      const data = (await catalogService.getCategories()) as Category[] | PaginatedResponse<Category>;
      // console.log('API response data:', data); // Log data to confirm structure

      // --- 🔑 CORRECTED LINE ---
      const categoriesArray = Array.isArray(data) ? data : data.results || [];
      
      // Now call filter on the array, not the parent object
      setCategories(categoriesArray.filter(cat => cat.icon_url)); 
      
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

    // Scroll the container by its own visible width
    const handleNext = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Scroll the container backward by its visible width
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
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* A simple skeleton loader */}
                    <h2 className="text-3xl font-bold text-center mb-8">Sell Your Device</h2>
                    <div className="flex gap-4 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-4">
                                <div className="bg-gray-200 rounded-xl animate-pulse h-36"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    // Hide scrollbar utility classes
    const scrollbarHideStyle = `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    `;

    return (
        <>
            <style>{scrollbarHideStyle}</style>
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Sell Your Device</h2>

                    <div className="relative">
                        {/* This is the responsive slider container:
                          - flex: Lays out children in a row
                          - overflow-x-auto: Allows horizontal scrolling
                          - snap-x, snap-mandatory: Enables CSS scroll-snapping
                          - scrollbar-hide: Hides the visual scrollbar
                          - gap-4: Applies spacing between cards
                        */}
                        <div 
                            ref={scrollContainerRef} 
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide gap-4 py-4"
                        >
                            {/* We map and render ALL categories */}
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} onClick={() => handleCategoryClick(category.id)} />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        {/* We can hide them on small screens if we want to rely on swipe only */}
                        <button 
                            onClick={handlePrev} 
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition hover:bg-gray-100 disabled:opacity-30 hidden sm:block"
                            aria-label="Previous categories"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition hover:bg-gray-100 disabled:opacity-30 hidden sm:block"
                            aria-label="Next categories"
                        >
                            <ChevronRight size={24} />
                        </button>
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
                w-36 sm:w-44 md:w-48
                p-4 bg-white rounded-xl shadow 
                hover:shadow-lg transition cursor-pointer
                h-36 sm:h-40
            "
        >
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={category.title} 
                    className="w-32 mx-auto mb-1" 
                />
            ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gray-200 rounded-full"></div>
            )}
            <h3 className="text-center font-semibold text-sm sm:text-base">{category.title}</h3>
        </div>
    );
};

export default CategorySlider;