import { User } from "./../db/models/index.js";
import { encryptPassword } from "../services/password.service.js";

export const getAllUsers = async (req, res) => {
  
  
  const users = await User.findAll();

  if (!users || users.length <= 0) {
    return res
      .status(404)
      .json({
        success: false,
        message: 'No se encontraron usuarios',
      });
  }

  return res
    .status(200)
    .json({
      success: true,
      message: "Todos los usuarios",
      data: users,
    });
};

export const updateUser = async (req, res) => {
  

    const userEmail = req.userEmail;
    try {
      const userById = await User.findOne({
        where: { email: userEmail },
      });

      if (!userById) {
        return res.status(404).json({
          success: false,
          message: 'El usuario a actualizar no existe',
        });
      }

      if (req.body.password) {
        req.body.password = await encryptPassword(req.body.password);
      }

      const fotoperfil = req.file ? req.file.path.replace(/\\/g, '/') : 'uploads/fotodefault.jpg'

      const updatedUser = {
        ...userById.toJSON(),
        ...req.body,
        fotoperfil,
      };

      await User.update(updatedUser, {
        where: {
          email: userEmail,
        },
      });

      return res.status(201).json({
        success: true,
        message: `Se ha actualizado el usuario: ${userById.id}`,
        data: updatedUser,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
      });
    }
};


export const getUserById = async (req, res) => {
  const userEmail = req.userEmail;
  try {
    const userById = await User.findOne({
      where: {  
        email : userEmail, 
      },    
    });
    if (!userById) {
      return res        
        .status(404)
        .json({ 
          success: false,   
          message: 'El usuario no existe',
        });
    }

    return res
      .status(200)  
      .json({       
        success: true,          
        message: `Se ha encontrado el usuario ${userById.id}`,
        data: {
          id: userById.id,
          name: userById.name,
          email: userById.email,
          password: userById.password,
          fotoperfil: userById.fotoperfil,
        },
      });
  } catch (err) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Something went wrong',
      });
  }
}