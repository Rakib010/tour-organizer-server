import { ITour } from "./tour.interface"
import { Tour } from "./tour.model"


const createTour = async (payload: Partial<ITour>) => {
    const division = await Tour.create(payload)
    return division
}

export const tourServices = {
    createTour
}