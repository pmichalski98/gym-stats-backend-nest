import * as mongoose from 'mongoose';

import { Exercise } from '../exercises/exercises.model';

export const TrainingSchema = new mongoose.Schema({
  name: String,
  exercises: Array,
  trainingUnits: Array,
});
export class Training {
  id: string;
  name: string;
  exercises: Exercise[];
  trainingUnits?: TrainingUnits[];
}

export class TrainingUnits extends Training {
  date: Date;
  exercises: Exercise[];
  constructor(exercises) {
    super();
    this.exercises = exercises;
    this.date = new Date();
  }
}
