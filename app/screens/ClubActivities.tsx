import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, onAuthStateChanged } from '@/constants/firebase'; // Import from your firebase file

// Set this to your actual computer's IP address when testing on a physical device
const LOCAL_IP = '10.51.13.177'; // Change this to your computer's actual IP

// API Configuration with multiple fallback URLs to try
const API_URLS = [
  'http://10.0.2.2:8080',        // Android emulator 
  'http://localhost:8080',       // iOS simulator
  'http://127.0.0.1:8080',       // Alternative localhost
  `http://${LOCAL_IP}:8080`,     // Your computer's actual IP address
];

let API_BASE_URL = API_URLS[0];

// Function to check network connectivity
const checkNetworkInfo = async () => {
  try {
    console.log('Checking network info...');
    
    // Check if we can reach a public website
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const googleResponse = await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Internet connectivity test:', googleResponse.ok ? 'Success' : 'Failed');
    } catch (err) {
      if (err instanceof Error) {
        console.log('Internet connectivity test: Failed', err.message);
      } else {
        console.log('Internet connectivity test: Failed', 'Unknown error');
      }
    }
    
    // Log the URLs being tested
    console.log('Your API URLs being tested:');
    API_URLS.forEach(url => console.log(`- ${url}`));
    
    console.log('If the above URLs don\'t work, try using your computer\'s actual IP address');
    console.log('You can find your IP by running "ipconfig" (Windows) or "ifconfig" (Mac/Linux)');
  } catch (err) {
    console.error('Error checking network:', err);
  }
};

// Try each base URL until one works with enhanced debugging
const testApiConnection = async () => {
  const currentUser = auth.currentUser;
  let token = null;
  
  console.log('Starting API connection test');
  console.log('Current user:', currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in');
  
  if (currentUser) {
    try {
      token = await currentUser.getIdToken();
      console.log('Firebase token obtained successfully');
    } catch (err) {
      console.error('Error getting Firebase token:', err);
    }
  } else {
    console.warn('No user logged in, authentication will likely fail');
  }
  
  for (const baseUrl of API_URLS) {
    console.log(`Testing connection to: ${baseUrl}/api/clubs`);
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added to request');
    } else {
      console.warn('No auth token available for request');
    }
    
    try {
      // Add timeout to avoid hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      console.log('Sending fetch request with headers:', headers);
      
      const response = await fetch(`${baseUrl}/api/clubs`, { 
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response from ${baseUrl}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()])
      });
      
      if (response.ok) {
        console.log(`Connection successful with ${baseUrl}`);
        return baseUrl;
      } else {
        // Try to read response body for more details
        try {
          const errorText = await response.text();
          console.error(`Error response from ${baseUrl}:`, errorText);
        } catch (bodyErr) {
          console.error(`Could not read error response body:`, bodyErr);
        }
      }
    } catch (err) {
      console.error(`Failed with URL ${baseUrl}:`, err);
      if (err instanceof Error) {
        console.error('Error name:', err.name || 'Unknown error type');
      } else {
        console.error('Error name: Unknown error type');
      }
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      } else {
        console.error('Error message: Unknown error type');
      }
      if (err instanceof Error && err.stack) {
        console.error('Error stack:', err.stack);
      }
    }
  }
  
  console.error('All connection attempts failed - no working URL found');
  throw new Error('All connection attempts failed');
};

// Enhanced fetch with Firebase authentication
const enhancedFetch = async (url: string, options: Record<string, any> = {}) => {
  console.log(`Fetching: ${url}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  try {
    // Get Firebase token
    const currentUser = auth.currentUser;
    let authHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    console.log('REQUEST HEADERS:', JSON.stringify(authHeaders));
    
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true); // Force refresh token
        authHeaders = {
          ...authHeaders,
          'Authorization': `Bearer ${token}`
        };
        console.log('Using auth token in request (first 20 chars):', token.substring(0, 20) + '...');
      } catch (tokenError) {
        console.error('Error getting ID token:', tokenError);
      }
    } else {
      console.warn('No user logged in, request will fail authentication');
    }
    
    const response = await fetch(url, {
      ...options,
      headers: authHeaders,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}: ${errorText || response.statusText}`);
      
      if (response.status === 403) {
        // Try to refresh token and retry once
        if (currentUser && !options.isRetry) {
          console.log('Auth failed, trying to refresh token and retry...');
          await currentUser.getIdToken(true); // Force refresh token
          return enhancedFetch(url, { ...options, isRetry: true });
        } else {
          throw new Error('Authentication failed. Please log out and log in again.');
        }
      }
      
      throw new Error(`${response.status} ${response.statusText}: ${errorText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

// API Service for Clubs with better error handling
const clubsApi = {
  // Get all clubs
  getClubs: async () => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/api/clubs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
  },
  
  // Get club by ID
  getClubById: async (id: string) => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/api/clubs/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching club details:', error);
      throw error;
    }
  },
  
  // Get clubs by category
  getClubsByCategory: async (category: string) => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/api/clubs/category/${category}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching clubs by category:', error);
      throw error;
    }
  },
};

// Activity API with better error handling
const activitiesApi = {
  // Get all activities
  getAllActivities: async () => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/api/activities`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },
  
  // Get activities for a specific club
  getClubActivities: async (clubId: string) => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/api/clubs/${clubId}/activities`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching activities for club ${clubId}:`, error);
      throw error;
    }
  }
};

