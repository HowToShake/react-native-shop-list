import * as React from 'react';
import Main from "../screens/Main";
import { NavigationContainer } from '@react-navigation/native';
import List from "../screens/List";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Settings from '../screens/Settings';

const Stack = createNativeStackNavigator();


export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
                <Stack.Screen name="List" component={List} options={{ title: 'Products' }} />
                <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
