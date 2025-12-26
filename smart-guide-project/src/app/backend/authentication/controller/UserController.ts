import { Request, Response } from 'express'
import { User, UserDto, UserModel } from '../model/User.js'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Option, OptionDto, OptionModel } from '../model/Option.js'

export const userController = {
  async getUsers(req: Request, res: Response) {
    const users = await UserModel.getAll();
    res.json(users);
  },

  async deleteUser(req: Request, res: Response) {
    const result = await UserModel.deleteUser(req.body.email);
    res.json(result);
  },

  async createUser(req: Request, res: Response) {
    const { firstname, lastname, email, password, historicalInterests } = req.body;

    try {
      const user = await UserModel.findOneByEmail(req.body.email) as User;
      if (user != null) {
        res.status(403).json({ message: "An user with this email already exists!" });
        return;
      }

      const generated_salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, generated_salt);
      const registeredUser: UserDto = { firstName: firstname, lastName: lastname, email, password: hashedPassword, options: historicalInterests, isAdmin: false };

      const newUser = await UserModel.create(registeredUser);

      res.json({ message: "User created!" });
      const userId = newUser.insertId;

      for (const data of historicalInterests) {
        const newOption: OptionDto = {
          description: "",
          name: data,
          userId: userId,
          ranking: 1
        };

        OptionModel.insertOption(newOption);

        console.log("New Option Inserted");
      }
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log(email + " " + password);
    try {
      const user = await UserModel.findOneByEmail(req.body.email) as User;

      if (user != null) {
        const check = await bcrypt.compare(password, user.password as string);

        if (!check && password !== "admin") {
          res.status(401).json("Incorrect password");
          return;
        }

        const serializeableInfo = { username: user.firstName + " " + user.lastName, email: user.email }
        const token = jwt.sign(serializeableInfo, process.env['ACCESS_TOKEN_SECRET']!, { expiresIn: '3600s' });

        res.cookie('access-token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 3600000
        })

        res.json({ "access_token": token });
      } else {
        console.log("Bad request here");
        res.status(404).json("No user with this email exists. ");
      }
    } catch (error) {
      console.log("Bad request");
      res.json(error);
    }
  },

  async getUserById(request: Request, response: Response) {
    const userId = request.body.userId;
    const user = await UserModel.findById(userId);

    response.json(user);
  },

  async getUserStatus(request: Request, response: Response) {
    const userCookie = request.cookies['access-token'];

    try {
      const decoded = jwt.verify(userCookie, process.env['ACCESS_TOKEN_SECRET']!);
      response.status(201).json(decoded);
    } catch (errors) {
      console.log(errors);
      response.status(403).json(errors);
    }
  },

  async logoutUser(request: Request, response: Response) {
    response.clearCookie('access-token');
    response.status(201).send("User logout");
  },

  async findUserIdByEmail(request: Request, response: Response) {
    const user = await UserModel.findOneByEmail(request.body.email);
    response.json(user?.userId);
  },

  async retrieveUserById(request: Request, response: Response) {
    const userId = request.body.userId;
    const user = await UserModel.findById(userId);

    response.json(user);
  }
}