// Define fallback data for testing when API fails
const FALLBACK_CLUBS_DATA = [
  { id: 1, name: "Airsoft Kulübü", mail: "airsoft@example.com", explanation: "Club for airsoft enthusiasts" },
  { id: 2, name: "Arama ve Kurtarma Kulübü (SUAK)", mail: "rescue@example.com", explanation: "Search and rescue club" },
  { id: 3, name: "Dans Kulübü (SUDANCE)", mail: "dance@example.com", explanation: "Dance club for all styles" },
];

const FALLBACK_ACTIVITIES_DATA = {
  1: [
    { id: 1, clubId: 1, clubName: "Airsoft Kulübü", activityName: "Airsoft Training", date: "2023-10-15", location: "Field A", icon: "https://cdn-icons-png.flaticon.com/512/2619/2619270.png" },
    { id: 3, clubId: 1, clubName: "Airsoft Kulübü", activityName: "Tactical Workshop", date: "2023-11-05", location: "Meeting Room 3", icon: "https://cdn-icons-png.flaticon.com/512/2619/2619270.png" }
  ],
  2: [
    { id: 4, clubId: 2, clubName: "Arama ve Kurtarma Kulübü (SUAK)", activityName: "First Aid Training", date: "2023-10-22", location: "Health Center", icon: "https://cdn-icons-png.flaticon.com/512/3125/3125392.png" }
  ],
  3: [
    { id: 2, clubId: 3, clubName: "Dans Kulübü (SUDANCE)", activityName: "Dance Workshop", date: "2023-10-20", location: "Hall B", icon: "https://cdn-icons-png.flaticon.com/512/857/857455.png" }
  ]
};

// Club Card Component - removed edit/delete buttons and added View Activities button
type ClubCardProps = {
  id: string;
  name: string;
  icon?: string;
  mail: string;
  explanation: string;
  onViewActivities: (id: string, name: string) => void;
};

