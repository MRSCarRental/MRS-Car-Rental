import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import TaskDialog from "@/components/crm/TaskDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  completed_at?: string;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
      return;
    }

    setTasks(data || []);
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const completed_at = newStatus === "completed" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, completed_at })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      return;
    }

    loadTasks();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Tasks</h2>
              <p className="text-muted-foreground">Manage your team's tasks</p>
            </div>
            <Button onClick={() => { setSelectedTask(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </CardTitle>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedTask(task); setDialogOpen(true); }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {task.due_date && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={selectedTask}
          onSuccess={loadTasks}
        />
      </CrmLayout>
    </ProtectedRoute>
  );
}
