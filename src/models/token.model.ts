import { model, Schema } from 'mongoose';
import { Token } from './token.types';

const tokenSchema = new Schema<Token>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    hashed_token: { type: String, required: true },
    user_agent: { type: String, required: true },
    expires_at: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
});

export const TokenModel = model('tokens', tokenSchema);
