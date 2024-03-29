import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouteReuseStrategy } from '@angular/router';
import { DefaultRouteReuseStrategy } from './route-reuse-strategy';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgChartsModule,
    MatSnackBarModule,
    FormsModule,
    MatNativeDateModule,
    MarkdownModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: DefaultRouteReuseStrategy,
    },
  ],
})
export class AppModule {}
