import { Controller, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  create(@Body('content') content: string) {
    return this.postService.createPost(content);
  }
}
