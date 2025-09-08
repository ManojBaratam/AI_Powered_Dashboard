import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Clock, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, SubTask, Team, LeaderboardEntry } from "@/types/task";

interface CreateTaskDialogProps {
  onCreateTask: (task: Task) => void;
  teams?: Team[];
  members?: LeaderboardEntry[];
}

export const CreateTaskDialog = ({ onCreateTask, teams = [], members = [] }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("none");
  const [assignedTeam, setAssignedTeam] = useState<string>("none");
  const [aiSuggestions, setAiSuggestions] = useState<{ title: string; estimatedHours: number }[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();

  // Reset assignedTo when team changes
  const handleTeamChange = (value: string) => {
    setAssignedTeam(value);
    setAssignedTo("none"); // Reset member selection when team changes
  };

  const generateAIBreakdown = async () => {
    if (!title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title before generating AI suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    
    // Simulate AI task breakdown (in real app, this would call an AI API)
    setTimeout(() => {
      const suggestions: { title: string; estimatedHours: number }[] = [
        { title: "Research and planning phase", estimatedHours: 2 },
        { title: "Create initial draft/prototype", estimatedHours: 4 },
        { title: "Review and iterate", estimatedHours: 2 },
        { title: "Final implementation", estimatedHours: 3 },
        { title: "Testing and quality assurance", estimatedHours: 1 }
      ].map(task => ({
        ...task,
        title: task.title.replace("implementation", title.toLowerCase().includes("design") ? "design work" : "implementation")
      }));

      setAiSuggestions(suggestions);
      setIsGeneratingAI(false);
      
      toast({
        title: "AI Breakdown Generated! ✨",
        description: `Created ${suggestions.length} subtasks for "${title}"`,
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in task title and due date.",
        variant: "destructive"
      });
      return;
    }

    const points = priority === "high" ? 25 : priority === "medium" ? 15 : 10;
    const subtasks = aiSuggestions.map((suggestion, index) => ({
      id: `subtask-${index}`,
      title: suggestion.title,
      completed: false,
      estimatedHours: suggestion.estimatedHours
    }));

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      priority,
      dueDate,
      status: "todo",
      points,
      subtasks,
      assignedTo: assignedTo && assignedTo !== "none" ? assignedTo : undefined,
      assignedTeam: assignedTeam && assignedTeam !== "none" ? assignedTeam : undefined
    };

    onCreateTask(newTask);
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setAssignedTo("none");
    setAssignedTeam("none");
    setAiSuggestions([]);
    setOpen(false);
    
    toast({
      title: "Task created successfully! 🎉",
      description: `"${title}" has been added with ${points} points potential.`,
    });
  };

  const totalEstimatedHours = aiSuggestions.reduce((sum, task) => sum + task.estimatedHours, 0);

  // Get filtered members based on selected team
  const getFilteredMembers = () => {
    if (assignedTeam && assignedTeam !== "none") {
      return members.filter(member => member.teamId === assignedTeam);
    }
    return members;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Create New Task
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task details..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    <SelectItem value="low">Low (10 pts)</SelectItem>
                    <SelectItem value="medium">Medium (15 pts)</SelectItem>
                    <SelectItem value="high">High (25 pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Assignment Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignedTeam">Assign to Team</Label>
                <Select value={assignedTeam} onValueChange={handleTeamChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    <SelectItem value="none">No team</SelectItem>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {team.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedTo">Assign to Member</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select member..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    <SelectItem value="none">No member</SelectItem>
                    {getFilteredMembers().map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* AI Breakdown Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Task Breakdown</h3>
              <Button
                type="button"
                variant="outline"
                onClick={generateAIBreakdown}
                disabled={isGeneratingAI}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingAI ? "Generating..." : "Generate AI Subtasks"}
              </Button>
            </div>
            
            {aiSuggestions.length > 0 && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {aiSuggestions.length} subtasks
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {totalEstimatedHours}h estimated
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <span className="text-sm">{suggestion.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.estimatedHours}h
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-success hover:opacity-90 transition-opacity"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};