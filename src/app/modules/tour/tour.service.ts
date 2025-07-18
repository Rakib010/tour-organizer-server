import { QueryBuilder } from './../../utils/QueryBuilder';
import { tourSearchableFields } from './tour.constant';
import { ITour } from "./tour.interface"
import { Tour } from "./tour.model"


const createTour = async (payload: Partial<ITour>) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    /* const baseSlug = payload.title?.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }payload.slug = slug */


    const tour = await Tour.create(payload);
    return tour;
};

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
        throw new Error("Tour not found.");
    }

    /* eykaj  hook use kora hoise model e
    if (payload.title) {
        const baseSlug = payload.title?.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}`

        let counter = 0;
        while (await Tour.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        payload.title = slug
    } */


    const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
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