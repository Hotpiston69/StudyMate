import { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PaperProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F6FF"
      />

      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8F6FF' },
          }}
        />

        {showSplash && (
          <View style={styles.splash}>
            <Image
              source={require('../../assets/images/studymate-splash.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
