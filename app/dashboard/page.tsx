import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer wil be ijfkvfivv  vdvimdkvdknvsd dnjdnvd d",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function Dashboard() {
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
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
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
                  <DropdownMenuItem>
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
                <span className="text-sm text-muted-foreground">Johndoe</span>
              </div>
              <div>
                <span className="font-semibold tet-base mr-2">Email:</span>
                <span className="text-sm text-muted-foreground">
                  Johndoe@gmail.com
                </span>
              </div>
              <div>
                <span className="font-semibold tet-base mr-2">
                  Member since:
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toDateString()}
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <form>
              <Input type="text" placeholder="Filter tasks..." />
            </form>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">+ Add</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <div>
                  <DialogHeader className="text-start">
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your list
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div>
                  <Label htmlFor="title" className="block mb-4">
                    Title
                  </Label>
                  <Input id="title" name="title" placeholder="Task title" />
                </div>
                <div>
                  <Label htmlFor="tag" className="block mb-4">
                    Tag
                  </Label>
                  <Select name="tag" id="tag">
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tags</SelectLabel>
                        <SelectItem value="documentation">
                          Documentation
                        </SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="fix">Fix</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="todo">Todo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button type="submit" variant="destructive">
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Task</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>
                  <Badge>{invoice.paymentStatus}</Badge>
                </TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
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
                          <DropdownMenuItem>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            <span>Mark Done</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent className="sm:max-w-[425px]">
                      <div>
                        <DialogHeader className="text-start">
                          <DialogTitle>Edit Task</DialogTitle>
                          <DialogDescription>
                            Edit your task here
                          </DialogDescription>
                        </DialogHeader>
                      </div>
                      <div>
                        <Label htmlFor="title" className="block mb-4">
                          Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tag" className="block mb-4">
                          Tag
                        </Label>
                        <Select name="tag" id="tag">
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select a tag" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tags</SelectLabel>
                              <SelectItem value="documentation">
                                Documentation
                              </SelectItem>
                              <SelectItem value="feature">Feature</SelectItem>
                              <SelectItem value="fix">Fix</SelectItem>
                              <SelectItem value="bug">Bug</SelectItem>
                              <SelectItem value="todo">Todo</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <DialogFooter>
                        <Button type="submit" variant="destructive">
                          Update Task
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
