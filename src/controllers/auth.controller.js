import { randomUUID, } from 'crypto';
import { User, } from '../db/models/index.js';
import { encode, decode, verify } from '../services/auth.service.js';
import { encryptPassword, isValidPassword, } from '../services/password.service.js';
import {sendEmail} from '../services/sendEmail.service.js';
const ONE_MS = 1000;

export const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const existentedUser = await User.findOne({ where: { email, }, });
  if (!existentedUser) {
    return res
      .status(401)
      .json({
        success: false,
        message: "El usuario no ha sido encontrado o no esta registrado",
      });
  }
  
  const validPassword = await isValidPassword(password, existentedUser.password);

  if (!validPassword) {
    return res
      .status(401)
      .json({
        success: false,
        message: "La contraseña es incorrecta",
      });
  }

  const now = Date.now();

  // Generando/Codificando el token
  const { 
    token, 
  } = await encode({
    id: existentedUser.id,
    sub: existentedUser.email,
    name: existentedUser.name,
    iat: now,
    exp: now + (ONE_MS * 60 * 60* 3), // 3h 
  });

  return res
    .status(200)
    .json({
      success: true,
      data: { 
        token,
      },
    });
};


export const signup = async (req, res) => {
  // Los campos del formulario deben estar disponibles después de Multer
  const { name, email, password } = req.body;

  // Verifica si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'El usuario ya se encuentra registrado',
    });
  }

  // Encripta la contraseña
  const encryptedPassword = await encryptPassword(password);

  // Obtiene el path del archivo de perfil
  const fotoperfil = req.file ? req.file.path.replace(/\\/g, '/') : 'uploads/fotodefault.jpg';


  // Crea el nuevo usuario
  try {
    await User.create({
      id: randomUUID(),
      name,
      email,
      password: encryptedPassword,
      fotoperfil,
    });

    return res.status(201).json({
      success: true,
      message: 'El usuario ha sido registrado',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
    });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email, }, });
  if (!user) {
    return res.status(404).json({ success: false, message: 'El usuario no existe.' });
  }

  const resetToken = await encode({ 
    id: user.id,
    sub: user.email,
    name: user.name,
    iat: Date.now(),
    exp: Date.now() + 3600000,
  });

 const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken.token}`;
  try {
    await sendEmail(user.email, 'Recuperación de contraseña', `Haz click en el siguiente enlace para recuperar tu contraseña: ${resetUrl}`);
    res.json({ success: true, message: 'Correo de recuperación enviado con éxito.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
  }
}

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const {newPassword } = req.body;

  const decoded = await decode(token);
  if ('success' in decoded && !decoded.success) {
    return res.status(400).json({ success: false, message: 'El enlace de recuperación es inválido o ha expirado.' });
  }

  const { id, sub, name, iat, exp } = decoded;
  const email = sub;

  try {
    const user = await User.findOne({ where: { email},});
    console.log(token);
    const {payload,} = await verify(token);
    if ('success' in payload && !payload.success) {
      return res.status(400).json({ success: false, message: 'El enlace de recuperación es inválido o ha expirado.' });
    }

    const hashedPassword = await encryptPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'La contraseña ha sido actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor. Inténtelo de nuevo más tarde.' });
  }
};