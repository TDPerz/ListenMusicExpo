export const play = async (playBackObj, uri) =>{
    try{
        return await playBackObj.loadAsync({ uri: uri }, { shouldPlay: true })
    }
    catch{
        console.log("Error")
    }
}

export const pause = async playBackObj=>{
    try{
        return await playBackObj.setStatusAsync({ shouldPlay: false })
    }catch{
        console.log("Error")
    }
}

export const resume = async playBackObj=>{
    try{
        return await playBackObj.playAsync()
    }catch{
        console.log("Error")
    }
}

export const playOther = async (playBackObj, uri)=>{
    try{
        await playBackObj.stopAsync()
        await playBackObj.unloadAsync()
        return await play(playBackObj, uri)
    }catch{
        console.log("Error")
    }
}