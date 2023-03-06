import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  sets: number;
  @Column()
  reps: number;
  @Column()
  weight: number;
}
