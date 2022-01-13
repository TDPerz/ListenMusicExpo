import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AudioProvider from './components/context/AudioProvider';
import Root from './components/Roots/Roots';

export default function App() {
  return (
    <View style={styles.container}>
      <AudioProvider>
        <Root style={{ backgroundColor: "#191919" }} />
      </AudioProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919"
  },
});
