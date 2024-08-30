import { randomUUID } from'crypto';
import { Task, User } from'../db/models/index.js';
import { Op } from'sequelize';

const getUserId = async (userEmail) => {
  try {
    const user = await User.findOne({
      attributes: ['id'],
      where: {
        email: userEmail,
      },
    });

    return user ? user.id : null;
  } catch (error) {
    thrownewError('Error retrieving user ID');
  }
};

export const getAllTask = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const UserId = await getUserId(userEmail);

    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: 'User doesn’t exist',
      });
    }

    await Task.update(
      { status: 'expired' },
      {
        where: {
          finishdate: {
            [Op.lt]: new Date(),
          },
          status: {
            [Op.not]: 'expired',
          },
        },
      }
    );

    const tasks = await Task.findAll({
      where: {
        status: {
          [Op.in]: ['todo', 'doing', 'completed'],
        },
        UserId: UserId,
      },
    });

    return res.status(200).json({
      success: true,
      length: tasks?.length,
      data: tasks ?? [],
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.update(
      { status: 'expired' },
      {
        where: {
          finishdate: {
            [Op.lt]: new Date(),
          },
          status: {
            [Op.not]: 'expired',
          },
        },
      }
    );

    const task = await Task.findOne({
      where: { id, status: { [Op.not]: 'expired' } },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error fetching tareas by ID:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createTask = async (req, res) => {
  const { name, description, finishdate, priority, status, category } = req.body;

  try {
    const userEmail = req.userEmail;
    const UserId = await getUserId(userEmail);

    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: 'User doesn’t exist',
      });
    }

    const taskByName = await Task.findOne({
      where: { name, UserId: UserId },
    });

    if (taskByName) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una tarea con el mismo nombre',
      });
    }

    const uuid = randomUUID();

    await Task.create({
      id: uuid,
      name,
      description,
      finishdate,
      priority,
      status,
      category,
      UserId: UserId,
    });

    return res.status(201).json({
      success: true,
      message: 'Se ha creado la tarea correctamente',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskById = await Task.findOne({ where: { id } });

    if (!taskById) {
      return res.status(404).json({
        success: false,
        message: 'La tarea a actualizar no existe',
      });
    }

    await Task.update(req.body, { where: { id } });

    return res.status(201).json({
      success: true,
      message: `Se ha actualizado la tarea ${id}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskById = await Task.findOne({ where: { id } });

    if (!taskById) {
      return res.status(404).json({
        success: false,
        message: 'La tarea a eliminar no existe',
      });
    }

    await Task.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: `Se ha eliminado la tarea ${id}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
