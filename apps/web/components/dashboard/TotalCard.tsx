import { LoadingSpinner } from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalCardProps {
    title: string;
    value: number | null;
    unit?: string;
    isLoading?: boolean;
}

export function TotalCard({ title, value, unit, isLoading }: TotalCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <span className="text-2xl font-semibold">
                        {value !== null ? `${value.toLocaleString()}${unit ? ` ${unit}` : ''}` : "-"}
                    </span>
                )}
            </CardContent>
        </Card>
    );
}
