interface ILocationParams {
    venueName?: string,
    address?: string
    city?: string
    state?: string
    country?: string
}

export const generateMapLink = ({ venueName, address, city, state, country }: ILocationParams) => {
    const queryParts = [venueName, address, city, state, country].filter(Boolean);
    
    const encodedQuery = encodeURIComponent(queryParts.join(', '));
    
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}