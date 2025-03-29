import { Location } from '@/models/session.types';
import { isLocation } from '@/utils/validators';

export const getLocationByIp = async (ip?: string): Promise<Location|null> => {
    try{
        if(!ip || ip.length === 0) throw 'Invalid IP address';
        const data = await fetch(`http://ip-api.com/json/${ip}`, {
            method: 'GET'
        }).then(res => res.json());
        if(!isLocation(data)) throw 'Not valid location response data';
        const { lat, lon, city, country } = data;
        const location = { lat, lon, city, country };
        return location;
    }catch(_){
        return null;
    }
};
