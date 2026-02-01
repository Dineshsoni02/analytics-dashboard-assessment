export const Skeleton = ({ className = '' }) => {
    return (
        <div className={`skeleton rounded-lg ${className}`} />
    );
};

export const KPISkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-background-secondary border border-border rounded-xl p-6"
                >
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-9 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
};

export const ChartSkeleton = () => {
    return (
        <div className="bg-background-secondary border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="h-[280px] flex items-end gap-2 p-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        style={{ height: `${Math.random() * 60 + 30}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

export const TableSkeleton = () => {
    return (
        <div className="bg-background-secondary border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
};
