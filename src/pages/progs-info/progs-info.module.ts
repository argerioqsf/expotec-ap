import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgsInfoPage } from './progs-info';

@NgModule({
  declarations: [
    ProgsInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgsInfoPage),
  ],
})
export class ProgsInfoPageModule {}
