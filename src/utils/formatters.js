export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
};

export const formatPercentage = (num, decimals = 1) => {
    return `${num.toFixed(decimals)}%`;
};

export const formatRange = (range) => {
    return `${range} mi`;
};

export const getChangeIndicator = (change) => {
    if (change > 0) {
        return { color: 'text-accent-emerald', icon: '↑' };
    }
    if (change < 0) {
        return { color: 'text-accent-rose', icon: '↓' };
    }
    return { color: 'text-text-secondary', icon: '→' };
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Color palette for charts
export const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    tertiary: '#10b981',
    quaternary: '#f59e0b',
    quinary: '#06b6d4',
    senary: '#f43f5e',
    septenary: '#ec4899',
    octonary: '#84cc16',
};

export const CHART_COLOR_ARRAY = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#06b6d4', // cyan
    '#f43f5e', // rose
    '#ec4899', // pink
    '#84cc16', // lime
    '#14b8a6', // teal
    '#a855f7', // violet
];

export const getChartColor = (index) => {
    return CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length];
};
