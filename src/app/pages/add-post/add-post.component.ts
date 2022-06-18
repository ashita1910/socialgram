import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import { readAndCompressImage } from 'browser-image-resizer';
import { config } from 'src/utils/config';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  locationName: string = "";
  description: string = "";
  user: any;
  uploadPercent : number = 0;
  picture: string = "";

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private auth: AuthService
  ) { 
    this.auth.getUser().subscribe((user) => {
      console.log("user1: ", user);
      this.db.object(`/users/${user?.uid}`).valueChanges().subscribe((user) => {
        this.user = user;
        console.log("user2: ", user);
      })
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const uid = uuidv4();

    this.db.object(`/posts/${uid}`).set({
      id: uid,
      locationName: this.locationName,
      description: this.description,
      by: this.user.name,
      instaUrl: this.user?.instaUsername,
      date: Date.now(),
      picture: this.picture
    })
    .then(() => {
      this.router.navigateByUrl('/');
      this.toastr.success("Post Uploaded Successfully!", "", {closeButton: true});
    })
    .catch((err) => {
      this.toastr.error("Something went wrong, please try again!", "", {closeButton: true});
    })
  }

  async uploadFile(event: any) {
    const file = event?.target?.files[0];
    const resizedImage = await readAndCompressImage(file, config);
    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percent: any) => {
      this.uploadPercent = percent;
    }); 
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("Image posted successfully!", "", {closeButton: true});
        });
      })
    ).subscribe();
  }

}
