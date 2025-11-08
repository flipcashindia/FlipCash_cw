import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Category } from '../../api/types/catalog.types';

const CategorySlider: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await catalogService.getCategories();
      console.log(data);
      
      setCategories(data.filter(cat => cat.icon_url));
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate('/select-brand', { state: { categoryId } });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Sell Your Device</h2>
        
        <div className="relative">
          <div className="flex overflow-hidden gap-4">
            {categories.slice(currentIndex, currentIndex + 4).map((category) => (
              <CategoryCard key={category.id} category={category} onClick={() => handleCategoryClick(category.id)} />
            ))}
          </div>

          <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

const CategoryCard: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => {
  const imageUrl = useImageCache(category.icon_url);

  return (
    <div onClick={onClick} className="flex-1 min-w-[200px] bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
      {imageUrl && <img src={imageUrl} alt={category.title} className="w-16 h-16 mx-auto mb-4" />}
      <h3 className="text-center font-semibold">{category.title}</h3>
    </div>
  );
};

export default CategorySlider;