import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { finalize } from "rxjs/operators";
import { config } from 'src/utils/config';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { readAndCompressImage } from 'browser-image-resizer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture: string = "https://raw.githubusercontent.com/nehal076/SocioGram/master/WebContent/images/sociogram.png";
  uploadPercent: number = 0;
  model = {
    email: "",
    password: "",
    username: "",
    country: "",
    bio: "",
    name: ""
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const email =this. model.email;
    const password =this. model.password;
    const country =this. model.country;
    const username =this. model.username;
    const bio =this. model.bio;
    const name =this. model.name;

    this.auth.signUp(email, password)
    .then((res) => {
      const {uid}: any = res?.user;

      this.db.object(`/users/${uid}`).set({
        uid: uid,
        name: name,
        email: email,
        password: password,
        country: country,
        bio: bio,
        instaUsername: username,
        picture: this.picture
      });
    })
    .then(() => {
      this.router.navigateByUrl("/");
      this.toastr.success("Signup Successfull!", "", {closeButton: true});
    })
    .catch((err) => {
      this.toastr.error("SignUp failed, try again!", "", {closeButton: true});
    });
  }

  async uploadFile(event: any) {
    const file = event?.target?. files[0];
    let resizedImage = await readAndCompressImage(file, config);
    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percent: any) => {
      this.uploadPercent = percent;
    })
    task.snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe((url) => {
        this.picture = url;
        this.toastr.success("Image Uploaded Successfully!");
      })
    })).subscribe();
  }

}
