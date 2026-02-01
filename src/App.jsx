import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, MapPin, TrendingUp, Battery } from 'lucide-react';

// Utils
import {
    parseCSVData,
    getAdoptionTrend,
    getTopManufacturers,
    getVehicleTypeDistribution,
    getRangeDistribution,
    getGeographicDistribution,
    getTopCities,
    getYearRangeCorrelation,
    getTopModels,
    calculateKPIs,
    filterVehicles,
    getFilterOptions,
} from '@/utils/data-processor';

// Components
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/ui/KPICard';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPISkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import { AdoptionTrend } from '@/components/charts/AdoptionTrend';
import { TopManufacturers } from '@/components/charts/TopManufacturers';
import { VehicleTypeBreakdown } from '@/components/charts/VehicleTypeBreakdown';
import { RangeDistribution } from '@/components/charts/RangeDistribution';
import { GeographicMap } from '@/components/charts/GeographicMap';
import { RangeCorrelation } from '@/components/charts/RangeCorrelation';
import { ModelsTable } from '@/components/charts/ModelsTable';

function App() {
    // State
    const [allVehicles, setAllVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [filters, setFilters] = useState({
        yearRange: [2010, 2024],
        manufacturers: [],
        vehicleTypes: ['BEV', 'PHEV'],
        states: [],
    });

    // Load CSV data
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/ev-data.csv');
                const csvText = await response.text();
                const vehicles = parseCSVData(csvText);
                setAllVehicles(vehicles);

                // Set initial year range based on data
                const options = getFilterOptions(vehicles);
                setFilters(prev => ({
                    ...prev,
                    yearRange: options.yearRange,
                }));
            } catch (error) {
                console.error('Failed to load EV data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Theme toggle
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // Filter options from data
    const filterOptions = useMemo(() => {
        return getFilterOptions(allVehicles);
    }, [allVehicles]);

    // Filtered data
    const filteredVehicles = useMemo(() => {
        return filterVehicles(allVehicles, filters);
    }, [allVehicles, filters]);

    // Computed chart data
    const chartData = useMemo(() => {
        if (filteredVehicles.length === 0) return null;

        return {
            kpis: calculateKPIs(filteredVehicles, allVehicles),
            adoptionTrend: getAdoptionTrend(filteredVehicles),
            topManufacturers: getTopManufacturers(filteredVehicles, 8),
            vehicleTypes: getVehicleTypeDistribution(filteredVehicles),
            rangeDistribution: getRangeDistribution(filteredVehicles),
            geographicDistribution: getGeographicDistribution(filteredVehicles, 8),
            topCities: getTopCities(filteredVehicles, 8),
            rangeCorrelation: getYearRangeCorrelation(filteredVehicles),
            topModels: getTopModels(filteredVehicles, 15),
        };
    }, [filteredVehicles, allVehicles]);

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            yearRange: filterOptions.yearRange,
            manufacturers: [],
            vehicleTypes: ['BEV', 'PHEV'],
            states: [],
        });
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-background-primary">
                <Header
                    isDarkMode={isDarkMode}
                    onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                    totalVehicles={filteredVehicles.length}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            Electric Vehicle Insights
                        </h2>
                        <p className="text-text-muted">
                            Comprehensive analysis of EV population data, adoption trends, and market dynamics.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    {!isLoading && (
                        <FilterBar
                            yearRange={filterOptions.yearRange}
                            selectedYearRange={filters.yearRange}
                            manufacturers={filterOptions.manufacturers}
                            selectedManufacturers={filters.manufacturers}
                            states={filterOptions.states}
                            selectedStates={filters.states}
                            vehicleTypes={filters.vehicleTypes}
                            onYearRangeChange={(range) => setFilters(prev => ({ ...prev, yearRange: range }))}
                            onManufacturerChange={(manufacturers) => setFilters(prev => ({ ...prev, manufacturers }))}
                            onStateChange={(states) => setFilters(prev => ({ ...prev, states }))}
                            onVehicleTypeChange={(vehicleTypes) => setFilters(prev => ({ ...prev, vehicleTypes }))}
                            onReset={handleResetFilters}
                        />
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-6">
                            <KPISkeleton />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ChartSkeleton />
                                <ChartSkeleton />
                                <ChartSkeleton />
                                <ChartSkeleton />
                            </div>
                        </div>
                    )}

                    {/* Dashboard Content */}
                    {!isLoading && chartData && (
                        <div className="space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <KPICard
                                    label="Total Vehicles"
                                    value={chartData.kpis.totalVehicles}
                                    subValue={`${chartData.kpis.uniqueMakes} manufacturers`}
                                    change={chartData.kpis.yoyChange}
                                    changeLabel="YoY"
                                    icon={<Car className="w-5 h-5" />}
                                    color="blue"
                                    delay={0}
                                />
                                <KPICard
                                    label="BEV Adoption"
                                    value={`${chartData.kpis.bevPercentage.toFixed(1)}%`}
                                    subValue="Battery Electric Vehicles"
                                    icon={<Zap className="w-5 h-5" />}
                                    color="emerald"
                                    delay={0.1}
                                />
                                <KPICard
                                    label="Average Range"
                                    value={`${chartData.kpis.avgRange} mi`}
                                    subValue="Electric range per vehicle"
                                    icon={<Battery className="w-5 h-5" />}
                                    color="purple"
                                    delay={0.2}
                                />
                                <KPICard
                                    label="Top Manufacturer"
                                    value={chartData.kpis.topManufacturer?.name || 'N/A'}
                                    subValue={`${chartData.kpis.topManufacturer?.share.toFixed(1)}% market share`}
                                    icon={<TrendingUp className="w-5 h-5" />}
                                    color="amber"
                                    delay={0.3}
                                />
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Adoption Trend - Full Width */}
                                <AdoptionTrend data={chartData.adoptionTrend} delay={0.4} />

                                {/* Top Manufacturers */}
                                <TopManufacturers data={chartData.topManufacturers} delay={0.5} />

                                {/* Vehicle Type Distribution */}
                                <VehicleTypeBreakdown data={chartData.vehicleTypes} delay={0.6} />

                                {/* Range Distribution */}
                                <RangeDistribution data={chartData.rangeDistribution} delay={0.7} />

                                {/* Geographic Distribution */}
                                <GeographicMap
                                    data={chartData.geographicDistribution}
                                    title="Distribution by State"
                                    delay={0.8}
                                />

                                {/* Top Cities */}
                                <GeographicMap
                                    data={chartData.topCities}
                                    title="Top Cities"
                                    delay={0.9}
                                />

                                {/* Range Correlation - Full Width */}
                                <RangeCorrelation data={chartData.rangeCorrelation} delay={1.0} />

                                {/* Models Table - Full Width */}
                                <ModelsTable data={chartData.topModels} delay={1.1} />
                            </div>

                            {/* Footer */}
                            <motion.footer
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-12 pt-8 border-t border-border text-center"
                            >
                                <p className="text-sm text-text-muted">
                                    Data source: Electric Vehicle Population Data •
                                    Built with React, Recharts, and Tailwind CSS
                                </p>
                            </motion.footer>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredVehicles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-background-secondary rounded-full mb-4">
                                <Car className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No vehicles found</h3>
                            <p className="text-text-muted mb-4">Try adjusting your filters to see more results.</p>
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 bg-blue-500 text-text-primary rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
