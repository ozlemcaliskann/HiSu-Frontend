export interface ServiceProvider {
  id: string;
  name: string;
  likes: number;
  hours: string;
  weekendHours?: string;
  location: string;
  phone: string;
  hasComments?: boolean;
  comments?: Comment[];
  coordinates?: { x: number, y: number };
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

// Tüm servis sağlayıcıların tam listesi - backend bağlantısı olmazsa bura kullanılacak
export const serviceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Akkol',
    likes: 0,
    hours: '07:30-10:40 (Kahvaltı), 11:30-20:30 (Öğle-Akşam Yemeği)',
    location: 'Üniversite Merkezi',
    phone: '9472-3648-2031',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8910633, y: 29.3800095 }
  },
  {
    id: '2',
    name: 'Akbank',
    likes: 0,
    hours: '08:30-12:30, 13:00-16:30',
    weekendHours: 'Hafta sonu kapalı',
    location: 'Üniversite Merkezi',
    phone: '9461, 9449, 2042',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8918737, y: 29.3796166 }
  },
  {
    id: '3',
    name: 'Coffy',
    likes: 0,
    hours: '07:30-23:00',
    weekendHours: '09:30-18:00',
    location: 'Bilgi Merkezi',
    phone: '7879',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8903156, y: 29.3773989 }
  },
  {
    id: '4',
    name: 'Copy Center - Merkom',
    likes: 0,
    hours: '08:30-16:45',
    weekendHours: 'Pazar günleri açık',
    location: 'Üniversite Merkezi',
    phone: '9460',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8914187, y: 29.3798939 }
  },
  {
    id: '5',
    name: 'Espressolab',
    likes: 0,
    hours: '09:00-24:30',
    weekendHours: '14:00-23:30',
    location: 'Kampüs içi',
    phone: '4328-4335',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8914583, y: 29.3814643 }
  },
  {
    id: '6',
    name: 'Era Kuaför',
    likes: 0,
    hours: '08:30-19:00',
    weekendHours: 'Cumartesi: 08:30-17:00, Pazar: Kapalı',
    location: 'Satınalma ve Destek Hizmetler',
    phone: '9913',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8918512, y: 29.3829297 }
  },
  {
    id: '7',
    name: 'Fasshane',
    likes: 0,
    hours: '08:00-16:00',
    weekendHours: '09:00-17:00',
    location: 'Sanat ve Sosyal Bilimler Fakültesi',
    phone: '3090',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8904792, y: 29.3785660 }
  },
  {
    id: '8',
    name: 'Haberleşme Merkezi',
    likes: 0,
    hours: '08:30-16:50',
    weekendHours: 'Cumartesi: 08:30-15:45, Pazar: Kapalı',
    location: 'Sosyal Hizmetler Binası (D2)',
    phone: '9915',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8918701, y: 29.3825625 }
  },
  {
    id: '9',
    name: 'Köpüklü Kahve',
    likes: 0,
    hours: '09:00-02:30',
    weekendHours: '09:00-02:30',
    location: 'Kampüs içi',
    phone: '9942',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8917212, y: 29.3816610 }
  },
  {
    id: '10',
    name: 'Küçük Ev',
    likes: 0,
    hours: '09:00-19:00',
    weekendHours: '11:00-19:00',
    location: 'Üniversite Merkezi',
    phone: '7585',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8910446, y: 29.3802500 }
  },
  {
    id: '11',
    name: 'Piazza Cafe',
    likes: 0,
    hours: '08:00-02:00',
    weekendHours: '14:00-00:00',
    location: 'Kampüs içi',
    phone: '0534 593 48 43',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8919671, y: 29.3813932 }
  },
  {
    id: '12',
    name: 'Pizzabulls',
    likes: 0,
    hours: '11:00-03:00',
    location: 'Shuttle Servis Alanı',
    phone: '7878',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8887403, y: 29.3786923 }
  },
  {
    id: '13',
    name: 'Suclub',
    likes: 0,
    hours: '09:00-16:00',
    weekendHours: 'Hafta sonu kapalı',
    location: 'Üniversite Merkezi',
    phone: '2038',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8914353, y: 29.3799357 }
  },
  {
    id: '14',
    name: 'Kampüs Sağlık Merkezi',
    likes: 2,
    hours: '08:45-18:00, 19:30-23:30',
    weekendHours: 'Acil 7/24',
    location: 'Kampüs içi',
    phone: '9923-Emergency 6666',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8917984, y: 29.3827121 }
  },
  {
    id: '15',
    name: 'Simit Sarayı',
    likes: 0,
    hours: '08:00-18:00',
    weekendHours: 'Kapalı',
    location: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    phone: 'Belirtilmemiş',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8906440, y: 29.3791800 }
  },
  {
    id: '16',
    name: 'Starbucks',
    likes: 0,
    hours: '07:00-00:00',
    weekendHours: '10:30-19:00',
    location: 'Üniversite Merkezi',
    phone: '3759',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8915388, y: 29.3800904 }
  },
  {
    id: '17',
    name: 'Subway',
    likes: 0,
    hours: '11:00-23:00',
    location: 'Shuttle Servis Alanı',
    phone: '0216 568 76 76',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8887930, y: 29.3787098 }
  },
  {
    id: '18',
    name: 'Şok Market',
    likes: 0,
    hours: '08:00-22:00',
    weekendHours: '10:00-22:00',
    location: 'Üniversite Merkezi',
    phone: 'Belirtilmemiş',
    hasComments: true,
    comments: [],
    coordinates: { x: 40.8920577, y: 29.3795941 }
  },
  {
    id: '19',
    name: 'SU Kütüphane',
    likes: 2,
    hours: '08:30-23:00',
    weekendHours: '10:00-22:00',
    location: 'Bilgi Merkezi',
    phone: '9430-9431',
    hasComments: true,
    comments: []
  },
  {
    id: '20',
    name: 'Kampüs Spor Tesisleri',
    likes: 2,
    hours: '08:00-22:00',
    weekendHours: '10:00-20:00',
    location: 'Spor Merkezi',
    phone: '9450',
    hasComments: true,
    comments: []
  }
];

// Export default for expo-router
export default serviceProviders; 