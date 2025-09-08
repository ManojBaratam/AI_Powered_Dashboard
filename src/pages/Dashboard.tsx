import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { GameStats } from "@/components/GameStats";
import { Leaderboard } from "@/components/Leaderboard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { TeamDetailsModal } from "@/components/TeamDetailsModal";
import { TeamOverview } from "@/components/TeamOverview";
import { TeamModal } from "@/components/TeamModal";
import { TeamManagement } from "@/components/TeamManagement";
import { BarChart3, Users, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, UserStats, LeaderboardEntry, Team } from "@/types/task";
import heroImage from "@/assets/hero-dashboard.jpg";

// Mock data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new product landing page",
    description: "Create a modern, conversion-focused landing page with A/B testing capabilities",
    priority: "high",
    dueDate: "2025-01-08",
    status: "in-progress",
    points: 25,
    subtasks: [
      { id: "1a", title: "Research competitor layouts", completed: true, estimatedHours: 2 },
      { id: "1b", title: "Create wireframes", completed: true, estimatedHours: 3 },
      { id: "1c", title: "Design high-fidelity mockups", completed: false, estimatedHours: 4 },
      { id: "1d", title: "Implement responsive design", completed: false, estimatedHours: 5 }
    ]
  },
  {
    id: "2", 
    title: "Database optimization review",
    description: "Analyze query performance and implement optimizations for better response times",
    priority: "medium",
    dueDate: "2025-01-10",
    status: "todo",
    points: 15,
    subtasks: [
      { id: "2a", title: "Audit current queries", completed: false, estimatedHours: 3 },
      { id: "2b", title: "Identify slow queries", completed: false, estimatedHours: 2 },
      { id: "2c", title: "Implement optimizations", completed: false, estimatedHours: 4 }
    ]
  }
];

const userStats = {
  totalPoints: 1250,
  currentStreak: 12,
  longestStreak: 18,
  tasksCompleted: 47,
  onTimeRate: 94,
  level: 8,
  pointsToNextLevel: 150,
  badges: ["Early Bird", "Streak Master", "Perfectionist", "Team Player"]
};

const leaderboardData = [
  { id: "1", name: "Alex Thompson", points: 1450, tasksCompleted: 52, streak: 15, department: "Engineering", teamId: "team1" },
  { id: "2", name: "Sarah Chen", points: 1380, tasksCompleted: 48, streak: 11, department: "Design", teamId: "team2" },
  { id: "3", name: "Marcus Johnson", points: 1250, tasksCompleted: 47, streak: 12, department: "Product", teamId: "team1" },
  { id: "4", name: "Emma Davis", points: 1180, tasksCompleted: 43, streak: 8, department: "Marketing", teamId: "team2" },
  { id: "5", name: "David Kim", points: 1120, tasksCompleted: 41, streak: 6, department: "Engineering", teamId: "team1" }
];

