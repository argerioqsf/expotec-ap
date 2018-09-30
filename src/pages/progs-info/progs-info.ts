import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ModalController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ProgsInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-info'
})
@Component({
  selector: 'page-progs-info',
  templateUrl: 'progs-info.html',
})
export class ProgsInfoPage {
  prog:any = null;
  palestrantes:any = null;
  id = null;
  edit = false;
  locais;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    firebaseProvider.getLocais().then(locais=>{
      this.locais =  locais;
      console.log("id: ", this.navParams.get("id"));
      console.log("locais: ",this.locais);
      this.getId();
    });
  }

  getId(){
    this.id = this.navParams.get("id");
    this.progOn();
  }

  ionViewDidLeave(){
    if(this.edit == false){
      this.firebaseProvider.refOff("prog/"+this.id);
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }

  Trim(vlr) {
    while(vlr.indexOf(" ") != -1){
      vlr = vlr.replace(" ", "");
    }
    return vlr;
  }

  progOn(){
    if(this.id != null){
      this.firebaseProvider.refOff("prog/"+this.id);
      this.firebaseProvider.refOn("prog/"+this.id).on("value",(prog:any)=>{
        console.log("progOn/info: ",prog.val());
        if(prog.val()){
          let horaI = prog.val().horario.split("-");
          let dia = prog.val().dia.split("-");
          for (let k = 0; k < this.locais.length; k++) {
            if(prog.val().local == this.Trim(this.locais[k].local)){
              console.log("cor: ",prog.val().local," - ", this.Trim(this.locais[k].local)," - ", this.locais[k].cor);
              this.prog = prog.val();
              this.prog.horario = horaI[0] + " - " + horaI[1];
              this.prog.dia = dia[0] + "/" + dia[1] + "/" + dia[2];
              this.prog.cor = this.locais[k].cor;
              console.log(this.locais[k].local + " prog: ",this.prog);
              break;
            }
          }
          this.palestrantesOn();
        }else{
          this.prog = [];
        }
      });
    }else{
      this.getId();
    }
  }

  palestrantesOn(){
    if(this.prog.palestrantes.length > 0){
      this.palestrantes = [];
      for (let i = 0; i < this.prog.palestrantes.length; i++) {
          this.firebaseProvider.refOn("palestrantes/"+this.prog.palestrantes[i]).once("value",(palestrante:any)=>{
            if(palestrante.val()){
              this.palestrantes.push(palestrante.val());
            }
          });
          if (i == this.prog.palestrantes.length - 1) {
            if (!(this.palestrantes.length > 0)) {
              this.palestrantes = [];
            }
          }
      }
    }
  }

  infoPalestrantes(palestrante){
    console.log("palestrante: ",palestrante);
    this.edit = true;
    let modal = this.modalCtrl.create("page-palestrantes-info",{id:palestrante.id});
    modal.onDidDismiss(data => {
      this.edit = false;
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
    });
    modal.present();
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

}
