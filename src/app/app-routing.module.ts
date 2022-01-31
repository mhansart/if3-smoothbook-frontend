import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { AddpageComponent } from './admin/addpage/addpage.component';
import { AddpostComponent } from './admin/addpost/addpost.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { DesignComponent } from './admin/design/design.component';
import { OptionComponent } from './admin/option/option.component';
import { AuthguardService } from './admin/services/authguard.service';
import { UserComponent } from './admin/user/user.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { ErrorComponent } from './site/error/error.component';
import {  PageComponent } from './site/page/page.component';
import { PostComponent } from './site/post/post.component';
import { SiteComponent } from './site/site/site.component';


export const routes: Routes = [
  {path:'', redirectTo: '/accueil', pathMatch: 'full'},
  {path : 'connexion', component : ConnexionComponent},
  {path : 'oubli-mdp', component : ConnexionComponent},
  {path : 'new-mdp/:id', component : ConnexionComponent},
  {path : 'adminafg', canActivate:[AuthguardService], component : AdminComponent, children:[
    {path : '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path : 'optionpost',canActivate:[AuthguardService], component : OptionComponent},
    {path : 'addpost',canActivate:[AuthguardService], component : AddpostComponent},
    {path : 'optionpages',canActivate:[AuthguardService], component : OptionComponent},
    {path : 'addpage',canActivate:[AuthguardService], component : AddpageComponent},
    {path : 'updatepage/:id',canActivate:[AuthguardService], component : AddpageComponent},
    {path : 'updatepost/:id',canActivate:[AuthguardService], component : AddpostComponent},
    {path : 'designsite',canActivate:[AuthguardService], component : DesignComponent},
    {path : 'dashboard',canActivate:[AuthguardService], component : DashboardComponent},
    {path : 'user-profile',canActivate:[AuthguardService], component : UserComponent}
  ]},
  {path : '', component : SiteComponent, children:[
    {path : 'post/:id', component : PostComponent},
    {path : 'error', component : ErrorComponent},
    {path : ':name', component : PageComponent},

  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
