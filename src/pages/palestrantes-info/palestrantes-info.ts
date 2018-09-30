import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the PalestrantesInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-palestrantes-info'
})
@Component({
  selector: 'page-palestrantes-info',
  templateUrl: 'palestrantes-info.html',
})
export class PalestrantesInfoPage {

  palestrante:any = null;
  id = null;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    console.log("palestrante: ", this.palestrante);
    this.getId();
  }

  
  getId(){
    this.id = this.navParams.get("id");
    this.progOn();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }

  progOn(){
    if(this.id != null){
      this.firebaseProvider.refOn("palestrantes/"+this.id).on("value",(prog:any)=>{
        console.log("palestranteOn: ",prog.val());
        this.palestrante = prog.val();
        console.log("palestrante: ",this.palestrante);
      });
    }else{
      this.getId();
    }
  }
  
  ionViewDidLeave(){
    this.firebaseProvider.refOff("palestrantes/"+this.palestrante.id);
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

}
