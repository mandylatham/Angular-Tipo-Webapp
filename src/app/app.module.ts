import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@app/auth';
import { TipoCommonModule, MetadataService } from '@app/common';
import { TipoFrameworkModule } from '@app/framework';
import { TipoComponentsModule } from '@app/tipocomponents';
import { TipoDirectivesModule } from '@app/tipodirectives';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';



export function loadApplication(metadataService: MetadataService) {
  return () => metadataService.loadAppMetadata();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TipoCommonModule,
    AuthModule,
    TipoComponentsModule,
    TipoDirectivesModule,
    TipoFrameworkModule,
    AppRoutingModule,
  ],
  providers: [
    MetadataService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadApplication,
      deps: [MetadataService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
