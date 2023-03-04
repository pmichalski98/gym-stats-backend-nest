import * as mongoose from 'mongoose';

import { Exercise } from '../exercises/exercises.model';

export const TrainingSchema = new mongoose.Schema({
  name: String,
  exercises: Array,
});
export interface Training {
  id: string;
  name: string;
  exercises: Exercise[];
}
