import React, { Component, createContext } from "react";
import { Text } from "react-native-elements";
import * as MediaLibrary from 'expo-media-library';
import { Alert } from "react-native";

export const AudioContext = createContext()

export class AudioProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            audioFile: [],
            currentPista: { filename: "Alguien xd" },
            playBackObj: null,
            soundObj: null,
            iconStatus: 'stop',
            soundPosition:null,
            soundDuration:null
        }
    }

    permissionAlert = () => {
        Alert.alert("Se Necesitan Permisos", "Se necesitan permiso para accder al audio", [{
            text: "Listo",
            onPress: () => this.getPermission()
        },
        {
            text: "Cancelar",
            onPress: () => this.permissionAlert()
        }
        ])
    }

    getAudioFiles = async () => {
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        })
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount
        })
        this.setState({ ...this.state, audioFile: media.assets })
    }

    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync();
        if (permission.granted) {
            this.getAudioFiles();
        }
        else if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'denied' && canAskAgain) {
                this.permissionAlert()
            }
            if (status === 'granted') {
                this.getAudioFiles()
            }
        }
    }

    componentDidMount() {
        this.getPermission()
    }

    updateState = (prevState, newState = {}) =>{
        this.setState({...prevState, ...newState})
    }

    converTime = (time) => {
        if (time) {
            const hrs = time / 60
            const minute = hrs.toString().split('.')[0]
            const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2))
            const sec = Math.ceil((60 * percent) / 100)
            if (parseInt(minute) < 10 && sec < 10) return `0${minute}:${sec}`
            if (parseInt(minute) < 10) return `0${minute}:${sec}`
            if (sec < 10) return `${minute}:0${sec}`
            return `${minute}:${sec}`
        }
    }

    render() {
        const { audioFile, currentPista, playBackObj, soundObj, iconStatus, soundPosition, soundDuration} = this.state
        return (
            <AudioContext.Provider value={{ audioFile, currentPista, playBackObj, soundObj, iconStatus, updateState: this.updateState, convertTime: this.converTime, soundPosition, soundDuration}}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}

export default AudioProvider