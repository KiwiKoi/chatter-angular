import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  public post: Post = {
    title: '',
    body: '',
    createdAt: null,
    updatedAt: null,
    userID: '',
    id: '',
    image: null,
    author: null
  };
  public postID!: string | null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    if (this.postID != null) {
      this.postService.fetchPostByID(this.postID)
      .subscribe((data: any) => {
        this.post = data;
        console.log(this.post)
      });
    }
  }
}
