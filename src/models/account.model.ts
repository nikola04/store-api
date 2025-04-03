import { model, Schema } from 'mongoose';
import { IAccount, IPasskey } from './account.types';

const PasskeySubschema = new Schema<IPasskey>({
    credential_id: { type: String, required: true, trim: true },
    credential_public_key: { type: String, required: true, trim: true },
    counter: { type: Number, required: true, default: 0, min: 0 },
    transports: {
        type: [String],
        enum: ['usb', 'nfc', 'ble', 'internal', 'hybrid'],
        default: []
    },
    name: { type: String, trim: true, maxlength: 50 },
    created_at: { type: Date, default: Date.now, immutable: true },
    last_used_at: { type: Date }
}, {
    _id: false,
    versionKey: false
});

const accountSchema = new Schema<IAccount>({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
    verified_email: { type: Boolean, default: false },
    hashed_pswd: { type: String, select: false, default: null },
    two_factor_auth: { type: Boolean, default: false },
    passkeys: { type: [PasskeySubschema], default: [] },
    passkey_challenge: { type: String, select: false, default: null },
    password_changed_at: { type: Date, default: null }
});

export const AccountModel = model('accounts', accountSchema);
