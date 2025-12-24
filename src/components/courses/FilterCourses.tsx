// "use client";

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { useState, useEffect } from "react";
// import { Star, Menu, ChevronDown, ChevronUp } from "lucide-react";

// // Define the shape of the filters object
// export interface FilterState {
//   rating: number;
//   price: string[];
//   duration: string[];
//   language: string[];
//   level: string[];
//   category: string[];
//   sortBy: string;
// }

// interface FilterProps {
//   onFilter: (filters: FilterState) => void;
// }

// // Initial state for all filters
// const initialFilters: FilterState = {
//   rating: 0,
//   price: [],
//   duration: [],
//   language: [],
//   level: [],
//   category: [],
//   sortBy: 'highest-rated',
// };

// const FilterCourses: React.FC<FilterProps> = ({ onFilter }) => {
//   const [filters, setFilters] = useState<FilterState>(initialFilters);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//   const [showAllCategories, setShowAllCategories] = useState(false);

//   const categories = [
//     { label: "Development", count: 3200 },
//     { label: "Business", count: 1500 },
//     { label: "IT & Software", count: 2100 },
//     { label: "Design", count: 1200 },
//     { label: "Marketing", count: 980 },
//     { label: "Photography", count: 600 },
//   ];

//   // Notify parent component whenever filters change
//   useEffect(() => {
//     onFilter(filters);
//   }, [filters, onFilter]);

//   // Handler for radio buttons (like rating)
//   const handleRatingChange = (value: number) => {
//     setFilters(prev => ({ ...prev, rating: prev.rating === value ? 0 : value })); // Allow unselecting
//   };
  
//   // Generic handler for all checkbox groups
//   const handleCheckboxChange = (field: keyof FilterState, value: string) => {
//     setFilters(prev => {
//       const currentValues = prev[field] as string[];
//       const newValues = currentValues.includes(value)
//         ? currentValues.filter(item => item !== value)
//         : [...currentValues, value];
//       return { ...prev, [field]: newValues };
//     });
//   };

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFilters(prev => ({ ...prev, sortBy: e.target.value }));
//   };

//   return (
//     <div className="w-full lg:w-64 space-y-6 text-sm text-gray-900 dark:text-white">
//       {/* Filter Header */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() => setIsSidebarVisible(prev => !prev)}
//           className="flex items-center border px-3 py-1 rounded text-sm font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
//         >
//           <Menu className="mr-2 h-4 w-4" />
//           Filter
//         </button>
//         <select value={filters.sortBy} onChange={handleSortChange} className="border rounded px-2 py-1 text-sm cursor-pointer bg-transparent dark:bg-neutral-800">
//           <option value="highest-rated">Highest Rated</option>
//           <option value="newest">Newest</option>
//         </select>
//       </div>

//       {/* Filter Sidebar - Conditional Rendering */}
//       {isSidebarVisible && (
//         <Accordion type="multiple" defaultValue={["ratings", "category"]} className="w-full space-y-2">
          
//           {/* Ratings */}
//           <AccordionItem value="ratings">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Ratings</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {[4.5, 4.0, 3.5, 3.0].map((rate) => (
//                 <label key={rate} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="rating"
//                     className="accent-purple-500"
//                     checked={filters.rating === rate}
//                     onChange={() => handleRatingChange(rate)}
//                   />
//                   <span className="flex items-center gap-1">
//                     {Array(5).fill(0).map((_, i) => (
//                       <Star key={i} size={16} className={i < rate ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
//                     ))}
//                   </span>
//                   <span>{rate.toFixed(1)} & up</span>
//                 </label>
//               ))}
//             </AccordionContent>
//           </AccordionItem>

//           {/* Video Duration */}
//           <AccordionItem value="duration">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Video Duration</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {["0-1 Hour", "1-3 Hours", "3-6 Hours", "6-17 Hours"].map((d) => (
//                 <label key={d} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="accent-purple-500"
//                     checked={filters.duration.includes(d)}
//                     onChange={() => handleCheckboxChange('duration', d)}
//                   />
//                   {d}
//                 </label>
//               ))}
//             </AccordionContent>
//           </AccordionItem>

//           {/* Price */}
//           <AccordionItem value="price">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Price</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {['Paid', 'Free'].map((item) => (
//                 <label key={item} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input type="checkbox" className="accent-purple-500" checked={filters.price.includes(item)} onChange={() => handleCheckboxChange('price', item)} />
//                   {item}
//                 </label>
//               ))}
//             </AccordionContent>
//           </AccordionItem>

//           {/* Language */}
//           <AccordionItem value="language">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Language</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {['English', 'Arabic', 'French'].map((item) => (
//                 <label key={item} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input type="checkbox" className="accent-purple-500" checked={filters.language.includes(item)} onChange={() => handleCheckboxChange('language', item)} />
//                   {item}
//                 </label>
//               ))}
//             </AccordionContent>
//           </AccordionItem>

//           {/* Level */}
//           <AccordionItem value="level">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Level</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {['All Levels', 'Beginner', 'Intermediate', 'Expert'].map((item) => (
//                 <label key={item} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input type="checkbox" className="accent-purple-500" checked={filters.level.includes(item)} onChange={() => handleCheckboxChange('level', item)} />
//                   {item}
//                 </label>
//               ))}
//             </AccordionContent>
//           </AccordionItem>

