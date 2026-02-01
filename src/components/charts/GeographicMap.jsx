import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { CHART_COLOR_ARRAY } from '@/utils/formatters';

const CustomTreemapContent = ({ x, y, width, height, name, value, index }) => {
    if (width < 50 || height < 30) return null;

    // Text shadow for better readability on colored backgrounds
    const textShadow = '0 1px 2px rgba(0, 0, 0, .2)';

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length]}
                stroke="var(--bg-primary)"
                strokeWidth={2}
                rx={4}
                style={{ transition: 'all 0.2s' }}
            />
            {width > 60 && height > 40 && (
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill="#000"
                        fontSize={14}
                        fontWeight={600}
                        style={{ textShadow }}
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 10}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.9)"
                        fontSize={12}
                        style={{ textShadow }}
                    >
                        {value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                    </text>
                </>
            )}
        </g>
    );
};

export const GeographicMap = ({
    data,
    title = "Geographic Distribution",
    delay = 0
}) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const topLocation = data[0];
    const topPercentage = topLocation ? ((topLocation.value / total) * 100).toFixed(0) : 0;

    const treemapData = data.map((d, i) => ({
        name: d.name,
        size: d.value,
        fill: CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length],
    }));

    return (
        <ChartCard
            title={title}
            subtitle="EV concentration by location"
            insight={`${topLocation?.name || 'Top location'} leads with ${topPercentage}% of registrations. Urban areas show significantly higher EV adoption rates.`}
            delay={delay}
        >
            <ResponsiveContainer width="100%" height={280}>
                <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="var(--bg-primary)"
                    animationBegin={0}
                    animationDuration={1000}
                    content={<CustomTreemapContent x={0} y={0} width={0} height={0} name="" value={0} index={0} />}
                >
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        }}
                        formatter={(value) => [
                            `${value.toLocaleString()} vehicles (${((value / total) * 100).toFixed(1)}%)`,
                            ''
                        ]}
                    />
                </Treemap>
            </ResponsiveContainer>
        </ChartCard>
    );
};
