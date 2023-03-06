import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
}
