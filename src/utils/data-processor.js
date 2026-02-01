import { getChartColor } from './formatters';

// Parse CSV data from the EV Population dataset
export const parseCSVData = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const vehicles = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Handle CSV fields with possible commas in quoted strings
        const values = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        // Map to vehicle object based on standard EV Population Data columns
        const vehicle = {
            vin: values[0] || '',
            county: values[1] || '',
            city: values[2] || '',
            state: values[3] || '',
            postalCode: values[4] || '',
            modelYear: parseInt(values[5]) || 0,
            make: values[6] || '',
            model: values[7] || '',
            electricVehicleType: values[8]?.includes('Battery') ? 'BEV' : 'PHEV',
            cafvEligibility: values[9] || '',
            electricRange: parseInt(values[10]) || 0,
            baseMSRP: parseInt(values[11]) || 0,
            legislativeDistrict: parseInt(values[12]) || 0,
            electricUtility: values[13] || '',
        };

        // Only include valid records
        if (vehicle.modelYear > 0 && vehicle.make) {
            vehicles.push(vehicle);
        }
    }

    return vehicles;
};

// Get adoption trend data by year
export const getAdoptionTrend = (vehicles) => {
    const yearCounts = {};

    vehicles.forEach(v => {
        if (!yearCounts[v.modelYear]) {
            yearCounts[v.modelYear] = { total: 0, bev: 0, phev: 0 };
        }
        yearCounts[v.modelYear].total++;
        if (v.electricVehicleType === 'BEV') {
            yearCounts[v.modelYear].bev++;
        } else {
            yearCounts[v.modelYear].phev++;
        }
    });

    return Object.entries(yearCounts)
        .map(([year, counts]) => ({
            year: parseInt(year),
            count: counts.total,
            bev: counts.bev,
            phev: counts.phev,
        }))
        .sort((a, b) => a.year - b.year);
};

// Get top manufacturers by count
export const getTopManufacturers = (vehicles, limit = 10) => {
    const makeCounts = {};

    vehicles.forEach(v => {
        makeCounts[v.make] = (makeCounts[v.make] || 0) + 1;
    });

    return Object.entries(makeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value], index) => ({
            name,
            value,
            fill: getChartColor(index),
        }));
};

// Get vehicle type distribution (BEV vs PHEV)
export const getVehicleTypeDistribution = (vehicles) => {
    const bevCount = vehicles.filter(v => v.electricVehicleType === 'BEV').length;
    const phevCount = vehicles.filter(v => v.electricVehicleType === 'PHEV').length;

    return [
        { name: 'Battery Electric (BEV)', value: bevCount, fill: '#3b82f6' },
        { name: 'Plug-in Hybrid (PHEV)', value: phevCount, fill: '#8b5cf6' },
    ];
};

// Get electric range distribution
export const getRangeDistribution = (vehicles) => {
    const ranges = [
        { min: 0, max: 50, label: '0-50 mi' },
        { min: 51, max: 100, label: '51-100 mi' },
        { min: 101, max: 150, label: '101-150 mi' },
        { min: 151, max: 200, label: '151-200 mi' },
        { min: 201, max: 250, label: '201-250 mi' },
        { min: 251, max: 300, label: '251-300 mi' },
        { min: 301, max: 350, label: '301-350 mi' },
        { min: 351, max: Infinity, label: '350+ mi' },
    ];

    const total = vehicles.filter(v => v.electricRange > 0).length;

    return ranges.map(range => {
        const count = vehicles.filter(v => v.electricRange >= range.min && v.electricRange <= range.max).length;
        return {
            range: range.label,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0,
        };
    });
};

// Get geographic distribution by state
export const getGeographicDistribution = (vehicles, limit = 10) => {
    const stateCounts = {};

    vehicles.forEach(v => {
        if (v.state) {
            stateCounts[v.state] = (stateCounts[v.state] || 0) + 1;
        }
    });

    return Object.entries(stateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value], index) => ({
            name,
            value,
            fill: getChartColor(index),
        }));
};

