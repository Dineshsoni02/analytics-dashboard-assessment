import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Zap, Battery } from 'lucide-react';
import { ChartCard } from '@/components/ui/ChartCard';

export const ModelsTable = ({ data, delay = 0 }) => {
    const [sortField, setSortField] = useState('count');
    const [sortDirection, setSortDirection] = useState('desc');
    const [search, setSearch] = useState('');

    const sortedData = useMemo(() => {
        let filtered = data.filter(item =>
            item.make.toLowerCase().includes(search.toLowerCase()) ||
            item.model.toLowerCase().includes(search.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return sortDirection === 'asc'
                ? aVal - bVal
                : bVal - aVal;
        });
    }, [data, sortField, sortDirection, search]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc'
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <ChartCard
            title="Top Models"
            subtitle="Most popular EV models by registration"
            delay={delay}
            className="lg:col-span-2"
        >
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search models..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th
                                className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-muted cursor-pointer hover:text-zinc-300"
                                onClick={() => handleSort('make')}
                            >
                                <div className="flex items-center gap-1">
                                    Make <SortIcon field="make" />
                                </div>
                            </th>
                            <th
                                className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-muted cursor-pointer hover:text-zinc-300"
                                onClick={() => handleSort('model')}
                            >
                                <div className="flex items-center gap-1">
                                    Model <SortIcon field="model" />
                                </div>
                            </th>
                            <th
                                className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-muted cursor-pointer hover:text-zinc-300"
                                onClick={() => handleSort('count')}
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Count <SortIcon field="count" />
                                </div>
                            </th>
                            <th
                                className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-muted cursor-pointer hover:text-zinc-300"
                                onClick={() => handleSort('avgRange')}
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Avg Range <SortIcon field="avgRange" />
                                </div>
                            </th>
                            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                                Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <motion.tr
                                key={`${item.make}-${item.model}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: delay + index * 0.03 }}
                                className="border-b border-border/50 hover:bg-background-tertiary/50 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span className="font-medium text-text-primary">{item.make}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-text-secondary">{item.model}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="text-text-primary font-mono">{item.count.toLocaleString()}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className="text-text-secondary">{item.avgRange} mi</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${item.type === 'BEV'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-purple-500/20 text-purple-400'}
                  `}>
                                        {item.type === 'BEV' ? <Zap className="w-3 h-3" /> : <Battery className="w-3 h-3" />}
                                        {item.type}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedData.length === 0 && (
                <div className="text-center py-8 text-text-muted">
                    No models found matching "{search}"
                </div>
            )}
        </ChartCard>
    );
};
