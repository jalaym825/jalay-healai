import { useEffect, useState } from 'react';
import { Button } from '../../UIs/shadcn-ui/button'
import { Card, CardContent, CardHeader } from '../../UIs/shadcn-ui/card';
import { Mail, Phone, User, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '../../UIs/shadcn-ui/badge';
import Global from '@/Utils/Global';
import healthLoader from '../../assets/healthLoader.json';
import { LottieAnimation } from '@/Components/Lottie/LottieAnimation';

const BookAppointment = () => {

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [nextAvailableTime, setNextAvailableTime] = useState('');
  // const [amount, setAmount] = useState(0);



  const bookAppointment = async (id) => {
    if(Global.user.subscription === "FREE") {
        alert("Please upgrade to premium subscription to book an appointment");
        return;
    }
    const { meeting_id } = await Global.httpPost('/appointment/createAppointment', {
      time: new Date(nextAvailableTime),
      hosted_by: id,
      attended_by: Global.user.email
    })
    window.location.href = 'meetings/' + meeting_id;
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      setLoading(true);
      try {
        const response = await Global.httpGet('/appointment/getAvailableDoctors');
        setAvailableDoctors(response.data.availableDoctors);
        setNextAvailableTime(response.data.nextAvailableTime);
        console.log("Response received:", response);
      } catch (error) {
        console.error('Error fetching available doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full justify-center items-center">
        <div className="w-[25vw] h-[25vh]">
          <LottieAnimation animationData={healthLoader} loop={true} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl font-dm-sans mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-t-2xl">
        <h1 className="text-2xl font-semibold mb-2">Book Your Appointment</h1>
        <p className="text-teal-50">Select your preferred doctor, date, and time for the consultation</p>
      </div>

      {/* Main Content */}
      <div className='bg-white grid grid-cols-3 gap-3 mt-3 h-[400px]'>
        {
          availableDoctors && availableDoctors.map((doctor, index) => (
            <Card key={index} className="max-w-md h-[300px] bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-1 pt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">{doctor.firstName}</h2>
                    <p className="text-teal-100 text-sm">{doctor.specialization}</p>
                  </div>
                  <Badge className="bg-teal-200 text-teal-900 hover:bg-teal-300 text-xs">
                    ⭐ {doctor.rating}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Experience and Next Available Time */}
                <div className="flex justify-between items-center bg-white/10 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-200" />
                    <div>
                      <p className="text-xs text-teal-100">Next Available</p>
                      <p className="text-sm font-semibold">{nextAvailableTime}</p>
                    </div>
                  </div>
                  <div className="border-l border-white/20 pl-2">
                    <p className="text-xs text-teal-100">Experience</p>
                    <p className="text-sm font-semibold">{doctor.experience}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-teal-200" />
                  <div>
                    <p className="text-xs text-teal-100">Email</p>
                    <p className="text-sm font-semibold truncate">{doctor.email}</p>
                  </div>
                </div>


                {/* Book Appointment Button */}
                <Button
                  className="w-full bg-white text-teal-700 hover:bg-teal-50 font-semibold py-2 flex items-center justify-center gap-2"
                  onClick={() => bookAppointment(doctor.email)}
                >
                  Book Appointment
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        }

      </div>
    </div>
  );
};

export default BookAppointment;