// Get top cities
export const getTopCities = (vehicles, limit = 10) => {
    const cityCounts = {};

    vehicles.forEach(v => {
        if (v.city) {
            cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
        }
    });

    return Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value], index) => ({
            name,
            value,
            fill: getChartColor(index),
        }));
};

// Get correlation data between model year and range
export const getYearRangeCorrelation = (vehicles) => {
    // Group by year and make to get average range
    const grouped = {};

    vehicles.forEach(v => {
        if (v.electricRange > 0) {
            const key = `${v.modelYear}-${v.make}`;
            if (!grouped[key]) {
                grouped[key] = { totalRange: 0, count: 0, make: v.make, year: v.modelYear };
            }
            grouped[key].totalRange += v.electricRange;
            grouped[key].count++;
        }
    });

    return Object.values(grouped)
        .filter(g => g.count >= 5) // Only include makes with at least 5 vehicles
        .map(g => ({
            modelYear: g.year,
            electricRange: Math.round(g.totalRange / g.count),
            make: g.make,
            count: g.count,
        }));
};

// Get top models
export const getTopModels = (vehicles, limit = 15) => {
    const modelData = {};

    vehicles.forEach(v => {
        const key = `${v.make}-${v.model}`;
        if (!modelData[key]) {
            modelData[key] = { make: v.make, model: v.model, count: 0, totalRange: 0, type: v.electricVehicleType };
        }
        modelData[key].count++;
        modelData[key].totalRange += v.electricRange;
    });

    return Object.values(modelData)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map(m => ({
            make: m.make,
            model: m.model,
            count: m.count,
            avgRange: Math.round(m.totalRange / m.count),
            type: m.type,
        }));
};

// Calculate KPI metrics
export const calculateKPIs = (vehicles, allVehicles) => {
    const bevCount = vehicles.filter(v => v.electricVehicleType === 'BEV').length;
    const avgRange = vehicles.reduce((sum, v) => sum + v.electricRange, 0) / vehicles.length || 0;

    // Get top manufacturer
    const makeCounts = {};
    vehicles.forEach(v => {
        makeCounts[v.make] = (makeCounts[v.make] || 0) + 1;
    });
    const topMake = Object.entries(makeCounts).sort((a, b) => b[1] - a[1])[0];

    // Calculate YoY change for the most recent complete year
    const years = [...new Set(vehicles.map(v => v.modelYear))].sort();
    const currentYear = years[years.length - 1];
    const prevYear = years[years.length - 2];

    const currentCount = vehicles.filter(v => v.modelYear === currentYear).length;
    const prevCount = vehicles.filter(v => v.modelYear === prevYear).length;
    const yoyChange = prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0;

    return {
        totalVehicles: vehicles.length,
        bevPercentage: (bevCount / vehicles.length) * 100,
        avgRange: Math.round(avgRange),
        topManufacturer: topMake ? { name: topMake[0], count: topMake[1], share: (topMake[1] / vehicles.length) * 100 } : null,
        yoyChange,
        uniqueMakes: Object.keys(makeCounts).length,
        uniqueModels: new Set(vehicles.map(v => `${v.make}-${v.model}`)).size,
    };
};

// Filter vehicles based on filter state
export const filterVehicles = (vehicles, filters) => {
    return vehicles.filter(v => {
        // Year filter
        if (v.modelYear < filters.yearRange[0] || v.modelYear > filters.yearRange[1]) {
            return false;
        }

        // Manufacturer filter
        if (filters.manufacturers.length > 0 && !filters.manufacturers.includes(v.make)) {
            return false;
        }

        // Vehicle type filter
        if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(v.electricVehicleType)) {
            return false;
        }

        // State filter
        if (filters.states.length > 0 && !filters.states.includes(v.state)) {
            return false;
        }

        return true;
    });
};

// Get unique values for filter options
export const getFilterOptions = (vehicles) => {
    const years = [...new Set(vehicles.map(v => v.modelYear))].sort();
    const manufacturers = [...new Set(vehicles.map(v => v.make))].sort();
    const states = [...new Set(vehicles.map(v => v.state))].filter(s => s).sort();

    return {
        yearRange: [Math.min(...years), Math.max(...years)],
        manufacturers,
        states,
    };
};
