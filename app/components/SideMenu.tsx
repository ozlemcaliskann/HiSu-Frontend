import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/constants/firebase';

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type MenuItem = {
  title: string;
  icon: string;
  route: string;
};

const SideMenu = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  const handleNavigation = (route: "/screens/AboutUs" | "/screens/ProgramInfo" | "/screens/Rankings" | "/screens/Scholarships" | "/screens/ClubActivities" | "/screens/faculties/FASS" | "/screens/faculties/FENS") => {
      router.push(route);
      onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const menuSections: MenuSection[] = [
    {
      title: 'General',
      items: [
        { title: 'About Us', icon: 'information-circle-outline', route: '/screens/AboutUs' },
        { title: 'Program Information', icon: 'school-outline', route: '/screens/ProgramInfo' },
        { title: 'Rankings', icon: 'trophy-outline', route: '/screens/Rankings' },
        { title: 'Scholarships', icon: 'cash-outline', route: '/screens/Scholarships' },
        { title: 'Club Activities', icon: 'people-outline', route: '/screens/ClubActivities' },
      ]
    },
    {
      title: 'Faculties',
      items: [
        { title: 'Faculty of Arts and Social Sciences', icon: 'book-outline', route: '/screens/faculties/FASS' },
        { title: 'Faculty of Engineering and Natural Sciences', icon: 'construct-outline', route: '/screens/faculties/FENS' },
        { title: 'Faculty of Management', icon: 'business-outline', route: '/screens/faculties/FMAN' },
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with User Info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image 
              source={require('@/assets/images/sabanci-logo.png')} 
              style={styles.avatar}
              defaultSource={require('@/assets/images/sabanci-logo.png')}
            />
            <Text style={styles.userName}>
              {auth.currentUser?.displayName || auth.currentUser?.email || 'Student'}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route as "/screens/AboutUs" | "/screens/ProgramInfo" | "/screens/Rankings" | "/screens/Scholarships" | "/screens/ClubActivities" | "/screens/faculties/FASS" | "/screens/faculties/FENS")}
              >
                <Ionicons name={item.icon as any} size={22} color="#007AFF" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Footer with Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8e8e93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SideMenu;