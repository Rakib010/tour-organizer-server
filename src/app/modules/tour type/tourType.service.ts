import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tourType.interface";
import { TourType } from "./tourType.modal";
import { Tour } from '../tour/tour.model';


const createTourType = async (payload: ITourType) => {
  const isExists = await TourType.findOne({ name: payload.name });
  if (isExists) {
    throw new AppError(httpStatus.CONFLICT, "Tour type name must be unique");
  }
  const result = await TourType.create(payload);
  return result;
};

const getAllTourTypes = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const updated = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type not found");
  }

  return updated;
};

const deleteTourType = async (id: string) => {
  const isAssociated = await Tour.exists({ tourType: id });

  if (isAssociated) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete. Tour type is associated with one or more tours."
    );
  }

  const deleted = await TourType.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type not found");
  }

  return deleted;
};



export const tourTypeService = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType
}