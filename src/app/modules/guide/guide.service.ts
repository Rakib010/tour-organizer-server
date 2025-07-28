

const applyAsGuide = async (/* user: any, nidPhoto: string, divisionId: string */) => {
    /* if (!nidPhoto) {
        throw new ApiError(httpStatus.BAD_REQUEST, "NID photo is required");
    }

    const existingApplication = await GuideApplication.findOne({ user: user._id });
    if (existingApplication) {
        throw new ApiError(httpStatus.CONFLICT, "You have already applied");
    }

    const result = await GuideApplication.create({
        user: user._id,
        nidPhoto,
        division: divisionId,
    }); */

    return {};
};

const approveGuide = async (/* id: string, status: "APPROVED" | "REJECTED" */) => {
    /*     const application = await GuideApplication.findById(id).populate("user");
    
        if (!application) {
            throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
        }
    
        if (application.status !== "PENDING") {
            throw new ApiError(httpStatus.BAD_REQUEST, "Only pending applications can be updated");
        }
    
        application.status = status;
        await application.save();
    
        if (status === "APPROVED") {
            await User.findByIdAndUpdate(application.user._id, { role: "GUIDE" });
        }
     */
    return {};
};

const getAllGuideApplications = async (/* filters: any */)/* : Promise<IGenericResponse<any[]>> */ => {
    /* const { searchTerm, status, division, user, page = 1, limit = 10, sortBy, sortOrder } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: guideSearchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        });
    }

    if (status) andConditions.push({ status });
    if (division) andConditions.push({ division });
    if (user) andConditions.push({ user });

    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};

    const sortConditions: any = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const skip = paginationHelpers.calculateSkip({ page, limit });

    const [data, total] = await Promise.all([
        GuideApplication.find(whereCondition)
            .populate("user")
            .populate("division")
            .sort(sortConditions)
            .skip(skip)
            .limit(Number(limit)),
        GuideApplication.countDocuments(whereCondition),
    ]); */

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data,
    };
};

export const GuideService = {
    applyAsGuide,
    approveGuide,
    getAllGuideApplications,
};
