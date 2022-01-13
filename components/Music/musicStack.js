import React from "react";
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import AllMusic from "./allMusic";
import PlayMusic from "../playerMusic/PlayMusic";

const Stack = createStackNavigator()

export default function MusicStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown:false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} initialRouteName="AllMusic">
            <Stack.Screen name="AllMusic" component={AllMusic}/>
            <Stack.Screen name="PlayMusic" component={PlayMusic}/>
        </Stack.Navigator>
    )
}