//           {/* Category */}
//           <AccordionItem value="category">
//             <AccordionTrigger className="text-gray-900 dark:text-white">Category</AccordionTrigger>
//             <AccordionContent className="pt-2 space-y-2">
//               {(showAllCategories ? categories : categories.slice(0, 4)).map((item) => (
//                 <label key={item.label} className="flex items-center gap-2 py-1 cursor-pointer">
//                   <input type="checkbox" className="accent-purple-500" checked={filters.category.includes(item.label)} onChange={() => handleCheckboxChange('category', item.label)} />
//                   {item.label}
//                 </label>
//               ))}
//               {categories.length > 4 && (
//                 <button
//                   className="mt-2 text-purple-600 font-semibold text-sm flex items-center gap-1"
//                   onClick={() => setShowAllCategories((prev) => !prev)}
//                 >
//                   {showAllCategories ? "Show less" : "Show more"}
//                   {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                 </button>
//               )}
//             </AccordionContent>
//           </AccordionItem>

//         </Accordion>
//       )}
//     </div>
//   );
// };

// export default FilterCourses;

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star, Menu, ChevronDown, ChevronUp } from "lucide-react";

export interface FilterState {
  rating: number;
  price: string[];
  duration: string[];
  language: string[];
  level: string[];
  category: string[];
  sortBy: string;
}

interface FilterProps {
  onFilter: (filters: FilterState) => void;
}

const initialFilters: FilterState = {
  rating: 0,
  price: [],
  duration: [],
  language: [],
  level: [],
  category: [],
  sortBy: 'highest-rated',
};

const FilterCourses: React.FC<FilterProps> = ({ onFilter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoryOptions = t('filters.category_options', { returnObjects: true }) as { value: string; label: string }[];
  const durationOptions = t('filters.duration_options', { returnObjects: true }) as { value: string; label: string }[];
  const priceOptions = t('filters.price_options', { returnObjects: true }) as { value: string; label: string }[];
  const languageOptions = t('filters.language_options', { returnObjects: true }) as { value: string; label: string }[];
  const levelOptions = t('filters.level_options', { returnObjects: true }) as { value: string; label: string }[];

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleRatingChange = (value: number) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === value ? 0 : value }));
  };
  
  const handleCheckboxChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };
  

  const CheckboxLabel = ({ item, groupName }: { item: {value: string, label: string}, groupName: keyof FilterState}) => (
    <label key={item.value} className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 px-2 rounded transition-colors ${locale === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
        <input
            type="checkbox"
            className="accent-teal-500 w-4 h-4"
            checked={(filters[groupName] as string[]).includes(item.value)}
            onChange={() => handleCheckboxChange(groupName, item.value)}
        />
        <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.label}</span>
    </label>
  );

  return (
    <div className="w-full lg:w-64 space-y-6 text-sm sticky top-24 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 p-6 rounded-2xl shadow-lg border border-teal-200 dark:border-teal-800 backdrop-blur-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsSidebarVisible(prev => !prev)}
          className="flex items-center border-2 border-teal-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-teal-500 hover:text-white transition-all duration-200 text-teal-700 dark:text-teal-300"
        >
          <Menu className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {t('filters.title')}
        </button>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="border-2 border-teal-500 rounded-lg px-3 py-2 text-sm cursor-pointer bg-white dark:bg-neutral-800 text-teal-700 dark:text-teal-300 font-medium hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all"
        >
          <option value="highest-rated">{t('filters.sortBy_options.highest_rated')}</option>
          <option value="newest">{t('filters.sortBy_options.newest')}</option>
        </select>
      </div>

      {/* Filter Sidebar  */}
      {isSidebarVisible && (
        <Accordion type="multiple" defaultValue={["ratings", "category"]} className="w-full space-y-2">
          
          <AccordionItem value="ratings" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.ratings_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map((rate) => (
                <label key={ratings} className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 px-2 rounded transition-colors ${locale === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                  <input
                    type="radio"
                    name="rating"
                    className="accent-teal-500 w-4 h-4"
                    checked={filters.rating === rate}
                    onChange={() => handleRatingChange(rate)}
                  />
                  <span className={`flex items-center gap-1 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={16} className={i < rate ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">{t('filters.ratings_and_up', { rate: rate.toFixed(1) })}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="duration" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.duration_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {durationOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="duration"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.price_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {priceOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="price"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="language" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.language_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {languageOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="language"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.level_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {levelOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="level"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category" className="border-b border-teal-200 dark:border-teal-800">
            <AccordionTrigger className="text-teal-900 dark:text-teal-100 font-semibold hover:text-teal-600 dark:hover:text-teal-400">{t('filters.category_title')}</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {(showAllCategories ? categoryOptions : categoryOptions.slice(0, 4)).map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="category"/>
              ))}
              {categoryOptions.length > 4 && (
                <button
                  className="mt-2 text-teal-600 dark:text-teal-400 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                >
                  {showAllCategories ? t('filters.show_less') : t('filters.show_more')}
                  {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default FilterCourses;