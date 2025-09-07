import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, User, AlertCircle } from "lucide-react";
import { Task } from "@/types/task";

interface ScheduleViewProps {
  tasks: Task[];
  teams: Array<{ id: string; name: string; members: Array<{ id: string; name: string }> }>;
}

export function ScheduleView({ tasks, teams }: ScheduleViewProps) {
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Group tasks by due date
  const tasksByDate = tasks.reduce((acc, task) => {
    const dueDate = task.dueDate ? new Date(task.dueDate).toDateString() : 'No due date';
    if (!acc[dueDate]) acc[dueDate] = [];
    acc[dueDate].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'No due date') return 1;
    if (b === 'No due date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const getAssigneeName = (task: Task) => {
    if (task.assignedTo) {
      const allMembers = teams.flatMap(team => team.members);
      const member = allMembers.find(m => m.id === task.assignedTo);
      return member?.name || 'Unknown Member';
    }
    if (task.assignedTeam) {
      const team = teams.find(t => t.id === task.assignedTeam);
      return team?.name || 'Unknown Team';
    }
    return 'Unassigned';
  };

  const getAssigneeType = (task: Task): 'team' | 'member' | 'unassigned' => {
    if (task.assignedTo) return 'member';
    if (task.assignedTeam) return 'team';
    return 'unassigned';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < today && task.status !== 'completed';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Schedule View</h2>
      </div>

      {sortedDates.map(dateStr => (
        <div key={dateStr} className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">
              {dateStr === 'No due date' ? 'No Due Date' : 
               dateStr === todayStr ? 'Today' :
               new Date(dateStr).toLocaleDateString('en-US', { 
                 weekday: 'long', 
                 year: 'numeric', 
                 month: 'long', 
                 day: 'numeric' 
               })}
            </h3>
            <span className="text-sm text-muted-foreground">
              ({tasksByDate[dateStr].length} task{tasksByDate[dateStr].length !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="grid gap-3">
            {tasksByDate[dateStr].map(task => {
              const assigneeType = getAssigneeType(task);
              const assigneeName = getAssigneeName(task);
              const overdue = isOverdue(task);

              return (
                <Card key={task.id} className={`p-4 ${overdue ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-2">
                        {overdue && <AlertCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />}
                        <div>
                          <h4 className={`font-medium ${overdue ? 'text-destructive' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>

                        {task.points && (
                          <Badge variant="secondary" className="text-xs">
                            {task.points} pts
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {assigneeType === 'member' && <User className="h-4 w-4 text-primary" />}
                      {assigneeType === 'team' && <Users className="h-4 w-4 text-secondary" />}
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{assigneeName}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {assigneeType === 'unassigned' ? 'Not assigned' : assigneeType}
                        </div>
                      </div>

                      {assigneeType === 'member' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {assigneeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {sortedDates.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Tasks Scheduled</h3>
          <p className="text-muted-foreground">Create tasks with due dates to see them in the schedule view.</p>
        </Card>
      )}
    </div>
  );
}