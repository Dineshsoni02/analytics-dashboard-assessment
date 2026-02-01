import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';

export const RangeDistribution = ({ data, delay = 0 }) => {
    // Find the most common range bucket
    const maxBucket = data.reduce((max, d) => d.count > max.count ? d : max, data[0]);

    return (
        <ChartCard
            title="Electric Range Distribution"
            subtitle="Miles of electric range per vehicle"
            insight={`Most EVs have ${maxBucket?.range || 'moderate'} range capacity. The distribution shows a bimodal pattern: PHEVs cluster in lower ranges while BEVs dominate the 200+ mile category.`}
            delay={delay}
        >
            <ResponsiveContainer width="100%" height={280}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="range"
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        }}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                        formatter={(value, _, props) => [
                            `${value.toLocaleString()} vehicles (${props.payload.percentage.toFixed(1)}%)`,
                            'Count'
                        ]}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="url(#rangeGradient)"
                        radius={[4, 4, 0, 0]}
                        animationBegin={0}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
