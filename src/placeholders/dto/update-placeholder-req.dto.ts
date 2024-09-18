import { PartialType } from '@nestjs/swagger';
import { CreatePlaceholderReqDTO } from './create-placeholder-req.dto';

export class UpdatePlaceholderReqDTO extends PartialType(CreatePlaceholderReqDTO) {}