import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';
import { QueryCEP } from '@/protocols';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const { cep } = req.query as QueryCEP;

  try {
    const { logradouro, complemento, bairro, cidade, uf } = await enrollmentsService.getAddressFromCEP(cep);
    const responseData = {
      logradouro,
      complemento,
      bairro,
      cidade,
      uf,
    };
    res.status(httpStatus.OK).send(responseData);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      console.log('oi');
      return res.send(httpStatus.NO_CONTENT);
    }
    res.sendStatus(500);
  }
}
