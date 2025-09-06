import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { LeaderboardEntry } from "@/types/task";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const Leaderboard = ({ entries, currentUserId }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: 
        return <Crown className="h-5 w-5 text-gold fill-current" />;
      case 2: 
        return <Medal className="h-5 w-5 text-gray-400 fill-current" />;
      case 3: 
        return <Award className="h-5 w-5 text-amber-600 fill-current" />;
      default: 
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: 
        return "bg-gradient-achievement text-white shadow-achievement";
      case 2: 
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800";
      case 3: 
        return "bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800";
      default: 
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.id === currentUserId;
          
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:shadow-md ${
                getRankStyle(rank)
              } ${
                isCurrentUser && rank > 3 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : ""
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>
                  {entry.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold truncate ${
                    rank <= 3 ? "text-current" : "text-foreground"
                  }`}>
                    {entry.name}
                  </h4>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${
                  rank <= 3 ? "opacity-80" : "text-muted-foreground"
                }`}>
                  {entry.department}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`font-bold text-lg ${
                  rank <= 3 ? "text-current" : "text-foreground"
                }`}>
                  {entry.points}
                </div>
                <div className={`text-xs ${
                  rank <= 3 ? "opacity-80" : "text-muted-foreground"
                }`}>
                  {entry.tasksCompleted} tasks
                </div>
              </div>
              
              {entry.streak > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  <span className={`text-sm font-medium ${
                    rank <= 3 ? "text-current" : "text-foreground"
                  }`}>
                    {entry.streak}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};