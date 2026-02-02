import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Post } from 'src/database/entities/post.entity';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    @Inject('RABBITMQ_SERVICE')
    private rabbitClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.rabbitClient.connect();
  }

  async createPost(content: string) {
    const post = this.postRepo.create({ content });
    await this.postRepo.save(post);

    // Publish Event
    this.rabbitClient.emit('post.created', {
      postId: post.id,
      content: post.content,
    });

    return post;
  }
}
