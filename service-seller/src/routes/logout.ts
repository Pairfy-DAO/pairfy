import { Request, Response } from "express";

export const logoutHandler = (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};

