import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const applyAsGuide = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const nidPhoto = req.file?.path;
    const divisionId = req.body.divisionId;

    const result = await GuideService.applyAsGuide(user, nidPhoto, divisionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Guide application submitted successfully",
        data: result,
    });
});

const approveGuide = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    const result = await GuideService.approveGuide(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Guide application ${status.toLowerCase()} successfully`,
        data: result,
    });
});

const getAllGuide = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;

    const result = await GuideService.getAllGuideApplications(filters);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Guide applications retrieved successfully",
        data: result,
    });
});

export const GuideController = {
    applyAsGuide,
    approveGuide,
    getAllGuide,
};