import { motion } from 'framer-motion';
import { BarChart3, Moon, Sun, Github, Zap } from 'lucide-react';

export const Header = ({ isDarkMode, onToggleTheme, totalVehicles }) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 border-b border-border bg-background-primary/80 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Zap className="w-5 h-5 text-text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-text-primary">EV Analytics</h1>
                            <p className="text-xs text-text-muted">Electric Vehicle Population Dashboard</p>
                        </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-full">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-text-secondary">
                            Analyzing <span className="text-text-primary font-semibold">{totalVehicles.toLocaleString()}</span> vehicles
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleTheme}
                            className="p-2 rounded-lg bg-background-secondary border border-border hover:border-border-hover transition-colors"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-amber-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-blue-400" />
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </motion.header>
    );
};
