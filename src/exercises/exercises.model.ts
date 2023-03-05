import { faker } from '@faker-js/faker';

export class Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  constructor(name: string, sets?: number, reps?: number, weight?: number) {
    this.id = faker.database.mongodbObjectId();
    this.name = name;
    this.sets = sets | 0;
    this.reps = reps | 0;
    this.weight = weight | 0;
  }
}
