import express from "express";
import cors from "cors";
import path from "path";
import { calcMonthlyQuota } from "./quota";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3001);

app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "server", time: new Date().toISOString() });
});

// /quota?month=7&areaHa=5&kc=1.15&sf=1.2
app.get("/quota", async (req, res) => {
    try {
        const month = Number(req.query.month ?? 7);
        const areaHa = Number(req.query.areaHa ?? 10);
        const kc = Number(req.query.kc ?? 1.2);
        const sf = Number(req.query.sf ?? 1.05);

        const penPath = path.resolve(process.cwd(), "data", "KONYA.pen");
        const cliPath = path.resolve(process.cwd(), "data", "KONYA.cli");

        const result = await calcMonthlyQuota({ month, areaHa, kc, sf, penPath, cliPath });
        res.json(result);
    } catch (e) {
        res.status(400).json({ error: String((e as Error).message ?? e) });
    }
});


app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
