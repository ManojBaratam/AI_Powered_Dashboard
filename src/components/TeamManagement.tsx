import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, UserPlus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Team, LeaderboardEntry } from "@/types/task";

interface TeamManagementProps {
  teams: Team[];
  allMembers: LeaderboardEntry[];
  onUpdateTeams: (teams: Team[]) => void;
  onTeamClick: (team: Team) => void;
}

export const TeamManagement = ({ teams, allMembers, onUpdateTeams, onTeamClick }: TeamManagementProps) => {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedTeamForMember, setSelectedTeamForMember] = useState<string>("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const { toast } = useToast();

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name.",
        variant: "destructive"
      });
      return;
    }

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      totalPoints: 0,
      memberCount: 0,
      avgTaskCompletion: 0,
      members: []
    };

    onUpdateTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamDescription("");
    setIsCreateTeamOpen(false);

    toast({
      title: "Team created! 🎉",
      description: `"${newTeamName}" team has been created successfully.`,
    });
  };

  const handleAddMember = () => {
    if (!selectedTeamForMember || !selectedMemberId) {
      toast({
        title: "Selection required",
        description: "Please select both a team and a member.",
        variant: "destructive"
      });
      return;
    }

    const member = allMembers.find(m => m.id === selectedMemberId);
    if (!member) return;

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeamForMember) {
        const updatedMembers = [...team.members, { ...member, teamId: selectedTeamForMember }];
        return {
          ...team,
          members: updatedMembers,
          memberCount: updatedMembers.length,
          totalPoints: updatedMembers.reduce((sum, m) => sum + m.points, 0),
          avgTaskCompletion: Math.round(updatedMembers.reduce((sum, m) => sum + (m.tasksCompleted * 2), 0) / updatedMembers.length)
        };
      }
      return team;
    });

    onUpdateTeams(updatedTeams);
    setSelectedTeamForMember("");
    setSelectedMemberId("");
    setIsAddMemberOpen(false);

    toast({
      title: "Member added! 👥",
      description: `${member.name} has been added to the team.`,
    });
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const updatedMembers = team.members.filter(m => m.id !== memberId);
        return {
          ...team,
          members: updatedMembers,
          memberCount: updatedMembers.length,
          totalPoints: updatedMembers.reduce((sum, m) => sum + m.points, 0),
          avgTaskCompletion: updatedMembers.length > 0 
            ? Math.round(updatedMembers.reduce((sum, m) => sum + (m.tasksCompleted * 2), 0) / updatedMembers.length)
            : 0
        };
      }
      return team;
    });

    onUpdateTeams(updatedTeams);

    toast({
      title: "Member removed",
      description: "Team member has been removed successfully.",
    });
  };

  const getAvailableMembers = () => {
    const assignedMemberIds = teams.flatMap(team => team.members.map(m => m.id));
    return allMembers.filter(member => !assignedMemberIds.includes(member.id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Manage your teams and members</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="teamDescription">Description</Label>
                  <Input
                    id="teamDescription"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Enter team description..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam} className="flex-1">
                    Create Team
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member to Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Team</Label>
                  <Select value={selectedTeamForMember} onValueChange={setSelectedTeamForMember}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Member</Label>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableMembers().map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} className="flex-1">
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6">
        {teams.map(team => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="cursor-pointer hover:text-primary transition-colors" onClick={() => onTeamClick(team)}>
                      {team.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">{team.memberCount} members</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{team.totalPoints}</div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{team.avgTaskCompletion}%</div>
                  <div className="text-xs text-muted-foreground">Avg Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{team.memberCount > 0 ? Math.round(team.totalPoints / team.memberCount) : 0}</div>
                  <div className="text-xs text-muted-foreground">Avg Points</div>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Team Members:</div>
                {team.members.length > 0 ? (
                  <div className="space-y-2">
                    {team.members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg bg-background">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.department}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {member.points} pts
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleRemoveMember(team.id, member.id)}
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No members added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {teams.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teams created</h3>
              <p className="text-muted-foreground mb-4">
                Create your first team to start organizing your members
              </p>
              <Button onClick={() => setIsCreateTeamOpen(true)} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create First Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};