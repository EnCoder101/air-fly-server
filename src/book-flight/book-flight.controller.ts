import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res, Sse } from '@nestjs/common';
import { BookFlightService } from './book-flight.service';
import { Response } from 'express';

@Controller('bookFlight')
export class BookFlightController {
    constructor(private readonly bookFlightService: BookFlightService) { }

    @Sse('getSelectedFlightSeats/sse')
    sse(@Query() query: any) {
        return this.bookFlightService.sse(query);
    }

    @Get('getUserFlightsDetails')
    getUserFlightsDetails(@Query() query: any) {
        return this.bookFlightService.getUserFlightsDetails(query);
    }

    @Post()
    async bookFlight(@Body() body: any, @Res() res: Response) {
        const data = await this.bookFlightService.bookFlightAndSendMail(body);
        console.log(data);
        try {
            if (data?.isConfirmed) {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="e-ticket.pdf"'
                });
                res.send(data.pdfTicket);
            } else {
                res.send({
                    message: 'Booking failed',
                    isConfirmed: data.isConfirmed
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                message: 'Booking failed',
                error: error
            });
            throw new HttpException("Failed to generate PDF", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
