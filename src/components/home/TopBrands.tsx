import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as catalogService from '../../api/services/catalogService';
import { useImageCache } from '../../api/utils/imageCache';
import type { Brand } from '../../api/types/catalog.types';

const TopBrands: React.FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopBrands();
  }, []);

  const loadTopBrands = async () => {
    try {
      const categories = await catalogService.getCategories();
      // console.log("top brand categories : ", categories);
      
      if (categories.length > 0) {
        const phoneCat = categories.find(c => c.name.toLowerCase().includes('phone')) || categories[0];
        const data = await catalogService.getBrandsByCategory(phoneCat.id);
        
        setBrands(data.filter(b => b.is_featured).slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brandId: string) => {
    navigate('/select-model', { state: { brandId } });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading brands...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Top Brands</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} onClick={() => handleBrandClick(brand.id)} />
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandCard: React.FC<{ brand: Brand; onClick: () => void }> = ({ brand, onClick }) => {
  const logoUrl = useImageCache(brand.logo);

  return (
    <div onClick={onClick} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
      {logoUrl && <img src={logoUrl} alt={brand.name} className="w-full h-16 object-contain mb-2" />}
      <p className="text-center text-sm font-medium">{brand.name}</p>
    </div>
  );
};

export default TopBrands;