import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/db/supabase.service';

@Injectable()
export class SearchFlightsService {
    constructor(private readonly supabaseService: SupabaseService){}
    getAllFlightsInit(){
        return this.supabaseService.getAllFlightsInit();
    }
    async searchFlights(body : any){
        if(body.tripType === 'oneway'){
            const flights = await this.supabaseService.searchFlights(body);

            return flights;
        }else{
            const departureFlights = await this.supabaseService.searchFlights(body);
            const newBody = {...body ,
                departureDate: body.returnDate,
                source: body.destination,
                destination: body.source
            };
            const returnFlights = await this.supabaseService.searchFlights(newBody);
            return [...departureFlights, ...returnFlights];
        }
    }
}
