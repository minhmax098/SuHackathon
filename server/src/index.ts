import express from "express";
import cors from "cors";
import path from "node:path";
import { calcMonthlyQuota } from "./quota";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3001);

app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "server", time: new Date().toISOString() });
});

// get quota info
app.get("/quota", async (req, res) => {
    try {
        // query string | string[] | undefined
        const month = Number(String(req.query.month ?? "7"));
        const areaHa = Number(String(req.query.areaHa ?? "10"));
        const kc = Number(String(req.query.kc ?? "1.2"));
        const sf = Number(String(req.query.sf ?? "1.05"));

        const penPath = path.resolve(process.cwd(), "data", "KONYA.pen");
        const cliPath = path.resolve(process.cwd(), "data", "KONYA.cli");

        const result = await calcMonthlyQuota({ month, areaHa, kc, sf, penPath, cliPath });
        res.json(result);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        res.status(400).json({ error: msg });
    }
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});
