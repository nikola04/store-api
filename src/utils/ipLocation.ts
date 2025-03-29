import { Location } from '@/models/session.types';

export const getIpLocation = async (ip?: string): Promise<Location | null> => {
    if(!ip) return null;
    try{
        const data = await fetch(`http://ip-api.com/json/${ip}`, {
            method: 'GET'
        }).then(res => res.json());
        if(data?.status !== 'success') return null;
        return ({
            lat: data.lat,
            lon: data.lon,
            city: data?.city,
            country: data?.country
        });
    }catch(_err){
        return null;
    }
};
