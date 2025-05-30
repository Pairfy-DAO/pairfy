import { Request, Response } from "express";

const logoutHandler = (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};

export { logoutHandler };