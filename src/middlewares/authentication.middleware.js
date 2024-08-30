import { verify, } from "../services/auth.service.js";
const authenticationMiddleware = async (req, res, next) => {
  const authorization = req.headers['authorization'];

   console.log('Authorization header:', authorization);

  if (!authorization) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'Falta la cabecera de Authorization',
      });
  }

  const [ ,token, ] = authorization.split(' ');
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'No se encontro el token',
      });
  }

  const { payload, } = await verify(token);
  if ('success' in payload && !payload.success) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'El token es invalido',
      });
  }

  const {
    id,
    exp,
    iss,
    sub,
  } = payload;

  const now = new Date();
  if (exp <= now.getTime()) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'El token expiro/caduco',
      });
  }

  if (!iss || iss !== process.env.APP_URL) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'El claim iss es invalido',
      });
  }

  if (!sub) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'El claim subject no esta presenta en el cuerpo del token',
      });
  }

  req.userId = id;
  req.userEmail = sub;

  next();
};

export default authenticationMiddleware;