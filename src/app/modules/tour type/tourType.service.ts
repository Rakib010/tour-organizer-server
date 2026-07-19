import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tourType.interface";
import { TourType } from "./tourType.modal";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { cleanDisplayName, exactNameFilter } from '../../utils/exactNameFilter';



const createTourType = async (payload: ITourType) => {
  if (!payload.name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
  }

  payload.name = cleanDisplayName(payload.name);

  const isExists = await TourType.findOne(exactNameFilter("name", payload.name));
  if (isExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A category with this name already exists. Please use a different name."
    );
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

const getSingleTourTypes = async (id: string) => {
  const tourType = await TourType.findById(id);
  return {
    data: tourType
  };

};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type not found.");
  }

  if (payload.name) {
    payload.name = cleanDisplayName(payload.name);

    const duplicateTourType = await TourType.findOne({
      ...exactNameFilter("name", payload.name),
      _id: { $ne: id },
    });

    if (duplicateTourType) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A category with this name already exists. Please use a different name."
      );
    }
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
  deleteTourType,
  getSingleTourTypes
}