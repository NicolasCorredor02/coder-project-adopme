import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { config } from "../config/config.js";
import { CustomError } from "../utils/CustomError.js";

// Validar formato de email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        
        // Validar campos requeridos
        if (!first_name || !last_name || !email || !password) {
            CustomError.validationError('REQUIRED_FIELDS_MISSING', 'Los campos first_name, last_name, email y password son obligatorios');
        }
        
        // Validar formato de email
        if (!isValidEmail(email)) {
            CustomError.userError('INVALID_EMAIL');
        }
        
        // Validar longitud de contraseña
        if (password.length < 8) {
            CustomError.userError('WEAK_PASSWORD');
        }
        
        // Verificar si el usuario ya existe
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            CustomError.userError('ALREADY_EXISTS');
        }
        
        // Crear usuario
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        };
        
        const result = await usersService.create(user);
        
        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            payload: {
                id: result._id,
                email: result.email,
                name: `${result.first_name} ${result.last_name}`
            }
        });
        
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validar campos requeridos
        if (!email || !password) {
            CustomError.validationError('REQUIRED_FIELDS_MISSING', 'Email y contraseña son obligatorios');
        }
        
        // Buscar usuario
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            CustomError.authError('INVALID_CREDENTIALS');
        }
        
        // Validar contraseña
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            CustomError.authError('INVALID_CREDENTIALS');
        }
        
        // Generar token
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, config.AUTH.JWT_KEY, { expiresIn: "1h" });
        
        res.cookie('coderCookie', token, { 
            maxAge: 3600000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        }).json({
            success: true,
            message: "Inicio de sesión exitoso",
            user: {
                name: userDto.name,
                email: userDto.email,
                role: userDto.role
            }
        });
        
    } catch (error) {
        next(error);
    }
};

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie'];
        
        // Verificar si existe la cookie
        if (!cookie) {
            CustomError.authError('TOKEN_MISSING');
        }
        
        // Verificar y decodificar el token
        let user;
        try {
            user = jwt.verify(cookie, config.AUTH.JWT_KEY);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                CustomError.authError('SESSION_EXPIRED');
            } else {
                CustomError.authError('TOKEN_INVALID');
            }
        }
        
        res.json({
            success: true,
            message: "Usuario autenticado",
            payload: user
        });
        
    } catch (error) {
        next(error);
    }
};

const unprotectedLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validar campos requeridos
        if (!email || !password) {
            CustomError.validationError('REQUIRED_FIELDS_MISSING', 'Email y contraseña son obligatorios');
        }
        
        // Buscar usuario
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            CustomError.authError('INVALID_CREDENTIALS');
        }
        
        // Validar contraseña
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            CustomError.authError('INVALID_CREDENTIALS');
        }
        
        // Generar token (sin DTO para versión no protegida)
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        }, config.AUTH.JWT_KEY, { expiresIn: "1h" });
        
        res.cookie('unprotectedCookie', token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        }).json({
            success: true,
            message: "Inicio de sesión no protegido exitoso"
        });
        
    } catch (error) {
        next(error);
    }
};

const unprotectedCurrent = async (req, res, next) => {
    try {
        const cookie = req.cookies['unprotectedCookie'];
        
        // Verificar si existe la cookie
        if (!cookie) {
            CustomError.authError('TOKEN_MISSING');
        }
        
        // Verificar y decodificar el token
        let user;
        try {
            user = jwt.verify(cookie, config.AUTH.JWT_KEY);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                CustomError.authError('SESSION_EXPIRED');
            } else {
                CustomError.authError('TOKEN_INVALID');
            }
        }
        
        res.json({
            success: true,
            message: "Usuario autenticado (no protegido)",
            payload: user
        });
        
    } catch (error) {
        next(error);
    }
};

// Nuevo endpoint para logout
const logout = async (req, res, next) => {
    try {
        res.clearCookie('coderCookie');
        res.clearCookie('unprotectedCookie');
        
        res.json({
            success: true,
            message: "Sesión cerrada exitosamente"
        });
        
    } catch (error) {
        next(error);
    }
};
export default {
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent,
    logout
};
