"use client"

import { useState } from "react"
import { Plus } from "lucide-react";
import { format, getDaysInMonth, startOfMonth, addDays } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface AttendanceDay {
  date: Date
  hours: number
}

interface Employee {
  id: number
  name: string
  contact: string
  address: string
  dailyRate: number
  attendance: {
    [key: string]: AttendanceDay[]
  }
}

const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    contact: "+94 771234567",
    address: "123 Solar Street, Colombo",
    dailyRate: 2000,
    attendance: {
      "2024-02": [
        { date: new Date(2024, 1, 1), hours: 8 },
        { date: new Date(2024, 1, 2), hours: 7 },
      ]
    }
  }
]

const formSchema = z.object({
  name: z.string().nonempty(),
  contact: z.string().min(10),
  address: z.string().min(5),
  dailyRate: z.number().positive(),
  month: z.string(),
  attendance: z.array(z.object({
    date: z.date(),
    hours: z.number().min(0).max(24)
  }))
})

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [search, setSearch] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      address: "",
      dailyRate: 0,
      month: selectedMonth,
      attendance: []
    }
  })

  const generateMonthDays = (month: string) => {
    const [year, monthStr] = month.split("-")
    const date = new Date(parseInt(year), parseInt(monthStr) - 1)
    const daysInMonth = getDaysInMonth(date)
    const firstDay = startOfMonth(date)
    
    return Array.from({ length: daysInMonth }, (_, i) => 
      addDays(firstDay, i)
    )
  }

  const calculateMonthlySalary = (attendance: AttendanceDay[], dailyRate: number) => {
    const totalHours = attendance.reduce((sum, day) => sum + day.hours, 0)
    return (totalHours * dailyRate) / 8 // Assuming 8 hours is a full day
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      name: values.name,
      contact: values.contact,
      address: values.address,
      dailyRate: values.dailyRate,
      attendance: {
        [values.month]: values.attendance
      }
    }
    
    setEmployees([...employees, newEmployee])
    setOpen(false)

    form.reset()
  }

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Employee Attendance</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-auto px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Rate (LKR)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Attendance Record</h3>
                  <div className="overflow-auto max-h-[40vh]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                          <TableHead className="w-1/2">Date</TableHead>
                          <TableHead className="w-1/2">Hours Worked</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateMonthDays(selectedMonth).map((date) => (
                          <TableRow key={date.toISOString()}>
                            <TableCell>{format(date, "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                min="0"
                                max="24"
                                className="w-full"
                                onChange={(e) => {
                                  const hours = parseFloat(e.target.value)
                                  const attendance = form.getValues("attendance")
                                  const newAttendance = [
                                    ...attendance,
                                    { date, hours }
                                  ]
                                  form.setValue("attendance", newAttendance)
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-background pt-4">
                  <Button type="submit" className="w-full">Submit</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(new Date().getFullYear(), i)
              return (
                <SelectItem 
                  key={format(date, "yyyy-MM")} 
                  value={format(date, "yyyy-MM")}
                >
                  {format(date, "MMMM yyyy")}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <CardTitle>{employee.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Contact:</span> {employee.contact}</p>
                <p><span className="font-semibold">Address:</span> {employee.address}</p>
                <p><span className="font-semibold">Daily Rate:</span> LKR {employee.dailyRate}</p>
                {employee.attendance[selectedMonth] && (
                  <>
                    <p><span className="font-semibold">Total Hours:</span> {
                      employee.attendance[selectedMonth].reduce((sum, day) => sum + day.hours, 0)
                    }</p>
                    <p><span className="font-semibold">Monthly Salary:</span> LKR {
                      calculateMonthlySalary(employee.attendance[selectedMonth], employee.dailyRate).toFixed(2)
                    }</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
