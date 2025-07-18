import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { Tour } from '../tour/tour.model';

const createDivision = async (payload: Partial<IDivision>) => {
    const division = await Division.create(payload)
    return division
}

const getAllDivision = async () => {
    const division = await Division.find()

    return division
}

const updatedDivision = async (id: string, payload: Partial<IDivision>) => {
    const isDivision = await Division.findById(id)

    if (!isDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found")
    }

    const division = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return division
}

const deleteDivision = async (id: string) => {
    const isDivision = await Division.findById(id)

    if (!isDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found")
    }

    // Check if this division is associated with any tour
    const isAssociated = await Tour.exists({ division: id });
    if (isAssociated) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Division cannot be deleted because it is associated with tours"
        );
    }


    const division = await Division.findByIdAndDelete(id)

    return division
}


export const divisionServices = {
    createDivision,
    getAllDivision,
    updatedDivision,
    deleteDivision
}