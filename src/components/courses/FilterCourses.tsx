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
import { Star, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export interface FilterState {
  rating: number;
  duration: string[];
  level: string[];
  category: string[];
  sortBy: string;
}

interface FilterProps {
  onFilter: (filters: FilterState) => void;
}

const initialFilters: FilterState = {
  rating: 0,
  duration: [],
  level: [],
  category: [],
  sortBy: 'highest-rated',
};

const FilterCourses: React.FC<FilterProps> = ({ onFilter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoryOptions = t('filters.category_options', { returnObjects: true }) as { value: string; label: string }[];
  const durationOptions = t('filters.duration_options', { returnObjects: true }) as { value: string; label: string }[];
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
    <label key={item.value} className={`flex items-center gap-3 py-2 cursor-pointer hover:bg-teal-500/10 -mx-2 px-2 rounded transition-colors ${locale === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
        <input
            type="checkbox"
            className="accent-teal-500 w-4 h-4 rounded border-gray-600"
            checked={(filters[groupName] as string[]).includes(item.value)}
            onChange={() => handleCheckboxChange(groupName, item.value)}
        />
        <span className="text-gray-200 text-sm">{item.label}</span>
    </label>
  );

  return (
    <div className="w-full lg:w-72 sticky top-24">
      {/* Filter Header */}
      <div className="bg-gradient-to-br from-teal-900/40 to-teal-950/60 backdrop-blur-sm border border-teal-700/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-teal-700/30">
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-300 hover:bg-teal-500/20 transition-all text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            {t('filters.title')}
          </button>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="flex-1 px-3 py-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-300 text-sm cursor-pointer hover:bg-teal-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="highest-rated" className="bg-gray-900">{t('filters.sortBy_options.highest_rated')}</option>
            <option value="newest" className="bg-gray-900">{t('filters.sortBy_options.newest')}</option>
          </select>
        </div>

        {/* Filter Sections */}
        <Accordion type="multiple" defaultValue={["ratings", "category", "duration", "level"]} className="w-full mt-4">

          {/* Ratings */}
          <AccordionItem value="ratings" className="border-b border-teal-700/30">
            <AccordionTrigger className="text-white font-semibold hover:text-teal-300 py-3 text-sm">
              {t('filters.ratings_title')}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-3 space-y-1">
              {[4.5, 4.0, 3.5, 3.0].map((rate) => (
                <label key={rate} className={`flex items-center gap-3 py-2 cursor-pointer hover:bg-teal-500/10 -mx-2 px-2 rounded transition-colors ${locale === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                  <input
                    type="radio"
                    name="rating"
                    className="accent-teal-500 w-4 h-4"
                    checked={filters.rating === rate}
                    onChange={() => handleRatingChange(rate)}
                  />
                  <span className={`flex items-center gap-1 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={14} className={i < rate ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                    ))}
                  </span>
                  <span className="text-gray-200 text-sm">{t('filters.ratings_and_up', { rate: rate.toFixed(1) })}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Duration */}
          <AccordionItem value="duration" className="border-b border-teal-700/30">
            <AccordionTrigger className="text-white font-semibold hover:text-teal-300 py-3 text-sm">
              {t('filters.duration_title')}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-3 space-y-1">
              {durationOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="duration"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Level */}
          <AccordionItem value="level" className="border-b border-teal-700/30">
            <AccordionTrigger className="text-white font-semibold hover:text-teal-300 py-3 text-sm">
              {t('filters.level_title')}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-3 space-y-1">
              {levelOptions.map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="level"/>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Category */}
          <AccordionItem value="category" className="border-b-0">
            <AccordionTrigger className="text-white font-semibold hover:text-teal-300 py-3 text-sm">
              {t('filters.category_title')}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-3 space-y-1">
              {(showAllCategories ? categoryOptions : categoryOptions.slice(0, 4)).map((item) => (
                <CheckboxLabel key={item.value} item={item} groupName="category"/>
              ))}
              {categoryOptions.length > 4 && (
                <button
                  className="mt-2 text-teal-400 font-semibold text-xs flex items-center gap-1 hover:text-teal-300 transition-colors"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                >
                  {showAllCategories ? t('filters.show_less') : t('filters.show_more')}
                  {showAllCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterCourses;