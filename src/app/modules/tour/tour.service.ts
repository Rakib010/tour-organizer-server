import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { deleteImageFromCloudinary } from '../../config/cloudinary.config';
import { QueryBuilder } from './../../utils/QueryBuilder';
import { cleanDisplayName, exactNameFilter } from '../../utils/exactNameFilter';
import { tourSearchableFields } from './tour.constant';
import { ITour } from "./tour.interface"
import { Tour } from "./tour.model"


const assertUniqueTourTitle = async (title: string, excludeId?: string) => {
    const filter: Record<string, unknown> = {
        ...exactNameFilter("title", title),
    };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    const existingTour = await Tour.findOne(filter).select("_id title");
    if (existingTour) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A tour with this name already exists. Please use a different name."
        );
    }
};

const createTour = async (payload: Partial<ITour>) => {
    if (!payload.title?.trim()) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour title is required");
    }

    // Global unique name — division / category change does NOT allow duplicate titles
    payload.title = cleanDisplayName(payload.title);
    await assertUniqueTourTitle(payload.title);

    const tour = await Tour.create(payload);
    return tour;
};

// advanced filter,search (eitai pore query build die kora hoyse jeno reusable hoy code )
/* const getAllTours = async (query: Record<string, string>) => {
    const filter = query; // ?location=dhaka
    const searchTerm = query.searchTerm || ""
    const sort = query.sort || "-createdAt"
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    // field filtering
    const fields = query.fields?.split(",").join(" ") || ""
    //old field => title,location
    //new fields => title location


    // delete filter["searchTerm"]
    // delete filter["sort"]

    const excludeField = ['searchTerm', "sort", "fields", "limit", "page"]
    for (const field of excludeField) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field]
    }

    // const tours = await Tour.find({
    //     $or: [
    //         { title: { $regex: searchTerm, $options: "i" } },
    //         { location: { $regex: searchTerm, $options: "i" } }
    //     ] -> eitai niche map dia kore disi 
    // })

    const tourSearchableFields = ["title", "description", "location"]
    const searchQuery = {
        $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    }

    const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)

    const totalTours = await Tour.countDocuments()

    const totalPage = Math.ceil(totalTours / limit)

    const meta = {
        page: page,
        limit: limit,
        total: totalTours,
        totalPage: totalPage

    }

    return {
        meta: meta,
        data: tours
    }
} */

const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
    //.build();

    //const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        meta,
        data
    }
}

const getSingleTours = async (slug: string) => {

    const division = await Tour.findOne({ slug });
    return {
        data: division,
    }

}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour not found.");
    }

    if (payload.title) {
        payload.title = cleanDisplayName(payload.title);
        await assertUniqueTourTitle(payload.title, id);
    }

    /**
     * Slug generation logic was previously handled here if the title was updated.
     * But now it's managed in the model-level pre-save hook, so it has been removed from here.
     */

    // If new images are provided, and existing images already exist in DB
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        // Combine the new images with the existing ones and assign to payload.images
        payload.images = [...payload.images, ...existingTour.images];
    }

    // If deleteImages field is provided, create a new image list excluding those to be deleted
    if (
        payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0
    ) {
        // Keep only those DB images which are not in the deleteImages list
        const restDBImages = existingTour.images.filter(
            imageUrl => !payload.deleteImages?.includes(imageUrl)
        );

        // From the new images, keep only those not listed in deleteImages and not already in DB
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl));

        // Combine filtered DB images and new images to create final image list
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }

    // Update the tour data
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
        new: true, 
        runValidators: true, 
    });

    // If deleteImages exist, also remove them from Cloudinary
    if (
        payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0
    ) {
        await Promise.all(
            payload.deleteImages.map(url => deleteImageFromCloudinary(url))
        );
    }

    return updatedTour;
};


const deleteTour = async (id: string) => {

    // Optional: Check if tour has bookings
    /* const hasBooking = await Booking.exists({ tour: id });
    if (hasBooking) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour has active bookings');
    } */
    const tour = await Tour.findByIdAndDelete(id);
    return tour;
};



export const tourServices = {
    createTour,
    getAllTours,
    updateTour,
    deleteTour,
    getSingleTours
}