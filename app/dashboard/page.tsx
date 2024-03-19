"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LogOut,
  Pencil,
  User,
  Trash2,
  MoreHorizontal,
  CheckCheck,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { AuthContextProps } from "@/contexts/auth-context";
import { sliceText } from "@/lib/utils";
import { COLLECTION_ID, DB_ID, database } from "@/lib/appwrite.config";
import { Query, ID, Models } from "appwrite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggler } from "@/components/theme-toggler";

const tags: string[] = ["documentation", "feature", "fix", "bug", "todo"];

const TaskFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  tag: z.string({ required_error: "Tag is required, select" }),
});

const EditFormTaskSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  tag: z.string({ required_error: "Tag is required, select" }),
});

export default function Dashboard() {
  const { user, loading, logoutUser }: AuthContextProps = useAuth();
  const [tasks, setTasks] = useState<Models.Document[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [filteredTasks, setFilteredTasks] = useState<Models.Document[]>([]);
  const [filterText, setFilterText] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
  });

  const editForm = useForm<z.infer<typeof EditFormTaskSchema>>({
    resolver: zodResolver(EditFormTaskSchema),
  });

  const getTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const res: Models.DocumentList<Models.Document> =
        await database.listDocuments(DB_ID, COLLECTION_ID, [
          Query.equal("userId", user?.$id ?? ""),
          Query.orderDesc("$createdAt"),
        ]);
      setTasks(res.documents);
      setTasksLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setTasksLoading(false);
    }
  }, [user?.$id]);

  async function onSubmit(data: z.infer<typeof TaskFormSchema>) {
    const taskSN = Math.floor(Math.random() * 1000);
    try {
      const res: Models.Document = await database.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId: user?.$id,
          username: user?.name,
          title: data.title,
          tag: data.tag,
          completed: false,
          taskSN: `T ${taskSN}`,
        }
      );
      setTasks((prev: Models.Document[]) => [...prev, res]);
      form.reset();
      getTasks();

      toast({
        title: "Success!",
        description: "Task created successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await database.deleteDocument(DB_ID, COLLECTION_ID, id);
      const newTasks: Models.Document[] = tasks.filter(
        (task: Models.Document) => task.$id !== id
      );
      setTasks(newTasks);
      toast({
        title: "Success!",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  const markTaskAsDone = async (id: string) => {
    try {
      await database.updateDocument(DB_ID, COLLECTION_ID, id, {
        completed: true,
      });
      const newTasks: Models.Document[] = tasks.map((task: Models.Document) => {
        if (task.$id === id) {
          return { ...task, completed: true };
        }
        return task;
      });
      setTasks(newTasks);
      toast({
        title: "Success!",
        description: "Task marked as done successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  const markTaskAsUnDone = async (id: string) => {
    try {
      await database.updateDocument(DB_ID, COLLECTION_ID, id, {
        completed: false,
      });
      const newTasks: Models.Document[] = tasks.map((task: Models.Document) => {
        if (task.$id === id) {
          return { ...task, completed: false };
        }
        return task;
      });
      setTasks(newTasks);
      toast({
        title: "Success!",
        description: "Task marked as undone successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  async function editTask(
    data: z.infer<typeof EditFormTaskSchema>,
    id: string
  ) {
    try {
      await database.updateDocument(DB_ID, COLLECTION_ID, id, {
        title: data.title,
        tag: data.tag,
      });
      getTasks();
      toast({
        title: "Success!",
        description: "Task edited successfully",
      });
      editForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      console.log("edited finally");
    }
  }

  const filterTasks = (e: any) => {
    e.preventDefault();

    router.push(`/dashboard?search=${filterText}`);
    const newFilteredTasks = tasks.filter((task) => {
      return task.title.toLowerCase().includes(filterText.toLowerCase());
    });
    setFilteredTasks(newFilteredTasks);
  };

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }

    getTasks();
  }, [user, getTasks]);

  return (
    <main className="container my-10">
      <section className="px-6 py-12 border rounded-lg">
        <div className="flex iems-center justify-between mb-6">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-2xl font-bold leading-none">Welcome back!</h3>
            <p className="text-muted-foreground text-sm">
              Here&apos;s a list of your tasks!
            </p>
          </div>
          <Dialog>
            <DropdownMenu>
              <div className="flex items-center gap-x-6">
                <ThemeToggler />
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://t4.ftcdn.net/jpg/04/62/63/65/360_F_462636502_9cDAYuyVvBY4qYJlHjW7vqar5HYS8h8x.jpg"
                      alt={user?.name}
                      className="text-muted"
                    />
                    <AvatarFallback className="bg-destructive text-white">
                      {sliceText(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent className="w-fit relative right-10">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    disabled={loading}
                    onClick={() => logoutUser()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>My Profile</DialogTitle>
                <DialogDescription>
                  Here&apos;s your profile information
                </DialogDescription>
              </DialogHeader>
              <div>
                <span className="font-semibold tet-base mr-2">Name:</span>
                <span className="text-sm text-muted-foreground">
                  {user?.name}
                </span>
              </div>
              <div>
                <span className="font-semibold tet-base mr-2">Email:</span>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <div>
                <span className="font-semibold tet-base mr-2">
                  Account created on:
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user?.$createdAt ?? "").toDateString()}
                </span>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" variant="destructive">
                    Okay
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between gap-x-2 mb-6">
          <>
            <form onKeyUp={filterTasks}>
              <Input
                type="text"
                placeholder="Filter tasks..."
                value={filterText}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilterText(e.target.value)
                }
              />
            </form>
          </>
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">+ Add</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <DialogHeader className="text-start">
                        <DialogTitle>Add Task</DialogTitle>
                        <DialogDescription>
                          Add a new task to your list
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Task Title" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tag</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a tag" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tags.map((tag: string) => (
                                  <SelectItem key={tag} value={tag}>
                                    {tag}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" variant="destructive">
                          Add Task
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </>
        </div>
        {tasksLoading ? (
          "Loading tasks..."
        ) : (
          <>
            {tasks?.length < 1 ? (
              "No tasks yet"
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Task</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {pathname === `/dashboard` &&
                searchParams.get("search") === `${filterText}` ? (
                  <TableBody>
                    {filteredTasks.map((task: Models.Document) => (
                      <TableRow key={task?.$id}>
                        <TableCell className="font-medium">
                          {task?.taskSN}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{task?.tag}</Badge>
                        </TableCell>
                        <TableCell
                          className={`${
                            task?.completed === true ? "line-through" : ""
                          }`}
                        >
                          {task?.title}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="hover:bg-input rounded cursor-pointer"
                              >
                                <MoreHorizontal className="h-6 w-6 p-1" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-fit relative right-10">
                                <DropdownMenuGroup>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  {task?.completed === false ? (
                                    <DropdownMenuItem
                                      onClick={() => markTaskAsDone(task.$id)}
                                    >
                                      <CheckCheck className="mr-2 h-4 w-4" />
                                      <span>Mark Done</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => markTaskAsUnDone(task.$id)}
                                    >
                                      <CheckCheck className="mr-2 h-4 w-4" />
                                      <span>Mark Undone</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => deleteTask(task.$id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="sm:max-w-[425px]">
                              <Form {...editForm}>
                                <form
                                  onSubmit={editForm.handleSubmit((data) =>
                                    editTask(data, task?.$id)
                                  )}
                                >
                                  <div className="mb-4">
                                    <DialogHeader className="text-start">
                                      <DialogTitle>Edit Task</DialogTitle>
                                      <DialogDescription>
                                        Edit your task here
                                      </DialogDescription>
                                    </DialogHeader>
                                  </div>
                                  <div className="mb-4">
                                    <FormField
                                      control={editForm.control}
                                      name="title"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>New Title</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Task Title"
                                              {...field}
                                            />
                                          </FormControl>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <FormField
                                      control={editForm.control}
                                      name="tag"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Tag</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a tag" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {tags.map((tag: string) => (
                                                <SelectItem
                                                  key={tag}
                                                  value={tag}
                                                >
                                                  {tag}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                      >
                                        Update Task
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    {tasks.map((task: Models.Document) => (
                      <TableRow key={task?.$id}>
                        <TableCell className="font-medium">
                          {task?.taskSN}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{task?.tag}</Badge>
                        </TableCell>
                        <TableCell
                          className={`${
                            task?.completed === true ? "line-through" : ""
                          }`}
                        >
                          {task?.title}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="hover:bg-input rounded cursor-pointer"
                              >
                                <MoreHorizontal className="h-6 w-6 p-1" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-fit relative right-10">
                                <DropdownMenuGroup>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  {task?.completed === false ? (
                                    <DropdownMenuItem
                                      onClick={() => markTaskAsDone(task.$id)}
                                    >
                                      <CheckCheck className="mr-2 h-4 w-4" />
                                      <span>Mark Done</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => markTaskAsUnDone(task.$id)}
                                    >
                                      <CheckCheck className="mr-2 h-4 w-4" />
                                      <span>Mark Undone</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => deleteTask(task.$id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="sm:max-w-[425px]">
                              <Form {...editForm}>
                                <form
                                  onSubmit={editForm.handleSubmit((data) =>
                                    editTask(data, task?.$id)
                                  )}
                                >
                                  <div className="mb-4">
                                    <DialogHeader className="text-start">
                                      <DialogTitle>Edit Task</DialogTitle>
                                      <DialogDescription>
                                        Edit your task here
                                      </DialogDescription>
                                    </DialogHeader>
                                  </div>
                                  <div className="mb-4">
                                    <FormField
                                      control={editForm.control}
                                      name="title"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>New Title</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Task Title"
                                              {...field}
                                            />
                                          </FormControl>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <FormField
                                      control={editForm.control}
                                      name="tag"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Tag</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a tag" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {tags.map((tag: string) => (
                                                <SelectItem
                                                  key={tag}
                                                  value={tag}
                                                >
                                                  {tag}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                      >
                                        Update Task
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            )}
          </>
        )}
      </section>
    </main>
  );
}
