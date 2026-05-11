import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { chatJSON } from "@/lib/ai";
import { toast } from "sonner";

export const TodoForm = ({ 
  onSubmit, 
  initialData 
}: { 
  onSubmit: (data: any) => void;
  initialData?: any;
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [category, setCategory] = useState(initialData?.category || "Personal");
  const [date, setDate] = useState<Date | undefined>(initialData?.dueDate ? new Date(initialData.dueDate) : undefined);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleMagicCategorize = async () => {
    if (!title) return toast.error("Enter a task title first");
    setIsAIThinking(true);
    try {
      const result = await chatJSON(`Categorize this task and suggest a priority (low, medium, high). Task: "${title}". Respond only in JSON format: { "category": "string", "priority": "low|medium|high" }`);
      if (result.category) setCategory(result.category);
      if (result.priority) setPriority(result.priority);
      toast.success("AI suggested labels applied!");
    } catch (e) {
      toast.error("AI was unable to categorize this task.");
    } finally {
      setIsAIThinking(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Task" : "Create New Task"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Task Title</Label>
          <div className="relative">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-zinc-900 border-zinc-800 focus:ring-primary pr-10"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-1 top-1 h-7 w-7 text-purple-400 hover:text-purple-300"
              onClick={handleMagicCategorize}
              disabled={isAIThinking}
            >
              <Sparkles className={cn("h-4 w-4", isAIThinking && "animate-pulse")} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Work, Health..."
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800 hover:bg-zinc-800",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button 
          onClick={() => onSubmit({ title, priority, category, dueDate: date?.toISOString() })}
          className="bg-primary hover:bg-primary/90 text-white w-full"
        >
          {initialData ? "Save Changes" : "Create Task"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
