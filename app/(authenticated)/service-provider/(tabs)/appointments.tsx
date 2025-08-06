import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { Calendar, ChevronRight, Clock, User } from "lucide-react-native";
import { useState } from "react";

// Single appointments list with status
const appointments = [
  {
    id: 1,
    date: "24 Oct",
    time: "09:00",
    client: "Mrs/Mrs kay",
    service: "Deep Cleaning",
    status: "upcoming"
  },
  {
    id: 2,
    date: "25 Oct",
    time: "14:30",
    client: "Mr. Johnson",
    service: "Standard Cleaning",
    status: "upcoming"
  },
  {
    id: 3,
    date: "26 Oct",
    time: "11:00",
    client: "Ms. Smith",
    service: "Deep Cleaning",
    status: "upcoming"
  },
  {
    id: 4,
    date: "27 Oct",
    time: "16:00",
    client: "Dr. Williams",
    service: "Move-in Cleaning",
    status: "upcoming"
  },
  {
    id: 5,
    date: "28 Oct",
    time: "10:30",
    client: "Mrs. Davis",
    service: "Standard Cleaning",
    status: "upcoming"
  },
  {
    id: 6,
    date: "20 Oct",
    time: "09:00",
    client: "Mr. Brown",
    service: "Deep Cleaning",
    status: "delivered"
  },
  {
    id: 7,
    date: "19 Oct",
    time: "14:00",
    client: "Ms. Wilson",
    service: "Standard Cleaning",
    status: "delivered"
  },
  {
    id: 8,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered"
  }
];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'delivered'>('upcoming');

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(
    appointment => appointment.status === activeTab
  );

  return (
    <Box className="flex-1 bg-gray-50">
      {/* Header */}
      <Box className="bg-white px-6 py-4 border-b border-gray-100">
       
        <Text className="text-gray-500">
          Manage your cleaning schedules
        </Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          <Pressable
            className={`flex-1 py-4 ${activeTab === 'upcoming' ? 'border-b-2 border-brand-500' : ''}`}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`text-center font-semibold text-base ${activeTab === 'upcoming' ? 'text-brand-500' : 'text-gray-500'}`}>
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 py-4 ${activeTab === 'delivered' ? 'border-b-2 border-brand-500' : ''}`}
            onPress={() => setActiveTab('delivered')}
          >
            <Text className={`text-center font-semibold text-base ${activeTab === 'delivered' ? 'text-brand-500' : 'text-gray-500'}`}>
              Delivered
            </Text>
          </Pressable>
        </Box>
      </Box>

      {/* Appointments List */}
      <Box className="flex-1 px-6 py-6">
        {filteredAppointments.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium">
            {filteredAppointments.length} {activeTab} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </Text>
        )}
        
        {filteredAppointments.map((appointment, index) => (
          <Pressable
            key={appointment.id}
            className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
          >
            <Box className="flex-row items-start justify-between">
              {/* Left side - Client and Service */}
              <Box className="flex-1 mr-4">
                <Box className="flex-row items-center mb-2">
                  <Icon 
                    as={User} 
                    size="sm" 
                    className="text-gray-400 mr-2" 
                  />
                  <Text className="text-base font-semibold text-gray-900">
                    {appointment.client}
                  </Text>
                </Box>
                <Text className="text-sm text-gray-600 ml-6">
                  {appointment.service}
                </Text>
              </Box>

              {/* Right side - Date, Time, and Arrow */}
              <Box className="items-end justify-start">
                <Box className="flex-row items-center mb-1">
                  <Icon 
                    as={Calendar} 
                    size="sm" 
                    className="text-gray-400 mr-1" 
                  />
                  <Text className="text-sm font-medium text-gray-900">
                    {appointment.date}
                  </Text>
                </Box>
                <Box className="flex-row items-center mb-2">
                  <Icon 
                    as={Clock} 
                    size="sm" 
                    className="text-gray-400 mr-1" 
                  />
                  <Text className="text-sm text-gray-600">
                    {appointment.time}
                  </Text>
                </Box>
                <Icon 
                  as={ChevronRight} 
                  size="sm" 
                  className="text-gray-300" 
                />
              </Box>
            </Box>
          </Pressable>
        ))}

        {filteredAppointments.length === 0 && (
          <Box className="flex-1 items-center justify-center py-12">
            <Icon 
              as={Calendar} 
              size="xl" 
              className="text-gray-300 mb-4" 
            />
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No {activeTab} appointments
            </Text>
            <Text className="text-gray-400 text-center">
              {activeTab === 'upcoming' 
                ? 'You don\'t have any upcoming appointments scheduled.' 
                : 'No completed appointments yet.'
              }
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
