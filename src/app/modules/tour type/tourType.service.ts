import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tourType.interface";
import { TourType } from "./tourType.modal";
import { QueryBuilder } from '../../utils/QueryBuilder';



const createTourType = async (payload: ITourType) => {
  const isExists = await TourType.findOne({ name: payload.name });
  if (isExists) {
    throw new AppError(httpStatus.CONFLICT, "Tour type already exists");
  }
  const result = await TourType.create(payload);
  return result;
};

const getAllTourTypes = async (query: Record<string, string>) => {

  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const tourTypeSearchableFields = ["name"];
  
  const tourType = await queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()


  const [data, meta] = await Promise.all([
    tourType.build(),
    queryBuilder.getMeta()
  ])

  return {
    meta,
    data
  }


};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

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

  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const deletedTourType = await TourType.findByIdAndDelete(id);

  return deletedTourType;
};



export const tourTypeService = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType
}