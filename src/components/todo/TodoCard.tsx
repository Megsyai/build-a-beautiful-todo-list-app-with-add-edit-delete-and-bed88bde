import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit3, Calendar, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
}

export const TodoCard = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit 
}: { 
  todo: Todo; 
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}) => {
  const priorityColors = {
    low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative flex items-center gap-4 p-4 transition-all hover:shadow-xl hover:shadow-primary/5",
        "bg-zinc-900/50 border-zinc-800 backdrop-blur-sm",
        todo.completed && "opacity-60"
      )}>
        <Checkbox 
          checked={todo.completed} 
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5 rounded-full border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "text-sm font-medium transition-all truncate",
              todo.completed ? "line-through text-zinc-500" : "text-zinc-100"
            )}>
              {todo.title}
            </h3>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 uppercase tracking-wider", priorityColors[todo.priority])}>
              {todo.priority}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            {todo.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(todo.dueDate), "MMM dd")}
              </span>
            )}
            {todo.category && (
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                {todo.category}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => onEdit(todo)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-rose-400" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
