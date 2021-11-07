/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import SQLite from 'react-native-sqlite-storage';
import Navigation from './navigation';
import {NativeBaseProvider} from 'native-base';

export const db = SQLite.openDatabase(
  {
    name: 'bbb',
    location: 'default',
  },
  () => {
    return console.log('success');
  },
  error => console.log('error', error),
);

const App = () => {
  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
};

export default App;
