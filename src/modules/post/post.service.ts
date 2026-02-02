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

    // DIRECT
    @Inject('RABBITMQ_DIRECT')
    private directClient: ClientProxy,

    // FANOUT
    @Inject('RABBITMQ_FANOUT')
    private fanoutClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.directClient.connect();
    await this.fanoutClient.connect();
  }

  async createPost(content: string) {
    const post = this.postRepo.create({ content });
    await this.postRepo.save(post);

    const payload = {
      postId: post.id,
      content: post.content,
    };

    // DIRECT (one consumer)
    this.directClient.emit('post.created', payload);

    // FANOUT (pub-sub)
    // this.fanoutClient.emit('post.created', payload);

    return post;
  }
}
