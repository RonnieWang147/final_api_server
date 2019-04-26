const axios = require('axios');

const BASE_URL = "https://my-capstone-project-235720.appspot.com"
const YELP_API_KEY = "tc8-NjddT_4EnBddv0CPfDckf_L0R3gNe7Iteso3rjxtcT-OlT_eoS4nnFFVPCJhjkGflD1RxG5ZmZ-EK4rZIQvSrhzXIZ-1j7bbnAIvJ8aYuYtnUW9askzu3v97XHYx";
const FB_TOKEN ="EAAHZCaLiHg90BADulAaYnCTOUZBSsw2CE5voIDUcs1FPJ1Df8tgYZBsfLjiYJH1v7pewLhP9cralEm4yyQLl5hTCzyi2fby3xaf9MqwajHZAzbNZBPl29q6iOxbxReZCQI8422SEGZBZB3BzlMOUpnhG5xlHPJ2ZAvDfwkWUfFnOU8gZDZD";


async function yelpSearch(latitude, longitude, radius = 1000){
    
    try {
        const res = await axios.get(`https://api.yelp.com/v3/businesses/search`, {
            headers: {
                Authorization: `Bearer ${YELP_API_KEY}`
            },
            params: {
                location: `${latitude},${longitude}`,
                radius: radius,
                limit: 5
            }
        });
        // return res.data;
        let returnData = res.data.businesses.map(async business => {
            const detail = await getBusinessByID(business.id);
            return detail;
        })
        let results = Promise.all(returnData).then(results => results).catch(e => console.log(e));
        return results;
    }
    catch (err) {
        console.log(err);
    }
}

async function facebookSearch(latitude, longitude, radius = 1000){
    
    // return axios.get(`https://graph.facebook.com/v3.2/search?type=place&center=${latitude},${longitude}&distance=${radius}&q=cafe&fields=name,checkins,picture,cover,description,single_line_address,rating_count,overall_star_rating,description&limit=5&access_token=${FB_TOKEN}`)
    try {
        const res = await axios.get(`https://graph.facebook.com/v3.2/search`, {
            params: {
                type: 'place',
                center: `${latitude},${longitude}`,
                distance: radius,
                q: 'cafe',
                fields: 'name,checkins,picture,cover,description,single_line_address,rating_count,overall_star_rating,location,category_list,hours,phone,price_range,website',
                limit: 5,
                access_token: FB_TOKEN
            }
        });
        return res.data;
    }
    catch (err) {
        console.log(err);
    }
}

async function getBusinessByID(id){
    try {
        const res = await axios.get(`https://api.yelp.com/v3/businesses/${id}`, {
            headers: {
                Authorization: `Bearer ${YELP_API_KEY}`
            }
        });
        return res.data;
    }
    catch (err) {
        console.log(err);
    }
}
exports.search = async function(req, res){
    console.log(`search ${JSON.stringify(req.latitude)}`);
    if(!(req.query.latitude && req.query.longitude)){
        return res.json({rc: -1, message:"Missing latitude or longitude"});
      }
    returnObj = await getData(req.query.latitude, req.query.longitude);

    console.log(returnObj);
    return res.json({rc: 1, message:"success", result: returnObj});
}
getData = async function(latitude, longitude, radius = 3000){
    let yelpData = await yelpSearch(latitude,longitude,radius);
    let yelpMarkers = [];
    let facebookMarkers = [];
    if(yelpData){
        yelpMarkers = yelpData.map( business => {
            return {
                type: 0,
                coordinate: {
                    latitude: business.coordinates.latitude,
                    longitude: business.coordinates.longitude,
                },
                title: business.name,
                categories: business.categories.map(category => category.title).join('/'),
                phone: business.display_phone,
                address: business.location.display_address.join(" "),
                image: business.image_url,
                price: business.price,
                website: business.url,
                photos: business.photos,
                rating_count: business.review_count,
                rating: business.rating
            }
        });
    }
    
    let facebookData = await facebookSearch(latitude,longitude,radius);
    if(facebookData){
        facebookMarkers = facebookData.data.map( business => {
            return {
                type: 1,
                coordinate: {
                  latitude: business.location.latitude,
                  longitude: business.location.longitude,
                },
                title: business.name,
                categories: business.category_list.name,
                phone: business.phone,
                address: business.single_line_address,
                image: business.hasOwnProperty('cover')?business.cover.source: null,
                price: business.price_range,
                website: business.website?business.website.indexOf('http')>-1? business.website:'http://'+business.website:"",
                description: business.description,
                rating_count: business.rating_count,
                rating: business.overall_star_rating
            }
        });
    }
    return [...yelpMarkers, ...facebookMarkers];
}