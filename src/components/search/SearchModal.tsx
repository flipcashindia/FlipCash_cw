import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as catalogService from '../../api/services/catalogService';
import type { Model, Brand } from '../../api/types/catalog.types';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      searchModels();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchModels = async () => {
    setLoading(true);
    try {
      // Get all brands and models, filter by search query
      const categories = await catalogService.getCategories();
      const allModels: Model[] = [];
      
      for (const cat of categories) {
        const brands = await catalogService.getBrandsByCategory(cat.id);
        for (const brand of brands) {
          const models = await catalogService.getModelsByBrand(brand.id);
          allModels.push(...models);
        }
      }
      
      const filtered = allModels.filter(model =>
        model.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      
      setResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (model: Model) => {
    navigate('/device-stepper', { state: { modelId: model.id } });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="text-gray-400" size={24} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for device model..."
            className="flex-1 text-lg focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-gray-500">Searching...</div>
          )}
          
          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map(model => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  {model.thumbnail && (
                    <img src={model.thumbnail} alt={model.name} className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{model.name}</p>
                    <p className="text-sm text-gray-600">Base: ₹{model.base_price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!loading && query.length > 2 && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">No results found</div>
          )}
          
          {query.length <= 2 && (
            <div className="p-8 text-center text-gray-500">Type to search...</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;