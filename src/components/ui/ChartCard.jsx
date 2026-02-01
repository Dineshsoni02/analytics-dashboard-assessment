import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export const ChartCard = ({
    title,
    subtitle,
    insight,
    children,
    delay = 0,
    className = '',
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
        bg-background-secondary border border-border rounded-xl p-6
        hover:border-border-hover transition-colors duration-200
        ${className}
      `}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-text-muted mt-1">{subtitle}</p>
                )}
            </div>

            <div className="min-h-[280px]">
                {children}
            </div>

            {insight && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-background-tertiary rounded-lg">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-text-secondary leading-relaxed">{insight}</p>
                </div>
            )}
        </motion.div>
    );
};
