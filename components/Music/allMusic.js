import React, { Component, useState } from 'react';
import { useFonts } from "expo-font";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, ListItem, Avatar } from 'react-native-elements';
import Musiccomponet from '../Music-Component/music-component'
import AudioProvider, { AudioContext } from '../context/AudioProvider';
import { Audio } from 'expo-av';
import { pause, play, playOther, resume } from './audioControll';


export default class AllMusic extends Component {

    static contextType = AudioContext

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    converTime = (time) => {
        var minutes = Math.floor(time / 60);;
        var seconds = (time - minutes * 60).toFixed(0)
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" : (
                    (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds)
        );
    }

    openMenu = () => {
        this.props.navigation.openDrawer();
    }

    onPlayBackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.context.updateState(this.context, { soundPosition: playbackStatus.positionMillis, soundDuration: playbackStatus.durationMillis })
        }
        if (playbackStatus.didJustFinish) {
            this.context.updateState(this.context, { iconStatus: 'stop' })
            const { audioFile, updateState } = this.context
            var index = audioFile.indexOf(this.context.currentPista)
            if (index + 1 < audioFile.length) {
                index += 1
                const status = await playOther(this.context.playBackObj, audioFile[index].uri)
                updateState(this.context, { soundObj: status, iconStatus: "pause", currentPista: audioFile[index]})
            }
            else {
                ToastAndroid.show("No hay mas canciones", ToastAndroid.SHORT)
            }
        }
    }

    handleAudioPress = async (item) => {
        const { currentPista, playBackObj, soundObj, updateState } = this.context
        if (soundObj === null) {
            const playBackObj = new Audio.Sound()
            const status = await play(playBackObj, item.uri)
            updateState(this.context, { playBackObj: playBackObj, soundObj: status, iconStatus: "pause", currentPista: item })
            playBackObj.setOnPlaybackStatusUpdate(this.onPlayBackStatusUpdate)
        }
        else if (soundObj.isLoaded && soundObj.isPlaying && currentPista.id === item.id) {
            const status = await pause(playBackObj)
            updateState(this.context, { soundObj: status, iconStatus: "play-arrow" })
        }
        else if (soundObj.isLoaded && !soundObj.isPlaying && currentPista.id === item.id) {
            const status = await resume(playBackObj)
            updateState(this.context, { soundObj: status, iconStatus: "pause" })
        }
        else if (soundObj.isLoaded && currentPista.id != item.id) {
            const status = await playOther(playBackObj, item.uri)
            updateState(this.context, { soundObj: status, iconStatus: "pause", currentPista: item })
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

    handleNextButton = async (item) => {
        const { audioFile } = this.context
        var index = audioFile.indexOf(item)
        if (index + 1 < audioFile.length) {
            index += 1
            this.handleAudioPress(audioFile[index])
        }
        else {
            ToastAndroid.show("No hay mas canciones", ToastAndroid.SHORT)
        }
    }

    handlePrevButton = async (item) => {
        const { audioFile } = this.context
        var index = audioFile.indexOf(item)
        if (index - 1 > 0) {
            index -= 1
            this.handleAudioPress(audioFile[index])
        }
        else {
            ToastAndroid.show("Inicio de la lista", ToastAndroid.SHORT);
        }
    }

    getElement = (item) => {
        this.setState({ ... this.state, currentPista: item })
        this.handleAudioPress(item)
    }

    renderMyItems = (item) => {
        return (
            <ListItem containerStyle={style.itemList} key={item.id} bottomDivider onPress={() => this.getElement(item)}>
                <Avatar source={{ uri: "https://www.akamai.com/content/dam/site/im-demo/perceptual-standard.jpg" }} avatarStyle={{ borderRadius: 10 }} size="medium" />
                <ListItem.Content>
                    <ListItem.Title style={[style.textColor, style.titleText]}>{item.filename}</ListItem.Title>
                    <ListItem.Subtitle style={[style.textColor, style.artistText]}>{this.converTime(item.duration)}</ListItem.Subtitle>
                </ListItem.Content>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={25} color="#EEEEEE" />
                    </TouchableOpacity>
                </View>
            </ListItem>
        )
    }

    render() {
        return (
            <View style={{ backgroundColor: "#191919", flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'light-content', backgroundColor: '#171717' }}
                    placement="left"
                    containerStyle={{
                        backgroundColor: '#171717',
                        height: 95,
                        alignItems: 'center',
                        borderBottomColor: '#191919'
                    }}>
                    <View style={{ marginTop: 5 }} >
                        <TouchableOpacity onPress={this.openMenu}>
                            <MaterialIcons name="menu" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 7 }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Musica</Text>
                    </View>
                </Header>
                <Text style={{ color: 'white' }}>Todas las canciones</Text>
                <ScrollView>
                    {
                        this.context.audioFile.map((item) => this.renderMyItems(item))
                    }
                </ScrollView>
                <Musiccomponet pista={this.context.currentPista} navegar={() => { this.props.navigation.navigate('PlayMusic') }} iconState={this.context.iconStatus} stopMusic={() => this.handlePlayPauseButton()} nextSong={() => { this.handleNextButton(this.context.currentPista) }} prevSong={() => { this.handlePrevButton(this.context.currentPista) }} />
            </View>
        )
    }
}

const style = StyleSheet.create({
    itemList: {
        backgroundColor: "#191919",
        borderBottomColor: '#DA0037',
        color: "#EEEEEE"
    },
    titleText: {
        fontSize: 18
    },
    artistText: {
        fontSize: 10
    },
    textColor: {
        color: "#EEEEEE"
    }
})