import FixedScreen from '@/lib/components/screens/FixedScreen';
import { Avatar, AvatarImage } from '@/lib/components/ui/avatar';
import { Box } from '@/lib/components/ui/box';
import { HStack } from '@/lib/components/ui/hstack';
import { Icon } from '@/lib/components/ui/icon';
import { Pressable } from '@/lib/components/ui/pressable';
import { Text } from '@/lib/components/ui/text';
import { VStack } from '@/lib/components/ui/vstack';
import { router } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react-native';

type RoutePath =
  | '/account/profile'
  | '/account/services'
  | '/account/support'
  | '/account/appointments'
  | '/account/payment'
  | '/account/settings';

const menuItems: { icon: any; label: string; route: RoutePath }[] = [
  {
    icon: User,
    label: 'Profile',
    route: '/account/profile',
  },
  {
    icon: LayoutDashboard,
    label: 'Services',
    route: '/account/services',
  },
  {
    icon: MessageSquare,
    label: 'Customer Support',
    route: '/account/support',
  },
  {
    icon: Calendar,
    label: 'My Appointments',
    route: '/account/appointments',
  },
  {
    icon: CreditCard,
    label: 'Payment method',
    route: '/account/payment',
  },
  {
    icon: Settings,
    label: 'Settings',
    route: '/account/settings',
  },
];

export default function AccountScreen() {
  return (
    <FixedScreen addTopInset={true}>
      <Box className="flex-1">
        <VStack className="items-center mb-6 gap-3">
          <Avatar
            size="xl"
            className="rounded-full active:opacity-60 overflow-hidden"
          >
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80',
              }}
              alt="Profile Image"
            />
            {/* <AvatarFallbackText>Profile Image</AvatarFallbackText> */}
          </Avatar>
          <Text className="text-xl font-bold text-blue-800">
            Mr/Mrs Kay
          </Text>
        </VStack>

        <VStack className="gap-4">
          {menuItems.map((item, index) => (
            <Pressable key={item.label} onPress={() => router.push(item.route)}>
              <HStack
                className={`justify-between items-center py-3 px-2 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <HStack className="gap-4 items-center">
                  <Icon as={item.icon} className="text-blue-800" size="xl" />
                  <Text className="text-base text-blue-800">{item.label}</Text>
                </HStack>
                <Icon as={ChevronRight} className="text-gray-400" size="xl" />
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </FixedScreen>
    
  );
}
