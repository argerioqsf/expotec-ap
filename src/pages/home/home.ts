import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { MenuController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  progs = null;
  filtro = "Todos";
  progSnap = [];
  locais;
  cont = 1;
  egg1 = false;
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode,
              private splashScreen: SplashScreen) {
              this.splashScreen.hide();
              firebaseProvider.getLocais().then(locais=>{
                this.locais =  locais;
                this.egg1 = firebaseProvider.GetEgg1("egg11");
                console.log("locais: ",this.locais);
                this.progOn().then(resolve=>{
                  if(resolve == "OK"){
                    this.ProgOrder(true);
                  }
                });
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
      console.log("local/cor:",this.locais[i].local,"/",this.locais[i].cor);
      
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
        console.log("filtro: ",this.filtro);
        this.ProgOrder(false);
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
    return new Promise((resolve,reject)=>{
      this.firebaseProvider.refOn("prog/").orderByChild('fila').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        if(progSnap.val()){
          this.progSnap = progSnap;
          this.ProgOrder(false);
          resolve("OK");
        }else{
          console.log("progs0 vazio.");
          this.progs = [];
        }
      });
    });
  }

  info(prog){
    let modal = this.modalCtrl.create("page-info",{id:prog.id});
    this.cont = 0;
    modal.onDidDismiss(data => {
      this.cont = 1;
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

  ProgOrder(loop){
        console.log("progSnap: ",this.progSnap);
        this.firebaseProvider.TransformList(this.progSnap).then((progs:any)=>{
          let progs2 = [];
          for (let i = 0; i < progs.length; i++) {
            let horaA = this.firebaseProvider.Hora();
            let diaA = this.firebaseProvider.Dia();
            let horaP = progs[i].horario.split("-");
            horaP = horaP[0].split(":");
            horaP = horaP[0] + horaP[1];
            horaP = parseInt(horaP);
            let horaPF = progs[i].horario.split("-");
            horaPF = horaPF[1].split(":");
            horaPF = horaPF[0] + horaPF[1];
            horaPF = parseInt(horaPF);
            console.log("horaPF:", horaPF);
            console.log("horaP:", horaP);
            console.log("horaA:", horaA);
            console.log("diaA:", diaA);
            console.log("diaP:", progs[i].dia);
            console.log("progsList:", progs);
            if(progs[i].dia == diaA && (horaP >= horaA || horaA <= horaPF)){
              let horaI = progs[i].horario.split("-");
              if (progs2.length != 0) {
                for (let j = 0; j < progs2.length; j++) {
                  console.log("progs[j].horaI , horaI[0]: ",progs2[j].horaI ," / ", horaI[0]);
                  if(progs2[j].horaI == horaI[0]){

                    for (let k = 0; k < this.locais.length; k++) {
                      if(progs[i].local == this.Trim(this.locais[k].local)){
                        progs[i].cor = this.locais[k].cor;
                        break;
                      }
                    }

                    if (progs[i].local == this.filtro || this.filtro == "Todos") {
                      progs[i].horario = horaI[0] + " - " + horaI[1];
                      progs2[j].progs.push(progs[i]);
                      console.log("progs3: ",progs2);
                    }
                    break;
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
                        progsT.push(progs[i]);
                      if(horaP == horaA || (horaP <= horaA && horaA <= horaPF)){
                        progs2.push({horaI:horaI[0],progs:progsT,agora:true});
                        console.log("progs1: ",progs2);
                      }else{
                        progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                        console.log("progs1: ",progs2);
                      }
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
                    progsT.push(progs[i]);
                  if(horaP == horaA || (horaP <= horaA && horaA <= horaPF)){
                    progs2.push({horaI:horaI[0],progs:progsT,agora:true});
                    console.log("progs2: ",progs2);
                  }else{
                    progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                    console.log("progs2: ",progs2);
                  }
                }
              }
            }
            if(i == progs.length - 1){
              this.progs = progs2;
              console.log("progs: ",this.progs);
              if(loop){
                this.loop();
              }
            }
          }
        });
  }

  ionViewDidLeave(){
    this.cont = 0;
  }

  loop(){
    let that = this;
    setTimeout(() => {
      if(that.cont > 0){
        that.ProgOrder(true);
      }else{
        console.log("cont menor que zero");
      }
    }, 10000);
  }
}
