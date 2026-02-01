import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard = ({
    label,
    value,
    subValue,
    change,
    changeLabel,
    icon,
    color = 'blue',
    delay = 0,
}) => {
    const getChangeIcon = () => {
        if (change === undefined) return null;
        if (change > 0) return <TrendingUp className="w-4 h-4" />;
        if (change < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getChangeColor = () => {
        if (change === undefined) return 'text-text-muted';
        if (change > 0) return 'text-emerald-400';
        if (change < 0) return 'text-rose-400';
        return 'text-text-muted';
    };

    const colorStyles = {
        blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
        emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
        purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
        amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    };

    const iconColors = {
        blue: 'text-blue-400 bg-blue-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/20',
        purple: 'text-purple-400 bg-purple-500/20',
        amber: 'text-amber-400 bg-amber-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
        relative overflow-hidden rounded-xl border p-6
        bg-gradient-to-br ${colorStyles[color] || colorStyles.blue}
        backdrop-blur-sm card-hover
      `}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
                    <p className="text-3xl font-bold text-text-primary tracking-tight">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {subValue && (
                        <p className="text-sm text-text-muted mt-1">{subValue}</p>
                    )}
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 ${getChangeColor()}`}>
                            {getChangeIcon()}
                            <span className="text-sm font-medium">
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                            {changeLabel && (
                                <span className="text-xs text-text-muted ml-1">{changeLabel}</span>
                            )}
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-lg ${iconColors[color] || iconColors.blue}`}>
                        {icon}
                    </div>
                )}
            </div>

            {/* Subtle glow effect */}
            <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{
                    background: `radial-gradient(circle, var(--accent-${color}) 0%, transparent 70%)`
                }}
            />
        </motion.div>
    );
};
