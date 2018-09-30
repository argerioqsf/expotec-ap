import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Searchbar } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../pages/home/home';


import { FIREBASE_CREDENTIALS } from './firebase-cred';
import firebase from 'firebase';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AudioProvider } from '../providers/audio/audio';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('mySearchbar') searchbar: Searchbar;
  placeEgg = "The first egg";
  logoMenu = "assets/images/logo-menu.png";
  rootPage: any = HomePage;
  egg1;
  query = "";
  styleEgg = {};
  cont1 = 0;
  pages: Array<{title: string, component: any, icone: any}>;
  easterEgg = false;
  StorageEgg = true;
  constructor(public platform: Platform, 
              public statusBar: StatusBar,
              private toastCtrl: ToastController,
              private firebaseProvider: FirebaseProvider,
              private audio: AudioProvider,
              private alertCtrl: AlertController,
              private nativeStorage: NativeStorage) {
    this.initializeApp();
    firebase.initializeApp(FIREBASE_CREDENTIALS); 
    this.nativeStorage.getItem('egg1').then(data => {
            this.StorageEgg = data;
            if(data == true){
              this.firebaseProvider.Egg1("egg11");
              this.firebaseProvider.Egg1("egg12");
              this.logoMenu = "assets/images/logo-menu_egg.png";
              this.nativeStorage.getItem('egg2').then(data2 => {
                if (data2 == true) {
                  this.logoMenu = "assets/images/logo-menu_egg_king.png";
                }
              });
            }
            this.nativeStorage.setItem('egg1', data).then(() => {}
            ,error => {}
            );
          },
          error => {
            this.StorageEgg = false;
            this.nativeStorage.setItem('egg1', false).then(() => {}
            ,error => {}
            );
    });

    this.firebaseProvider.refOn("egg/egg1").on("value",(cont:any)=>{
      this.cont1 = cont.val();
      console.log("cont1: ",this.cont1);
    });
    
    this.firebaseProvider.refOn("egg/status").on("value",(cont:any)=>{
      this.easterEgg = cont.val();
      console.log("easterEgg status: ",this.easterEgg);
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icone:"home" },
      { title: 'Programação Geral', component: 'page-progs-geral', icone:"calendar" },
      { title: 'Mapa', component: 'page-mapa', icone:"md-map" },
      { title: 'Maratonas', component: 'page-progs-maratonas', icone:"md-trophy" },
      { title: 'Palestrantes', component: 'palestrantes', icone:"md-contacts" },
      { title: 'Sobre', component: 'page-sobre', icone:"md-list-box" },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.audio.preload('spiderman', 'assets/audio/audio1.mp3');
      this.audio.preload('sounou', 'assets/audio/sounou.mp3');
      this.audio.preload('perder', 'assets/audio/perder.mpeg');
      this.audio.preload('memeFinal', 'assets/audio/meFinal.mp3');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
          this.statusBar.styleBlackOpaque();
      }
    });
  }

  redeSocial(RS){
    window.open(RS, '_system', 'location=no');
  }

  eggs(ev: any) {
    if(this.easterEgg && this.StorageEgg == false){
        const val = ev.target.value;
        console.log('val', val);
        if((val == 'adventure' || val == 'Adventure')){
          this.egg1 = 'adventure';
          let toast = this.toastCtrl.create({
            message:"Created by Argério Queiroz",
            duration: 7000
          });
          this.firebaseProvider.Egg1("egg11");
          this.placeEgg = "O melhor conselho";
          toast.present();
          this.query = "";
        }
        
        if((val == 'com grandes poderes vêm grandes responsabilidades' || val == 'Com grandes poderes vêm grandes responsabilidades' || 
        val == 'Com grandes poderes vem grandes responsabilidades' || val == 'com grandes poderes vem grandes responsabilidades') && 
        this.firebaseProvider.GetEgg1("egg11")){
          this.egg1 = 'adventure';
          let id:any  = Math.floor((Math.random() * 1000) + 1);
          id = id.toString(2);
          if(this.cont1 < 1){
            let toast = this.toastCtrl.create({
              message:"Parabeeeeeens!!! Seu codigo "+ id,
              duration: 15000
            });
            toast.present();
            this.firebaseProvider.Egg1("egg12");
            this.placeEgg = "";
            this.query = "";
            this.audio.play("spiderman");
            this.logoMenu = "assets/images/spiderman.jpg";
            this.styleEgg = {'animation-name':'example','animation-duration':'0.5s','animation-iteration-count':'10'};
            setTimeout(() => {
              this.eggfinal(id);
            }, 2000);
          }else{
            let toast = this.toastCtrl.create({
              message:"É isso mesmo, sua saga de caçador de easter Egs acabou, alguem foi mais rápido!! Só que não, porque tem mais de onde esse veio.",
              duration: 10000
            });
            this.logoMenu = "assets/images/logo-menu_egg.png";
            toast.present();
            this.audio.stop("spiderman");
            this.audio.play("sounou");
            this.firebaseProvider.Egg1("egg12");
            this.placeEgg = "";
            this.query = "";
            this.nativeStorage.setItem('egg1', true).then(
                  () => {
                    //this.Toast('Stored item!');
                    this.StorageEgg = true;
                  },
                  error => {}//this.Toast('Error storing item '+ error)
                );
          }
        }
      }
  }

  Egg1(){
    if (this.logoMenu == "assets/images/logo-menu_egg.png") {
      this.logoMenu = "https://www.invertexto.com/barcodes/5bad419eab647.png";
    }else{
        if (this.logoMenu == "https://www.invertexto.com/barcodes/5bad419eab647.png") {
          this.logoMenu = "assets/images/logo-menu_egg.png";
        }
    }
  }

  eggfinal(id){
      const prompt = this.alertCtrl.create({
        title: 'Parabeeeens, Você descobriu o easter Egg!!!',
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
              data.egg = 1;
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
        if(this.cont1 > 0 ){
          let toast = this.toastCtrl.create({
            message:"É isso mesmo, sua saga de caçador de easter Egs acabou, alguem foi mais rápido!! Só que não, porque tem mais de onde esse veio.",
            duration: 10000
          });
          this.logoMenu = "assets/images/logo-menu_egg.png";
          toast.present();
          this.audio.stop("spiderman");
          this.audio.play("sounou");
          this.firebaseProvider.Egg1("egg12");
          this.placeEgg = "";
          this.query = "";
          this.nativeStorage.setItem('egg1', true).then(
                () => {
                  //this.Toast('Stored item!');
                  this.StorageEgg = true;
                },
                error => {}//this.Toast('Error storing item '+ error)
              );
        }
        if(this.cont1 < 1){
          this.firebaseProvider.push("egg/particantes",data).then(()=>{
            this.firebaseProvider.refOn("egg/egg1").once("value",(cont:any)=>{
              this.firebaseProvider.refOff("egg/egg1");
              this.firebaseProvider.update("egg/",{egg1:cont.val()+1}).then(()=>{
                let toast = this.toastCtrl.create({
                  message:"Confirmação enviada",
                  duration: 3000
                });
                this.cont1 = 1;
                this.logoMenu = "assets/images/logo-menu_egg.png";
                this.nativeStorage.setItem('egg1', true).then(
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

  Toast(msg){
    let toast = this.toastCtrl.create({
      message:msg,
      duration:5000
    });
    toast.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
