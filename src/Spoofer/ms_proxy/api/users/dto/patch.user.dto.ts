import { PutUserDto } from "./put.user.dto.js";

export interface PatchUserDto extends Partial<PutUserDto> {}
