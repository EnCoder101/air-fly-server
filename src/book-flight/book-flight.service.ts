import { Injectable } from '@nestjs/common';
import { interval, switchMap } from 'rxjs';
import { SupabaseService } from 'src/db/supabase.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BookFlightService {
    constructor(private readonly supabaseService: SupabaseService, private readonly mailService: MailerService) { }

    sse(query: any) {
        return interval(3000).pipe(
            switchMap(async () => {
                const data = await this.supabaseService.sse(query);
                return { data };
            })
        );
    }

    getUserFlightsDetails(query: any) {
        return this.supabaseService.getUserFlightsDetails(query);
    }

    async bookFlightAndSendMail(body: any) {
        const isConfirmed = await this.bookFlight(body);
        console.log(isConfirmed);
        const flightData = await this.supabaseService.getFlightData(body.flight_id);
        if (isConfirmed.length !== 0) {
            this.sendMail({ ...body, ...flightData });
            const pdfTicket = await this.getPdfTicket({ ...body, ...flightData,total_price: (body.price * body.passengersList.length) });
            return { pdfTicket, isConfirmed };
        }
        return { pdfTicket: '', isConfirmed: (isConfirmed == (isConfirmed.length === 0)) ? false : true };
    }

    bookFlight(body: any) {
        const updateBody = body.passengersList.map((passengerData: any) => {
            return {
                flight_id: body.flight_id,
                name: passengerData.name,
                age: passengerData.age,
                gender: passengerData.gender,
                phone_num: passengerData.phone ?? 0,
                booked_by: body.email,
                passenger_type: passengerData.type,
                class_type: body.class_type,
                amount: body.price
            }
        })
        return this.supabaseService.bookFlight({ updateBody, flight_id: body.flight_id, class_type: body.class_type, decreasing_value: body.passengersList.length });
    }

    sendMail(body: any) {

        this.mailService.sendMail({
            to: body.email,
            subject: 'Ticket Confirmation',
            template: 'confirmation',
            context: {
                email: body.email,
                passengersList: body.passengersList,
                class_type: body.class_type,
                total_price: (body.price * body.passengersList.length),
                airlines: body.airlines,
                flight_id: body.flight_id,
                source: body.source,
                destination: body.destination,
                departure_date: body.departure_date,
                start_time: body.start_time.split('T')[1],
                arrival_date: body.end_time.split('T')[0],
                end_time: body.end_time.split('T')[1],
            }
        });
    }

    async getPdfTicket(bookingData: any) {
        const templateSource = fs.readFileSync(__dirname + '/mail-templates/confirmation.hbs', 'utf-8');
        const template = Handlebars.compile(templateSource);
        const html = template(bookingData);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px',
            },
        });

        await browser.close();

        return pdfBuffer;
    }
}
