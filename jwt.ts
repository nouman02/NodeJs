import { AuthenticationError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';

export const ensureNonExpiredToken = (resolver: any) =>
  async (obj: any, args: any, context: any, info: any) => {
    try {
      const {
        req: {
          headers: { authorization }
        }
      } = context;

      const decodedToken: any = jwt.decode(authorization);

      if (!decodedToken) {
        throw new AuthenticationError('Invalid, missing or expired token');
      }
      const expirationDate = decodedToken.exp;
      const currentEpoch = Math.floor(new Date().getTime() / 1000);

      if (expirationDate <= currentEpoch) {
        throw new AuthenticationError('Invalid, missing or expired token');
      }

      return resolver(obj, args, context, info);
    } catch (e) {
      throw new AuthenticationError(e);
    }
  };
