import { Controller, Get, Post, Body } from '@nestjs/common';
import { SearchFlightsService } from './search-flights.service';

@Controller('searchFlights')
export class SearchFlightsController {
    constructor(private readonly searchFlightsService: SearchFlightsService){}
    @Get()
    getAllFlights(){
        return this.searchFlightsService.getAllFlightsInit();
    }
    @Post()
    searchFlights(@Body() body : any){
        return this.searchFlightsService.searchFlights(body);
    }
    
}
