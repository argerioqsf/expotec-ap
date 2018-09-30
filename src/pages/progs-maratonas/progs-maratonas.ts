import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the ProgsMaratonasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-progs-maratonas'
})
@Component({
  selector: 'page-progs-maratonas',
  templateUrl: 'progs-maratonas.html',
})
export class ProgsMaratonasPage {

  progs = null;
  filtro = "Todos";
  progSnap = [];
  locais;
  egg1 = false;
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode) {
              firebaseProvider.getLocais().then(locais=>{
                this.egg1 = firebaseProvider.GetEgg1("egg11");
                this.locais =  locais;
                this.progOn();
                console.log("locais: ", this.locais);
              });
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

  Filtro() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Filtro');

    for (let i = 0; i < this.locais.length; i++) {
      if(this.locais[i].local != "Nárnia" || (this.egg1 && this.locais[i].local == "Nárnia")){
        alert.addInput({
          type: 'radio',
          label: this.locais[i].local,
          value: this.Trim(this.locais[i].local),
          checked: (this.filtro == this.locais[i].local)
        });
      }
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.filtro = data;
        this.ProgOrder();
      }
    });
    alert.present();
  }

  Trim(vlr) {
    while(vlr.indexOf(" ") != -1){
      vlr = vlr.replace(" ", "");
    }
    return vlr;
  }

  progOn(){
    this.firebaseProvider.refOff("prog/");
      this.firebaseProvider.refOn("prog/").orderByChild('tipo').equalTo('maratona').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        if(progSnap.val()){
          this.progSnap = progSnap;
          this.ProgOrder();
        }else{
          console.log("progs0 vazio.");
          this.progs = [];
        } 
      });
  }

  info(prog){
    let modal = this.modalCtrl.create("page-info",{id:prog.id});
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
        console.log("progSnap: ",this.progSnap);
        this.firebaseProvider.TransformList(this.progSnap).then((progs:any)=>{
          let progs2 = [];
          for (let i = 0; i < progs.length; i++) {
              let horaI = progs[i].horario.split("-");
              let dia = progs[i].dia.split("-");
              if (progs2.length != 0) {
                for (let j = 0; j < progs2.length; j++) {
                  console.log("progs2[j].horaI , horaI[0]: ",progs2[j].horaI ," / ", horaI[0]);
                  if(progs2[j].horaI == horaI[0]){
                    for (let k = 0; k < this.locais.length; k++) {
                      if(progs[i].local == this.Trim(this.locais[k].local)){
                        console.log("prog add1: ",progs[i].local ," / ", this.Trim(this.locais[k].local));
                        progs[i].cor = this.locais[k].cor;
                        break;
                      }
                    }
                  }
                  if(j == progs2.length - 1){
                    let progsT:any = [];
                    for (let k = 0; k < this.locais.length; k++) {
                      if(progs[i].local == this.Trim(this.locais[k].local)){
                        progs[i].cor = this.locais[k].cor;
                        break;
                      }
                    }
                    if (progs[i].local == this.filtro || this.filtro == "Todos") {
                      progs[i].horario = horaI[0] + " - " + horaI[1];
                      progs[i].dia = dia[0] + "/" + dia[1] + "/" + dia[2];
                      progsT.push(progs[i]);
                        progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                        console.log("progs1: ",progs2);
                    }
                    break;
                  }
                }
              }else{
                let progsT:any = [];
                for (let k = 0; k < this.locais.length; k++) {
                  if(progs[i].local == this.Trim(this.locais[k].local)){
                    progs[i].cor = this.locais[k].cor;
                    break;
                  }
                }
                if (progs[i].local == this.filtro || this.filtro == "Todos") {
                    progs[i].horario = horaI[0] + " - " + horaI[1];
                    progs[i].dia = dia[0] + "/" + dia[1] + "/" + dia[2];
                    progsT.push(progs[i]);
                    progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                    console.log("progs2: ",progs2);
                }
              }
            if(i == progs.length - 1){
              this.progs = progs2;
              console.log("progs: ",this.progs);
            }
          }
        });
  }
}
