import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { SidebarComponent } from './viewer/sidebar/sidebar.component';
import { BottombarComponent } from './viewer/bottombar/bottombar.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    SidebarComponent,
    BottombarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
