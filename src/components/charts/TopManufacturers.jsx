import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { CHART_COLOR_ARRAY } from '@/utils/formatters';

export const TopManufacturers = ({ data, delay = 0 }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const topShare = data[0] ? ((data[0].value / total) * 100).toFixed(0) : 0;

    return (
        <ChartCard
            title="Top Manufacturers"
            subtitle="Market share by registration count"
            insight={`${data[0]?.name || 'Top manufacturer'} leads with ${topShare}% market share. The top 5 manufacturers account for the majority of EV registrations.`}
            delay={delay}
        >
            <ResponsiveContainer width="100%" height={280}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis
                        type="number"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={55}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        }}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                        formatter={(value) => [
                            `${value.toLocaleString()} vehicles (${((value / total) * 100).toFixed(1)}%)`,
                            'Count'
                        ]}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar
                        dataKey="value"
                        radius={[0, 4, 4, 0]}
                        animationBegin={0}
                        animationDuration={1000}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length]}
                                style={{ filter: 'brightness(1.1)' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
