import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AudioProvider } from '../../providers/audio/audio';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the ProgsGeralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-progs-geral'
})
@Component({
  selector: 'page-progs-geral',
  templateUrl: 'progs-geral.html',
})
export class ProgsGeralPage {

  progs = null;
  filtro = "Todos";
  progSnap = [];
  locais;
  egg1 = false;
  egg2 = false;
  query = "";
  cont2 = 0;
  StorageEgg = false;
  easterEgg = false;
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode,
              private audio: AudioProvider,
              private toastCtrl: ToastController,
              private nativeStorage: NativeStorage) {
              firebaseProvider.getLocais().then(locais=>{
                this.egg1 = firebaseProvider.GetEgg1("egg12");
                this.locais =  locais;
                this.progOn();
                console.log("locais: ",this.locais);
              });

              this.nativeStorage.getItem('egg2').then(data => {
                this.StorageEgg = data;
                this.nativeStorage.setItem('egg2', data).then(() => {console.log(data)}
                ,error => {console.log(error)}
                );
              },
              error => {
                this.StorageEgg = false;
                this.nativeStorage.setItem('egg2', false).then(() => {console.log("sucesso")}
                ,error => {console.log(error)}
                );
              });
              
              this.firebaseProvider.refOn("egg/egg2").on("value",(cont:any)=>{
                this.cont2 = cont.val();
                console.log("cont2: ",this.cont2);
              });
              
              this.firebaseProvider.refOn("egg/status").on("value",(cont:any)=>{
                this.easterEgg = cont.val();
                console.log("easterEgg status: ",this.easterEgg);
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

  eggs2(ev: any) {
    if(this.easterEgg && this.StorageEgg == false){
        const val = ev.target.value;
        console.log('val', val);
        if((val == '(G=P)=P' || val == '(G = P) = P' || 
            val == '(g = p) = p' || val == '(g=p)=p')){
          if(this.cont2 < 1){
          this.query = "";
          this.audio.play("memeFinal");
          let id:any  = Math.floor((Math.random() * 1000) + 1);
          id = id.toString(2);
          this.eggfinal(id);
        }else{
          let toast = this.toastCtrl.create({
            message:"É isso mesmo, sua saga de caçador de easter Egs acabou, alguem foi mais rápido!!.",
            duration: 10000
          });
          toast.present();
          this.audio.stop("memeFinal");
          this.audio.play("sounou");
          this.query = "";
        }
        }
      }
  }

  eggfinal(id){
    const prompt = this.alertCtrl.create({
      title: 'Parabeeeens, Você descobriu o SEGUNDO easter Egg!!!',
      subTitle:"Ponha suas informações, para concorrer ao premio, guarde seu codigo "+id+", é obrigatório enviar suas informações para participar da premiação.",
      message: "Ah! lembre-se de manter o segredo com você, Com grandes poderes vêm grandes responsabilidades.",
      inputs: [
        {
          name: 'Nome',
          placeholder: 'nome'
        },
        {
          name: 'Celular',
          placeholder: 'celular'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            data.id = parseInt(id, 2);
            data.egg = 2;
            console.log("data: ",data);
            this.eggF(data);
          }
        }
      ]
    });
    prompt.present();
  }

  eggF(data){
    
    if(this.easterEgg && this.StorageEgg == false){
        if(this.cont2 > 0 ){
          let toast = this.toastCtrl.create({
            message:"É isso mesmo, sua saga de caçador de easter Egs acabou, alguem foi mais rápido!!.",
            duration: 10000
          });
          toast.present();
          this.audio.stop("memeFinal");
          this.audio.play("sounou");
          this.query = "";
        }
        if(this.cont2 < 1){
          this.firebaseProvider.push("egg/particantes",data).then(()=>{
            this.firebaseProvider.refOn("egg/egg2").once("value",(cont:any)=>{
              this.firebaseProvider.refOff("egg/egg2");
              this.firebaseProvider.update("egg/",{egg2:cont.val()+1}).then(()=>{
                let toast = this.toastCtrl.create({
                  message:"Confirmação enviada",
                  duration: 3000
                });
                this.cont2 = 1;
                this.nativeStorage.setItem('egg2', true).then(
                      () => {
                        //this.Toast('Stored item!');
                        this.StorageEgg = true;
                      },
                      error => {}//this.Toast('Error storing item '+ error)
                    );
                toast.present();
              },erro=>{
                let toast = this.toastCtrl.create({
                message:"Hove um erro na comunicação com o servidor, leve seu aplicativo e mostre para alguem da coordenação para validar seu código",
                duration: 3000
              });
              toast.present();
              });
            });
          });
        }
      }
  }


  perder(){
    this.audio.stop("sounou");
    this.audio.stop("spiderman");
    this.audio.play("perder");
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
      this.firebaseProvider.refOn("prog/").orderByChild('fila').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        if(progSnap.val()){
          this.progSnap = progSnap;
          this.ProgOrder();
        }else{
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
