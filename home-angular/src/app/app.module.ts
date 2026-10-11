import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
@NgModule({declarations:[AppComponent],imports:[BrowserModule,RouterModule.forRoot([
 {path:'',loadChildren:()=>import('./home/home.module').then(m=>m.HomeModule)},
 {path:'**',redirectTo:''}
],{anchorScrolling:'enabled',scrollPositionRestoration:'enabled'})],providers:[provideHttpClient()],bootstrap:[AppComponent]})
export class AppModule {}
