import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { isValidObjectId, Model } from "mongoose";
import { Pokemon } from "./entities/pokemon.entity";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PokemonService {
  defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit') || 7;
  }



  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.onReturnError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    let { limit = this.defaultLimit, offset = 0 } = paginationDto;
    if (!offset) offset = 0;
    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select("-__v");
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(Number(term))) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    } else {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) throw new BadRequestException(`Pokemon ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.onReturnError(error, true);
    }
  }

  async remove(term: string) {
    const pokemon = await this.findOne(term);
    await pokemon.deleteOne();
    return { ...pokemon.toJSON() };
  }

  private onReturnError(error: any, isEditing = false) {
    if ((error as { code: number }).code === 11000) {
      throw new BadRequestException(
        `Ya existe un Pokemon con ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Error ${isEditing ? "actualizando" : "eliminando"} pokemon`,
    );
  }
}
