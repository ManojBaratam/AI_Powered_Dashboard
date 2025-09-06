import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Trophy, TrendingUp, Star } from "lucide-react";
import { Team } from "@/types/task";

interface TeamOverviewProps {
  teams: Team[];
  onTeamClick: (team: Team) => void;
}

export function TeamOverview({ teams, onTeamClick }: TeamOverviewProps) {
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTeams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onTeamClick(team)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {index === 0 && <Trophy className="h-4 w-4 text-gold" />}
                {index === 1 && <Star className="h-4 w-4 text-gray-400" />}
                {index === 2 && <Star className="h-4 w-4 text-amber-600" />}
                <span className="font-medium">{team.name}</span>
              </div>
              <Badge variant="outline">{team.memberCount} members</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{team.totalPoints}</div>
                <div className="text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{team.avgTaskCompletion}%</div>
                <div className="text-muted-foreground">Completion</div>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}