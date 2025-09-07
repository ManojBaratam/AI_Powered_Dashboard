import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Target, TrendingUp, Calendar, CheckCircle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role?: string;
  tasksCompleted: number;
  points: number;
  streak: number;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  totalPoints: number;
  memberCount: number;
  avgTaskCompletion: number;
  description?: string;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamDetailsModal({ isOpen, onClose, team }: TeamDetailsModalProps) {
  if (!team) return null;

  const topPerformer = team.members.reduce((top, member) => 
    member.points > top.points ? member : top, team.members[0]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team.name} Team Details
          </DialogTitle>
        </DialogHeader>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Members</span>
            </div>
            <div className="text-2xl font-bold">{team.memberCount}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">Total Points</span>
            </div>
            <div className="text-2xl font-bold text-gold">{team.totalPoints}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold text-success">{team.avgTaskCompletion}%</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Avg Points</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(team.totalPoints / team.memberCount)}</div>
          </Card>
        </div>

        {/* Top Performer Highlight */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-gold/10 to-gold/5 border-gold/20">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-gold" />
            <div>
              <h3 className="font-semibold text-gold">Top Performer</h3>
              <p className="text-sm text-muted-foreground">
                {topPerformer.name} - {topPerformer.points} points
              </p>
            </div>
          </div>
        </Card>

        {/* Team Members List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </h3>
          
          <div className="grid gap-4">
            {team.members.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Points */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gold">{member.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>

                    {/* Tasks */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-success">{member.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">tasks</div>
                    </div>

                    {/* Streak */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-orange-500">{member.streak}</div>
                      <div className="text-xs text-muted-foreground">streak</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}