import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, SubTask } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export const TaskCard = ({ task, onComplete, onSubtaskToggle }: TaskCardProps) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
  const isCompleted = task.status === "completed";
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed": 
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "in-progress": 
        return <Zap className="h-5 w-5 text-primary" />;
      default: 
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      isCompleted && "border-success bg-success/5",
      isOverdue && !isCompleted && "border-destructive bg-destructive/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <h3 className={cn(
                "font-semibold text-lg",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {task.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className={cn(
                "flex items-center gap-1",
                isOverdue && !isCompleted && "text-destructive font-medium"
              )}>
                <Clock className="h-4 w-4" />
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-gold font-medium">
                <Star className="h-4 w-4 fill-current" />
                {task.points} points
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.subtasks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Subtasks ({completedSubtasks}/{task.subtasks.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtasks(!showSubtasks)}
              >
                {showSubtasks ? "Hide" : "Show"}
              </Button>
            </div>
            <Progress value={progress} className="mb-2" />
            
            {showSubtasks && (
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSubtaskToggle(task.id, subtask.id)}
                      className="p-0 h-auto"
                    >
                      <CheckCircle2 className={cn(
                        "h-4 w-4",
                        subtask.completed ? "text-success" : "text-muted-foreground"
                      )} />
                    </Button>
                    <span className={cn(
                      "text-sm flex-1",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {subtask.estimatedHours}h
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {!isCompleted && (
            <Button
              onClick={() => onComplete(task.id)}
              className="flex-1 bg-gradient-success hover:opacity-90 transition-opacity"
              disabled={task.subtasks.length > 0 && progress < 100}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Task
            </Button>
          )}
          {isCompleted && (
            <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success/10 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-success font-medium">Completed!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};