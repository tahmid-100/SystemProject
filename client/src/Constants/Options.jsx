export const SelectTravelsList=[

    {
      id:1,
      title:'Just Me',
      desc:'A sole travels in exploration',
      icon:'✈️',
      people:1

    },

    {
        id:2,
        title:'A Couple',
        desc:'Two travelers',
        icon:'🥂',
        people:2
  
      },



      {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏘️',
        people:'3 to 5 people'
  
      },


      {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill seekers',
        icon:'👨‍🚒',
        people:'5 t0 10 people'
  
      }
]



export const SelectBudgetOptions=[

 { 
    id:1,
    title:'Cheap',
    desc:'Stay concious of costs',
    icon:'💲',
 },

 { 
    id:2,
    title:'Moderete',
    desc:'Keep cost on the average side',
    icon:'💰',
 },

 { 
    id:3,
    title:'Luxury',
    desc:'Do not worry about cost',
    icon:'💸',
 }


]

 export const AI_PROMPT='Generate Travel Plan for Location :{location},for {totalDays} Days for {traveler} with a {budget} budget,Give me a Hotels options list with HotelName,Hotel address,Price,Hotel image url,geo coordinates,rating,description and suggest itinerary with placeName,Place Details,Place image url,Geo coordinates,Ticket pricing,time t travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format'