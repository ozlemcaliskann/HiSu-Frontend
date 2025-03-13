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

export const serviceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Akkol',
    likes: 0,
    hours: '07:30-10:40 (Kahvaltı), 11:30-20:30 (Öğle-Akşam Yemeği)',
    location: 'Üniversite Merkezi',
    phone: '9472-3648-2031',
    hasComments: true,
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
  },
  {
    id: '8',
    name: 'Gift Shop',
    likes: 0,
    hours: '08:30-16:30',
    weekendHours: 'Hafta sonu kapalı',
    location: 'Üniversite Merkezi',
    phone: '2050',
    hasComments: true,
    comments: []
  },
  {
    id: '9',
    name: 'Gürsel Turizm',
    likes: 0,
    hours: '08:30-23:00',
    weekendHours: '08:30-23:00',
    location: 'Shuttle Servis Alanı',
    phone: '9492',
    hasComments: true,
    comments: []
  },
  {
    id: '10',
    name: 'Haberleşme Merkezi',
    likes: 0,
    hours: '08:30-16:50',
    weekendHours: 'Cumartesi: 08:30-15:45, Pazar: Kapalı',
    location: 'Sosyal Hizmetler Binası (D2)',
    phone: '9915',
    hasComments: true,
    comments: []
  },
  {
    id: '11',
    name: 'Homer Kitabevi - Kırtasiye',
    likes: 0,
    hours: '08:30-16:45',
    weekendHours: 'Hafta sonu kapalı',
    location: 'Üniversite Merkezi',
    phone: '9467-9454',
    hasComments: true,
    comments: []
  },
  {
    id: '12',
    name: 'Köpüklü Kahve',
    likes: 0,
    hours: '09:00-02:30',
    weekendHours: '09:00-02:30',
    location: 'Kampüs içi',
    phone: '9942',
    hasComments: true,
    comments: []
  },
  {
    id: '13',
    name: 'Küçük Ev',
    likes: 0,
    hours: '09:00-19:00',
    weekendHours: '11:00-19:00',
    location: 'Üniversite Merkezi',
    phone: '7585',
    hasComments: true,
    comments: []
  },
  {
    id: '14',
    name: 'Piazza Cafe',
    likes: 0,
    hours: '08:00-02:00',
    weekendHours: '14:00-00:00',
    location: 'Kampüs içi',
    phone: '0534 593 48 43',
    hasComments: true,
    comments: []
  },
  {
    id: '15',
    name: 'Pizzabulls',
    likes: 0,
    hours: '11:00-03:00',
    location: 'Shuttle Servis Alanı',
    phone: '7878',
    hasComments: true,
    comments: []
  },
  {
    id: '16',
    name: 'Suclub',
    likes: 0,
    hours: '09:00-16:00',
    weekendHours: 'Hafta sonu kapalı',
    location: 'Üniversite Merkezi',
    phone: '2038',
    hasComments: true,
    comments: []
  },
  {
    id: '17',
    name: 'Sağlık Merkezi',
    likes: 0,
    hours: '08:45-18:00, 19:30-23:30',
    weekendHours: 'Acil: 7/24',
    location: 'Kampüs içi',
    phone: '9923 (Acil: 6666)',
    hasComments: true,
    comments: []
  },
  {
    id: '18',
    name: 'Simit Sarayı',
    likes: 0,
    hours: '08:00-18:00',
    weekendHours: 'Kapalı',
    location: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    phone: '-',
    hasComments: true,
    comments: []
  },
  {
    id: '19',
    name: 'Starbucks',
    likes: 0,
    hours: '07:00-00:00',
    weekendHours: '10:30-19:00',
    location: 'Üniversite Merkezi',
    phone: '3759',
    hasComments: true,
    comments: []
  },
  {
    id: '20',
    name: 'Subway',
    likes: 0,
    hours: '11:00-23:00',
    weekendHours: '11:00-23:00',
    location: 'Shuttle Servis Alanı',
    phone: '0216 568 76 76',
    hasComments: true,
    comments: []
  },
  {
    id: '21',
    name: 'Şok Market',
    likes: 0,
    hours: '08:00-22:00',
    weekendHours: '08:00-22:00',
    location: 'Üniversite Merkezi',
    phone: '9477',
    hasComments: true,
    comments: []
  }
]; 