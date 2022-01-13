import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-ionicons';
import { BackgroundImage } from 'react-native-elements/dist/config';

export default function Musiccomponet({ pista, iconState, stopMusic, navegar, prevSong, nextSong}) {
    const [statePlay, setStatePlay] = useState("play-arrow");
    const onPress = () => {
        stopMusic()
    }
    return (
        <View style={[style.cont]}>
            <ImageBackground onPress={navegar} source={{uri: "https://www.akamai.com/content/dam/site/im-demo/perceptual-standard.jpg"}} blurRadius={10} resizeMode="cover" style={style.cont}>
                <View style={{ marginHorizontal: 10 }}>
                    <Avatar size="large" title="C" avatarStyle={{ borderRadius: 20, borderColor: "#DA0037",borderWidth:1 }} source={{ uri: "https://www.akamai.com/content/dam/site/im-demo/perceptual-standard.jpg" }} />
                </View>
                <View style={{width:"45%"}}>
                    <Text onPress={navegar} style={{ fontSize: 18, width:"100%"}} numberOfLines={1} ellipsizeMode='tail'>{pista.filename}</Text>
                    <Text>Desconocido</Text>
                </View>
                <View style={style.btns_view}>
                    <TouchableOpacity style={style.arround_btn} onPress={nextSong}>
                        <MaterialIcons name="skip-next" size={25} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.arround_btn} onPress={onPress}>
                        <MaterialIcons name={iconState} size={25} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.arround_btn} onPress={prevSong}>
                        <MaterialIcons name='skip-previous' size={25} color="black" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const style = StyleSheet.create({
    cont: {
        color: 'white',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 75,
        width: '100%',
    },
    btns_view: {
        flex: 1,
        flexDirection: 'row-reverse',
        marginLeft: 25,
        flexWrap: 'wrap'
    }
    ,
    arround_btn: {
        borderRadius: 100,
        marginHorizontal: 2,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(237, 237, 237, 0.5)'
    },

})