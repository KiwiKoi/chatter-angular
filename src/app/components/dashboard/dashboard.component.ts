import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onUpdateProfile: EventEmitter<User> = new EventEmitter();

  editProfileForm!: FormGroup;
  users: User[] = [];
  posts: Post[] = [];

  currentUser!: any;
  updatedUser!: User;
  editMode: boolean = false;
  subscription!: Subscription;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initialiseForm(): void {
    this.editProfileForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      firstname: null,
      lastname: null,
    });
  }

  getUser() {
    this.subscription = this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = this.userService
          .getUserByID(user.uid)
          .subscribe((userData: any) => {
            this.currentUser = userData;
            console.log(this.currentUser);
            this.initialiseForm();

            this.postService.fetchPosts()
            .subscribe((response) => {
              response.forEach((post) => {
                console.log(post)
                this.buildPosts(post);
              });
            });
          });
      }
    });
  }

  async buildPosts(response: any) {
    if (
      response.userID === this.currentUser.id &&
      !this.posts.some((e) => e.id === response.id)
    ) {
      this.posts.push({
        ...response,
      });
    }
  }

  updateProfile() {
    this.updatedUser = this.editProfileForm.getRawValue();
    this.userService
      .updateUser(this.currentUser.id, this.updatedUser)
      .subscribe((response: any) => response);
  }

  editBtn() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  sortPosts() {
    this.posts.sort((a: any, b: any) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });
  }
}
