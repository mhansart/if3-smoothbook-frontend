import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';

import { AuthguardService } from './admin/services/authguard.service';
import { ConnexionComponent } from './connexion/connexion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarsiteComponent } from './site/navbarsite/navbarsite.component';
import { AddpostComponent } from './admin/addpost/addpost.component';
import { AddpageComponent } from './admin/addpage/addpage.component';
import { OptionComponent } from './admin/option/option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PagesService } from './services/pages.service';
import { PageComponent } from './site/page/page.component';
import { UserService } from './services/user.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DesignComponent } from './admin/design/design.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbListModule, NbThemeModule } from '@nebular/theme';
import { ModalComponent } from './admin/modal/modal.component';
import { FooterComponent } from './site/footer/footer.component';
import { SiteComponent } from './site/site/site.component';
import { ErrorComponent } from './site/error/error.component';
import { PostComponent } from './site/post/post.component';
import { ModalImageComponent } from './site/modal-image/modal-image.component';
import { UserComponent } from './admin/user/user.component';
import { LoaderComponent } from './site/loader/loader.component';
import { ModalService } from './services/modal.service';
import { ModalImageService } from './services/modal-image.service';
import { PostsService } from './services/posts.service';
import { AuthService } from './services/auth.service';
import { ImageService } from './services/image.service';
import { InfositeService } from './services/infosite.service';
import { LoaderAdminComponent } from './admin/loader-admin/loader-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ConnexionComponent,
    NavbarComponent,
    NavbarsiteComponent,
    AddpostComponent,
    AddpageComponent,
    OptionComponent,
    PageComponent,
    DesignComponent,
    DashboardComponent,
    SanitizeHtmlPipe,
    ModalComponent,
    FooterComponent,
    SiteComponent,
    ErrorComponent,
    PostComponent,
    ModalImageComponent,
    UserComponent,
    LoaderComponent,
    LoaderAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbListModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NbEvaIconsModule,
    CKEditorModule,
    NbDialogModule.forRoot(),
    


  ],
  providers: [
    AuthguardService,
    PagesService,
    UserService,
    ModalService,
    ModalImageService,
    PostsService,
    AuthService,
    ImageService,
    InfositeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
