import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { motion } from 'framer-motion';

export const VehicleTypeBreakdown = ({ data, delay = 0 }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const bevData = data.find(d => d.name.includes('Battery'));
    const bevPercentage = bevData ? ((bevData.value / total) * 100).toFixed(0) : 0;

    const COLORS = ['#3b82f6', '#8b5cf6'];

    return (
        <ChartCard
            title="BEV vs PHEV Distribution"
            subtitle="Battery Electric vs Plug-in Hybrid"
            insight={`${bevPercentage}% of registered EVs are fully electric (BEV), indicating strong consumer preference for all-electric vehicles over plug-in hybrids.`}
            delay={delay}
        >
            <div className="flex items-center justify-center h-[280px]">
                <div className="relative w-full max-w-[250px]">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                }}
                                formatter={(value) => [
                                    `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                                    ''
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-text-primary">{bevPercentage}%</div>
                            <div className="text-sm text-text-muted">BEV</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="ml-4 space-y-3">
                    {data.map((entry, index) => (
                        <motion.div
                            key={entry.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay + 0.3 + index * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <div>
                                <div className="text-sm font-medium text-text-primary">
                                    {entry.name.includes('Battery') ? 'BEV' : 'PHEV'}
                                </div>
                                <div className="text-xs text-text-muted">
                                    {entry.value.toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
};
