import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerGestureContext } from '@react-navigation/drawer';
import AllMusic from '../Music/allMusic';
import PlayMusic from '../playerMusic/PlayMusic';
import MusicStack from '../Music/musicStack';

const Drawer = createDrawerNavigator();

export default function Root(){
    return (
        <NavigationContainer>
            <Drawer.Navigator screenOptions={{headerShown:false, drawerContentStyle:{backgroundColor: '#191919'}}} >
                <Drawer.Screen name="Music" component={MusicStack}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}