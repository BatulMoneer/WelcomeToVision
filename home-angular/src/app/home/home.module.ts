import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { HomeComponent } from './home.component';
@NgModule({declarations:[HomeComponent],imports:[CommonModule,FormsModule,HeaderModule,FooterModule,RouterModule.forChild([{path:'',component:HomeComponent}])]})
export class HomeModule {}
