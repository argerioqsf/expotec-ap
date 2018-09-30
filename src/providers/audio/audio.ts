import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { Platform } from 'ionic-angular';

/*
  KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
  KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
  TU É O ESPERTÃO NÉ? MAS BOA IDEIA KKKKKKK
*/
@Injectable()
export class AudioProvider {

  audioType: string = 'html5';
    sounds: any = [];

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    
    if(platform.is('cordova')){
      this.audioType = 'native';
    }
  }

  preload(key, asset) {
 
    if(this.audioType === 'html5'){

        let audio = {
            key: key,
            asset: asset,
            type: 'html5'
        };

        this.sounds.push(audio);

    } else {

        this.nativeAudio.preloadComplex(key, asset,1,1,100);

        let audio = {
            key: key,
            asset: key,
            type: 'native'
        };

        this.sounds.push(audio);
    }      

}

play(key){

console.log("play");

    let audio = this.sounds.find((sound) => {
        return sound.key === key;
    });

    if(audio.type === 'html5'){

        let audioAsset = new Audio(audio.asset);
        audioAsset.play();
        audioAsset.loop = false;

    } else {
  
   this.nativeAudio.play(audio.asset).then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });

    }

}

stop(key){
     
//console.log("stop");

    let audio = this.sounds.find((sound) => {
        return sound.key === key;
    });

//console.log("key,",audio.key);

    if(audio.type === 'html5'){
        
  //console.log("html5");
  //console.log("asset,",audio.asset);
        let audioAsset = new Audio(audio.asset);
  //audioAsset.loop = false;
        audioAsset.pause();
  //console.log("loop,",audioAsset.loop);

    } else {

        this.nativeAudio.stop(audio.asset).then((res) => {
            //console.log(res);
        }, (err) => {
            //console.log(err);
        });
  

    }

}

}
