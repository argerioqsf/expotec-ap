import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-mapa'
})
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  public swipe: number = 0;
  torto = {'transform':'rotate(0deg)'};
  direction;
  egg1 = false;
  easterEgg = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menuCtrl: MenuController,
              private firebaseProvider: FirebaseProvider) {
  this.firebaseProvider.refOn("egg/status").on("value",(cont:any)=>{
    this.easterEgg = cont.val();
    console.log("easterEgg status: ",this.easterEgg);
  });
}



  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }

  sideMenu(){
    this.menuCtrl.open();
  }

  swipeEvent(event) {
    if(this.easterEgg){
      console.log('event.direction: ',event.direction);
      if(event.direction === 4) {
        this.direction = event.direction;
        this.torto = {'transform':'rotate(20deg)'};
      }
      if(event.direction === 2) {
        this.direction = event.direction;
        this.torto = {'transform':'rotate(0deg)'};
      }
    }
  }
}
