import { useState, useMemo } from "react";
import { useCollection } from "@/lib/db";
import { TodoCard } from "@/components/todo/TodoCard";
import { TodoForm } from "@/components/todo/TodoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, LayoutGrid, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const Index = () => {
  const { data: todos, insert, update, remove } = useCollection<any>("todos");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTodos = useMemo(() => {
    return todos
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" ? true : filter === "completed" ? t.completed : !t.completed;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return (priorityScore[b.priority as keyof typeof priorityScore] || 0) - (priorityScore[a.priority as keyof typeof priorityScore] || 0);
      });
  }, [todos, search, filter]);

  const handleCreate = (data: any) => {
    insert({ 
      id: crypto.randomUUID(), 
      ...data, 
      completed: false, 
      createdAt: new Date().toISOString() 
    });
    setIsCreateOpen(false);
    toast.success("Task added to your list");
  };

  const handleUpdate = (data: any) => {
    update(editingTodo.id, data);
    setEditingTodo(null);
    toast.success("Task updated");
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-primary/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                ZenTask
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                You have {stats.pending} tasks left for today.
              </p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full h-12 px-6 bg-white text-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <TodoForm onSubmit={handleCreate} />
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total", value: stats.total, icon: LayoutGrid, color: "text-zinc-400" },
              { label: "Pending", value: stats.pending, icon: Circle, color: "text-amber-400" },
              { label: "Done", value: stats.completed, icon: CheckCircle2, color: "text-emerald-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl backdrop-blur-md">
                <stat.icon className={cn("h-4 w-4 mb-2", stat.color)} />
                <div className="text-xl font-semibold">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 focus:ring-primary/50"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
            <TabsList className="bg-zinc-900/50 border border-zinc-800 h-11 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 px-4">All</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-zinc-800 px-4">Active</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-zinc-800 px-4">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoCard 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={(id) => update(id, { completed: !todo.completed })}
                  onDelete={remove}
                  onEdit={setEditingTodo}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4">
                  <Sparkles className="h-8 w-8 text-zinc-700" />
                </div>
                <h3 className="text-zinc-400 font-medium">No tasks found</h3>
                <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters or search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={(open) => !open && setEditingTodo(null)}>
        {editingTodo && <TodoForm initialData={editingTodo} onSubmit={handleUpdate} />}
      </Dialog>
    </div>
  );
};

export default Index;
