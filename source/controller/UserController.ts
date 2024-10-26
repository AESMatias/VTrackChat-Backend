import { Request, Response } from "express";
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const TOKEN_VALID_HOURS = parseInt(process.env.TOKEN_VALID_HOURS || "1");
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

export class UserController {

    constructor(private userService: UserService) {
        this.userService = userService;
    }

    public async register(req: Request,res: Response) {

        const { username, password } = req.body; 

        try {
          const newUser = await this.userService.createUser(username, password);
          
          const AuthToken = jwt.sign({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
          }, SECRET_KEY_JWT,
            {
                expiresIn: '1h'

            })

          res
          .cookie('Veritres-Access_token', AuthToken,{
            maxAge: 60 * 68 * TOKEN_VALID_HOURS,
            httpOnly: true, // Avoid the JS manipulation of the cookie on the client side.
            // secure: // Only works through HTTPS
            sameSite: 'strict',
          })
          .status(201).json(newUser); //TODO: Send just the username, not the entire object
        }
        catch (err) {
          res.status(500).json({ error: "Error register the user." });
        }

    }

    public async login(req: Request,res: Response) {

        const { username, password } = req.body;

        try {
          const isAuthenticated = await this.userService.authenticateUser(username, password);
    
          if (isAuthenticated) {
            res.status(200).json({ message: "User authenticated successfully" });
          } else {
            res.status(401).json({ message: "Not valid credentials" });
          }
        }
        catch (err) {
          res.status(500).json({ error: "Error at login." });
        }

    }
}