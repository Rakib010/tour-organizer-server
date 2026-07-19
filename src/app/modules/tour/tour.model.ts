import { model, Schema, } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { cleanDisplayName, exactNameFilter } from "../../utils/exactNameFilter";
import { ITour } from "./tour.interface";



const tourSchema = new Schema<ITour>({
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    starDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    exclude: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }
}, {
    timestamps: true
})


// Block duplicate titles (global) and generate slug from title
tourSchema.pre("save", async function (next) {
    try {
        if (this.isModified("title") && this.title) {
            this.title = cleanDisplayName(this.title);

            const duplicate = await Tour.findOne({
                ...exactNameFilter("title", this.title),
                _id: { $ne: this._id },
            }).select("_id");

            if (duplicate) {
                return next(
                    new AppError(
                        httpStatus.CONFLICT,
                        "A tour with this name already exists. Please use a different name."
                    )
                );
            }

            const baseSlug = this.title.toLowerCase().split(" ").join("-");
            let slug = baseSlug;
            let counter = 0;

            // Only bump slug if another doc already owns this slug (should be rare when titles are unique)
            while (await Tour.exists({ slug, _id: { $ne: this._id } })) {
                slug = `${baseSlug}-${++counter}`;
            }
            this.slug = slug;
        }
        next();
    } catch (error) {
        next(error as Error);
    }
})

tourSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const tour = this.getUpdate() as Partial<ITour> & { $set?: Partial<ITour> };
        const updatePayload = (tour.$set ? tour.$set : tour) as Partial<ITour>;
        const title = updatePayload.title;

        if (title) {
            const cleanedTitle = cleanDisplayName(title);
            updatePayload.title = cleanedTitle;

            const query = this.getQuery() as { _id?: unknown };
            const duplicate = await Tour.findOne({
                ...exactNameFilter("title", cleanedTitle),
                _id: { $ne: query._id },
            }).select("_id");

            if (duplicate) {
                return next(
                    new AppError(
                        httpStatus.CONFLICT,
                        "A tour with this name already exists. Please use a different name."
                    )
                );
            }

            const baseSlug = cleanedTitle.toLowerCase().split(" ").join("-");
            let slug = baseSlug;
            let counter = 0;

            while (await Tour.exists({ slug, _id: { $ne: query._id } })) {
                slug = `${baseSlug}-${++counter}`;
            }
            updatePayload.slug = slug;

            if (tour.$set) {
                this.setUpdate({ ...tour, $set: updatePayload });
            } else {
                this.setUpdate(updatePayload);
            }
        }

        next();
    } catch (error) {
        next(error as Error);
    }
})





export const Tour = model<ITour>("Tour", tourSchema)
