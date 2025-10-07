"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.router = express_1.default.Router();
const dbPath = path_1.default.join(__dirname, 'db.json');
const workerId = process.env.WORKER_ID || 'worker-1';
if (!fs_1.default.existsSync(dbPath))
    fs_1.default.writeFileSync(dbPath, JSON.stringify([]));
exports.router.post('/issue', (req, res) => {
    const credential = req.body;
    if (!credential.id)
        return res.status(400).json({ error: 'Credential must have an id' });
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const exists = db.find((c) => c.id === credential.id);
    if (exists)
        return res.json({ message: 'Credential already issued', worker: exists.worker });
    const newCredential = { ...credential, issuedAt: new Date(), worker: workerId };
    db.push(newCredential);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ message: 'Credential issued', worker: workerId });
});
exports.router.post('/verify', (req, res) => {
    const credential = req.body;
    if (!credential.id)
        return res.status(400).json({ error: 'Credential must have an id' });
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const found = db.find((c) => c.id === credential.id);
    if (!found)
        return res.json({ valid: false });
    res.json({ valid: true, worker: found.worker, issuedAt: found.issuedAt });
});
//# sourceMappingURL=routes.js.map