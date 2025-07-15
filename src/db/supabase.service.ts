import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient
    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL ?? '',
            process.env.SUPABASE_ANON_KEY ?? ''
        )
    }

    async getAllFlightsInit() {
        const query = this.supabase.from('flight_seat_info').select(
            `
            flight_id,
            class_type,
            price,
            seat_available,
            flight_info (
              flight_id,
              source,
              destination,
              airlines,
              departure_date,
              start_time,
              end_time  
            )          
            `
        )
            .eq('class_type', 'Economy')
            .gt('seat_available', 0);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching flights:', error);
            return [];
        }
        return data.map((flight) => {
            return {
                ...flight,
                adults: 1,
                children: 0,
                infants: 0,
                price: flight.price
            }
        });
    }


    async searchFlights(body: any): Promise<any> {
        const query = this.supabase.from('flight_seat_info').select(`
            flight_id,
            class_type,
            seat_available,
            price,
            flight_info (
              flight_id,
              source,
              destination,
              airlines,
              departure_date,
              start_time,
              end_time  
            )          
            `)
            .eq('flight_info.source', body.source)
            .eq('flight_info.destination', body.destination)
            .eq('flight_info.departure_date', body.departureDate)
            .eq('class_type', body.classType)
            .gte('seat_available', +body.adults + +body.children + +body.infants)
            .not('flight_info', 'is', null);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching flights:', error);
            return [];
        }
        return data.map((flight) => {
            return {
                ...flight,
                adults: +body.adults,
                children: +body.children,
                infants: +body.infants,
                price: flight.price
            }
        });
    }

    async sse(query: any) {
        const seatQuery = this.supabase.from('flight_seat_info').select(`seat_available`)
            .eq('class_type', query.classType)
            .eq('flight_id', query.flight_id);

        const { data, error } = await seatQuery;

        if (error) {
            console.error('Error fetching flights:', error);
            return [];
        }
        return data[0];
    }

    async getUserFlightsDetails(query: any) {
        const userDataQuery = this.supabase.from('passenger_seats_booked').select(`
            flight_id,
            name,
            gender,
            age,
            phone_num,
            booked_by,
            passenger_type,
            class_type,
            flight_info(
                source,
                destination,
                airlines,
                departure_date,
                start_time,
                end_time
            )
        `)
        .eq('booked_by', query.email);

        const { data, error } = await userDataQuery;

        if (error) {
            console.error('Error while fetching booking details:', error);
            return [];
        }
        return data;
    }

    async bookFlight(body: any) {
        const query = this.supabase.rpc('book_flight_with_transaction', { passengers: body.updateBody, id_flight: body.flight_id, class: body.class_type, decreasing_value: body.decreasing_value });

        const { data, error } = await query;

        if (error) {
            console.error('Error booking flights:', error);
            return false;
        }
        return data;
    }
    async getFlightData(flight_id: any) {
        const query = this.supabase.from('flight_info').select(`*`).eq('flight_id', flight_id);

        const { data, error } = await query;

        if (error) {
            console.error('Error booking flights:', error);
            return [];
        }
        return data[0];
    }
}