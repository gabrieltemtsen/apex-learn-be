import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAttemptDto {
  @ApiProperty({ description: 'Map of questionId to answer string' })
  @IsNotEmpty()
  @IsObject()
  answers: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  timeTakenSeconds: number;
}
