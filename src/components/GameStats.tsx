import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Level & XP */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="bg-gradient-primary text-primary-foreground cursor-help">
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Your current level based on total points earned. Complete more tasks to level up!</p>
          </TooltipContent>
        </Tooltip>

        {/* Current Streak */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={`${stats.currentStreak >= 7 ? 'bg-gradient-achievement text-white' : ''} cursor-help`}>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Consecutive days completing at least one task. Keep it going!</p>
          </TooltipContent>
        </Tooltip>

        {/* Completion Rate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={`${stats.onTimeRate >= 90 ? 'bg-gradient-success text-success-foreground' : ''} cursor-help`}>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Percentage of tasks you complete before or on their due date</p>
          </TooltipContent>
        </Tooltip>

        {/* Tasks Completed */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Total number of tasks you've completed successfully</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
};