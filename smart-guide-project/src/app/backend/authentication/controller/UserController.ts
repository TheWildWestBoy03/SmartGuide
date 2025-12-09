import {Request, Response} from 'express'
import { User, UserModel } from '../model/User.js'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Option, OptionModel } from '../model/Option.js'

export const userController = {
    async getUsers(req: Request, res: Response) {
        const users = UserModel.getAll();
        res.json(users);
    },

    async createUser(req: Request, res: Response) {
      const { firstname, lastname, email, password, historicalInterests } = req.body;

      try {
        const user = await UserModel.findOneByEmail(req.body.email) as User;
        if (user != null) {
          res.status(401).json({ message: "An user with this email already exists!" });
          return;
        }

        const generated_salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, generated_salt);
        const registeredUser: User = { firstName: firstname, lastName: lastname, email, password: hashedPassword, options: historicalInterests };

        console.log(registeredUser);
        const newUser = await UserModel.create(registeredUser);

        res.json({ message: "User created!" });
        const userId = newUser.insertId;

        for (const data of historicalInterests) {
          const newOption: Option = {
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

    async loginUser(req : Request, res : Response) {
      const { email, password } = req.body;

      console.log(email + " " + password);
      try {
        const user = await UserModel.findOneByEmail(req.body.email) as User;

        if (user != null) {
          const check = await bcrypt.compare(password, user.password as string);

          if (!check) {
            res.json("Incorrect password");
            return;
          }

          const serializeableInfo = { username: user.firstName + " " + user.lastName, email: user.email }
          const token = jwt.sign(serializeableInfo, process.env['ACCESS_TOKEN_SECRET']!, { expiresIn: '3600s' });

          res.cookie('access-token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
          })

          res.json({"access_token" : token});
        } else {;
          console.log("Bad request here");
          res.status(404).json("No user with this email exists. ");
        }
      } catch (error) {
        console.log("Bad request");
        res.json(error);
      }
    }
}