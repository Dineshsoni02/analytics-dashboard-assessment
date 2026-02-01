import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';

export const AdoptionTrend = ({ data, delay = 0 }) => {
    const latestYear = data[data.length - 1];
    const prevYear = data[data.length - 2];
    const growth = prevYear ? ((latestYear?.count - prevYear.count) / prevYear.count * 100).toFixed(0) : 0;

    return (
        <ChartCard
            title="EV Adoption Over Time"
            subtitle="Registrations by model year"
            insight={`${latestYear?.year || 'Recent'} shows ${growth}% growth compared to the previous year. BEVs (blue) consistently outpace PHEVs (purple) in adoption rates.`}
            delay={delay}
            className="lg:col-span-2"
        >
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="bevGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="phevGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
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
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}
                        itemStyle={{ color: 'var(--text-secondary)', fontSize: '13px' }}
                        formatter={(value, name) => [
                            value.toLocaleString(),
                            name === 'bev' ? 'Battery Electric' : name === 'phev' ? 'Plug-in Hybrid' : 'Total'
                        ]}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-sm text-text-secondary">
                                {value === 'bev' ? 'BEV' : value === 'phev' ? 'PHEV' : 'Total'}
                            </span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="bev"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#bevGradient)"
                        animationBegin={0}
                        animationDuration={1000}
                    />
                    <Area
                        type="monotone"
                        dataKey="phev"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#phevGradient)"
                        animationBegin={200}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