const ClubCard: React.FC<ClubCardProps> = ({ id, name, icon, mail, explanation, onViewActivities }) => {
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
        
        {/* View Activities button */}
        <TouchableOpacity 
          style={styles.viewActivitiesButton}
          onPress={() => onViewActivities(id, name)}
        >
          <Text style={styles.buttonText}>View Activities</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Activity Card Component
type ActivityCardProps = {
  clubName: string;
  activityName: string;
  date: string;
  location: string;
  icon?: string;
};

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
const ClubsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [viewingActivities, setViewingActivities] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [selectedClubName, setSelectedClubName] = useState('');
  const [apiInitialized, setApiInitialized] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);
  
  type Club = {
    id: number;
    name: string;
    mail: string;
    explanation: string;
    icon?: string; // Added optional icon property
  };
  
  const [clubs, setClubs] = useState<Club[]>([]);
  type Activity = {
    id: number;
    clubId: number;
    clubName: string;
    activityName: string;
    date: string;
    location: string;
    icon: string;
  };
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'No user logged in');
      setUser(user ? { email: user.email || '' } : null);
      setAuthInitialized(true);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Initialize API connection
  const initApi = async () => {
    if (!authInitialized) {
      console.log('Auth not yet initialized, waiting...');
      return;
    }
    
    console.log('initApi called, auth initialized');
    
    try {
      // First check network
      await checkNetworkInfo();
      
      console.log('Attempting to find working API URL...');
      API_BASE_URL = await testApiConnection();
      console.log('Successfully connected to API at:', API_BASE_URL);
      setApiInitialized(true);
      setConnectionError(false);
    } catch (error) {
      console.error('Failed to initialize API connection:', error);
      console.error('All available endpoints failed to connect');
      setConnectionError(true);
      // Use fallback data for demo purposes
      setClubs(FALLBACK_CLUBS_DATA);
      setLoading(false);
    }
  };
  
  // Only initialize API after auth is initialized
  useEffect(() => {
    if (authInitialized) {
      console.log('Auth initialized, attempting API connection');
      initApi();
    }
  }, [authInitialized]);
  
  // Fetch clubs when API is initialized
  useEffect(() => {
    if (apiInitialized) {
      console.log('API initialized, fetching clubs');
      fetchClubs();
    } else if (authInitialized) {
      // Critical fix: If API initialization failed but auth is initialized, use fallback data
      if (connectionError) {
        console.log('Using fallback data due to connection error');
        setClubs(FALLBACK_CLUBS_DATA);
        setLoading(false);
      }
    }
  }, [apiInitialized, connectionError, authInitialized]);
  
  // Fetch all clubs
  const fetchClubs = async () => {
    if (connectionError) {
      console.log('In offline mode, using fallback data');
      setClubs(FALLBACK_CLUBS_DATA);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching clubs from API');
      const data = await clubsApi.getClubs();
      console.log('Clubs fetched successfully:', data.length);
      setClubs(data);
      setError(null);
    } catch (err) {
      console.error('Error in fetchClubs:', err);
      setError('Failed to load clubs. Please try again.');
      // Use fallback data for demo purposes
      setClubs(FALLBACK_CLUBS_DATA);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch activities for a specific club
  const fetchClubActivities = async (clubId: string) => {
    setLoading(true);
    
    if (connectionError) {
      console.log('In offline mode, using fallback activities data');
      // Get club activities from fallback data
      const clubActivities = FALLBACK_ACTIVITIES_DATA[Number(clubId) as keyof typeof FALLBACK_ACTIVITIES_DATA] || [];
      setActivities(clubActivities);
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Fetching activities for club ${clubId}`);
      const data = await activitiesApi.getClubActivities(clubId);
      console.log('Club activities fetched successfully:', data.length);
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching activities for club ${clubId}:`, err);
      setError('Failed to load activities. Please try again.');
      // Use fallback data for this club
      const clubActivities = FALLBACK_ACTIVITIES_DATA[Number(clubId) as keyof typeof FALLBACK_ACTIVITIES_DATA] || [];
      setActivities(clubActivities);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all activities (for the global activities view)
  const fetchAllActivities = async () => {
    if (connectionError) {
      console.log('In offline mode, using fallback activities data');
      // Combine all activities from fallback data
      const allActivities = Object.values(FALLBACK_ACTIVITIES_DATA).flat();
      setActivities(allActivities);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching all activities');
      const data = await activitiesApi.getAllActivities();
      console.log('All activities fetched successfully:', data.length);
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching all activities:', err);
      setError('Failed to load activities. Please try again.');
      // Combine all activities from fallback data
      const allActivities = Object.values(FALLBACK_ACTIVITIES_DATA).flat();
      setActivities(allActivities);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle viewing a club's activities
  const handleViewActivities = (clubId: string, clubName: string) => {
    setSelectedClubId(clubId);
    setSelectedClubName(clubName);
    setViewingActivities(true);
    fetchClubActivities(clubId);
  };
  
  // Filter clubs based on search text
  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show connection error banner
  const renderConnectionBanner = () => {
    if (connectionError) {
      return (
        <View style={styles.connectionErrorBanner}>
          <Text style={styles.connectionErrorText}>
            {user 
              ? "Running in offline mode with demo data. API connection failed." 
              : "Please log in to access your clubs and activities."}
          </Text>
          <TouchableOpacity 
            style={styles.retryConnectionButton}
            onPress={async () => {
              if (!user) {
                Alert.alert("Authentication Required", "You need to log in first");
                return;
              }
              
              try {
                setLoading(true);
                API_BASE_URL = await testApiConnection();
                setApiInitialized(true);
                setConnectionError(false);
                fetchClubs();
              } catch (error) {
                setConnectionError(true);
                setLoading(false);
              }
            }}
          >
            <Text style={styles.retryButtonText}>
              {user ? "Retry Connection" : "Log In"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Debug info section
  const renderDebugSection = () => {
    if (!debugModeEnabled) return null;
    
    return (
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Information</Text>
        <Text>Auth Initialized: {authInitialized ? 'Yes' : 'No'}</Text>
        <Text>User Logged In: {user ? 'Yes' : 'No'}</Text>
        <Text>User Email: {user?.email || 'None'}</Text>
        <Text>API Initialized: {apiInitialized ? 'Yes' : 'No'}</Text>
        <Text>Connection Error: {connectionError ? 'Yes' : 'No'}</Text>
        <Text>Clubs Count: {clubs.length}</Text>
        <Text>API URL: {API_BASE_URL}</Text>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => {
            checkNetworkInfo();
            Alert.alert("Debug", "Check console for network information");
          }}
        >
          <Text style={styles.debugButtonText}>Check Network</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => {
            setClubs(FALLBACK_CLUBS_DATA);
            Alert.alert("Debug", "Loaded fallback clubs data");
          }}
        >
          <Text style={styles.debugButtonText}>Load Fallback Data</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={initApi}
        >
          <Text style={styles.debugButtonText}>Reinitialize API</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Content rendering
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color="#4B7BEC" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
    
    if (error && !connectionError) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={viewingActivities 
              ? (selectedClubId ? () => fetchClubActivities(selectedClubId) : fetchAllActivities) 
              : fetchClubs}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (viewingActivities) {
      // Show activities for selected club or all activities
      if (activities.length === 0) {
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.noDataText}>
              {selectedClubId 
                ? `No activities found for ${selectedClubName}` 
                : "No activities found"}
            </Text>
          </View>
        );
      }
      
      return (
        <View style={styles.clubsSection}>
          {activities.map((activity) => (
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
      );
    } else {
      // Show clubs list with search
      if (filteredClubs.length === 0) {
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.noDataText}>
              {searchText ? 'No clubs match your search' : 'No clubs found'}
            </Text>
          </View>
        );
      }
      
      return (
        <View style={styles.clubsSection}>
          {filteredClubs.map((club) => (
            <ClubCard 
              key={club.id} 
              id={String(club.id)}
              name={club.name} 
              icon={club.icon}
              mail={club.mail}
              explanation={club.explanation}
              onViewActivities={handleViewActivities}
            />
          ))}
        </View>
      );
    }
  };

  // User info display
  const renderUserInfo = () => {
    if (user) {
      return (
        <View style={styles.userInfoBanner}>
          <Text style={styles.userInfoText}>
            Logged in as: {user.email}
          </Text>
        </View>
      );
    }
    return null;
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
          
          {/* Debug mode toggle */}
          <TouchableOpacity 
            style={{position: 'absolute', top: 0, right: 0, padding: 20}}
            onPress={() => {
              setDebugModeEnabled(!debugModeEnabled);
            }}
          >
            <Text style={{color: debugModeEnabled ? '#ff3b30' : 'transparent'}}>
              {debugModeEnabled ? 'Debug Mode' : '.'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderUserInfo()}
        {renderConnectionBanner()}
        {renderDebugSection()}

        {/* Navigation between clubs and activities */}
        {viewingActivities ? (
          <View>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setViewingActivities(false);
                setSelectedClubId(null);
                setSelectedClubName('');
              }}
            >
              <Text style={styles.backButtonText}>← Back to Clubs</Text>
            </TouchableOpacity>
            {selectedClubId && (
              <Text style={styles.activityHeaderText}>{selectedClubName} Activities</Text>
            )}
            {!selectedClubId && (
              <Text style={styles.activityHeaderText}>All Club Activities</Text>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.allActivitiesButton}
            onPress={() => {
              setViewingActivities(true);
              setSelectedClubId(null);
              setSelectedClubName('');
              fetchAllActivities();
            }}
          >
            <Text style={styles.allActivitiesText}>VIEW ALL ACTIVITIES</Text>
          </TouchableOpacity>
        )}

        {/* Search bar only for clubs view */}
        {!viewingActivities && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search clubs..."
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
          </View>
        )}

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
  userInfoBanner: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  userInfoText: {
    color: '#0050b3',
    fontSize: 14,
    textAlign: 'center',
  },
  connectionErrorBanner: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  connectionErrorText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryConnectionButton: {
    backgroundColor: '#856404',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#4B7BEC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002D72',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  allActivitiesButton: {
    backgroundColor: '#4B7BEC',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  allActivitiesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewActivitiesButton: {
    backgroundColor: '#4B7BEC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
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
    marginBottom: 8,
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
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#4B7BEC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  debugButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  debugButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClubsScreen;