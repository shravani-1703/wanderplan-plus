import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  status: 'pending' | 'completed' | 'skipped' | 'missed';
  poi_name: string;
}

interface TripProgressVisualizationProps {
  tripId: string;
  status: string;
}

export function TripProgressVisualization({ tripId, status }: TripProgressVisualizationProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [tripId]);

  const fetchActivities = async () => {
    try {
      const { data: days } = await supabase
        .from('itinerary_days')
        .select(`
          id,
          itinerary_activities (
            id,
            status,
            pois (name)
          )
        `)
        .eq('trip_id', tripId)
        .order('day_number');

      const allActivities: Activity[] = [];
      days?.forEach((day: any) => {
        day.itinerary_activities?.forEach((activity: any) => {
          allActivities.push({
            id: activity.id,
            status: activity.status,
            poi_name: activity.pois?.name || 'Unknown',
          });
        });
      });

      setActivities(allActivities);

      const allCompleted = allActivities.length > 0 &&
        allActivities.every((a) => a.status === 'completed');
      if (allCompleted && status === 'completed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-24 bg-muted/20 rounded-md animate-pulse" />;
  }

  if (activities.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No activities planned yet
      </div>
    );
  }

  const completedCount = activities.filter((a) => a.status === 'completed').length;
  const progressPercentage = (completedCount / activities.length) * 100;

  return (
    <div className="relative">
      <div className="relative h-24 bg-gradient-to-b from-sky-100 to-green-50 dark:from-sky-950/20 dark:to-green-950/20 rounded-lg overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d={`M 0,60 Q ${activities.length > 1 ? '25,40 50,60' : '50,60'} T 100,60`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-300 dark:text-gray-700"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M 0,60 Q ${activities.length > 1 ? '25,40 50,60' : '50,60'} T 100,60`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - progressPercentage}
            className="text-primary transition-all duration-1000"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDashoffset: 100 - progressPercentage,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-between px-4">
          {activities.slice(0, 5).map((activity, index) => {
            const isCompleted = activity.status === 'completed';
            const position = (index / Math.max(activities.length - 1, 1)) * 100;

            return (
              <div
                key={activity.id}
                className="relative group"
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg',
                    isCompleted
                      ? 'bg-primary text-primary-foreground scale-110 animate-bounce'
                      : 'bg-gray-300 dark:bg-gray-600 scale-100'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-10 pointer-events-none">
                  {activity.poi_name}
                </div>
              </div>
            );
          })}
        </div>

        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {[...Array(12)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute text-yellow-400 animate-ping"
                  style={{
                    top: `${Math.random() * 60 - 30}px`,
                    left: `${Math.random() * 60 - 30}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
              <div className="text-4xl animate-bounce">🎉</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completedCount} of {activities.length} completed
        </span>
        <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
      </div>

      {progressPercentage === 100 && (
        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
          <Check className="w-3 h-3" />
          Trip completed!
        </div>
      )}
    </div>
  );
}
