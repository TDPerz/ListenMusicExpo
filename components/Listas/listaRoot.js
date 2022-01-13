import { createStackNavigator } from '@react-navigation/stack';
import React from 'react-native';

const stackList = createStackNavigator()

export default function ListRoot(){
    return (
        <stackList.Navigator>
            <stackList.Screen name='lista'/>
        </stackList.Navigator>
    )
}