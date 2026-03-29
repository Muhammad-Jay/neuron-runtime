export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <p className="text-sm font-medium">
                No workflows yet
            </p>
            <p className="text-xs text-muted-foreground">
                Create your first automation pipeline.
            </p>
        </div>
    )
}