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
    private rabbitClient: ClientProxy,

    // FANOUT
    @Inject('RABBITMQ_FANOUT')
    private fanoutClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.rabbitClient.connect();
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
    // this.rabbitClient.emit('post.created', payload);
    // console.log('[DIRECT] Message sent to RabbitMQ:', payload);

    // FANOUT (pub-sub)
    this.fanoutClient.emit('post.created', payload);
    console.log('[FANOUT] Message sent to RabbitMQ:', payload);

    return post;
  }
}
