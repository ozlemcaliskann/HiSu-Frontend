import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  const { bottom } = useSafeAreaInsets();
  let tabHeight = 0;
  
  try {
    // Eğer Tab Navigator içindeyse bu fonksiyon çalışacak, değilse hata fırlatacak
    tabHeight = useBottomTabBarHeight();
  } catch (error) {
    // Tab Navigator içinde değilsek sabit bir değer kullanabiliriz
    tabHeight = bottom + 49; // iOS tab bar standart yüksekliği
  }
  
  return tabHeight - bottom;
}
