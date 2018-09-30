import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalestrantesPage } from './palestrantes';

@NgModule({
  declarations: [
    PalestrantesPage,
  ],
  imports: [
    IonicPageModule.forChild(PalestrantesPage),
  ],
})
export class PalestrantesPageModule {}
