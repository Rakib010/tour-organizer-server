import { deleteImageFromCloudinary } from '../../config/cloudinary.config';
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
        throw new Error("Tour not found.");
    }

    /**
     * যদি title পরিবর্তন করা হয়, তাহলে slug generate করার logic এখানে ছিল।
     * এটি এখন Model level pre-save hook এ handle হচ্ছে বলে এখানে comment করে রাখা হয়েছে।
     */

    // নতুন image থাকলে, পুরানো image গুলোর সাথে মিলে payload এ সেট করো
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        // নতুন image গুলোর সাথে পুরানো গুলো যোগ করে images field তৈরি করো
        payload.images = [...payload.images, ...existingTour.images];
    }

    //  deleteImages ফিল্ড থাকলে, পুরানো ইমেজ থেকে ঐ image গুলো বাদ দিয়ে নতুন image list তৈরি করো
    if (
        payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0
    ) {
        // পুরানো DB image থেকে যেগুলো delete list-এ নেই সেগুলো রেখে দাও
        const restDBImages = existingTour.images.filter(
            imageUrl => !payload.deleteImages?.includes(imageUrl)
        );

        // নতুন যোগ করা image গুলোর মধ্যে থেকে যেগুলো delete list-এ নেই এবং DB-তে নেই সেগুলো বের করো
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl));

        // নতুন এবং পুরাতন ফিল্টার করা image গুলো মিলিয়ে images ফিল্ড তৈরি করো
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }

    //  Tour ডেটা আপডেট করো
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
        new: true, // Updated document return করো
        runValidators: true, // Schema validation enforce করো
    });

    //  deleteImages থাকলে, Cloudinary থেকে সেই ইমেজগুলোও ডিলিট করো
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