import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the PalestrantesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'palestrantes'
})
@Component({
  selector: 'page-palestrantes',
  templateUrl: 'palestrantes.html',
})
export class PalestrantesPage {
  palestrantes = null;
  palestrantesSnap = [];
  egg = false;
  options:NativeTransitionOptions;
  imageEgg = "assets/images/newUser-b.png";
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode,
              private nativePageTransitions: NativePageTransitions) {
              this.palestrantesOn();
              this.egg = firebaseProvider.GetEgg1("egg11");
              this.platform.registerBackButtonAction(() => {
                if(!this.viewCtrl.enableBack()) { 
                  this.backgroundMode.moveToBackground();
                }else{
                    this.navCtrl.pop();
                } 
              });
  }

  sideMenu(){
    this.menuCtrl.open();
  }

  Egg(){
    this.imageEgg = "https://www.invertexto.com/barcodes/5bac89b242935.png";
  }

  

  ionViewWillLeave() {

    this.options = {
       direction: 'up',
       duration: 500,
       slowdownfactor: 3,
       slidePixels: 20,
       iosdelay: 100,
       androiddelay: 400,
       fixedPixelsTop: 0,
       fixedPixelsBottom: 60
      };
   
    this.nativePageTransitions.slide(this.options).then(sucesso=>{
      console.log("sucesso nativePageTransitions");
    }).catch(error=>{
      console.log("erro nativePageTransitions");
    });
   
   }

  palestrantesOn(){
      this.firebaseProvider.refOff("palestrantes/");
      this.firebaseProvider.refOn("palestrantes/").orderByChild('nome').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        this.palestrantesSnap = progSnap;
        this.ProgOrder();
      });
  }

  info(palestrante){
    console.log("palestrante: ",palestrante);
    this.nativePageTransitions.drawer(this.options);
    let modal = this.modalCtrl.create("page-palestrantes-info",{id:palestrante.id});
    modal.onDidDismiss(data => {
      this.platform.registerBackButtonAction(() => {
        if(!this.viewCtrl.enableBack()) { 
          this.backgroundMode.moveToBackground();
        }else{
            this.navCtrl.pop();
        } 
      });
    });
    modal.present();
  }

  ProgOrder(){
        console.log("palestrantesSnap: ",this.palestrantesSnap);
        this.firebaseProvider.TransformList(this.palestrantesSnap).then((palestrantes:any)=>{
          this.palestrantes = palestrantes;
        });
  }
}
