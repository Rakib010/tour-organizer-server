import { ITour } from "./tour.interface"
import { Tour } from "./tour.model"


const createTour = async (payload: Partial<ITour>) => {
    const tour = await Tour.create(payload);
    return tour;
};


//const getAllTours = async () => { };


const updateTour = async (id: string, payload: Partial<ITour>) => {
    const tour = await Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return tour;
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
   // getAllTours,
    updateTour,
    deleteTour
}