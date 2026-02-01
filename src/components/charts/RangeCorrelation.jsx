import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';

export const RangeCorrelation = ({ data, delay = 0 }) => {
    // Calculate trend - are newer cars getting better range?
    const avgByYear = {};
    data.forEach(d => {
        if (!avgByYear[d.modelYear]) avgByYear[d.modelYear] = { total: 0, count: 0 };
        avgByYear[d.modelYear].total += d.electricRange;
        avgByYear[d.modelYear].count++;
    });

    const years = Object.keys(avgByYear).map(Number).sort();
    const oldAvg = avgByYear[years[0]] ? avgByYear[years[0]].total / avgByYear[years[0]].count : 0;
    const newAvg = avgByYear[years[years.length - 1]] ? avgByYear[years[years.length - 1]].total / avgByYear[years[years.length - 1]].count : 0;
    const improvement = oldAvg > 0 ? ((newAvg - oldAvg) / oldAvg * 100).toFixed(0) : 0;

    return (
        <ChartCard
            title="Range vs Model Year"
            subtitle="Technology improvement over time"
            insight={`Average EV range has improved by ${improvement}% since ${years[0] || 'early models'}. Newer models consistently offer better range, with top manufacturers leading innovation.`}
            delay={delay}
            className="lg:col-span-2"
        >
            <ResponsiveContainer width="100%" height={280}>
                <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        type="number"
                        dataKey="modelYear"
                        name="Model Year"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <YAxis
                        type="number"
                        dataKey="electricRange"
                        name="Range (mi)"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        unit=" mi"
                    />
                    <ZAxis
                        type="number"
                        dataKey="count"
                        range={[50, 400]}
                        name="Count"
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        }}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                        formatter={(value, name) => {
                            if (name === 'Model Year') return [value, 'Year'];
                            if (name === 'Range (mi)') return [`${value} miles`, 'Avg Range'];
                            if (name === 'Count') return [value.toLocaleString(), 'Vehicles'];
                            return [value, name];
                        }}
                        labelFormatter={() => ''}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-background-tertiary border border-border rounded-lg p-3 shadow-xl">
                                        <p className="text-text-primary font-semibold">{data.make}</p>
                                        <p className="text-text-secondary text-sm">Year: {data.modelYear}</p>
                                        <p className="text-text-secondary text-sm">Avg Range: {data.electricRange} mi</p>
                                        <p className="text-text-muted text-xs">{data.count.toLocaleString()} vehicles</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Scatter
                        data={data}
                        fill="#06b6d4"
                        fillOpacity={0.6}
                        animationBegin={0}
                        animationDuration={1000}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
