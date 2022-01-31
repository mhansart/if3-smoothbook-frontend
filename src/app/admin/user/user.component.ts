import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: User[] = [];
  email: string = JSON.parse(localStorage.getItem('adminIs')).email;
  updateInfo: boolean = false;
  fgInfos: FormGroup;
  errorMessage: string;
  admin: User[] = [];
  addingAdmin: boolean = false;
  fgAdmin: FormGroup;
  alreadyAdmin: string = '';
  modifMdp: boolean = false;
  fgMdp: FormGroup;
  wrongPsw : string = '';

  constructor(private _router: Router, private _authService: AuthService, private _userService: UserService, private _formBuilder: FormBuilder, private _modalService: ModalService) { document.getElementById('loader-admin').style.display="flex" }

  ngOnInit(): void {
    // fermer le loader
    setTimeout(function(){ document.getElementById('loader-admin').style.display="none" }, 1000);

    // responsive menu
    if (window.innerWidth < 992) {
      const menu = document.querySelector('header');
      if(!menu.classList.contains('menu-closed')) menu.classList.add('menu-closed');
      const burger = document.querySelector('.menu-burger');
    burger.classList.remove('cross-menu');
    }

    this._userService.GetUser(this.email).subscribe(user => {
      console.log(user);
      this.user = user;
      this.fgInfos.setValue({ name: this.user[0].name, firstname: this.user[0].firstname, email: this.user[0].email });
    })
    this.fgInfos = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      name: [''],
      firstname: [''],
      email: ['', Validators.email]
    })
    this.fgAdmin = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      admin: ['', Validators.required]
    })
    this.fgMdp = this._formBuilder.group({
      //dans ce groupe je vais placer les noms des != formcontrol qu'il y aura dans le formgroup
      password: ['', Validators.required],
      newpsw: ['', Validators.required]
    })
    this._userService.GetUsers().subscribe(users => {
      this.admin = users;
    })


  }

  deconnexion() {
    this._modalService.openModal('vous déconnecter');
    this._modalService.onClose.subscribe(data => {
      if (data) {
        this._authService.signOut();
        this._router.navigate(['/adminafg']);
      }
    })
  }
  toggleInfos() {
    this.updateInfo = !this.updateInfo;
  }
  onSubmitInfos() {
    this._userService.updateUser(this.fgInfos.value, this.user[0].id).subscribe({
      next: () => {
        this._userService.GetUser(this.email).subscribe(user => {
          this.user = user;
          this.fgInfos.setValue({ name: this.user[0].name, firstname: this.user[0].firstname, email: this.user[0].email });
        })
        this.updateInfo = false;
      },
      error: error => {
        this.errorMessage = error;
      }
    })
  }
  addAdmin() {
    this.addingAdmin = !this.addingAdmin;

  }
  deleteAdmin(id: number) {
    const name = this.admin.filter((x) => x.id == id)
    const str = name[0].email == this.email ? 'supprimer votre propre compte' : `supprimer l'administrateur ${name[0].firstname} ${name[0].name}`
    this._modalService.openModal(str);
    this._modalService.onClose.subscribe(data => {
      if (data) {
        this._userService.deleteUser(id).subscribe({
          next: () => {
            if (name[0].email == this.email) {
              this.deconnexion();
            } else {
              this.admin = this.admin.filter((x) => x.id !== id);
            }
          },
          error: error => {
            this.errorMessage = error;
          }
        })
      }
    })
  }
  onSubmitAdmin() {
    const isIn = this.admin.filter((x) => x.email == this.fgAdmin.value['email']);
    if (isIn.length > 0) {
      this.alreadyAdmin = "Cet email existe déjà.";
    } else {
      this._userService.addUser(this.fgAdmin.value).subscribe({
        next: () => {
          this._userService.GetUsers().subscribe(data => this.admin = data)
          this.addingAdmin = false;
          this.fgAdmin.reset();
        },
        error: error => {
          this.errorMessage = error;
        }
      })
    }
  }
  iptAdmin() {
    this.alreadyAdmin = '';
    this.wrongPsw = '';
  }
  onSubmitMdp() {
    this._userService.passwordIsOk({ email: this.email, password: this.fgMdp.value['password'] }).subscribe({
      next: () => {
        this._userService.updatePsw({ email: this.email, password: this.fgMdp.value['newpsw'] }, this.user[0].id).subscribe({
          next : () => {
            this.modifyMdp();
          },
          error: error => {
            console.log(error);
          }
        })
      },
      error: error => {
        this.wrongPsw = "Le mot de passe actuel n'est pas correct";
      }
    })
  }
  modifyMdp() {
    this.modifMdp = !this.modifMdp;
  }


}
