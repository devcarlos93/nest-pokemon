import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from "axios";
import {PokeResponse} from "./interface/poke-response.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Pokemon} from "../pokemon/entities/pokemon.entity";
import {Model} from "mongoose";

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor( @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {
  }
  

  async executedSeed() {
   await this.pokemonModel.deleteMany({});
   const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');
      const pokemonInsert: { name: string; no: number }[] = [];

   data.results.forEach(({name, url}) => {
       const segments = url.split('/');
       const no = +segments[segments.length - 2];
       pokemonInsert.push({name, no});
   });

   await this.pokemonModel.insertMany(pokemonInsert);
   return 'Seed successfully';
  }
}
