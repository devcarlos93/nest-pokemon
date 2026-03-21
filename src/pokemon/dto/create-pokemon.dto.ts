import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsInt({ message: 'no debe ser un número entero' })
    @IsPositive({ message: 'no debe ser un número positivo' })
    @Min(1, { message: 'no debe ser mínimo 1' })
    no: number;
    
    @IsString({ message: 'name debe ser un string' })
    @MinLength(1, { message: 'name debe tener al menos 1 carácter' })
    name: string;
}
