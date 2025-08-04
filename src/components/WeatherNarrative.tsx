import { Card } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';

interface WeatherNarrativeProps {
  narrative: string | null;
  loading: boolean;
}

export default function WeatherNarrative({ narrative, loading }: WeatherNarrativeProps) {
  if (loading) {
    return (
      <Card className="weather-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <LoadingSpinner size="sm" />
          <h3 className="text-lg font-semibold text-primary">
            AI Weather Assistant
          </h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
          <div className="h-4 bg-muted/30 rounded animate-pulse w-4/5"></div>
          <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!narrative) {
    return null;
  }

  return (
    <Card className="weather-panel p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        🤖 AI Weather Assistant
      </h3>
      <p className="text-foreground leading-relaxed">
        {narrative}
      </p>
    </Card>
  );
}