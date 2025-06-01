import { Request, Response } from "express";

export const logoutUserHandler = (req: Request, res: Response) => {
  req.session = null;
  
  res.send({});
};

