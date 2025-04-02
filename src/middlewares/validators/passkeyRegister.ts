import { Request, Response, NextFunction } from 'express';

export const validateAttestation = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { attestationResponse } = req.body;
        if (!attestationResponse) {
            res.status(400).json({ error: 'Missing attestation response' });
            return;
        }

        const requiredFields = ['id', 'rawId', 'type', 'response'];
        for (const field of requiredFields) {
            if (!attestationResponse[field]) {
                res.status(400).json({ error: `Missing required field: ${field}` });
                return;
            }
        }

        const requiredResponseFields = ['attestationObject', 'clientDataJSON'];
        for (const field of requiredResponseFields) {
            if (!attestationResponse.response[field]) {
                res.status(400).json({ error: `Missing required response field: ${field}` });
                return;
            }
        }

        if (attestationResponse.type !== 'public-key') {
            res.status(400).json({ error: 'Invalid credential type' });
            return;
        }

        const base64urlRegex = /^[A-Za-z0-9_-]+$/;
        if (!base64urlRegex.test(attestationResponse.id) || !base64urlRegex.test(attestationResponse.rawId) || !base64urlRegex.test(attestationResponse.response.clientDataJSON) || !base64urlRegex.test(attestationResponse.response.attestationObject)) {
            res.status(400).json({ error: 'Invalid base64url encoding' });
            return;
        }

        next();
    } catch (error) {
        console.error('Attestation validation error:', error);
        res.status(500).json({ error: 'Internal server error during validation' });
    }
};
