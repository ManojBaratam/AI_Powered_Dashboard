import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, Target, TrendingUp, Award } from "lucide-react";
import { UserStats } from "@/types/task";

interface GameStatsProps {
  stats: UserStats;
}

export const GameStats = ({ stats }: GameStatsProps) => {
  const levelProgress = 100 - (stats.pointsToNextLevel / 100) * 100;
  
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Early Bird": return "🌅";
      case "Streak Master": return "🔥";
      case "Perfectionist": return "💎";
      case "Speed Demon": return "⚡";
      case "Team Player": return "🤝";
      default: return "🏆";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Level & XP */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Level {stats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{stats.totalPoints}</div>
          <div className="text-sm opacity-90 mb-2">Total Points</div>
          <Progress value={levelProgress} className="bg-primary-foreground/20" />
          <div className="text-xs opacity-80 mt-1">
            {stats.pointsToNextLevel} to next level
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className={`${stats.currentStreak >= 7 ? 'bg-gradient-achievement text-white' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <div className="text-sm text-muted-foreground">days</div>
          {stats.currentStreak >= 7 && (
            <Badge className="mt-2 bg-gold text-gold-foreground">
              🔥 On Fire!
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className={`${stats.onTimeRate >= 90 ? 'bg-gradient-success text-success-foreground' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            On-Time Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.onTimeRate}%</div>
          <div className="text-sm opacity-80">of tasks completed on time</div>
          {stats.onTimeRate >= 90 && (
            <Badge className="mt-2 bg-gold text-gold-foreground">
              🎯 Excellent!
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tasks Done
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
          <div className="text-sm text-muted-foreground">total completed</div>
          <div className="text-xs text-muted-foreground mt-1">
            Record: {stats.longestStreak} days
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {stats.badges.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements ({stats.badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.badges.map((badge) => (
                <Badge 
                  key={badge} 
                  className="bg-gold text-gold-foreground px-3 py-1 shadow-achievement"
                >
                  <span className="mr-1">{getBadgeIcon(badge)}</span>
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};