const teamsData: Team[] = [
  {
    id: "team1",
    name: "Alpha Squad",
    description: "High-performance engineering and product team",
    totalPoints: 3820,
    memberCount: 3,
    avgTaskCompletion: 94,
    members: leaderboardData.filter(member => member.teamId === "team1")
  },
  {
    id: "team2", 
    name: "Creative Force",
    description: "Design and marketing excellence team",
    totalPoints: 2560,
    memberCount: 2,
    avgTaskCompletion: 89,
    members: leaderboardData.filter(member => member.teamId === "team2")
  }
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [teams, setTeams] = useState(teamsData);
  const [allMembers, setAllMembers] = useState(leaderboardData); // Track all members separately
  const [currentUser] = useState("3"); // Current user is Marcus Johnson
  const [selectedTeamMember, setSelectedTeamMember] = useState<LeaderboardEntry | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const currentUserName = getAllMembers().find(user => user.id === currentUser)?.name || "You";
        const updatedTask: Task = { 
          ...task, 
          status: "completed",
          completedBy: currentUserName,
          completedAt: new Date().toISOString()
        };
        
        // Update member points in both teams and allMembers
        if (task.assignedTo) {
          // Update teams
          setTeams(prevTeams => prevTeams.map(team => ({
            ...team,
            members: team.members.map(member => {
              if (member.id === task.assignedTo) {
                return {
                  ...member,
                  points: member.points + task.points,
                  tasksCompleted: member.tasksCompleted + 1
                };
              }
              return member;
            }),
            totalPoints: team.members.reduce((sum, m) => 
              m.id === task.assignedTo ? sum + m.points + task.points : sum + m.points, 0)
          })));

          // Update allMembers
          setAllMembers(prevMembers => prevMembers.map(member => {
            if (member.id === task.assignedTo) {
              return {
                ...member,
                points: member.points + task.points,
                tasksCompleted: member.tasksCompleted + 1
              };
            }
            return member;
          }));
        }
        
        // Show enhanced achievement toast
        toast({
          title: `🎉 Task Completed!`,
          description: (
            <div className="space-y-1">
              <div className="font-semibold">+{task.points} points earned!</div>
              <div className="text-sm opacity-90">"{task.title}"</div>
              <div className="text-xs opacity-75">Keep up the great work! 🚀</div>
            </div>
          ),
        });
        
        return updatedTask;
      }
      return task;
    }));
  };

  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTeams = (updatedTeams: Team[]) => {
    setTeams(updatedTeams);
    // Update allMembers when teams change
    const teamMembers = updatedTeams.flatMap(team => team.members);
    const memberIds = teamMembers.map(m => m.id);
    const baseMembers = allMembers.filter(m => !memberIds.includes(m.id));
    setAllMembers([...teamMembers, ...baseMembers]);
  };

  // Get all members from all teams dynamically
  const getAllMembers = (): LeaderboardEntry[] => {
    const allTeamMembers = teams.flatMap(team => team.members);
    // Combine with base members, ensuring no duplicates
    const memberIds = allTeamMembers.map(m => m.id);
    const baseMembers = allMembers.filter(m => !memberIds.includes(m.id));
    return [...allTeamMembers, ...baseMembers];
  };

  const handleTeamMemberClick = (member: LeaderboardEntry) => {
    setSelectedTeamMember(member);
    setIsTeamModalOpen(true);
  };

  const handleCloseTeamModal = () => {
    setIsTeamModalOpen(false);
    setSelectedTeamMember(null);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsTeamDetailsModalOpen(true);
  };

  const handleCloseTeamDetailsModal = () => {
    setIsTeamDetailsModalOpen(false);
    setSelectedTeam(null);
  };

  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const completedTasks = tasks.filter(task => task.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage} 
          alt="Productivity dashboard" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Your Productivity
                <span className="block bg-gradient-to-r from-gold to-gold-glow bg-clip-text text-transparent">
                  Command Center
                </span>
              </h1>
              <p className="text-xl opacity-90 mb-6 max-w-2xl">
                Track tasks, earn achievements, and level up your productivity with AI-powered insights and gamification.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <CreateTaskDialog onCreateTask={handleCreateTask} />
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                      <div className="text-sm opacity-80">Total Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userStats.currentStreak}</div>
                      <div className="text-sm opacity-80">Day Streak 🔥</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userStats.onTimeRate}%</div>
                      <div className="text-sm opacity-80">On-Time Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">Level {userStats.level}</div>
                      <div className="text-sm opacity-80">Current Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        {/* Game Stats */}
        <GameStats stats={userStats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                  <TabsTrigger value="active">
                    Active ({todoTasks.length + inProgressTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Done ({completedTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="teams">
                    Teams ({teams.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All ({tasks.length})
                  </TabsTrigger>
                </TabsList>
                <CreateTaskDialog onCreateTask={handleCreateTask} teams={teams} members={getAllMembers()} />
              </div>

              <TabsContent value="active" className="space-y-6">
                {inProgressTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">In Progress</Badge>
                    </h3>
                    <div className="space-y-4">
                      {inProgressTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onComplete={handleCompleteTask}
                          onSubtaskToggle={handleSubtaskToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {todoTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge variant="outline">To Do</Badge>
                    </h3>
                    <div className="space-y-4">
                      {todoTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onComplete={handleCompleteTask}
                          onSubtaskToggle={handleSubtaskToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {todoTasks.length === 0 && inProgressTasks.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No active tasks</h3>
                      <p className="text-muted-foreground mb-4">
                        Create a new task to get started and earn points!
                      </p>
                      <CreateTaskDialog onCreateTask={handleCreateTask} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleCompleteTask}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
                {completedTasks.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground">No completed tasks yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="teams" className="space-y-4">
                <TeamManagement 
                  teams={teams} 
                  allMembers={getAllMembers()} 
                  onUpdateTeams={handleUpdateTeams}
                  onTeamClick={handleTeamClick}
                />
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleCompleteTask}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Overview */}
            <TeamOverview teams={teams} onTeamClick={handleTeamClick} />

            {/* Leaderboard */}
            <Leaderboard 
              entries={getAllMembers()} 
              currentUserId={currentUser} 
              onMemberClick={handleTeamMemberClick}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Overview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule View
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Details Modal */}
      <TeamDetailsModal
        isOpen={isTeamModalOpen}
        onClose={handleCloseTeamModal}
        member={selectedTeamMember}
      />

      {/* Team Modal */}
      <TeamModal
        isOpen={isTeamDetailsModalOpen}
        onClose={handleCloseTeamDetailsModal}
        team={selectedTeam}
      />
    </div>
  );
}