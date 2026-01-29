import { promises as fs } from "fs";

function daysInMonth(month: number, year = 2026) {
    // month: from 1 to 12
    return new Date(year, month, 0).getDate();
}

function extractMonthlyLastColumn(lines: string[]) {
    // return array 12 number (Jan..Dec)
    // take the last column of each row of numbers
    const nums: number[] = [];

    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;

        // skip header / line with text
        if (/[a-zA-Z"]/g.test(line)) continue;

        // separated by whitespace
        const parts = line.split(/\s+/).filter(Boolean);
        if (parts.length < 1) continue;

        const last = Number(parts[parts.length - 1]);
        if (!Number.isFinite(last)) continue;

        nums.push(last);
    }

    if (nums.length < 12) {
        throw new Error(`Parsed only ${nums.length} monthly rows, expected 12.`);
    }

    return nums.slice(0, 12);
}

export async function readET0FromPen(penPath: string) {
    const txt = await fs.readFile(penPath, "utf8");
    const lines = txt.split(/\r?\n/);
    // 12 months: ET0 mm/day
    return extractMonthlyLastColumn(lines);
    }

    export async function readPeffFromCli(cliPath: string) {
    const txt = await fs.readFile(cliPath, "utf8");
    const lines = txt.split(/\r?\n/);
    // 12 months: P_eff mm/month (last column)
    return extractMonthlyLastColumn(lines);
}

export type QuotaInput = {
    month: number;      // 1..12
    areaHa: number;     // ha
    kc: number;         // crop coefficient
    sf: number;         // soil factor
    penPath: string;
    cliPath: string;
    year?: number;
};

export async function calcMonthlyQuota(input: QuotaInput) {
    const { month, areaHa, kc, sf, penPath, cliPath } = input;
    const year = input.year ?? 2026;

    if (month < 1 || month > 12) throw new Error("month must be 1..12");
    if (!(areaHa > 0)) throw new Error("areaHa must be > 0");
    if (!(kc > 0)) throw new Error("kc must be > 0");
    if (!(sf > 0)) throw new Error("sf must be > 0");

    const et0Arr = await readET0FromPen(penPath);   // mm/day
    const peffArr = await readPeffFromCli(cliPath); // mm/month

    const idx = month - 1;
    const et0Daily = et0Arr[month - 1];
    const peffMonthly = peffArr[month - 1];

    if (et0Daily == null) throw new Error("ET0 missing for this month");
    if (peffMonthly == null) throw new Error("P_eff missing for this month");


    const days = daysInMonth(month, year);
    const etcMonthlyMm = et0Daily * days * kc;
    const netMm = Math.max(0, etcMonthlyMm - peffMonthly);

    // 1 mm on 1 ha = 10 m3
    const quotaM3 = netMm * areaHa * 10 * sf;

    return {
        ok: true,
        month,
        year,
        days,
        areaHa,
        kc,
        sf,
        et0Daily_mm_per_day: et0Daily,
        peffMonthly_mm: peffMonthly,
        etcMonthly_mm: etcMonthlyMm,
        netMm,
        quota_m3: quotaM3,
    };
}

