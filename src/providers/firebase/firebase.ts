import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  egg1 = {egg11:false,egg12:false,egg13:false};
  egg2 = {egg21:false,egg22:false,egg23:false};
  constructor() {
    console.log('Hello FirebaseProvider Provider');
  }
  
  list(path){ 
    return new Promise((resolve, reject)=>{
			let list = [];
			firebase.database().ref(path).once("value",userProfileSnapshot=>{
				let result = userProfileSnapshot;
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/list: ",list);
				resolve(list);
			},error=>{
        console.log("Erro/list: ",error);
				resolve("Erro");
			});
		  });
  }
  refOn(path){
    return firebase.database().ref(path);
  }
  refOnMaratonas(path){
    return firebase.database().ref(path).orderByChild('tipo').equalTo('maratona');
  }
  refOff(path){
    return firebase.database().ref(path).off();
  }
  update(path,data){
    return firebase.database().ref(path).update(data);
  }
  set(path,valor){
    return firebase.database().ref(path).set(valor);
  }
  push(path,valor){
    return firebase.database().ref(path).push(valor);
  }
  delete(path){ 
    return firebase.database().ref(path).remove();
  }
  TransformList(result){
    return new Promise((resolve, reject)=>{
			  let list = [];
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/TransformList: ",list);
				resolve(list);
		});
  }
  Hora(){
		let horas:any = new Date().getHours();
		let minutos:any = new Date().getMinutes();
		
			if(horas < 10){
				horas = "0" + horas;
			}
			if(minutos < 10){
				minutos = "0" + minutos;
			}
		
    let dataNow:any = horas + "" + minutos;
    dataNow = parseInt(dataNow);
		return dataNow;
  }

  HoraL(){
		let horas:any = new Date().getHours();
		let minutos:any = new Date().getMinutes();
    horas + 1;
			if(horas < 10){
				horas = "0" + horas;
			}
			if(minutos < 10){
				minutos = "0" + minutos;
			}
		
    let dataNow:any = horas + "" + minutos;
    dataNow = parseInt(dataNow);
		return dataNow;
  }

  Dia(){
		let ano:any = new Date().getFullYear();
		let mes:any = new Date().getMonth() + 1;
		let dia:any = new Date().getDate();
		
			if(mes < 10){
				mes = "0" + mes;
			}
			if(dia < 10){
				dia = "0" + dia;
			}
		
		let dataNow:any = dia +"-"+ mes +"-"+ ano;
		return dataNow;
  }
  getLocais(){
    return new Promise((resolve,reject)=>{
      firebase.database().ref("config/locais").once("value",locaisSnap=>{
        console.log("config/locais: ", locaisSnap.val());
          resolve(locaisSnap.val());
        });
      });
  }

  Egg1(egg){
    this.egg1[""+egg+""] = true;
  }

  
  Egg2(egg){
    this.egg2[""+egg+""] = true;
  }

  GetEgg1(egg){
    return this.egg1[""+egg+""];
  }

  
  GetEgg2(egg){
    return this.egg2[""+egg+""];
  }
}
