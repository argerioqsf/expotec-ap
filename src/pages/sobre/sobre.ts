import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the SobrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-sobre'
})
@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html',
})
export class SobrePage {
  desc = "";
  subtitulo = "";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menuCtrl: MenuController,
              private firebaseProvider: FirebaseProvider) {
  firebaseProvider.refOn("config/sobre/desc").on("value",desc=>{
    this.desc = desc.val();
  });
  
  firebaseProvider.refOn("config/sobre/subtitulo").on("value",subtitulo=>{
    this.subtitulo = subtitulo.val();
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SobrePage');
  }

  sideMenu(){
    this.menuCtrl.open();
  }

  redeSocial(RS){
    window.open(RS, '_system', 'location=no');
  }

}
