import { Injectable, NotFoundException } from '@nestjs/common';
import { Training, TrainingUnits } from './trainings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from '../exercises/exercises.model';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectModel('Training') private readonly trainingModel: Model<Training>,
  ) {}

  async getAll() {
    const trainings = await this.trainingModel.find().exec();
    if (!trainings) {
      throw new NotFoundException('There are no trainings, first create one');
    }
    return this.formatTrainings(trainings);
  }

  async getOne(id): Promise<Training> {
    let training;
    try {
      training = await this.findTraining(id);
    } catch (error) {
      throw new NotFoundException('You provided wrong id');
    }
    if (!training) {
      throw new NotFoundException('Training not found');
    }
    return this.formatTraining(training);
  }

  async addTraining(training: Training): Promise<Training> {
    const createdTraining = new this.trainingModel({
      name: training.name,
      exercises: training.exercises.map((exercise) => {
        return new Exercise(
          exercise.name,
          exercise.sets,
          exercise.reps,
          exercise.weight,
        );
      }),
      trainingUnits: [],
    });
    const savedTraining = await createdTraining.save();
    return this.formatTraining(savedTraining);
  }

  async deleteTraining(id: string) {
    const result = await this.trainingModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('There is no training with that ID');
    }
    return result;
  }

  async updateTraining(updatedTraining) {
    const foundTraining = await this.findTraining(updatedTraining.id);
    if (updatedTraining.name) {
      foundTraining.name = updatedTraining.name;
    }
    if (updatedTraining.exercises) {
      foundTraining.exercises = updatedTraining.exercises;
    }
    return this.formatTraining(await foundTraining.save());
  }

  async addTrainingUnit(training) {
    const trainingToUpdate = await this.findTraining(training.id);
    trainingToUpdate.trainingUnits.push(new TrainingUnits(training.exercises));
    return await trainingToUpdate.save();
  }

  // Helper functions below
  private async findTraining(id: string) {
    return this.trainingModel.findOne({ _id: id }).exec();
  }

  private formatTrainings(trainings: Training[]) {
    return trainings.map((training) => ({
      id: training.id,
      name: training.name,
      exercises: training.exercises,
      trainingUnits: training.trainingUnits,
    }));
  }

  private formatTraining(training) {
    return {
      id: training.id,
      name: training.name,
      exercises: training.exercises,
      trainingUnits: training.trainingUnits,
    };
  }
}
