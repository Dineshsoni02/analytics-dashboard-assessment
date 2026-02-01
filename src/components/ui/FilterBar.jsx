import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Filter, RotateCcw } from 'lucide-react';

const Dropdown = ({
    label,
    options,
    selected,
    onChange,
    singleSelect = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = (option) => {
        if (singleSelect) {
            onChange(selected.includes(option) ? [] : [option]);
        } else {
            if (selected.includes(option)) {
                onChange(selected.filter(s => s !== option));
            } else {
                onChange([...selected, option]);
            }
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
          transition-all duration-200
          ${selected.length > 0
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-background-tertiary border-border hover:border-border-hover text-text-secondary'}
        `}
            >
                <span>{label}</span>
                {selected.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-blue-500/30 rounded text-xs">
                        {selected.length}
                    </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-background-tertiary border border-border rounded-lg shadow-xl z-50"
                    >
                        {options.length > 10 && (
                            <div className="p-2 border-b border-border">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md text-sm text-text-primary placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        )}
                        <div className="max-h-64 overflow-y-auto p-2">
                            {filteredOptions.slice(0, 50).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleToggle(option)}
                                    className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left
                    transition-colors duration-150
                    ${selected.includes(option)
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'text-text-secondary hover:bg-background-secondary'}
                  `}
                                >
                                    <div className={`
                    w-4 h-4 rounded border flex items-center justify-center
                    ${selected.includes(option)
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'border-zinc-600'}
                  `}>
                                        {selected.includes(option) && (
                                            <svg className="w-3 h-3 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="truncate">{option}</span>
                                </button>
                            ))}
                        </div>
                        {selected.length > 0 && (
                            <div className="p-2 border-t border-border">
                                <button
                                    onClick={() => onChange([])}
                                    className="w-full px-3 py-2 text-xs text-text-muted hover:text-zinc-300 transition-colors"
                                >
                                    Clear selection
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FilterBar = ({
    yearRange,
    selectedYearRange,
    manufacturers,
    selectedManufacturers,
    states,
    selectedStates,
    vehicleTypes,
    onYearRangeChange,
    onManufacturerChange,
    onStateChange,
    onVehicleTypeChange,
    onReset,
}) => {
    const hasActiveFilters =
        selectedManufacturers.length > 0 ||
        selectedStates.length > 0 ||
        vehicleTypes.length < 2 ||
        selectedYearRange[0] !== yearRange[0] ||
        selectedYearRange[1] !== yearRange[1];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 p-4 bg-background-secondary border border-border rounded-xl mb-6"
        >
            <div className="flex items-center gap-2 text-text-secondary mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
            </div>

            {/* Year Range */}
            <div className="flex items-center gap-2 px-4 py-2 bg-background-tertiary border border-border rounded-lg">
                <span className="text-sm text-text-secondary">Year:</span>
                <select
                    value={selectedYearRange[0]}
                    onChange={(e) => onYearRangeChange([parseInt(e.target.value), selectedYearRange[1]])}
                    className="bg-transparent text-sm text-text-primary border-none focus:outline-none cursor-pointer"
                >
                    {Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i).map(year => (
                        <option key={year} value={year} className="bg-background-tertiary">{year}</option>
                    ))}
                </select>
                <span className="text-text-muted">-</span>
                <select
                    value={selectedYearRange[1]}
                    onChange={(e) => onYearRangeChange([selectedYearRange[0], parseInt(e.target.value)])}
                    className="bg-transparent text-sm text-text-primary border-none focus:outline-none cursor-pointer"
                >
                    {Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i).map(year => (
                        <option key={year} value={year} className="bg-background-tertiary">{year}</option>
                    ))}
                </select>
            </div>

            {/* Manufacturers */}
            <Dropdown
                label="Manufacturer"
                options={manufacturers}
                selected={selectedManufacturers}
                onChange={onManufacturerChange}
            />

            {/* States */}
            <Dropdown
                label="State"
                options={states}
                selected={selectedStates}
                onChange={onStateChange}
            />

            {/* Vehicle Type Toggle */}
            <div className="flex items-center gap-1 bg-background-tertiary border border-border rounded-lg p-1">
                <button
                    onClick={() => {
                        if (vehicleTypes.includes('BEV')) {
                            onVehicleTypeChange(vehicleTypes.filter(t => t !== 'BEV'));
                        } else {
                            onVehicleTypeChange([...vehicleTypes, 'BEV']);
                        }
                    }}
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all
            ${vehicleTypes.includes('BEV')
                            ? 'bg-blue-500 text-text-primary'
                            : 'text-text-secondary hover:text-zinc-300'}
          `}
                >
                    BEV
                </button>
                <button
                    onClick={() => {
                        if (vehicleTypes.includes('PHEV')) {
                            onVehicleTypeChange(vehicleTypes.filter(t => t !== 'PHEV'));
                        } else {
                            onVehicleTypeChange([...vehicleTypes, 'PHEV']);
                        }
                    }}
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all
            ${vehicleTypes.includes('PHEV')
                            ? 'bg-purple-500 text-text-primary'
                            : 'text-text-secondary hover:text-zinc-300'}
          `}
                >
                    PHEV
                </button>
            </div>

            {/* Active filter tags */}
            {selectedManufacturers.length > 0 && selectedManufacturers.length <= 3 && (
                <div className="flex items-center gap-1">
                    {selectedManufacturers.map(m => (
                        <span
                            key={m}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md"
                        >
                            {m}
                            <button onClick={() => onManufacturerChange(selectedManufacturers.filter(s => s !== m))}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Reset Button */}
            {hasActiveFilters && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors ml-auto"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>
            )}
        </motion.div>
    );
};
