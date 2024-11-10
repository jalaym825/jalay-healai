import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../UIs/shadcn-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '../UIs/shadcn-ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UIs/shadcn-ui/tabs'
import { Button } from '../UIs/shadcn-ui/button'
import { Badge } from '../UIs/shadcn-ui/badge'
import { Calendar, Clock, User, MapPin, Globe, Phone, Mail, GraduationCap } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UIs/shadcn-ui/table'

// Mock data
const doctorDetails = {
  name: "Dr. Emily Johnson",
  specialty: "Cardiologist",
  location: "New York, USA",
  languages: ["English", "Spanish"],
  phone: "+1 (555) 123-4567",
  email: "emily.johnson@example.com"
}

const pendingAppointments = [
  { id: 1, patientName: "John Doe", date: "2023-07-15", time: "10:00 AM", reason: "Annual Checkup" },
  { id: 2, patientName: "Jane Smith", date: "2023-07-16", time: "2:30 PM", reason: "Follow-up" },
  { id: 3, patientName: "Mike Brown", date: "2023-07-17", time: "11:15 AM", reason: "Consultation" },
]

const completedAppointments = [
  {
    id: 1,
    patientName: "Alice Johnson",
    date: "2023-07-10",
    time: "9:00 AM",
    diagnosis: "Hypertension",
    prescription: "Lisinopril 10mg, once daily"
  },
  {
    id: 2,
    patientName: "Bob Williams",
    date: "2023-07-11",
    time: "3:45 PM",
    diagnosis: "Arrhythmia",
    prescription: "Metoprolol 25mg, twice daily"
  },
  {
    id: 3,
    patientName: "Carol Davis",
    date: "2023-07-12",
    time: "1:30 PM",
    diagnosis: "High Cholesterol",
    prescription: "Atorvastatin 20mg, once daily at bedtime"
  },
]

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <main className="container mx-auto p-4 space-y-6">
        {/* Doctor's Details */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <Avatar className="h-24 w-24 border-2 border-green-500">
              <AvatarImage src="/placeholder-doctor.jpg" alt="Dr. Emily Johnson" />
              <AvatarFallback className="text-green-700 text-2xl">EJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-2xl">{doctorDetails.name}</h2>
              <p className="text-lg text-green-600">{doctorDetails.specialty}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-green-100">Board Certified</Badge>
                <Badge variant="outline" className="bg-green-100">20+ Years Experience</Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{doctorDetails.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Languages</p>
                <p className="text-sm text-muted-foreground">{doctorDetails.languages.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{doctorDetails.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{doctorDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Specialty</p>
                <p className="text-sm text-muted-foreground">Cardiology, Interventional Cardiology</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-muted-foreground">Harvard Medical School</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Availability</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-5PM</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Button size="sm">Start Consultation</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="completed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Prescription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.diagnosis}</TableCell>
                        <TableCell>{appointment.prescription}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 more than yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Consultation Time</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24m</div>
              <p className="text-xs text-muted-foreground">2 minutes less than last week</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}