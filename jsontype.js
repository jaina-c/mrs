var flight=
{
    "fis": [
        {
            "serialNumber": 1,//serial number
            "connections": [//specific information
                {
                    "origin": "PEK",//origin airport
                    "destination": "EVN",//destination airport
                    "DDate": "2016-10-25",//departure date
                    "durationInMinutes": 1375,//duration In Minutes
                    "segments": [
                        {
                            "originAirport": {
                                "code": "PEK",//the code of origin airport
                                "name": "Beijing Capital Airport - 首都国际机场"//the name of origin airport
                            },
                            "originCity": {
                                "code": "BJS",//the code of origin city
                                "name": "北京"//the name of origin city
                            },
                            "destinationAirport": {
                                "code": "CDG",//the code of destination airport
                                "name": "Paris Charles de Gaulle - 戴高乐机场"//the name of origin airport
                            },
                            "destinationCity": {
                                "code": "PAR",//the code of destination city
                                "name": "巴黎"//the name of destination city
                            },
                            "departureDateTime": "2016-10-25 01:00",//departure Date Time
                            "arrivalDateTime": "2016-10-25 05:55",//arrivalDateTime
                            "flightNumber": "AF0381",//flight number
                            "mc": {"code": "AF", "name": "法国航空"},//marketing carrier
                            "oc": {"code": "AF", "name": "法国航空"},//operating carrier
                            "equipment": {"code": "77W", "name": "Boeing 777-300" },//type of an airplane
                            "transferTimeInMinutes": 445,//transfer time in minutes
                            "bookingClass": "M",//booking class
                            "cabinClass": "ECONOMY",//the type of aircraft cabin
                            "pr":98.99//punctuality rate
                        },
                        {
                            "originAirport": {
                                "code": "CDG",
                                "name": "Paris Charles de Gaulle - 戴高乐机场"
                            },
                            "originCity": {
                                "code": "PAR",
                                "name": "巴黎"
                            },
                            "destinationAirport": {
                                "code": "EVN",
                                "name": "Zvartnots Airport"
                            },
                            "destinationCity": {
                                "code": "EVN",
                                "name": "耶烈万"
                            },
                            "departureDateTime": "2016-10-25 13:20",
                            "arrivalDateTime": "2016-10-25 19:55",
                            "flightNumber": "AF1060",
                            "marketingCarrier": {
                                "code": "AF",
                                "name": "法国航空"
                            },
                            "operatingCarrier": {
                                "code": "AF",
                                "name": "法国航空"
                            },
                            "equipment": {
                                "code": "32A",
                                "name": "Airbus A320-200"
                            },
                            "bookingClass": "Y",
                            "cabinClass": "ECONOMY",
                            "fareBase": "MFFWCN",
                            "singleCabin": false,
                            "economyCabinOfferedForBusinessClass": false,
                            "dynamicWaiver": false
                        }
                    ],
                }],
            "price": {
                "currencyCode": "CNY",
                "totalPrice": 12635,
                "totalFare": 11120,
                "totalTaxes": 1515,
                "totalPenalty": 0,
                "totalBookingFee": 0,
                "bookingFee": 0,
                "displayPrice": 12635,
                "accuracy": "HIGH",
                "pricesPerPassengerType": [{
                        "totalPrice": 12635,
                        "fare": 11120,
                        "taxes": 1515,
                        "bookingFee": 0,
                        "penalty": 0,
                        "passengerType": "ADT"}]}
        },
        {
            "serialNumber":2
        }
    ]
}