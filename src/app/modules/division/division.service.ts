import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { deleteImageFromCloudinary } from '../../config/cloudinary.config';
import { cleanDisplayName, exactNameFilter } from '../../utils/exactNameFilter';


const createDivision = async (payload: Partial<IDivision>) => {
    if (!payload.name?.trim()) {
        throw new AppError(httpStatus.BAD_REQUEST, "Division name is required");
    }

    payload.name = cleanDisplayName(payload.name);

    const existingDivision = await Division.findOne(exactNameFilter("name", payload.name));
    if (existingDivision) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A division with this name already exists. Please use a different name."
        );
    }

    const division = await Division.create(payload)
    return division
}

const getAllDivision = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Division.find(), query);

    const divisionSearchableFields = ["name", "slug", "description"]
    const division = await queryBuilder
        .search(divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        division.build(),
        queryBuilder.getMeta()
    ])

    return {
        meta,
        data
    }
}

const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division,
    }
};

const updatedDivision = async (id: string, payload: Partial<IDivision>) => {
    const existingDivision = await Division.findById(id)

    if (!existingDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division Not Found")
    }

    if (payload.name) {
        payload.name = cleanDisplayName(payload.name);

        const duplicateDivision = await Division.findOne({
            ...exactNameFilter("name", payload.name),
            _id: { $ne: id },
        });

        if (duplicateDivision) {
            throw new AppError(
                httpStatus.CONFLICT,
                "A division with this name already exists. Please use a different name."
            );
        }
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    // update photo in cloudinary! agher photo delete hoye new photo set hobe
    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCloudinary(existingDivision.thumbnail)
    }

    return updatedDivision
}

const deleteDivision = async (id: string) => {
    // Check if this division is associated with any tour
    /* const isAssociated = await Tour.exists({ division: id });
    if (isAssociated) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Division cannot be deleted because it is associated with tours"
        );
    } */
    await Division.findByIdAndDelete(id)
    return null
}


export const divisionServices = {
    createDivision,
    getAllDivision,
    updatedDivision,
    deleteDivision,
    getSingleDivision
}