import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface TeamMember {
  name: string;
  role: string;
  duties: string[];
  about: string;
  image?: any;
}

const teamMembers: TeamMember[] = [
  {
    name: "Deniz Semerci",
    role: "Proje Yöneticisi & UX Tasarımcısı",
    duties: [
      "Proje Tasarımı ve süreç takibi",
      "Kullanıcı deneyimi araştırmaları",
      "Arayüz tasarımı ve prototipleme"
    ],
    about: "Kullanıcı odaklı tasarım yaklaşımını benimseyen Deniz, HiSu projesinde kullanıcı deneyimini en üst düzeye çıkarmayı ve kampüs yaşamını dijital ortamda kolaylaştırmayı hedefliyor."
  },
  {
    name: "Özlem Çalışkan",
    role: "Backend Geliştirici",
    duties: [
      "Sistem mimarisi tasarımı",
      "Veritabanı yönetimi",
      "API geliştirme ve optimizasyon"
    ],
    about: "Özlem, güçlü teknik altyapısı ve sistem mimarisi konusundaki deneyimiyle HiSu'nun güvenli, ölçeklenebilir ve performanslı backend sistemlerini geliştiriyor."
  },
  {
    name: "Efe Koyuncu",
    role: "Frontend Geliştirici",
    duties: [
      "Kullanıcı arayüzü geliştirme",
      "Mobil uygulama entegrasyonu",
      "Performans optimizasyonu"
    ],
    about: "Modern web teknolojilerindeki uzmanlığıyla Efe, HiSu'nun kullanıcı dostu ve yenilikçi arayüzünü geliştirerek, öğrencilere kesintisiz bir deneyim sunmayı amaçlıyor."
  }
];

const whyUs = [
  {
    title: "Yenilikçi Teknoloji",
    description: "En güncel teknolojiler ve modern tasarım yaklaşımlarıyla, kampüs yaşamını dijitalleştirerek öğrencilere ve akademisyenlere benzersiz bir deneyim sunuyoruz."
  },
  {
    title: "Kullanıcı Odaklı Yaklaşım",
    description: "Kullanıcı geri bildirimlerini sürekli değerlendirerek, herkesin kolayca kullanabileceği, erişilebilir ve kapsayıcı bir platform geliştiriyoruz."
  },
  {
    title: "Sürekli İyileştirme",
    description: "Düzenli güncellemeler ve yeni özelliklerle uygulamayı sürekli geliştiriyor, değişen ihtiyaçlara hızla adapte oluyoruz."
  }
];

export default function AboutScreen() {
  const handleContact = (type: string) => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:iletisim@hisu.edu.tr');
        break;
      case 'phone':
        Linking.openURL('tel:+902164839000');
        break;
      case 'address':
        Linking.openURL('https://maps.google.com/?q=Sabancı+Üniversitesi+Tuzla+İstanbul');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Hakkımızda</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/sabanci-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>HiSU Nedir?</Text>
          <Text style={styles.description}>
            HiSu, Sabancı Üniversitesi'nin dijital dönüşüm vizyonu doğrultusunda geliştirilen, 
            kampüs yaşamını daha erişilebilir ve interaktif hale getiren yenilikçi bir mobil platformdur.
          </Text>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vizyonumuz</Text>
          <Text style={styles.sectionText}>
            Teknoloji ve inovasyonu eğitim deneyimiyle birleştirerek, öğrencilerin üniversite yaşamını 
            kolaylaştırmak, tercih sürecinden mezuniyete kadar tüm aşamalarda rehberlik etmek ve 
            Sabancı Üniversitesi'nin dijital dönüşümüne öncülük etmektir.
          </Text>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ekibimiz</Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMemberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberImagePlaceholder}>
                  <FontAwesome name="user-circle" size={50} color="#002B5C" />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
              <View style={styles.memberDuties}>
                {member.duties.map((duty, dutyIndex) => (
                  <View key={dutyIndex} style={styles.dutyItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#002B5C" />
                    <Text style={styles.dutyText}>{duty}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.memberAbout}>{member.about}</Text>
            </View>
          ))}
        </View>

        {/* Why Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Neden HiSu?</Text>
          {whyUs.map((item, index) => (
            <View key={index} style={styles.whyUsCard}>
              <Text style={styles.whyUsTitle}>{item.title}</Text>
              <Text style={styles.whyUsDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <Text style={styles.contactText}>Görüş ve önerileriniz için bizimle iletişime geçebilirsiniz.</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={() => handleContact('email')}>
            <Ionicons name="mail-outline" size={24} color="#002B5C" />
            <Text style={styles.contactItemText}>iletisim@hisu.edu.tr</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={() => handleContact('address')}>
            <Ionicons name="location-outline" size={24} color="#002B5C" />
            <Text style={styles.contactItemText}>Sabancı Üniversitesi, Orta Mahalle, Üniversite Caddesi No:27, 34956 Tuzla, İstanbul</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={() => handleContact('phone')}>
            <Ionicons name="call-outline" size={24} color="#002B5C" />
            <Text style={styles.contactItemText}>+90 216 483 90 00</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002B5C',
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#002B5C',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  section: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#002B5C',
    marginBottom: 20,
    textAlign: 'left',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'left',
  },
  teamMemberCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    marginLeft: 15,
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B5C',
    textAlign: 'left',
  },
  memberRole: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    textAlign: 'left',
  },
  memberDuties: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  dutyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dutyText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  memberAbout: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'left',
  },
  whyUsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  whyUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B5C',
    marginBottom: 10,
    textAlign: 'left',
  },
  whyUsDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'left',
  },
  contactSection: {
    backgroundColor: '#F8F9FA',
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'left',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contactItemText: {
    marginLeft: 15,
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
}); 