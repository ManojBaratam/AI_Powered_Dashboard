import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Calendar, 
  Target, 
  TrendingUp, 
  Mail, 
  Building,
  Star,
  Flame,
  Award
} from "lucide-react";
import { LeaderboardEntry } from "@/types/task";

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: LeaderboardEntry | null;
}

export const TeamDetailsModal = ({ isOpen, onClose, member }: TeamDetailsModalProps) => {
  if (!member) return null;

  // Mock additional details for the team member
  const memberDetails = {
    email: `${member.name.toLowerCase().replace(' ', '.')}@company.com`,
    joinDate: "Jan 15, 2023",
    completionRate: 94,
    avgTaskTime: "2.3 days",
    totalHours: 127,
    recentBadges: ["Speed Demon", "Team Player", "Perfectionist"],
    currentProjects: [
      "Mobile App Redesign",
      "API Documentation",
      "User Research Study"
    ],
    skillTags: ["React", "TypeScript", "Design Systems", "API Development"]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{member.name}</h2>
              <p className="text-sm text-muted-foreground">{member.department} Team</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{memberDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.department} Department</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {memberDetails.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{member.points}</div>
                <div className="text-sm opacity-90">Ranked #{member.id} this week</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-achievement text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{member.streak}</div>
                <div className="text-sm opacity-90">consecutive days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{memberDetails.completionRate}%</div>
                <Progress value={memberDetails.completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tasks Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{member.tasksCompleted}</div>
                <div className="text-sm text-muted-foreground">
                  Avg: {memberDetails.avgTaskTime}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Efficiency Chart */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Task Efficiency</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${memberDetails.completionRate}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{memberDetails.completionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Team Performance</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--success))"
                        strokeWidth="2"
                        strokeDasharray="88, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">88%</span>
                    </div>
                  </div>
                </div>

                {/* Time Management Chart */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Time Management</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeDasharray="76, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">76%</span>
                    </div>
                  </div>
                </div>

                {/* Task Completion Chart */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Task Completion</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--gold))"
                        strokeWidth="2"
                        strokeDasharray={`${Math.round((member.tasksCompleted / 50) * 100)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{member.tasksCompleted}</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Tasks Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Current Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {memberDetails.currentProjects.map((project) => (
                  <div 
                    key={project}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="text-sm">{project}</span>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {memberDetails.skillTags.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline"
                    className="px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};