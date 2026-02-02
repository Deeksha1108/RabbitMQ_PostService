import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Post } from './database/entities/post.entity';
import { PostService } from './modules/post/post.service';
import { PostController } from './modules/post/post.controller';

@Module({
  imports: [
    // ---------------- DATABASE ----------------
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'rabbitMQ',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Post]),

    // ---------------- RABBITMQ CLIENTS ----------------
    ClientsModule.register([
      // DIRECT (point-to-point)
      {
        name: 'RABBITMQ_DIRECT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'post_queue',
          queueOptions: { durable: true },
        },
      },

      // FANOUT (pub-sub)
      {
        name: 'RABBITMQ_FANOUT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          exchange: 'post_fanout_exchange',
          exchangeType: 'fanout',
          queue: '', // producer doesn't need queue
        },
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class AppModule {}
