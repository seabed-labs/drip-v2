// src/users/usersController.ts
import { Controller, Get, Route } from "tsoa";
import { getServerResponseCommon } from "./common";
import { PingResponse } from "./types";
// import { User } from "./user";
// import { UsersService, UserCreationParams } from "./usersService";

@Route("/")
export class PingController extends Controller {
  @Get()
  public async ping(): Promise<PingResponse> {
    return {
      ...getServerResponseCommon(),
      data: {
        message: "Pong",
      },
    };
  }

  // @SuccessResponse("201", "Created") // Custom success response
  // @Post()
  // public async createUser(
  //   @Body() requestBody: UserCreationParams
  // ): Promise<void> {
  //   this.setStatus(201); // set return status 201
  //   new UsersService().create(requestBody);
  //   return;
  // }
}
