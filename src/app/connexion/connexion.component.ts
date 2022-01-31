import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
  fg: FormGroup;
  authStatus: boolean;
  user: User[];
  errorMessage: string;
  isAuth: boolean;
  h:number;
  fgEmail : FormGroup;
  fgNewPsw : FormGroup;

  constructor(private _userService: UserService, private _router: Router, private _formBuilder: FormBuilder, private _authService: AuthService, private _route:ActivatedRoute) {
  }

  ngOnInit(): void {

    this.h = window.innerHeight;
    this.fg = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
    this.fgEmail = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      email: ['', [Validators.required, Validators.email]],
    })
    this.fgNewPsw = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      password: ['', Validators.required],
    })

  }

  
  onSubmit() {
    if (this.isAuth) {
      this._authService.signOut();
      this.isAuth = false;
    } else {

      this._authService.signIn(this.fg.value).subscribe({
        next: () => {
          console.log('ici');
          this.isAuth = true;
          this._router.navigate(['/adminafg']);
        },
        error: error => {
          this.errorMessage = "Votre mot de passe ou votre email n'est pas correct";
          console.log(error);
          this.fg.reset();
        }

      })
    }
  }

  onSubmitEmail(){
    this._userService.GetUsers().subscribe(data =>{
      const thisUser = data.filter((x)=>{ return x.email == this.fgEmail.value['email']});
      this._userService.sendEmail(thisUser[0]).subscribe({
        next : () =>{
          this.errorMessage = "L'email a bien été envoyé"
        },
        error : error =>{
          console.log(error);
        }
      })
    })
  }

  onSubmitMdp(){
    const idUser = this._route.snapshot.params['id'];
    this._userService.GetUsers().subscribe(data=>{
      const thisUser = data.filter((x)=> x.id == idUser);
      this._userService.updatePsw({email : thisUser[0].email, password : this.fgNewPsw.value['password']}, idUser).subscribe({
        next : () =>{
          this._router.navigate(['/connexion']);
        },
        error : error =>{
          console.log(error);
        }
      })
    })
  }

  resetError(){
    this.errorMessage='';
  }
}
