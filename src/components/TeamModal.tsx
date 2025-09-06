import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Trophy, TrendingUp, Target, Award } from "lucide-react";
import { Team } from "@/types/task";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamModal({ isOpen, onClose, team }: TeamModalProps) {
  if (!team) return null;

  const topPerformer = team.members.reduce((top, member) => 
    member.points > top.points ? member : top, team.members[0]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Team Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{team.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{team.memberCount}</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{team.avgTaskCompletion}%</div>
                  <div className="text-sm text-muted-foreground">Avg Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.round(team.totalPoints / team.memberCount)}</div>
                  <div className="text-sm text-muted-foreground">Avg Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {topPerformer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{topPerformer.name}</div>
                  <div className="text-sm text-muted-foreground">{topPerformer.department}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{topPerformer.points} pts</div>
                  <div className="text-sm text-muted-foreground">{topPerformer.tasksCompleted} tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.members
                  .sort((a, b) => b.points - a.points)
                  .map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="h-4 w-4 text-gold" />}
                        {index === 1 && <Award className="h-4 w-4 text-gray-400" />}
                        {index === 2 && <Award className="h-4 w-4 text-amber-600" />}
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.department}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{member.points}</div>
                        <div className="text-muted-foreground">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{member.tasksCompleted}</div>
                        <div className="text-muted-foreground">Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{member.streak}🔥</div>
                        <div className="text-muted-foreground">Streak</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}