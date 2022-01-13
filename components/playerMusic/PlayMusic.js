import React, { Component, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Button, Image, Animated, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, ListItem, Avatar, Text, Slider } from 'react-native-elements';
import { color } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'
import { AudioContext } from '../context/AudioProvider';
import { pause, resume, playOther } from '../Music/audioControll';

export default class PlayMusic extends Component {

    static contextType = AudioContext

    constructor(props) {
        super(props)
        this.state = {
            time: 0
        }
    }

    handlePlayPauseButton = async () => {
        const { playBackObj, soundObj, updateState } = this.context
        if (soundObj !== null) {
            if (soundObj.isLoaded && soundObj.isPlaying) {
                const status = await pause(playBackObj)
                updateState(this.context, { soundObj: status, iconStatus: "play-arrow" })
            }
            else if (soundObj.isLoaded && !soundObj.isPlaying) {
                const status = await resume(playBackObj)
                updateState(this.context, { soundObj: status, iconStatus: "pause" })
            }
        }
    }

    handleNextButton = async () => {
        const { currentPista, audioFile, playBackObj, soundObj, updateState } = this.context
        var index = audioFile.indexOf(currentPista)
        if (index + 1 < audioFile.length) {
            index += 1
            const status = await playOther(playBackObj, audioFile[index].uri)
            updateState(this.context, { soundObj: status, iconStatus: "pause", currentPista: audioFile[index] })
        }
        else {
            ToastAndroid.show("No hay mas canciones", ToastAndroid.SHORT)
        }
    }

    calculateTieme() {
        if (this.context.soundPosition !== null && this.context.soundDuration !== null) {
            return this.context.soundPosition / this.context.soundDuration
        }
        return 0
    }

    changeSlide = (value) => {
        if (this.context.soundObj.isLoaded) {
            this.context.playBackObj.setPositionAsync(value * this.context.soundDuration)
        }
    }

    handlePrevButton = async () => {
        const { currentPista, audioFile, updateState, playBackObj, soundObj } = this.context
        var index = audioFile.indexOf(currentPista)
        if (index - 1 > 0) {
            index -= 1
            const status = await playOther(playBackObj, audioFile[index].uri)
            updateState(this.context, { soundObj: status, iconStatus: "pause", currentPista: audioFile[index] })
        }
        else {
            ToastAndroid.show("Inicio de la lista", ToastAndroid.SHORT);
        }
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" : (
                    (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds)
        );
    }

    render() {
        return (
            <ImageBackground source={{ uri: "https://www.akamai.com/content/dam/site/im-demo/perceptual-standard.jpg" }} style={{ flex: 1 }} blurRadius={10}>
                <LinearGradient colors={['rgba(0,0,0,0)', "#191919", "#191919", "#191919"]} style={{ flex: 1 }}>
                    <Header
                        statusBarProps={{ barStyle: 'light-content', backgroundColor: 'transparent' }}
                        placement="left"
                        containerStyle={{
                            backgroundColor: 'transparent',
                            height: 90,
                            alignItems: 'center',
                            borderBottomColor: '#191919'
                        }}>
                        <View style={{ marginTop: "2%" }} >
                            <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                                <MaterialIcons name="chevron-left" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: "1%", }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }} numberOfLines={1} >{this.context.currentPista.filename}</Text>
                        </View>
                    </Header>
                    <View style={{ alignItems: 'center', marginTop: "2%" }} >
                        <Image source={{ uri: "https://www.akamai.com/content/dam/site/im-demo/perceptual-standard.jpg" }} style={{ width: 300, height: 300 }} />
                        <Text h2 style={[{ textAlign: 'center', marginTop: 25, marginHorizontal: 5 }, style.text]} numberOfLines={2}>{this.context.currentPista.filename}</Text>
                        <Text style={[style.text]}>Unknow</Text>
                        <Text style={[style.text, { fontSize: 12, width: 100 }]} numberOfLines={1} ellipsizeMode='tail'><MaterialIcons name="library-music" size={12} color="white" />{this.context.currentPista.uri}</Text>
                    </View>
                    <View style={{ marginTop: "5%", alignItems: 'center' }}>
                        <Slider value={this.calculateTieme()} onSlidingComplete={(value) => this.changeSlide(value)} maximumValue={1} minimumValue={0} style={{ width: 300 }} trackStyle={{ color: "#DA0037" }} minimumTrackTintColor="#DA0037" maximumTrackTintColor="#444444" thumbStyle={{ height: 19, width: 19, borderColor: "#EEEEEE", borderWidth: 1 }} />
                        <Text style={[style.text, { fontSize: 14 }]}>{this.millisToMinutesAndSeconds(this.context.soundPosition)} / {this.millisToMinutesAndSeconds(this.context.soundDuration)}</Text>
                    </View>
                    <View style={style.btns_view}>
                        <View style={style.rowFlex}>
                            <TouchableOpacity style={style.arround_btn} onPress={() => { this.handlePrevButton() }}>
                                <MaterialIcons name='skip-previous' size={50} color="#EEEEEE" />
                            </TouchableOpacity>
                            <TouchableOpacity style={style.arround_btn} onPress={() => { this.handlePlayPauseButton() }}>
                                <MaterialIcons name={this.context.iconStatus} size={50} color="#EEEEEE" />
                            </TouchableOpacity>
                            <TouchableOpacity style={style.arround_btn} onPress={() => { this.handleNextButton() }}>
                                <MaterialIcons name="skip-next" size={50} color="#EEEEEE" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <StatusBar style="light" />
                </LinearGradient>
            </ImageBackground>
        )
    }
}

const style = StyleSheet.create({
    text: {
        color: "#EEEEEE"
    },
    btns_view: {
        alignItems: 'center',
        marginTop: "2%"
    },
    rowFlex: {
        flexDirection: 'row'
    },
    arround_btn: {
        marginHorizontal: "2%",
        justifyContent: 'center',
        alignItems: 'center'
    }
})