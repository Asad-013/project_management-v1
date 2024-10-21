'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Folder, CheckSquare, Trash2, Edit, Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Project = {
  id: number;
  name: string;
  description: string;
  tasks: number;
  completed: number;
  createdAt: Date;
}

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate: Date;
}

export function Page() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Website Redesign', description: 'Overhaul of company website', tasks: 5, completed: 2, createdAt: new Date('2023-01-15') },
    { id: 2, name: 'Mobile App Development', description: 'New app for customer engagement', tasks: 8, completed: 3, createdAt: new Date('2023-02-01') },
    { id: 3, name: 'Marketing Campaign', description: 'Q2 product launch campaign', tasks: 4, completed: 1, createdAt: new Date('2023-03-10') },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design homepage', description: 'Create wireframes and mockups', project: 'Website Redesign', status: 'In Progress', dueDate: new Date('2023-04-30') },
    { id: 2, title: 'Implement user authentication', description: 'Set up secure login system', project: 'Mobile App Development', status: 'Completed', dueDate: new Date('2023-05-15') },
    { id: 3, title: 'Create social media content', description: 'Design graphics and write copy', project: 'Marketing Campaign', status: 'Not Started', dueDate: new Date('2023-06-01') },
  ])

  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [newTask, setNewTask] = useState({ title: '', description: '', project: '', status: 'Not Started', dueDate: new Date() })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterProject, setFilterProject] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('dueDate')

  const addProject = () => {
    if (newProject.name.trim()) {
      setProjects([...projects, { 
        id: Date.now(), 
        name: newProject.name, 
        description: newProject.description,
        tasks: 0, 
        completed: 0,
        createdAt: new Date()
      }])
      setNewProject({ name: '', description: '' })
    }
  }

  const updateProject = () => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p))
      setEditingProject(null)
    }
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id))
    setTasks(tasks.filter(t => t.project !== projects.find(p => p.id === id)?.name))
  }

  const addTask = () => {
    if (newTask.title.trim() && newTask.project) {
      setTasks([...tasks, { ...newTask, id: Date.now() }])
      setNewTask({ title: '', description: '', project: '', status: 'Not Started', dueDate: new Date() })
      updateProjectTaskCount(newTask.project, 1)
    }
  }

  const updateTask = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t))
      setEditingTask(null)
    }
  }

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id)
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== id))
      updateProjectTaskCount(taskToDelete.project, -1)
    }
  }

  const updateProjectTaskCount = (projectName: string, change: number) => {
    setProjects(projects.map(p => 
      p.name === projectName 
        ? { ...p, tasks: p.tasks + change } 
        : p
    ))
  }

  const filteredTasks = tasks.filter(task => 
    filterProject === 'All' || task.project === filterProject
  ).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.getTime() - b.dueDate.getTime()
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Project Management Dashboard</h1>
        
        <Tabs defaultValue="projects" className="bg-white rounded-lg shadow-lg">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {project.name}
                      <div>
                        <Button variant="ghost" size="icon" onClick={() => setEditingProject(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      <Folder className="inline-block mr-2" />
                      {project.tasks} tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{project.description}</p>
                    <progress 
                      value={project.completed} 
                      max={project.tasks} 
                      className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary transition-all"
                    />
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Created: {project.createdAt.toLocaleDateString()}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>Create a new project here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input 
                      id="name" 
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addProject}>Save Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value="tasks" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {task.title}
                      <div>
                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{task.project}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'default'}>
                        {task.status}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due: {task.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <CheckSquare className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new task here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input 
                      id="title" 
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="taskDescription" className="text-right">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project" className="text-right">Project</Label>
                    <Select 
                      value={newTask.project} 
                      onValueChange={(value) => setNewTask({...newTask, project: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select 
                      value={newTask.status} 
                      onValueChange={(value: 'Not Started' | 'In Progress' | 'Completed') => setNewTask({...newTask, status: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select  a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date"
                      value={newTask.dueDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addTask}>Save Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Make changes to your project here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">Name</Label>
                <Input 
                  id="editName" 
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDescription" className="text-right">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateProject}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Make changes to your task here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTitle" className="text-right">Title</Label>
                <Input 
                  id="editTitle" 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTaskDescription" className="text-right">Description</Label>
                <Textarea
                  id="editTaskDescription"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProject" className="text-right">Project</Label>
                <Select 
                  value={editingTask.project} 
                  onValueChange={(value) => setEditingTask({...editingTask, project: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">Status</Label>
                <Select 
                  value={editingTask.status} 
                  onValueChange={(value: 'Not Started' | 'In Progress' | 'Completed') => setEditingTask({...editingTask, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDueDate" className="text-right">Due Date</Label>
                <Input 
                  id="editDueDate" 
                  type="date"
                  value={editingTask.dueDate.toISOString().split('T')[0]}
                  onChange={(e) => setEditingTask({...editingTask, dueDate: new Date(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateTask}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}