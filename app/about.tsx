import React from 'react';
import AboutScreen from './screens/about';
import { Stack } from 'expo-router';

export default function About() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Hakkımızda',
        }}
      />
      <AboutScreen />
    </>
  );
} 