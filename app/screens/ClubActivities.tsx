import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Complete club data with all clubs
const ALL_CLUBS_DATA = [
  { id: 1, name: "Airsoft Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 2, name: "Arama ve Kurtarma Kulübü (SUAK)", mail: "club mail", explanation: "explanation" },
  { id: 3, name: "Artelier Güzel Sanatlar Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 4, name: "Astronomi Kulübü (ASTROSU)", mail: "club mail", explanation: "explanation" },
  { id: 5, name: "Atatürkçü Gençlik Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 6, name: "Badminton Kulübü (SUBAD)", mail: "club mail", explanation: "explanation" },
  { id: 7, name: "Bilgisayar Kulübü (CSS)", mail: "club mail", explanation: "explanation" },
  { id: 8, name: "Bilim Kulübü (SUSCI)", mail: "club mail", explanation: "explanation" },
  { id: 9, name: "Binicilik Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 10, name: "Blockchain Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 11, name: "Briç Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 12, name: "Çağdaş Sirk Sanatları Kulübü (SIRKUS)", mail: "club mail", explanation: "explanation" },
  { id: 13, name: "CEO'larla Çay Sohbetleri Kulübü (TEATALKS)", mail: "club mail", explanation: "explanation" },
  { id: 14, name: "Dans Kulübü (SUDANCE)", mail: "club mail", explanation: "explanation" },
  { id: 15, name: "Doğa Sporları Kulübü (SUDOSK)", mail: "club mail", explanation: "explanation" },
  { id: 16, name: "Doğal Yaşamı Koruma Kulübü (SUDOĞA)", mail: "club mail", explanation: "explanation" },
  { id: 17, name: "Düşünce ve Felsefe Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 18, name: "E-Sports Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 19, name: "Edebiyat Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 20, name: "Ekonomi ve İşletme Kulübü (EİK)", mail: "club mail", explanation: "explanation" },
  { id: 21, name: "Endüstri Mühendisliği Kulübü (IES)", mail: "club mail", explanation: "explanation" },
  { id: 22, name: "Endüstriyel ve Uygulamalı Matematik Topluluğu (SIAM)", mail: "club mail", explanation: "explanation" },
  { id: 23, name: "Enerji Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 24, name: "Film Yapımcılık Kulübü (KISSA)", mail: "club mail", explanation: "explanation" },
  { id: 25, name: "Fotoğraf Kulübü (FOKUS)", mail: "club mail", explanation: "explanation" },
  { id: 26, name: "Gastronomi ve Yemek Kulübü (SuGastro)", mail: "club mail", explanation: "explanation" },
  { id: 27, name: "Genç Girişimciler Kulübü (GGK)", mail: "club mail", explanation: "explanation" },
  { id: 28, name: "Go Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 29, name: "Golf Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 30, name: "IEEE Student Branch, Sabancı University", mail: "club mail", explanation: "explanation" },
  { id: 31, name: "International Students Club (SUINT)", mail: "club mail", explanation: "explanation" },
  { id: 32, name: "kAi - Yapay Zeka ve Makine Öğrenmesi Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 33, name: "Kalite Yönetim Sistemleri Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 34, name: "Kaykay ve Paten Kulübü (SUKATE)", mail: "club mail", explanation: "explanation" },
  { id: 35, name: "Kayak Kulübü (SUSNOW)", mail: "club mail", explanation: "explanation" },
  { id: 36, name: "Kürek Kulübü (SUROWING)", mail: "club mail", explanation: "explanation" },
  { id: 37, name: "Kutu Oyunları Kulübü (Pandora)", mail: "club mail", explanation: "explanation" },
  { id: 38, name: "Liberal Arts Club", mail: "club mail", explanation: "explanation" },
  { id: 39, name: "Medya Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 40, name: "Moda Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 41, name: "Model Birleşmiş Milletler (Sabancı MUN)", mail: "club mail", explanation: "explanation" },
  { id: 42, name: "Motor Yarışları Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 43, name: "Motorsport ve Teknolojileri Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 44, name: "Münazara Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 45, name: "Müzik Kulübü (MUZİKUS)", mail: "club mail", explanation: "explanation" },
  { id: 46, name: "Offtown Festival Organizasyon Komitesi", mail: "club mail", explanation: "explanation" },
  { id: 47, name: "Okçuluk Kulübü (SUARCH)", mail: "club mail", explanation: "explanation" },
  { id: 48, name: "Oyun Geliştirme Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 49, name: "Psikoloji Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 50, name: "QTurkey Student Branch - SU", mail: "club mail", explanation: "explanation" },
  { id: 51, name: "Radyo Kulübü (RADYOSU)", mail: "club mail", explanation: "explanation", icon: "https://cdn-icons-png.flaticon.com/512/2619/2619270.png" },
  { id: 52, name: "Robot Kulübü (SURK)", mail: "club mail", explanation: "explanation" },
  { id: 53, name: "Saatçilik Kulübü (SUWATCH)", mail: "club mail", explanation: "explanation" },
  { id: 54, name: "Sağlıklı Yaşam Kulübü (SUWELL)", mail: "club mail", explanation: "explanation" },
  { id: 55, name: "Satranç Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 56, name: "Siber Güvenlik Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 57, name: "Sinema Kulübü (SİNEK)", mail: "club mail", explanation: "explanation" },
  { id: 58, name: "Spor Kulübü (SK)", mail: "club mail", explanation: "explanation", icon: "https://cdn-icons-png.flaticon.com/512/857/857455.png" },
  { id: 59, name: "Su Altı Sporları ve Araştırmaları Kulübü [SUSS]", mail: "club mail", explanation: "explanation" },
  { id: 60, name: "SUminars Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 61, name: "SuTrong (Fitness) Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 62, name: "Tarih Kulübü (RETROSU)", mail: "club mail", explanation: "explanation" },
  { id: 63, name: "Tenis Kulübü", mail: "club mail", explanation: "explanation" },
  { id: 64, name: "Tiyatro Kulübü (ODASU-Oda Tiyatrosu)", mail: "club mail", explanation: "explanation" },
  { id: 65, name: "Tiyatro Kulübü (SUO-SuOyuncuları)", mail: "club mail", explanation: "explanation" },
  { id: 66, name: "Toplumsal Cinsiyet Kulübü (CİNS KULÜP)", mail: "club mail", explanation: "explanation" },
  { id: 67, name: "Türk Japon Kültürel Etkileşim Kulübü (SUTJEK)", mail: "club mail", explanation: "explanation" },
  { id: 68, name: "Ultimate Frisbee Kulübü (Seahawks)", mail: "club mail", explanation: "explanation" },
  { id: 69, name: "Uluslararası İlişkiler, Diplomasi ve Politika Kulübü (IRDP)", mail: "club mail", explanation: "explanation" },
  { id: 70, name: "Vegan Kulüp (VEGANSA)", mail: "club mail", explanation: "explanation" },
  { id: 71, name: "Yelken ve Denizcilik Kulübü (SUSAIL)", mail: "club mail", explanation: "explanation", icon: "https://cdn-icons-png.flaticon.com/512/3437/3437810.png" },
  { id: 72, name: "Yeni Girişliler Kulübü (SUFIRST)", mail: "club mail", explanation: "explanation" },
];

// Club Card Component
interface ClubCardProps {
  name: string;
  icon?: string;
  mail: string;
  explanation: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ name, icon, mail, explanation }) => {
  // Default icon if none is provided
  const defaultIcon = "https://cdn-icons-png.flaticon.com/512/0/527.png"; // Generic organization icon
  
  return (
    <View style={styles.clubCard}>
      <Image 
        source={{ uri: icon || defaultIcon }} 
        style={styles.clubIcon} 
        defaultSource={{ uri: defaultIcon }}
      />
      <View style={styles.clubDetails}>
        <Text style={styles.clubName}>{name}</Text>
        <Text style={styles.clubMail}>{mail}</Text>
        <Text style={styles.clubExplanation}>{explanation}</Text>
      </View>
    </View>
  );
};

// Activity Card Component
interface ActivityCardProps {
  clubName: string;
  activityName: string;
  date: string;
  location: string;
  icon?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ clubName, activityName, date, location, icon }) => {
  // Default icon if none is provided
  const defaultIcon = "https://cdn-icons-png.flaticon.com/512/0/527.png"; // Generic organization icon
  
  return (
    <View style={styles.clubCard}>
      <Image 
        source={{ uri: icon || defaultIcon }} 
        style={styles.clubIcon} 
        defaultSource={{ uri: defaultIcon }}
      />
      <View style={styles.clubDetails}>
        <Text style={styles.clubName}>{clubName}</Text>
        <Text style={styles.activityName}>{activityName}</Text>
        <Text style={styles.activityDetail}>{date}</Text>
        <Text style={styles.activityDetail}>{location}</Text>
      </View>
    </View>
  );
};

// Clubs Screen Component
// Sample activities data
const ACTIVITIES_DATA = [
  { id: 1, clubName: "Airsoft Kulübü", activityName: "Airsoft Training", date: "2023-10-15", location: "Field A", icon: "https://cdn-icons-png.flaticon.com/512/2619/2619270.png" },
  { id: 2, clubName: "Dans Kulübü (SUDANCE)", activityName: "Dance Workshop", date: "2023-10-20", location: "Hall B", icon: "https://cdn-icons-png.flaticon.com/512/857/857455.png" },
  { id: 3, clubName: "Müzik Kulübü (MUZİKUS)", activityName: "Music Jam Session", date: "2023-10-25", location: "Studio C", icon: "https://cdn-icons-png.flaticon.com/512/3437/3437810.png" },
];

const ClubsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [showingActivities, setShowingActivities] = useState(false);
  
  // Filter clubs based on search text
  const filteredClubs = ALL_CLUBS_DATA.filter(club => 
    club.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContent = () => {
    if (showingActivities) {
      // Show activities
      return (
        <>
          <View style={styles.clubsSection}>
            {ACTIVITIES_DATA.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                clubName={activity.clubName}
                activityName={activity.activityName}
                date={activity.date}
                location={activity.location}
                icon={activity.icon}
              />
            ))}
          </View>
        </>
      );
    } else {
      // Show clubs list with search
      return (
        <>
          {/* Search bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search clubs..."
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
          </View>

          <View style={styles.clubsSection}>
            {filteredClubs.map((club) => (
              <ClubCard 
                key={club.id} 
                name={club.name} 
                icon={club.icon}
                mail={club.mail}
                explanation={club.explanation}
              />
            ))}
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            <Text style={styles.hisuText}>HiSU</Text>
          </Text>
          <Text style={styles.appTagline}>app for all of us</Text>
          <Text style={styles.clubsTitle}>Clubs</Text>
        </View>

        <TouchableOpacity 
          style={styles.currentActivitiesButton}
          onPress={() => setShowingActivities(!showingActivities)}
        >
          <Text style={styles.currentActivitiesText}>CURRENT ACTIVITIES</Text>
        </TouchableOpacity>

        {renderContent()}
      </ScrollView>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  hisuText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72', // Dark blue
  },
  appTagline: {
    fontSize: 16,
    color: '#4B7BEC', // Blue for the app tagline
    marginTop: -5,
  },
  clubsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72',
    marginTop: 10,
  },
  currentActivitiesButton: {
    backgroundColor: '#4B7BEC',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  currentActivitiesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  clubsSection: {
    padding: 10,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  clubIcon: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  clubDetails: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002D72',
    marginBottom: 4,
  },
  clubMail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  clubExplanation: {
    fontSize: 16,
    color: '#333',
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 16,
    color: '#333',
  },
});

export default ClubsScreen;