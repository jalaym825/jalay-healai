'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../UIs/shadcn-ui/card";
import { Progress } from "../UIs/shadcn-ui/progress";
import { Avatar, AvatarFallback } from '../UIs/shadcn-ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UIs/shadcn-ui/tabs'
import { Button } from '../UIs/shadcn-ui/button'
import { Textarea } from '../UIs/shadcn-ui/textarea'
import { Badge } from '../UIs/shadcn-ui/badge'
import { Activity, Calendar, Clock, Phone, User, Star, Heart, Weight, Ruler } from 'lucide-react'
import Global from '@/Utils/Global';

export default function Component() {
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [prescription, setPrescription] = useState([]);

  // const appointments = [
  //   { id: 1, date: '2023-06-15', doctor: 'Dr. Smith', symptoms: 'Headache, Fever', prescription: 'Paracetamol 500mg' },
  //   { id: 2, date: '2023-07-01', doctor: 'Dr. Johnson', symptoms: 'Cough, Sore throat', prescription: 'Amoxicillin 250mg' },
  // ]

  useEffect(() => {
    (async () => {
      const appointmentResponse = await Global.httpGet("/appointment/getAppointment?status=past");
      const upcomingAppointmentResponse = await Global.httpGet("/appointment/getAppointment?status=upcoming");
      const prescriptionResponse = await Global.httpGet("/prescription/getPrescription");
      setAppointments(appointmentResponse.data);
      setUpcomingAppointments(upcomingAppointmentResponse.data);
      console.log(appointmentResponse.data)
      setPrescription(prescriptionResponse.data[0].Prescription_Medicine);
    })();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}

      <div className="container mx-auto p-4 space-y-6">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 bg-green-100">
              <AvatarFallback className="text-green-700"><img src="https://png.pngtree.com/png-clipart/20231001/original/pngtree-3d-illustration-avatar-profile-man-png-image_13026634.png" alt="" /></AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-xl">{Global.user.firstName}</h2>
              {/* <p className="text-sm text-muted-foreground">Patient ID: #123456</p> */}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm text-muted-foreground">32 years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Blood Group</p>
                <p className="text-sm text-muted-foreground">O+</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Weight</p>
                <p className="text-sm text-muted-foreground">70 kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Height</p>
                <p className="text-sm text-muted-foreground">175 cm</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Blood Pressure</p>
                <p className="text-sm text-muted-foreground">120/80 mmHg</p>
              </div>
            </div> */}
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Emergency Contact</p>
                <p className="text-sm text-muted-foreground">Jane Doe: +1 234-567-8900</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="previous">
              <TabsList>
                <TabsTrigger value="previous">Previous</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
              <TabsContent value="previous">
                {appointments.length === 0 ? (
                  <p>No Past Appointments!</p>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="mb-4 p-4 border rounded-lg">
                      <div className="flex justify-start items-center mb-2">
                        <span className="font-semibold">{appointment.doctor}</span>
                        <Badge variant="outline">
                          {appointment.time.split("T")[1].slice(0, 5)} {appointment.time.split("T")[0]}
                        </Badge>
                      </div>
                      <p><strong>Doctor:</strong> {appointment.hosted_by_user.firstName} {appointment.hosted_by_user.lastName} </p>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="upcoming">
                {upcomingAppointments.length === 0 ? (
                  <p>No Upcoming Appointments!</p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="mb-4 p-4 border rounded-lg">
                      <div className="flex justify-start items-center mb-2">
                        <span className="font-semibold">{appointment.doctor}</span>
                        <Badge variant="outline">
                          {appointment.time.split("T")[1].slice(0, 5)} {appointment.time.split("T")[0]}
                        </Badge>
                      </div>
                      <p><strong>Doctor:</strong> {appointment.hosted_by_user.firstName} {appointment.hosted_by_user.lastName} </p>
                    </div>
                  ))
                )}
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>

        {/* Medication Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medication Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {
              prescription
                .map((data, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-3 mt-5">
                    <div className="bg-green-50 p-4 rounded-lg  border border-green-700">
                      <h3 className="font-semibold mb-2 text-green-700">{data.time}</h3>
                      <ul className="space-y-2">
                        <li className="text-sm">• {data.medicine.name} x {data.quantity}</li>
                      </ul>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Health Scores */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Health</span>
                  <span className="text-sm font-medium">80%</span>
                </div>
                <Progress value={80} className="bg-green-100" indicatorClassName="bg-green-600" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Physical Activity</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="bg-green-100" indicatorClassName="bg-green-600" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Mental Wellness</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="bg-green-100" indicatorClassName="bg-green-600" />
              </div>
            </CardContent>
          </Card> */}

          {/* Current Conditions */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                <div>
                  <p className="font-medium">Mild Hypertension</p>
                  <p className="text-sm text-muted-foreground">Diagnosed: Jan 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Seasonal Allergies</p>
                  <p className="text-sm text-muted-foreground">Diagnosed: Mar 2024</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Recent Activities */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Blood Pressure Check</p>
                  <p className="text-sm text-muted-foreground">Yesterday - Normal Range</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Medication Refill</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Virtual Consultation</p>
                  <p className="text-sm text-muted-foreground">3 days ago - Dr. Smith</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Feedback Section
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feedback</CardTitle>
            <CardDescription>Share your experience with your doctor and our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className={`p-0 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setRating(star)}
                    >
                      <Star className="h-6 w-6" />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Your feedback</label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Submit Feedback</Button>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  )
}
