import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { faShareSquare, faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnChanges {

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;
  upvote = 0;
  downvote = 0;
  user: any;

  @Input() post: any;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase
  ) { 
    this.auth.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges() : void {
    if(this.post.votes) {
      Object.values(this.post.votes).map((vote: any) => {
        if(vote.upvote) {
          this.upvote += 1;
        }
        if(vote.downvote) {
          this.downvote += 1;
        }
      });
    }
  }

  upvotePost(){
    this.db.object(`/posts/${this.post.id}/votes/${this.user.uid}`).set({
      upvote: 1
    });
  }

  downvotePost() {
    this.db.object(`/posts/${this.post.id}/votes/${this.user.uid}`).set({
      downvote: 1
    });
  }

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaUrl}`;
  }

}
